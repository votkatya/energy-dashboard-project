'''
Business: Send test notifications (daily/weekly/burnout) to user via Telegram
Args: event with httpMethod and queryStringParameters (type: daily/weekly/burnout)
Returns: Result of sending test notification
'''

import json
import os
import requests
import psycopg2
from typing import Dict, Any
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    dsn = os.environ.get('DATABASE_URL')
    
    if not bot_token or not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Missing configuration'})
        }
    
    params = event.get('queryStringParameters') or {}
    notification_type = params.get('type', 'daily')
    
    chat_id = 329579550
    user_id = 1
    full_name = 'Катерина'
    
    conn = psycopg2.connect(dsn)
    tz = ZoneInfo('Europe/Moscow')
    
    if notification_type == 'daily':
        message = f"Привет, {full_name}! 👋\n\n"
        message += "Время оценить свой день в FlowKat! 🌟\n\n"
        message += "Как прошёл твой день? Заполни дневник энергии, чтобы отследить свой прогресс."
    
    elif notification_type == 'weekly':
        weekly_stats = get_weekly_stats(conn, user_id, tz)
        
        if weekly_stats:
            message = f"📊 Еженедельный отчёт для {full_name}!\n\n"
            message += f"📅 Записей за неделю: {weekly_stats['count']}\n"
            message += f"⚡ Средний балл: {weekly_stats['avg_score']:.1f}/5\n\n"
            
            if weekly_stats['trend'] > 0:
                message += f"📈 Отличная динамика! Ты на подъёме (+{weekly_stats['trend']:.1f})"
            elif weekly_stats['trend'] < 0:
                message += f"📉 Небольшой спад ({weekly_stats['trend']:.1f}). Отдыхай больше!"
            else:
                message += "➡️ Стабильная неделя. Так держать!"
        else:
            message = f"{full_name}, недостаточно данных для недельного отчёта. Заполняй дневник каждый день! 📝"
    
    elif notification_type == 'burnout':
        burnout_risk = check_burnout_risk(conn, user_id)
        
        if burnout_risk:
            message = f"⚠️ {full_name}, важное предупреждение!\n\n"
            message += f"Я заметил, что последние {burnout_risk['days']} дня твоя оценка энергии низкая "
            message += f"(в среднем {burnout_risk['avg_score']:.1f}/5).\n\n"
            message += "Это может быть признаком выгорания. 🔥\n\n"
            message += "Рекомендации:\n"
            message += "• Возьми выходной или отпуск\n"
            message += "• Проведи время на природе\n"
            message += "• Обратись к специалисту\n"
            message += "• Пересмотри свою нагрузку"
        else:
            message = f"{full_name}, с твоей энергией всё в порядке! Признаков выгорания не обнаружено. 💪"
    
    else:
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Invalid type parameter'})
        }
    
    conn.close()
    
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    payload = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML'
    }
    
    response = requests.post(url, json=payload, timeout=10)
    
    if response.status_code == 200:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'type': notification_type,
                'message': 'Test notification sent!'
            })
        }
    else:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': False,
                'error': response.text
            })
        }


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