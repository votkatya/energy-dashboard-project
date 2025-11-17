import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Analyze user energy entries using Perplexity AI and provide recommendations
    Args: event with httpMethod, headers (X-User-Id)
    Returns: AI-generated insights and recommendations based on energy patterns
    '''
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
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('x-user-id') or headers.get('X-User-Id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'User ID required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    perplexity_key = os.environ.get('PERPLEXITY_API_KEY')
    
    print(f"DEBUG: perplexity_key exists: {bool(perplexity_key)}")
    print(f"DEBUG: perplexity_key length: {len(perplexity_key) if perplexity_key else 0}")
    print(f"DEBUG: All env keys: {list(os.environ.keys())}")
    
    if not perplexity_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Perplexity API key not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    user_id_escaped = str(user_id).replace("'", "''")
    
    cursor.execute(f'''
        SELECT e.entry_date, e.score, e.thoughts, COALESCE(string_agg(t.tag_name, ', '), '') as tags
        FROM t_p45717398_energy_dashboard_pro.energy_entries e
        LEFT JOIN t_p45717398_energy_dashboard_pro.entry_tags et ON e.id = et.entry_id
        LEFT JOIN t_p45717398_energy_dashboard_pro.tags t ON et.tag_id = t.id
        WHERE e.user_id = '{user_id_escaped}' 
        AND e.entry_date >= CURRENT_DATE - 7
        GROUP BY e.id, e.entry_date, e.score, e.thoughts
        ORDER BY e.entry_date DESC
    ''')
    
    entries = cursor.fetchall()
    cursor.close()
    conn.close()
    
    if not entries:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'analysis': 'Недостаточно данных для анализа. Добавьте больше записей об энергии.',
                'recommendations': []
            })
        }
    
    entries_text = "\n".join([
        f"Дата: {entry['entry_date']}, Оценка дня: {entry['score']}/10, Теги: {entry['tags'] or 'нет'}, Заметка: {entry['thoughts'] or 'нет'}"
        for entry in entries
    ])
    
    prompt = f"""Ты — персональный аналитик энергии, эмоционального состояния и образа жизни пользователя.
Твоя задача — находить закономерности, объяснять причины и давать конкретные действия, которые реально улучшают состояние человека.

🔹 Входные данные:
{entries_text}

(каждая запись включает дату, оценку дня, выбранные теги и заметку)

🧠 ТВОЯ ЗАДАЧА:

1. Проанализировать данные недели
Обрати внимание на:
- динамику оценок по дням (улучшение/ухудшение/колебания)
- теги, которые чаще всего встречаются
- теги, которые сопровождают низкие оценки
- теги, которые сопровождают высокие оценки
- эмоциональный тон заметок
- скрытые закономерности (например: сон + работа → просадка, хобби + общение → подъём)
- повторяющиеся мысли или состояния
- дни-исключения (резкие изменения и почему)

2. Выделить ключевые паттерны
Для каждого паттерна укажи:
- что конкретно вызывает + энергию
- что вызывает – энергию
- какие сочетания факторов наиболее значимы
- как эмоциональный фон влияет на оценки

3. Определить главные драйверы и «стоп-факторы»
Приоритетно оцени: сон, здоровье, работа, семья, хобби, спорт, общение, учёба
Определи: какие 2–3 фактора влияют сильнее всего, даже если пользователь этого не осознаёт.

4. Составить список наблюдений и инсайтов
Формат инсайта:
- «Когда происходит Х → энергия падает/растёт, потому что…»
- «Пользователь часто чувствует…, что связано с…»
- «Похоже, что пользователь недооценивает влияние…»

5. Сформировать рекомендации
Рекомендации должны быть:
- конкретными
- минимальными по усилию
- основанными на реальных данных
- адаптированными под паттерны конкретной недели

Подели на три блока:
✔ Что продолжать (работает хорошо)
🔧 Что подкорректировать (даст быстрый бонус)
🌱 Что попробовать новое (мягкие новые привычки)

Ответь в свободной форме, структурированно и с конкретными примерами из данных."""
    
    try:
        print(f"DEBUG: Making request to Perplexity API")
        response = requests.post(
            'https://api.perplexity.ai/chat/completions',
            headers={
                'Authorization': f'Bearer {perplexity_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'sonar',
                'messages': [
                    {'role': 'system', 'content': 'Ты эксперт по продуктивности и энергии. Отвечай кратко и конкретно на русском языке.'},
                    {'role': 'user', 'content': prompt}
                ],
                'temperature': 0.7,
                'max_tokens': 500
            },
            timeout=30
        )
        
        print(f"DEBUG: Perplexity response status: {response.status_code}")
        print(f"DEBUG: Perplexity response body: {response.text[:500]}")
        
        if response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'Perplexity API error: {response.status_code}', 'details': response.text[:200]})
            }
        
        result = response.json()
        ai_response = result['choices'][0]['message']['content']
        
        lines = [line.strip() for line in ai_response.split('\n') if line.strip()]
        analysis = lines[0] if lines else 'Анализ недоступен'
        recommendations = [line.lstrip('•-0123456789. ') for line in lines[1:] if line]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'analysis': analysis,
                'recommendations': recommendations[:5],
                'total_entries': len(entries)
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Analysis failed: {str(e)}'})
        }