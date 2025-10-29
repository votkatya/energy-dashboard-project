'''
Backend функция для работы с записями энергии в PostgreSQL
Поддерживает GET (получение всех записей), POST (добавление новой записи), PUT (обновление), DELETE (удаление)
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if not DATABASE_URL:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cur.execute('''
                SELECT id, entry_date, score, thoughts, created_at, updated_at
                FROM energy_entries
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
            entry_date = body_data.get('date')
            score = body_data.get('score')
            thoughts = body_data.get('thoughts', '')
            
            if not entry_date or score is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'date and score are required'}),
                    'isBase64Encoded': False
                }
            
            if score < 0 or score > 4:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'score must be between 0 and 4'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                INSERT INTO energy_entries (entry_date, score, thoughts)
                VALUES (%s, %s, %s)
                ON CONFLICT (entry_date) 
                DO UPDATE SET score = EXCLUDED.score, thoughts = EXCLUDED.thoughts, updated_at = CURRENT_TIMESTAMP
                RETURNING id, entry_date, score, thoughts
            ''', (entry_date, score, thoughts))
            
            conn.commit()
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
            query_params = event.get('queryStringParameters') or {}
            entry_id = query_params.get('id')
            
            if not entry_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id parameter is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('DELETE FROM energy_entries WHERE id = %s', (entry_id,))
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
                'body': json.dumps({'error': 'Method not allowed'}),
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
