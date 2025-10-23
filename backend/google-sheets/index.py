import json
import os
from typing import Dict, Any, List
import urllib.request
import urllib.parse

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получает данные из Google Sheets и возвращает их в формате JSON
    Args: event - dict with httpMethod, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with energy data
    '''
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
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    sheet_url = os.environ.get('GOOGLE_SHEET_URL', '')
    
    if not sheet_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Google Sheet URL not configured',
                'message': 'Please add GOOGLE_SHEET_URL secret'
            })
        }
    
    try:
        csv_url = sheet_url.replace('/edit#gid=', '/export?format=csv&gid=')
        if '/edit' in csv_url and 'export' not in csv_url:
            csv_url = csv_url.replace('/edit', '/export?format=csv')
        
        req = urllib.request.Request(csv_url)
        with urllib.request.urlopen(req, timeout=10) as response:
            csv_data = response.read().decode('utf-8')
        
        lines = csv_data.strip().split('\n')
        if len(lines) < 2:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'entries': [], 'stats': {}})
            }
        
        headers = [h.strip() for h in lines[0].split(',')]
        entries = []
        
        for line in lines[1:]:
            if not line.strip():
                continue
            
            values = []
            current_value = ''
            in_quotes = False
            
            for char in line:
                if char == '"':
                    in_quotes = not in_quotes
                elif char == ',' and not in_quotes:
                    values.append(current_value.strip())
                    current_value = ''
                else:
                    current_value += char
            values.append(current_value.strip())
            
            if len(values) >= 7:
                try:
                    score = int(values[1]) if values[1].isdigit() else 0
                    entry = {
                        'date': values[0],
                        'score': score,
                        'thoughts': values[2],
                        'category': values[3],
                        'week': values[4],
                        'month': values[5]
                    }
                    entries.append(entry)
                except (ValueError, IndexError):
                    continue
        
        good_count = sum(1 for e in entries if e['score'] >= 4)
        neutral_count = sum(1 for e in entries if e['score'] == 3)
        bad_count = sum(1 for e in entries if e['score'] <= 2)
        avg_score = sum(e['score'] for e in entries) / len(entries) if entries else 0
        
        stats = {
            'good': good_count,
            'neutral': neutral_count,
            'bad': bad_count,
            'average': round(avg_score, 1),
            'total': len(entries)
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'entries': entries[-20:],
                'stats': stats
            }, ensure_ascii=False)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Failed to fetch sheet data',
                'message': str(e)
            })
        }
