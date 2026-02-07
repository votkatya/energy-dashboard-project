'''
Business: CRUD операции с записями энергии пользователей (v2.1)
Args: event - dict с httpMethod, body, queryStringParameters, headers
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными записей или статистикой за 14 дней и текущий месяц
'''
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import hashlib
from typing import Dict, Any, Optional

JWT_SECRET = os.environ.get('JWT_SECRET', 'default-secret-key-change-in-production')
DATABASE_URL = os.environ.get('DATABASE_URL')

def verify_jwt(token: str) -> Optional[Dict[str, Any]]:
    """Проверка JWT токена"""
    try:
        import base64
        decoded = base64.b64decode(token.encode()).decode()
        payload_str, signature = decoded.split('::')
        
        expected_signature = hashlib.sha256(f"{payload_str}{JWT_SECRET}".encode()).hexdigest()
        
        if signature != expected_signature:
            return None
        
        payload = json.loads(payload_str)
        
        exp_time = datetime.fromisoformat(payload['exp'])
        if datetime.utcnow() > exp_time:
            return None
        
        return payload
    except Exception:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    auth_header = event.get('headers', {}).get('X-Auth-Token', '')
    
    if not auth_header:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'})
        }
    
    payload = verify_jwt(auth_header)
    
    if not payload:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Невалидный токен'})
        }
    
    user_id = payload['user_id']
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cur.execute("""
                SELECT id, entry_date as date, score, thoughts, tags, created_at, updated_at
                FROM energy_entries
                WHERE user_id = %s
                ORDER BY entry_date DESC
            """, (user_id,))
            
            entries = cur.fetchall()
            
            entries_list = []
            for entry in entries:
                entry_date = entry['date']
                if isinstance(entry_date, str):
                    dt = datetime.strptime(entry_date, '%Y-%m-%d')
                else:
                    dt = entry_date
                
                tags_data = entry.get('tags')
                if isinstance(tags_data, str):
                    tags_list = json.loads(tags_data) if tags_data else []
                elif tags_data is None:
                    tags_list = []
                else:
                    tags_list = tags_data
                
                entries_list.append({
                    'id': entry['id'],
                    'date': dt.strftime('%Y-%m-%d'),
                    'score': entry['score'],
                    'thoughts': entry['thoughts'] or '',
                    'tags': tags_list,
                    'createdAt': entry['created_at'].isoformat() if entry.get('created_at') else None,
                    'updatedAt': entry['updated_at'].isoformat() if entry.get('updated_at') else None
                })
            
            if len(entries_list) > 0:
                total = len(entries_list)
                avg_score = sum(e['score'] for e in entries_list) / total
                good = sum(1 for e in entries_list if e['score'] >= 4)
                neutral = sum(1 for e in entries_list if e['score'] == 3)
                bad = sum(1 for e in entries_list if e['score'] <= 2)
            else:
                total = 0
                avg_score = 0
                good = 0
                neutral = 0
                bad = 0
            
            # Статистика за последние 14 дней
            cur.execute("""
                SELECT AVG(score) as avg_14, COUNT(*) as count_14
                FROM energy_entries
                WHERE user_id = %s 
                AND entry_date >= CURRENT_DATE - INTERVAL '14 days'
            """, (user_id,))
            fourteen_days_stats = cur.fetchone()
            avg_14_days = float(fourteen_days_stats['avg_14']) if fourteen_days_stats['avg_14'] else 0
            count_14_days = fourteen_days_stats['count_14'] or 0
            
            # Статистика за текущий месяц
            cur.execute("""
                SELECT AVG(score) as avg_month, COUNT(*) as count_month
                FROM energy_entries
                WHERE user_id = %s 
                AND EXTRACT(YEAR FROM entry_date) = EXTRACT(YEAR FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM entry_date) = EXTRACT(MONTH FROM CURRENT_DATE)
            """, (user_id,))
            month_stats = cur.fetchone()
            avg_current_month = float(month_stats['avg_month']) if month_stats['avg_month'] else 0
            count_current_month = month_stats['count_month'] or 0
            
            cur.close()
            conn.close()
            
            stats_object = {
                'good': good,
                'neutral': neutral,
                'bad': bad,
                'average': round(avg_score, 2),
                'total': total,
                'last14Days': {
                    'average': round(avg_14_days, 2),
                    'count': count_14_days
                },
                'currentMonth': {
                    'average': round(avg_current_month, 2),
                    'count': count_current_month
                }
            }
            
            print(f"[DEBUG] Stats object: {json.dumps(stats_object)}")
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'entries': entries_list,
                    'stats': stats_object
                })
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            date_str = body_data.get('date', '')
            score = body_data.get('score')
            thoughts = body_data.get('thoughts', '')
            category = body_data.get('category', '')
            tags = body_data.get('tags', [])
            
            if not date_str or score is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Дата и оценка обязательны'})
                }
            
            if not (1 <= score <= 5):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Оценка должна быть от 1 до 5'})
                }
            
            try:
                if '.' in date_str:
                    parts = date_str.split('.')
                    db_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                else:
                    db_date = date_str
            except Exception:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный формат даты'})
                }
            
            tags_json = json.dumps(tags)
            
            cur.execute("""
                INSERT INTO energy_entries (user_id, entry_date, score, thoughts, tags)
                VALUES (%s, %s, %s, %s, %s::jsonb)
                ON CONFLICT (user_id, entry_date) 
                DO UPDATE SET score = EXCLUDED.score, thoughts = EXCLUDED.thoughts, 
                              tags = EXCLUDED.tags,
                              updated_at = CURRENT_TIMESTAMP
                RETURNING id, entry_date, score, thoughts, tags
            """, (user_id, db_date, score, thoughts, tags_json))
            
            entry = cur.fetchone()
            
            if tags:
                for tag in tags:
                    cur.execute("""
                        INSERT INTO tag_analytics (entry_id, tag, score, entry_date, user_id)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (entry['id'], tag, score, db_date, user_id))
            
            conn.commit()
            
            entry_date = entry['entry_date']
            if isinstance(entry_date, str):
                dt = datetime.strptime(entry_date, '%Y-%m-%d')
            else:
                dt = entry_date
            
            tags_data = entry.get('tags')
            if isinstance(tags_data, str):
                tags_list = json.loads(tags_data) if tags_data else []
            elif tags_data is None:
                tags_list = []
            else:
                tags_list = tags_data
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': entry['id'],
                    'date': dt.strftime('%Y-%m-%d'),
                    'score': entry['score'],
                    'thoughts': entry['thoughts'] or '',
                    'tags': tags_list
                })
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            entry_id = params.get('id')
            
            if not entry_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID записи обязателен'})
                }
            
            cur.execute("""
                DELETE FROM energy_entries
                WHERE id = %s AND user_id = %s
                RETURNING id
            """, (entry_id, user_id))
            
            deleted = cur.fetchone()
            conn.commit()
            
            cur.close()
            conn.close()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Запись не найдена'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Запись удалена'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'})
        }