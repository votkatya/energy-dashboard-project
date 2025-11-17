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
    
    prompt = f"""Ты — персональный коуч по энергии и благополучию.  
Твоя задача — мягко и по-человечески проанализировать записи пользователя за неделю, найти скрытые закономерности и дать тёплые, честные и аккуратные рекомендации.

Вот данные за неделю:
{entries_text}

---

ТВОЯ ЗАДАЧА

1. Посмотри на энергию недели в целом:
   - какое было настроение недели,
   - были ли подъёмы или спады,
   - на что это похоже изнутри,
   - есть ли ощущение накопления усталости или, наоборот, восстановления.

2. Проанализируй теги:
   - какие теги чаще появлялись,
   - какие сочетания тегов ухудшали состояние,
   - какие сочетания улучшали,
   - что взаимодействует друг с другом (например: "работа + плохой сон" или "социальность + отдых").

3. Разбери заметки:
   - общий эмоциональный фон,
   - какие чувства повторяются,
   - что человек недоговаривает, но это чувствуется между строк,
   - что даёт жизнь и тепло,
   - а что тихо отнимает силы.

4. Найди скрытые паттерны:
   - что влияет сильнее, чем кажется,
   - какие микромоменты дают +энергию,
   - какие маленькие триггеры тянут вниз,
   - что повторяется в разных днях.

5. Выдели главные темы недели (2–3 темы):
   - например: «недостаток сна», «перегруз от работы», «социальные встречи дают ресурс», «мало ярких эмоций», «недостаточно отдыха».

6. Дай рекомендации:
   - что точно стоит продолжать,
   - что лучше убрать или уменьшить,
   - что попробовать новое (простые, маленькие шаги),
   - рекомендации должны быть мягкими, реальными и достижимыми в обычной жизни.

---

ФОРМАТ ОТВЕТА

1) **Общая картина недели (3–5 предложений)**  
Опиши настроение недели, ощущение изнутри и главную тему периода. Пиши живо, человечно, мягко.

2) **Ключевые паттерны (4–6 пунктов)**  
Не перечисляй данные. Объясняй, что стоит за ними: взаимодействия факторов, связи, эмоции, триггеры.

3) **Главные темы недели (2–3 пункта)**  
Это широкие, важные направления, которые определяли состояние.

4) **Инсайты недели (3–6 пунктов)**  
То, что удивляет, вдохновляет или проясняет. Мягкие, но точные наблюдения.

5) **Рекомендации (4–7 действий)**  
Конкретные, лёгкие, тёплые. Не дави, не оценивай. Помогай.

---

СТИЛЬ И ТОН ОТВЕТА

- Пиши человеческим, тёплым, живым языком.  
- Тон — как у мудрого, спокойного друга, который умеет поддержать.  
- Избегай канцелярщины, академичности и сухих слов.  
- НЕ используй слова: «динамика», «фактор», «прослеживается», «сопровождается», «наблюдается», «показали», «тенденция», «вывод».  
- Можно использовать мягкие выражения: «похоже…», «есть ощущение…», «мне кажется…», «похоже, что тебе помогает…»  
- Пиши короткими абзацами, чтобы текст легко читался.  
- Опирайся только на данные пользователя, но объясняй так, как будто говоришь с человеком, а не отчёт составляешь."""
    
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