import json
import os
import psycopg2
import requests
from datetime import datetime, timedelta
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Check user notification settings and send daily reminders via Telegram
    Args: event with httpMethod (can be called via cron or HTTP)
    Returns: HTTP response with count of sent notifications
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'TELEGRAM_BOT_TOKEN not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT id, telegram_chat_id, notification_settings, full_name 
        FROM t_p45717398_energy_dashboard_pro.users 
        WHERE telegram_chat_id IS NOT NULL 
        AND notification_settings->>'dailyReminder' = 'true'
    """)
    
    users = cur.fetchall()
    cur.close()
    conn.close()
    
    current_time = datetime.now().strftime('%H:%M')
    sent_count = 0
    
    for user_id, chat_id, settings, full_name in users:
        reminder_time = settings.get('dailyReminderTime', '21:00')
        
        if current_time == reminder_time:
            message = f"Привет, {full_name or 'друг'}! 👋\n\n"
            message += "Время оценить свой день в FlowKat! 🌟\n\n"
            message += "Как прошёл твой день? Заполни дневник энергии, чтобы отследить свой прогресс."
            
            try:
                response = requests.post(
                    f'https://api.telegram.org/bot{bot_token}/sendMessage',
                    json={
                        'chat_id': chat_id,
                        'text': message,
                        'parse_mode': 'HTML'
                    },
                    timeout=10
                )
                
                if response.status_code == 200:
                    sent_count += 1
            except Exception as e:
                print(f"Failed to send notification to user {user_id}: {str(e)}")
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'checked': len(users),
            'sent': sent_count,
            'time': current_time
        })
    }