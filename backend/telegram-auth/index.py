'''
Business: Авторизация через Telegram Widget с проверкой подписи
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с JWT токеном или ошибкой
'''
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
import hashlib
import hmac
from typing import Dict, Any, Optional

JWT_SECRET = os.environ.get('JWT_SECRET', 'default-secret-key-change-in-production')
DATABASE_URL = os.environ.get('DATABASE_URL')
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')

def create_jwt(user_id: int, email: str) -> str:
    """Создание простого JWT токена"""
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': (datetime.utcnow() + timedelta(days=30)).isoformat()
    }
    
    payload_str = json.dumps(payload)
    signature = hashlib.sha256(f"{payload_str}{JWT_SECRET}".encode()).hexdigest()
    
    token = f"{payload_str}::{signature}"
    import base64
    return base64.b64encode(token.encode()).decode()

def verify_telegram_auth(data: Dict[str, str]) -> bool:
    """Проверка подписи данных от Telegram"""
    if not TELEGRAM_BOT_TOKEN:
        return False
    
    check_hash = data.get('hash')
    if not check_hash:
        return False
    
    data_check_dict = {k: v for k, v in data.items() if k != 'hash'}
    data_check_string = '\n'.join([f'{k}={v}' for k, v in sorted(data_check_dict.items())])
    
    secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    return calculated_hash == check_hash

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = event.get('body', '{}')
        if not body or body == '':
            body = '{}'
        
        body_data = json.loads(body)
        
        telegram_id = body_data.get('id')
        first_name = body_data.get('first_name', '')
        last_name = body_data.get('last_name', '')
        username = body_data.get('username', '')
        photo_url = body_data.get('photo_url', '')
        auth_date = body_data.get('auth_date', '')
        hash_value = body_data.get('hash', '')
        
        if not telegram_id or not hash_value:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Недостаточно данных от Telegram'}),
                'isBase64Encoded': False
            }
        
        if not verify_telegram_auth(body_data):
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверная подпись Telegram'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        email = f"telegram_{telegram_id}@energy.app"
        full_name = f"{first_name} {last_name}".strip() or username or f"User {telegram_id}"
        
        cur.execute(
            "SELECT id, email, full_name FROM t_p45717398_energy_dashboard_pro.users WHERE email = %s",
            (email,)
        )
        user = cur.fetchone()
        
        if user:
            cur.execute(
                "UPDATE t_p45717398_energy_dashboard_pro.users SET full_name = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING id, email, full_name",
                (full_name, user['id'])
            )
            user = cur.fetchone()
            conn.commit()
        else:
            password_hash = hashlib.sha256(f"telegram_{telegram_id}_{TELEGRAM_BOT_TOKEN}".encode()).hexdigest()
            
            cur.execute(
                "INSERT INTO t_p45717398_energy_dashboard_pro.users (email, password_hash, full_name) VALUES (%s, %s, %s) RETURNING id, email, full_name",
                (email, password_hash, full_name)
            )
            user = cur.fetchone()
            conn.commit()
        
        token = create_jwt(user['id'], user['email'])
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'token': token,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'name': user['full_name']
                }
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }