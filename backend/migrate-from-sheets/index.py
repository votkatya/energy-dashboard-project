'''
Функция для миграции данных из Google Sheets в PostgreSQL базу данных
Читает все записи из таблицы и переносит их в базу данных
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
from typing import Dict, Any, List
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Only POST method allowed'}),
            'isBase64Encoded': False
        }
    
    DATABASE_URL = os.environ.get('DATABASE_URL')
    GOOGLE_SHEET_URL = os.environ.get('GOOGLE_SHEET_URL')
    
    if not DATABASE_URL:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    if not GOOGLE_SHEET_URL:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'GOOGLE_SHEET_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        csv_url = GOOGLE_SHEET_URL.replace('/edit#gid=', '/export?format=csv&gid=').replace('/edit?gid=', '/export?format=csv&gid=')
        if '/export?format=csv' not in csv_url:
            csv_url = GOOGLE_SHEET_URL.replace('/edit', '/export?format=csv')
        
        with urllib.request.urlopen(csv_url) as response:
            csv_data = response.read().decode('utf-8')
        
        lines = csv_data.strip().split('\n')
        if len(lines) < 2:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Google Sheet is empty or has no data'}),
                'isBase64Encoded': False
            }
        
        entries_to_insert: List[tuple] = []
        
        for line in lines[1:]:
            parts = line.split(',')
            if len(parts) < 2:
                continue
            
            entry_date_str = parts[0].strip()
            score_str = parts[1].strip()
            thoughts = ','.join(parts[2:]).strip() if len(parts) > 2 else ''
            
            if not entry_date_str or not score_str:
                continue
            
            try:
                score = int(score_str)
                if score < 0 or score > 4:
                    continue
                
                date_obj = None
                for fmt in ['%d.%m.%Y', '%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y']:
                    try:
                        date_obj = datetime.strptime(entry_date_str, fmt)
                        break
                    except ValueError:
                        continue
                
                if not date_obj:
                    continue
                
                entry_date = date_obj.strftime('%Y-%m-%d')
                entries_to_insert.append((entry_date, score, thoughts))
            except ValueError:
                continue
        
        if not entries_to_insert:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No valid entries found in Google Sheet'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        inserted_count = 0
        updated_count = 0
        
        for entry_date, score, thoughts in entries_to_insert:
            cur.execute('''
                INSERT INTO energy_entries (entry_date, score, thoughts)
                VALUES (%s, %s, %s)
                ON CONFLICT (entry_date) 
                DO UPDATE SET score = EXCLUDED.score, thoughts = EXCLUDED.thoughts, updated_at = CURRENT_TIMESTAMP
                RETURNING (xmax = 0) AS inserted
            ''', (entry_date, score, thoughts))
            
            result = cur.fetchone()
            if result['inserted']:
                inserted_count += 1
            else:
                updated_count += 1
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'inserted': inserted_count,
                'updated': updated_count,
                'total': inserted_count + updated_count
            }),
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