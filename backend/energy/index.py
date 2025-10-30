'''
Backend функция для работы с записями энергии пользователей
Поддерживает GET (получение записей пользователя), POST (добавление/обновление записи), DELETE (удаление записи)
Требует авторизации через заголовок X-Auth-Token
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import errors
from datetime import datetime
from typing import Dict, Any, Optional
import hashlib
import base64

JWT_SECRET = os.environ.get('JWT_SECRET', '')
DATABASE_URL = os.environ.get('DATABASE_URL', '')

def verify_jwt(token: str) -> Optional[Dict[str, Any]]:
    try:
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
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if not DATABASE_URL or not JWT_SECRET:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Server configuration error'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'}),
            'isBase64Encoded': False
        }
    
    payload = verify_jwt(token)
    if not payload:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Невалидный или истёкший токен'}),
            'isBase64Encoded': False
        }
    
    user_id = payload['user_id']
    print(f"User ID from token: {user_id}")
    
    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cur.execute(f'''
                SELECT id, entry_date, score, thoughts, created_at, updated_at
                FROM t_p45717398_energy_dashboard_pro.energy_entries
                WHERE user_id = {user_id}
                ORDER BY entry_date DESC
            ''')
            entries = cur.fetchall()
            
            result = []
            for entry in entries:
                result.append({
                    'id': entry['id'],
                    'date': entry['entry_date'].strftime('%Y-%m-%d'),
                    'score': entry['score'],
                    'thoughts': entry['thoughts'] or '',
                    'createdAt': entry['created_at'].isoformat() if entry['created_at'] else None,
                    'updatedAt': entry['updated_at'].isoformat() if entry['updated_at'] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            entry_date_str = body_data.get('date')
            score = body_data.get('score')
            thoughts = body_data.get('thoughts', '')
            
            print(f"POST request: date={entry_date_str}, score={score}, thoughts={thoughts}")
            
            if not entry_date_str or score is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'date и score обязательны'}),
                    'isBase64Encoded': False
                }
            
            # Парсим дату в формате DD.MM.YYYY или YYYY-MM-DD
            if '.' in entry_date_str:
                parts = entry_date_str.split('.')
                if len(parts) == 3:
                    entry_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                else:
                    entry_date = entry_date_str
            else:
                entry_date = entry_date_str
            
            print(f"Parsed date: {entry_date}")
            
            if score < 1 or score > 5:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'score должен быть от 1 до 5'}),
                    'isBase64Encoded': False
                }
            
            # Экранируем значения для SimpleQuery
            safe_thoughts = thoughts.replace("'", "''")
            
            # Сначала пробуем вставить новую запись
            try:
                cur.execute(f'''
                    INSERT INTO t_p45717398_energy_dashboard_pro.energy_entries (user_id, entry_date, score, thoughts)
                    VALUES ({user_id}, '{entry_date}', {score}, '{safe_thoughts}')
                ''')
                conn.commit()
            except errors.UniqueViolation:
                # Если запись уже существует, откатываем и обновляем
                conn.rollback()
                cur.execute(f'''
                    UPDATE t_p45717398_energy_dashboard_pro.energy_entries 
                    SET score = {score}, thoughts = '{safe_thoughts}', updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = {user_id} AND entry_date = '{entry_date}'
                ''')
                conn.commit()
            
            # Получаем результат
            cur.execute(f'''
                SELECT id, entry_date, score, thoughts
                FROM t_p45717398_energy_dashboard_pro.energy_entries
                WHERE user_id = {user_id} AND entry_date = '{entry_date}'
            ''')
            new_entry = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': new_entry['id'],
                    'date': new_entry['entry_date'].strftime('%Y-%m-%d'),
                    'score': new_entry['score'],
                    'thoughts': new_entry['thoughts'] or ''
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            entry_date_str = body_data.get('date')
            
            if not entry_date_str:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'date параметр обязателен'}),
                    'isBase64Encoded': False
                }
            
            # Парсим дату в формате DD.MM.YYYY или YYYY-MM-DD
            if '.' in entry_date_str:
                parts = entry_date_str.split('.')
                if len(parts) == 3:
                    entry_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                else:
                    entry_date = entry_date_str
            else:
                entry_date = entry_date_str
            
            cur.execute(f'''
                DELETE FROM t_p45717398_energy_dashboard_pro.energy_entries 
                WHERE entry_date = '{entry_date}' AND user_id = {user_id}
            ''')
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Метод не поддерживается'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e), 'type': type(e).__name__}),
            'isBase64Encoded': False
        }
    
    finally:
        if conn:
            cur.close()
            conn.close()