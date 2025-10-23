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
    
    sheet_url = os.environ.get('GOOGLE_SHEET_URL', '').strip()
    
    if not sheet_url or not sheet_url.startswith('http'):
        demo_entries = [
            {'date': '07.10.2025', 'score': 3, 'thoughts': 'вернулась с отпуска, очень хотела спать и очень много работы было', 'category': 'Нейтральный', 'week': '06.10.2025', 'month': '01.10.2025'},
            {'date': '08.10.2025', 'score': 5, 'thoughts': 'отпуск', 'category': 'Хороший', 'week': '06.10.2025', 'month': '01.10.2025'},
            {'date': '09.10.2025', 'score': 5, 'thoughts': 'отпуск', 'category': 'Хороший', 'week': '06.10.2025', 'month': '01.10.2025'},
            {'date': '15.10.2025', 'score': 3, 'thoughts': 'вернулась с отпуска', 'category': 'Нейтральный', 'week': '13.10.2025', 'month': '01.10.2025'},
            {'date': '17.10.2025', 'score': 4, 'thoughts': 'постепенно в ритм вхожу', 'category': 'Хороший', 'week': '13.10.2025', 'month': '01.10.2025'},
            {'date': '20.10.2025', 'score': 2, 'thoughts': 'сложный был понедельник', 'category': 'Плохой', 'week': '20.10.2025', 'month': '01.10.2025'},
            {'date': '21.10.2025', 'score': 4, 'thoughts': 'утром гулять не ходила', 'category': 'Хороший', 'week': '20.10.2025', 'month': '01.10.2025'},
            {'date': '22.10.2025', 'score': 5, 'thoughts': 'день был классный', 'category': 'Хороший', 'week': '20.10.2025', 'month': '01.10.2025'},
        ]
        
        demo_stats = {
            'good': 5,
            'neutral': 2,
            'bad': 1,
            'average': 4.1,
            'total': 8
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'entries': demo_entries,
                'stats': demo_stats,
                'demo': True
            }, ensure_ascii=False)
        }
    
    try:
        if not sheet_url.startswith('https://docs.google.com/spreadsheets/'):
            raise ValueError('Invalid Google Sheets URL format')
            
        sheet_id = sheet_url.split('/d/')[1].split('/')[0]
        gid = '1030040391'
        csv_url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}'
        
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
                    score_str = values[1].strip()
                    if not score_str or not score_str.isdigit():
                        continue
                    
                    score = int(score_str)
                    if score < 1 or score > 5:
                        continue
                    
                    entry = {
                        'date': values[0].strip(),
                        'score': score,
                        'thoughts': values[2].strip(),
                        'category': values[4].strip(),
                        'week': values[5].strip(),
                        'month': values[6].strip()
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
        demo_entries = [
            {'date': '07.10.2025', 'score': 3, 'thoughts': 'вернулась с отпуска, очень хотела спать и очень много работы было', 'category': 'Нейтральный', 'week': '06.10.2025', 'month': '01.10.2025'},
            {'date': '08.10.2025', 'score': 5, 'thoughts': 'отпуск', 'category': 'Хороший', 'week': '06.10.2025', 'month': '01.10.2025'},
            {'date': '09.10.2025', 'score': 5, 'thoughts': 'отпуск', 'category': 'Хороший', 'week': '06.10.2025', 'month': '01.10.2025'},
            {'date': '15.10.2025', 'score': 3, 'thoughts': 'вернулась с отпуска', 'category': 'Нейтральный', 'week': '13.10.2025', 'month': '01.10.2025'},
            {'date': '17.10.2025', 'score': 4, 'thoughts': 'постепенно в ритм вхожу', 'category': 'Хороший', 'week': '13.10.2025', 'month': '01.10.2025'},
            {'date': '20.10.2025', 'score': 2, 'thoughts': 'сложный был понедельник', 'category': 'Плохой', 'week': '20.10.2025', 'month': '01.10.2025'},
            {'date': '21.10.2025', 'score': 4, 'thoughts': 'утром гулять не ходила', 'category': 'Хороший', 'week': '20.10.2025', 'month': '01.10.2025'},
            {'date': '22.10.2025', 'score': 5, 'thoughts': 'день был классный', 'category': 'Хороший', 'week': '20.10.2025', 'month': '01.10.2025'},
        ]
        
        demo_stats = {
            'good': 5,
            'neutral': 2,
            'bad': 1,
            'average': 4.1,
            'total': 8
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'entries': demo_entries,
                'stats': demo_stats,
                'demo': True,
                'error': str(e)
            }, ensure_ascii=False)
        }