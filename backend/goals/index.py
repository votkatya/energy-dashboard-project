'''
Business: API для управления целями на месяц
Args: event - dict с httpMethod, headers, body, queryStringParameters
      context - object с атрибутами: request_id, function_name, function_version
Returns: HTTP response dict
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
import jwt
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL')
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')

def verify_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    token = headers.get('x-auth-token') or headers.get('X-Auth-Token')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Токен не предоставлен'}),
            'isBase64Encoded': False
        }
    
    payload = verify_token(token)
    if not payload:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Невалидный или истёкший токен'}),
            'isBase64Encoded': False
        }
    
    user_id = payload['user_id']
    
    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {})
            year = query_params.get('year')
            month = query_params.get('month')
            
            if not year or not month:
                now = datetime.now()
                year = now.year
                month = now.month
            else:
                year = int(year)
                month = int(month)
            
            cur.execute('''
                SELECT id, year, month, goal_score, created_at, updated_at
                FROM t_p45717398_energy_dashboard_pro.monthly_goals
                WHERE user_id = %s AND year = %s AND month = %s
            ''', (user_id, year, month))
            
            goal = cur.fetchone()
            
            if goal:
                result = {
                    'id': goal['id'],
                    'year': goal['year'],
                    'month': goal['month'],
                    'goalScore': float(goal['goal_score']),
                    'createdAt': goal['created_at'].isoformat() if goal['created_at'] else None,
                    'updatedAt': goal['updated_at'].isoformat() if goal['updated_at'] else None
                }
            else:
                result = None
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' or method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            year = body_data.get('year')
            month = body_data.get('month')
            goal_score = body_data.get('goalScore')
            
            if not year or not month or goal_score is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'year, month и goalScore обязательны'}),
                    'isBase64Encoded': False
                }
            
            if goal_score < 0 or goal_score > 5:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'goalScore должен быть от 0 до 5'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                INSERT INTO t_p45717398_energy_dashboard_pro.monthly_goals 
                (user_id, year, month, goal_score, updated_at)
                VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (user_id, year, month) 
                DO UPDATE SET 
                    goal_score = EXCLUDED.goal_score,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id, year, month, goal_score, created_at, updated_at
            ''', (user_id, year, month, goal_score))
            
            goal = cur.fetchone()
            conn.commit()
            
            result = {
                'id': goal['id'],
                'year': goal['year'],
                'month': goal['month'],
                'goalScore': float(goal['goal_score']),
                'createdAt': goal['created_at'].isoformat() if goal['created_at'] else None,
                'updatedAt': goal['updated_at'].isoformat() if goal['updated_at'] else None
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if conn:
            cur.close()
            conn.close()
