import json
import asyncio
import ollama
from classifier_model import MultiTaskRuBERT

model = MultiTaskRuBERT()

async def get_input(prompt: str):
    return input(prompt)

async def classify_text(text: str):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, model.predict_samples, [text])

async def main():
    with open('knowledge_base.json', 'r', encoding='utf-8') as f:
        kb = json.load(f)

    with open('system_prompt_template.txt', 'r', encoding='utf-8') as f:
        sys_template = f.read()

    with open('user_prompt_template.txt', 'r', encoding='utf-8') as f:
        user_template = f.read()


    inp1 = await get_input("Текст первого партнера: ")
    task1 = asyncio.create_task(classify_text(inp1))

    inp2 = await get_input("Текст второго партнера: ")
    task2 = asyncio.create_task(classify_text(inp2))

    classifications = await task1
    classifications2 = await task2


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
    sys_data = {"owner_sex": "мужчина", "member_sex": "женщина"}

    user_data = {
        "owner_text":     inp1,
        "member_text":    inp2,
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


    sys_prompt  = sys_template.format(**sys_data)
    user_prompt = user_template.format(**user_data) 

    print("[SYSTEM PROMPT]:", sys_prompt)
    print("\n[USER_PROMPT]:", user_prompt)
    print("\n[START GENERATING ANSWER]")


    client = ollama.AsyncClient()
    stream = await client.chat(
        model="77ko88ok/psychocounsel-llama3-8:q4_l_m",
        messages=[
            {"role": "system", "content": sys_prompt},
            {"role": 'user', "content": user_prompt}
        ],
        stream=True,
    )

    async for chunk in stream:
        print(chunk["message"]["content"], end='', flush=True)

if __name__ == "__main__":
    asyncio.run(main())