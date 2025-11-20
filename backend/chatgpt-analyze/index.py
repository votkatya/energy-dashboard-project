import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Analyze user energy entries using ChatGPT and provide recommendations
    Args: event with httpMethod, headers (X-User-Id)
    Returns: AI-generated insights and recommendations based on energy patterns
    Version: 1.0.1
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
    
    if method == 'GET':
        # Return existing analysis from DB
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        user_id_escaped = str(user_id).replace("'", "''")
        
        cursor.execute(f'''
            SELECT analysis_text, total_entries, updated_at
            FROM t_p45717398_energy_dashboard_pro.ai_analyses
            WHERE user_id = '{user_id_escaped}'
        ''')
        
        existing = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not existing:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No analysis found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'analysis': existing['analysis_text'],
                'total_entries': existing['total_entries'],
                'updated_at': existing['updated_at'].isoformat() if existing['updated_at'] else None
            })
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
    openai_key = os.environ.get('OPENAI_API_KEY')
    proxy_url = os.environ.get('OPENAI_PROXY_URL')
    
    if not openai_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'OpenAI API key not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    user_id_escaped = str(user_id).replace("'", "''")
    
    # Check if analysis already exists
    cursor.execute(f'''
        SELECT analysis_text, total_entries, updated_at
        FROM t_p45717398_energy_dashboard_pro.ai_analyses
        WHERE user_id = '{user_id_escaped}'
    ''')
    
    existing_analysis = cursor.fetchone()
    
    # Get entries for analysis
    cursor.execute(f'''
        SELECT entry_date, score, thoughts, tags::text as tags
        FROM t_p45717398_energy_dashboard_pro.energy_entries
        WHERE user_id = '{user_id_escaped}' 
        AND entry_date >= CURRENT_DATE - 7
        ORDER BY entry_date DESC
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
        f"Дата: {entry['entry_date']}, Оценка дня: {entry['score']}/5, Теги: {entry['tags'] or 'нет'}, Мысли: {entry['thoughts'] or 'нет'}"
        for entry in entries
    ])
    
    prompt = f"""Ты — персональный аналитик энергии и эмоционального состояния.  
Проанализируй последние 7 дней записей пользователя.

ДАННЫЕ (последние 7 дней):
{entries_text}

Каждая запись содержит:
- оценку дня (1–5)
- мысли
- теги (что повлияло на день)

ТВОЯ ЗАДАЧА — ДАТЬ ГЛУБОКИЙ, ЧЕЛОВЕЧНЫЙ И ПОЛЕЗНЫЙ АНАЛИЗ

1. Определи ключевые паттерны недели
- что повышало энергию
- что понижало
- какие теги чаще всего приводили к подъёму или спаду
- какие мысли повторялись или образовывали тенденцию

2. Проанализируй динамику
- были ли скачки вверх или вниз
- точка максимума и минимума
- в какие дни произошли переломы
- есть ли циклы (например: 2 дня падения → резкий рост)

3. Разбери эмоциональный тон мыслей
- какие эмоции доминировали
- что пользователь пытался себе сказать
- где он проявлял поддержку себе
- где он, наоборот, давил, выгорал или избегал

4. Найди скрытые закономерности
(очень важно — проси модель это делать явно)
- какие теги усиливают энергию
- какие теги предсказывают спад
- какие слова-триггеры встречаются в мыслях
- какое состояние чаще всего предшествует упадку
- какие действия восстанавливают пользователя сильнее всего

5. Выдели 3 главных инсайта недели
Пиши человеческим, теплым языком.  
Не общими словами, а конкретно: что у пользователя срабатывает.

6. Сформулируй чёткие рекомендации на следующую неделю
Обязательно в виде:
- 3 персональные рекомендации (конкретные, не общие)
- 1 паттерн, который важно держать под наблюдением
- 1 маленькое действие, которое даст быстрый ресурс

ТОН
Пиши как мудрый, спокойный, внимательный друг.
Человечно, без шаблонных фраз, без назидания, без "мотивационной воды".

ФОРМАТ ОТВЕТА

### Итог недели
...

### Паттерны
- ...
- ...

### Динамика
- ...

### Эмоции и мысли
- ...

### 3 главных инсайта
1. ...
2. ...
3. ...

### Рекомендации на следующую неделю
- ...
- ...
- ...

### Что держать под наблюдением
- ...

### Одно маленькое действие на завтра
- ..."""
    
    try:
        request_body = {
            'model': 'gpt-4o-mini',
            'messages': [
                {'role': 'system', 'content': 'Ты эксперт по продуктивности и энергии. Отвечай на русском языке тёплым и человечным тоном.'},
                {'role': 'user', 'content': prompt}
            ],
            'temperature': 0.7,
            'max_tokens': 1500
        }
        
        request_headers = {
            'Authorization': f'Bearer {openai_key}',
            'Content-Type': 'application/json'
        }
        
        proxies = None
        if proxy_url:
            proxies = {
                'http': proxy_url,
                'https': proxy_url
            }
        
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=request_headers,
            json=request_body,
            proxies=proxies,
            timeout=60
        )
        
        if response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'OpenAI API error: {response.status_code}', 
                    'details': response.text[:200]
                })
            }
        
        result = response.json()
        ai_response = result['choices'][0]['message']['content']
        
        lines = [line.strip() for line in ai_response.split('\n') if line.strip()]
        analysis = ai_response
        recommendations = []
        
        in_recommendations = False
        for line in lines:
            if 'рекомендаци' in line.lower() or 'действи' in line.lower():
                in_recommendations = True
                continue
            if in_recommendations and (line.startswith('-') or line.startswith('•') or line[0].isdigit()):
                recommendations.append(line.lstrip('•-0123456789. '))
        
        # Save or update analysis in database
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        cursor.execute(f'''
            INSERT INTO t_p45717398_energy_dashboard_pro.ai_analyses 
                (user_id, analysis_text, total_entries, updated_at)
            VALUES ('{user_id_escaped}', %s, {len(entries)}, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) DO UPDATE SET
                analysis_text = EXCLUDED.analysis_text,
                total_entries = EXCLUDED.total_entries,
                updated_at = CURRENT_TIMESTAMP
        ''', (analysis,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'analysis': analysis,
                'recommendations': recommendations if recommendations else ['Продолжай отслеживать свою энергию'],
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