'''
Business: Test database connection and check user data
Args: event with httpMethod
Returns: User data from database
'''

import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT id, full_name, telegram_chat_id, notification_settings 
        FROM t_p45717398_energy_dashboard_pro.users
    """)
    
    rows = cur.fetchall()
    
    result = []
    for row in rows:
        result.append({
            'id': row[0],
            'full_name': row[1],
            'telegram_chat_id': row[2],
            'notification_settings': row[3]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps(result, ensure_ascii=False, indent=2)
    }
