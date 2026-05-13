import asyncio
import json
import ollama
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from classifier_model import MultiTaskRuBERT

app = FastAPI()

classifier = MultiTaskRuBERT()
ollama_client = ollama.AsyncClient()


kb_path            = 'knowledge_base.json'
sys_template_path  = 'system_prompt_template.txt'
user_template_path = 'user_prompt_template.txt'

with open(kb_path, 'r', encoding='utf-8') as f:
    kb = json.load(f)
            
with open(sys_template_path, 'r', encoding='utf-8') as f:
    sys_template = f.read()
    
with open(user_template_path, 'r', encoding='utf-8') as f:
    user_template = f.read()


async def classify_text(text: str):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, classifier.predict_samples, [text])


@app.websocket("/ws/ai")
async def ai_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)

            owner_text  = data.get("text")
            member_text = data.get("member_text", "")
            owner_sex   = data.get("sex")
            member_sex  = data.get("member_sex", "")

            await websocket.send_json({"status": "classifying", "text": "Классифицируем ваш запрос"})
            classifications = await classify_text(owner_text)
            classifications2 = await classify_text(member_text)

            # Partner 1
            stage_1   = classifications['stage_id'][0][0]
            strange_1 = classifications['strange_id'][0][0]
            group_1   = classifications['group_id'][0][0]
            emotion_1 = classifications['emotion_id'][0][0]
            trigger_1 = classifications['trigger_id'][0][0]

            # Partner 2
            stage_2   = classifications2['stage_id'][0][0]
            strange_2 = classifications2['strange_id'][0][0]
            group_2   = classifications2['group_id'][0][0]
            emotion_2 = classifications2['emotion_id'][0][0]
            trigger_2 = classifications2['trigger_id'][0][0]

            # kb - knowlage base
            sys_data = {"owner_sex": owner_sex, "member_sex": member_sex}

            user_data = {
                "owner_text":     owner_text,
                "member_text":    member_text,
                "stage_1":        stage_1,
                "stage_desc_1":   kb['stage_id'].get(stage_1, ""),
                "strange_1":      strange_1,
                "strange_desc_1": kb['strange_id'].get(strange_1, ""),
                "group_1":        group_1,
                "group_desc_1":   kb['group_id'].get(group_1, ""),
                "emotion_1":      emotion_1,
                "emotion_desc_1": kb['emotion_id'].get(emotion_1, ""),
                "trigger_1":      trigger_1,
                "trigger_desc_1": kb['trigger_id'].get(trigger_1, ""),

                "stage_2":        stage_2,
                "stage_desc_2":   kb['stage_id'].get(stage_2, ""),
                "strange_2":      strange_2,
                "strange_desc_2": kb['strange_id'].get(strange_2, ""),
                "group_2":        group_2,
                "group_desc_2":   kb['group_id'].get(group_2, ""),
                "emotion_2":      emotion_2,
                "emotion_desc_2": kb['emotion_id'].get(emotion_2, ""),
                "trigger_2":      trigger_2,
                "trigger_desc_2": kb['trigger_id'].get(trigger_2, "")
            }

            await websocket.send_json({"status": "preparing", "text": "Подготавливаем нашу модель"})
            sys_prompt  = sys_template.format(**sys_data)
            user_prompt = user_template.format(**user_data)

    
            await websocket.send_json({"status": "preparing", "text": "Генерируем результат"})

            stream = await ollama_client.chat(
                model="77ko88ok/psychocounsel-llama3-8:q4_l_m",
                messages=[
                    {"role": "system", "content": sys_prompt},
                    {"role": 'user', "content": user_prompt}
                ],
                stream=True,
            )

            ai_advice = ""

            # async for chunk in stream:
            #     ch = chunk["message"]["content"]
                
            #     ai_advice += ch
            #     print(ch, end='', flush=True)
            #     await websocket.send_json({"status": "generating", "text": ch})

            full_response = f"Братан, все будет хорошо. Если че, иишка много жрет, поэтому ее не запускал, а так она работает"
            words = full_response.split()
            
            for word in words:
                await websocket.send_json({
                    "status": "generating",
                    "text": word + " ",
                    "done": False
                })
                await asyncio.sleep(0.3)

            # # Финальное сообщение
            await websocket.send_json({"status": "completed", "text": full_response}) # change to ai_advice

    except WebSocketDisconnect:
        print("Основной бэкенд отключился")