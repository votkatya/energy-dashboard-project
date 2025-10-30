'''
Business: Get Telegram chat_id for user who messaged the bot
Args: event with httpMethod, context with request_id
Returns: Latest chat_id from bot updates
'''

import json
import os
from typing import Dict, Any
import requests

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
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'TELEGRAM_BOT_TOKEN not configured'})
        }
    
    # Get updates from Telegram
    url = f'https://api.telegram.org/bot{bot_token}/getUpdates'
    response = requests.get(url)
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Failed to get updates from Telegram'})
        }
    
    data = response.json()
    updates = data.get('result', [])
    
    if not updates:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'message': 'No messages found. Send a message to the bot first.'})
        }
    
    # Get the latest message
    latest_update = updates[-1]
    chat_id = latest_update.get('message', {}).get('chat', {}).get('id')
    username = latest_update.get('message', {}).get('from', {}).get('username', 'N/A')
    first_name = latest_update.get('message', {}).get('from', {}).get('first_name', 'N/A')
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'chat_id': chat_id,
            'username': username,
            'first_name': first_name,
            'total_updates': len(updates)
        })
    }
