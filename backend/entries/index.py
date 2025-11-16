'''
Business: CRUD операции с записями энергии пользователей
Args: event - dict с httpMethod, body, queryStringParameters, headers
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными записей или статистикой
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
                SELECT id, date, score, thoughts, category, tags, created_at
                FROM energy_entries
                WHERE user_id = %s
                ORDER BY date DESC
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
                    'date': dt.strftime('%d.%m.%Y'),
                    'score': entry['score'],
                    'thoughts': entry['thoughts'] or '',
                    'category': entry['category'] or '',
                    'tags': tags_list,
                    'week': f"Неделя {dt.isocalendar()[1]}",
                    'month': dt.strftime('%B %Y')
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
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'entries': entries_list,
                    'stats': {
                        'good': good,
                        'neutral': neutral,
                        'bad': bad,
                        'average': round(avg_score, 2),
                        'total': total
                    }
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
                INSERT INTO energy_entries (user_id, date, score, thoughts, category, tags)
                VALUES (%s, %s, %s, %s, %s, %s::jsonb)
                ON CONFLICT (user_id, date) 
                DO UPDATE SET score = EXCLUDED.score, thoughts = EXCLUDED.thoughts, 
                              category = EXCLUDED.category, tags = EXCLUDED.tags,
                              updated_at = CURRENT_TIMESTAMP
                RETURNING id, date, score, thoughts, category, tags
            """, (user_id, db_date, score, thoughts, category, tags_json))
            
            entry = cur.fetchone()
            
            if tags:
                for tag in tags:
                    cur.execute("""
                        INSERT INTO tag_analytics (entry_id, tag, score, entry_date, user_id)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (entry['id'], tag, score, db_date, user_id))
            
            conn.commit()
            
            entry_date = entry['date']
            if isinstance(entry_date, str):
                dt = datetime.strptime(entry_date, '%Y-%m-%d')
            else:
                dt = entry_date
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': entry['id'],
                    'date': dt.strftime('%d.%m.%Y'),
                    'score': entry['score'],
                    'thoughts': entry['thoughts'] or '',
                    'category': entry['category'] or '',
                    'tags': entry.get('tags', [])
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