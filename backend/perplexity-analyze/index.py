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
        f"Дата: {entry['entry_date']}, Оценка дня: {entry['score']}/10, Теги: {entry['tags'] or 'нет'}, Заметка: {entry['thoughts'] or 'нет'}"
        for entry in entries
    ])
    
    prompt = f"""Ты — продвинутый аналитик энергии, эмоциональных состояний и поведения.  
Твоя задача — проводить глубокий анализ даже при небольшом количестве данных, выявлять скрытые паттерны и давать сильные практические рекомендации.

ДАННЫЕ (записи пользователя за неделю):
{entries_text}

ТВОЯ РАБОТА:

1. Проанализируй динамику энергии, но НЕ перечисляй данные — делай выводы:
   - как менялось состояние внутри недели,
   - были ли резкие скачки и что их вызвало,
   - есть ли накопление усталости или ресурсов.

2. Проанализируй теги:
   - какие встречаются чаще,
   - какие теги в сочетании дают низкую энергию,
   - какие теги в сочетании дают высокую энергию,
   - есть ли взаимодействие факторов (например: "работа + плохой сон" → падение энергии).

3. Проанализируй заметки:
   - эмоциональный тон,
   - скрытые переживания,
   - уровни напряжения/энтузиазма,
   - непроявленные потребности пользователя.

4. Найди скрытые паттерны и закономерности:
   - что не лежит на поверхности,
   - что повторяется в разных днях,
   - что пользователь недооценивает,
   - какие малые действия дают заметный эффект.

5. Найди главные факторы недели:
   - что больше всего влияло на энергию (топ-2–3),
   - почему именно эти факторы оказались решающими.

6. Сформируй глубокие инсайты:
   - в чём настоящая причина усталости/ресурсности,
   - какие эмоциональные процессы повторяются,
   - что можно назвать "слабым звеном",
   - что является "скрытым источником сил".

7. Дай рекомендации (4–7 пунктов), обязательно:
   - чёткие,
   - конкретные,
   - минимальные по усилию,
   - основанные на найденных паттернах,
   - раздели на:
       а) что продолжать,
       б) что изменить,
       в) что попробовать.

ФОРМАТ ОТВЕТА:

1. **Общая картина недели (3–5 предложений)** — динамика + состояние + ключевая тема недели.
2. **Ключевые паттерны (4–6 пунктов)** — глубоко, со связями.
3. **Главные факторы влияния (2–3 пункта)** — почему они ключевые.
4. **Инсайты недели (3–6 пунктов)** — неожиданные выводы, "ага-эффекты".
5. **Рекомендации (4–7 конкретных действий)** — строго по данным и паттернам.

Будь аналитичным, глубоким, человеческим и поддерживающим.  
Не перечисляй данные — делай выводы.  
Работай с причинно-следственными связями и эмоциональными контекстами."""
    
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