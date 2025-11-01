import json
import os
import psycopg2
import requests
from datetime import datetime, timedelta
from typing import Dict, Any, List
from zoneinfo import ZoneInfo

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Check notification settings and send daily reminders, weekly reports, and burnout warnings via Telegram
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
        SELECT id, telegram_chat_id, notification_settings, full_name,
               last_notification_sent, last_weekly_report_sent, last_burnout_warning_sent
        FROM t_p45717398_energy_dashboard_pro.users 
        WHERE telegram_chat_id IS NOT NULL 
        AND (
            notification_settings->>'dailyReminder' = 'true'
            OR notification_settings->>'weeklyReport' = 'true'
            OR notification_settings->>'burnoutWarnings' = 'true'
        )
    """)
    
    users = cur.fetchall()
    cur.close()
    
    from datetime import timezone
    
    current_time_utc = datetime.now(timezone.utc)
    
    print(f"Checking notifications. Current UTC time: {current_time_utc.strftime('%H:%M')}, Users found: {len(users)}")
    
    daily_sent = 0
    weekly_sent = 0
    burnout_sent = 0
    cur = conn.cursor()
    
    for user_id, chat_id, settings, full_name, last_daily, last_weekly, last_burnout in users:
        user_timezone = settings.get('timezone', 'Europe/Moscow')
        
        try:
            tz = ZoneInfo(user_timezone)
        except Exception:
            tz = ZoneInfo('Europe/Moscow')
        
        current_time_user = current_time_utc.astimezone(tz)
        current_time_str = current_time_user.strftime('%H:%M')
        today_date = current_time_user.date()
        current_weekday = current_time_user.weekday()
        
        print(f"User {user_id} ({full_name}): timezone={user_timezone}, current_time={current_time_str}, chat_id={chat_id}")
        
        if settings.get('dailyReminder'):
            reminder_time = settings.get('dailyReminderTime', '21:00')
            reminder_hour = int(reminder_time.split(':')[0])
            current_hour = current_time_user.hour
            
            if current_hour == reminder_hour:
                if not last_daily or last_daily.astimezone(tz).date() < today_date:
                    message = f"Привет, {full_name or 'друг'}! 👋\n\n"
                    message += "Время оценить свой день в FlowKat! 🌟\n\n"
                    message += "Как прошёл твой день? Заполни дневник энергии, чтобы отследить свой прогресс."
                    
                    if send_telegram_message(bot_token, chat_id, message):
                        daily_sent += 1
                        cur.execute("""
                            UPDATE t_p45717398_energy_dashboard_pro.users 
                            SET last_notification_sent = %s 
                            WHERE id = %s
                        """, (current_time_utc, user_id))
                        conn.commit()
                        print(f"✅ Daily reminder sent to user {user_id} ({full_name})")
        
        if settings.get('weeklyReport') and current_weekday == 0 and current_hour == 9:
            if not last_weekly or last_weekly.astimezone(tz).date() < today_date:
                weekly_stats = get_weekly_stats(conn, user_id, tz)
                
                if weekly_stats:
                    message = f"📊 Еженедельный отчёт для {full_name or 'тебя'}!\n\n"
                    message += f"📅 Записей за неделю: {weekly_stats['count']}\n"
                    message += f"⚡ Средний балл: {weekly_stats['avg_score']:.1f}/5\n\n"
                    
                    if weekly_stats['trend'] > 0:
                        message += f"📈 Отличная динамика! Ты на подъёме (+{weekly_stats['trend']:.1f})"
                    elif weekly_stats['trend'] < 0:
                        message += f"📉 Небольшой спад ({weekly_stats['trend']:.1f}). Отдыхай больше!"
                    else:
                        message += "➡️ Стабильная неделя. Так держать!"
                    
                    if send_telegram_message(bot_token, chat_id, message):
                        weekly_sent += 1
                        cur.execute("""
                            UPDATE t_p45717398_energy_dashboard_pro.users 
                            SET last_weekly_report_sent = %s 
                            WHERE id = %s
                        """, (current_time_utc, user_id))
                        conn.commit()
                        print(f"✅ Weekly report sent to user {user_id} ({full_name})")
        
        if settings.get('burnoutWarnings') and current_hour == 20:
            if not last_burnout or (current_time_utc - last_burnout).days >= 1:
                burnout_risk = check_burnout_risk(conn, user_id)
                
                if burnout_risk:
                    message = f"⚠️ {full_name or 'Друг'}, важное предупреждение!\n\n"
                    message += f"Я заметил, что последние {burnout_risk['days']} дня твоя оценка энергии низкая "
                    message += f"(в среднем {burnout_risk['avg_score']:.1f}/5).\n\n"
                    message += "Это может быть признаком выгорания. 🔥\n\n"
                    message += "Рекомендации:\n"
                    message += "• Возьми выходной или отпуск\n"
                    message += "• Проведи время на природе\n"
                    message += "• Обратись к специалисту\n"
                    message += "• Пересмотри свою нагрузку"
                    
                    if send_telegram_message(bot_token, chat_id, message):
                        burnout_sent += 1
                        cur.execute("""
                            UPDATE t_p45717398_energy_dashboard_pro.users 
                            SET last_burnout_warning_sent = %s 
                            WHERE id = %s
                        """, (current_time_utc, user_id))
                        conn.commit()
                        print(f"✅ Burnout warning sent to user {user_id} ({full_name})")
    
    cur.close()
    conn.close()
    
    total_sent = daily_sent + weekly_sent + burnout_sent
    print(f"Check completed. Users checked: {len(users)}, Total sent: {total_sent} (daily: {daily_sent}, weekly: {weekly_sent}, burnout: {burnout_sent})")
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'checked': len(users),
            'daily_sent': daily_sent,
            'weekly_sent': weekly_sent,
            'burnout_sent': burnout_sent,
            'total_sent': total_sent
        })
    }


def send_telegram_message(bot_token: str, chat_id: int, message: str) -> bool:
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
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Failed to send message: {str(e)}")
        return False


def get_weekly_stats(conn, user_id: int, tz: ZoneInfo) -> Dict[str, Any]:
    cur = conn.cursor()
    
    from datetime import timezone
    now_utc = datetime.now(timezone.utc)
    now_user = now_utc.astimezone(tz)
    week_ago = now_user - timedelta(days=7)
    two_weeks_ago = now_user - timedelta(days=14)
    
    cur.execute("""
        SELECT 
            COUNT(*) as count,
            AVG(score) as avg_score
        FROM t_p45717398_energy_dashboard_pro.energy_entries
        WHERE user_id = %s AND entry_date >= %s AND entry_date < %s
    """, (user_id, week_ago.date(), now_user.date()))
    
    result = cur.fetchone()
    
    if not result or result[0] == 0:
        cur.close()
        return None
    
    count, avg_score = result
    
    cur.execute("""
        SELECT AVG(score) as prev_avg_score
        FROM t_p45717398_energy_dashboard_pro.energy_entries
        WHERE user_id = %s AND entry_date >= %s AND entry_date < %s
    """, (user_id, two_weeks_ago.date(), week_ago.date()))
    
    prev_result = cur.fetchone()
    prev_avg = prev_result[0] if prev_result and prev_result[0] else avg_score
    
    cur.close()
    
    return {
        'count': count,
        'avg_score': float(avg_score),
        'trend': float(avg_score - prev_avg)
    }


def check_burnout_risk(conn, user_id: int) -> Dict[str, Any]:
    cur = conn.cursor()
    
    cur.execute("""
        SELECT score, entry_date
        FROM t_p45717398_energy_dashboard_pro.energy_entries
        WHERE user_id = %s
        ORDER BY entry_date DESC
        LIMIT 5
    """, (user_id,))
    
    entries = cur.fetchall()
    cur.close()
    
    if len(entries) < 3:
        return None
    
    low_energy_days = 0
    total_score = 0
    
    for score, entry_date in entries:
        if score <= 2:
            low_energy_days += 1
            total_score += score
    
    if low_energy_days >= 3:
        return {
            'days': low_energy_days,
            'avg_score': total_score / low_energy_days
        }
    
    return None