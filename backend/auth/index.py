'''
Business: Регистрация, вход и проверка JWT токенов для пользователей
Args: event - dict с httpMethod, body, headers
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с JWT токеном или ошибкой
'''
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
import hashlib
import secrets
from typing import Dict, Any, Optional

JWT_SECRET = os.environ.get('JWT_SECRET', 'default-secret-key-change-in-production')
DATABASE_URL = os.environ.get('DATABASE_URL')

def create_jwt(user_id: int, email: str) -> str:
    """Создание простого JWT токена (упрощенная версия без библиотек)"""
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

def hash_password(password: str) -> str:
    """Хеширование пароля с солью"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256(f"{password}{salt}".encode()).hexdigest()
    return f"{salt}::{pwd_hash}"

def verify_password(password: str, stored_hash: str) -> bool:
    """Проверка пароля"""
    try:
        salt, pwd_hash = stored_hash.split('::')
        new_hash = hashlib.sha256(f"{password}{salt}".encode()).hexdigest()
        return new_hash == pwd_hash
    except Exception:
        return False

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
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                email = body_data.get('email', '').strip().lower()
                password = body_data.get('password', '')
                name = body_data.get('name', '')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email и пароль обязательны'})
                    }
                
                if len(password) < 6:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пароль должен быть минимум 6 символов'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT id FROM t_p45717398_energy_dashboard_pro.users WHERE email = %s", (email,))
                existing = cur.fetchone()
                
                if existing:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь с таким email уже существует'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    "INSERT INTO t_p45717398_energy_dashboard_pro.users (email, password_hash, full_name) VALUES (%s, %s, %s) RETURNING id, email, full_name",
                    (email, password_hash, name)
                )
                user = cur.fetchone()
                conn.commit()
                
                token = create_jwt(user['id'], user['email'])
                
                return {
                    'statusCode': 201,
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
            
            elif action == 'login':
                email = body_data.get('email', '').strip().lower()
                password = body_data.get('password', '')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email и пароль обязательны'})
                    }
                
                cur.execute("SELECT id, email, full_name, password_hash FROM t_p45717398_energy_dashboard_pro.users WHERE email = %s", (email,))
                user = cur.fetchone()
                
                if not user or not verify_password(password, user['password_hash']):
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный email или пароль'}),
                        'isBase64Encoded': False
                    }
                
                token = create_jwt(user['id'], user['email'])
                
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
        
        elif method == 'GET':
            auth_header = event.get('headers', {}).get('X-Auth-Token', '')
            
            if not auth_header:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Токен не предоставлен'}),
                    'isBase64Encoded': False
                }
            
            payload = verify_jwt(auth_header)
            
            if not payload:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Невалидный или истекший токен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT id, email, full_name FROM t_p45717398_energy_dashboard_pro.users WHERE id = %s", (payload['user_id'],))
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь не найден'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'name': user['full_name']
                    }
                }),
                'isBase64Encoded': False
            }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }