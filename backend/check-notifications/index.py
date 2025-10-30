import json
import os
import psycopg2
import requests
from datetime import datetime, timedelta
from typing import Dict, Any, List
from zoneinfo import ZoneInfo

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
    
    from datetime import timezone
    
    current_time_utc = datetime.now(timezone.utc)
    
    print(f"Checking notifications. Current UTC time: {current_time_utc.strftime('%H:%M')}, Users found: {len(users)}")
    
    sent_count = 0
    cur = conn.cursor()
    
    for user_id, chat_id, settings, full_name in users:
        reminder_time = settings.get('dailyReminderTime', '21:00')
        user_timezone = settings.get('timezone', 'Europe/Moscow')
        
        try:
            tz = ZoneInfo(user_timezone)
        except Exception:
            tz = ZoneInfo('Europe/Moscow')
        
        current_time_user = current_time_utc.astimezone(tz)
        current_time_str = current_time_user.strftime('%H:%M')
        
        print(f"User {user_id} ({full_name}): timezone={user_timezone}, current_time={current_time_str}, reminder_time={reminder_time}, chat_id={chat_id}")
        
        cur.execute("""
            SELECT last_notification_sent 
            FROM t_p45717398_energy_dashboard_pro.users 
            WHERE id = %s
        """, (user_id,))
        result = cur.fetchone()
        last_sent = result[0] if result and result[0] else None
        
        today_date = current_time_user.date()
        should_send = False
        
        if current_time_str == reminder_time:
            if not last_sent or last_sent.astimezone(tz).date() < today_date:
                should_send = True
        
        if should_send:
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
                    cur.execute("""
                        UPDATE t_p45717398_energy_dashboard_pro.users 
                        SET last_notification_sent = %s 
                        WHERE id = %s
                    """, (current_time_utc, user_id))
                    conn.commit()
                    print(f"✅ Notification sent to user {user_id} ({full_name})")
                else:
                    print(f"❌ Telegram API error for user {user_id}: {response.status_code} - {response.text}")
            except Exception as e:
                print(f"❌ Failed to send notification to user {user_id}: {str(e)}")
    
    cur.close()
    conn.close()
    
    print(f"Check completed. Users checked: {len(users)}, Notifications sent: {sent_count}")
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'checked': len(users),
            'sent': sent_count,
            'time': current_time_str
        })
    }