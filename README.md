# Aligned Hearts

![Develop Platform](https://img.shields.io/badge/platform-Desktop-lightgray)
![Status](https://img.shields.io/badge/status-in%20develop-pink)

![Python](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue)
![FastAPI](https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=FASTAPI&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

<img width="900" alt="main-page" src="https://github.com/user-attachments/assets/99b38c5d-5d42-4b64-82ee-31b5dde08545" />

## ❤️ Description

Aligned Hearts is designed to bridge the communication gap between partners by transforming heated disputes into structured, manageable dialogues. The journey toward understanding begins with **Anonymous Input**, where each partner describes the conflict from their own perspective, speaking as if to a personal therapist. 

Once the messages are received, the core enters the **AI Analysis** phase. Here, the system independently deconstructs each partner's narrative to identify underlying emotions, primary triggers, and the current stage of the conflict. This is followed by **Conflict Mapping**, where a logic engine compares these individual perspectives to pinpoint exactly where the couple’s views converge or diverge. 

Finally, the process culminates in **Personalized Feedback**. By leveraging the reasoning power of Large Language Models, Aligned Hearts synthesizes the NLU data into professional, empathetic recommendations. Instead of generic advice, the system provides a tailored roadmap for reconciliation, explaining one partner's hidden feelings to the other and offering clear steps to resolve the tension.

## 📷 Screenshots

### Profile page
<img width="900" alt="profile" src="https://github.com/user-attachments/assets/a019f068-fc54-4e19-864c-61e7e605a292" />

### Settings page
<img width="900" alt="settings" src="https://github.com/user-attachments/assets/cab6c08a-c82f-4bab-952f-841b07496234" />

### Create room
<img width="900" alt="room-create" src="https://github.com/user-attachments/assets/276ab531-ee5a-4473-b356-e4f6899ec4f0" />

### Wait for partner
<img width="900" alt="room-wait" src="https://github.com/user-attachments/assets/e0010f9c-aab8-4b51-a047-77e1bac1ec06" />

### Room messaging
<img width="900" alt="room-run" src="https://github.com/user-attachments/assets/97307eea-9f24-4bc6-907d-920bc37d9032" />

## 🏗 Core Architecture (3-Layer Pipeline)

The Aligned Hearts core operates as a cascaded processing pipeline designed for high-quality psychological analysis on consumer-grade hardware (Edge AI). Instead of passing raw text directly to a heavy LLM, the system first structures the data through a specialized NLU layer to ensure precision and efficiency.

### 1. Perception Layer (NLU)
Two independent text streams from each partner are transformed into structured state vectors using a fine-tuned MultiTaskRuBERT model based on rubert-tiny2. The model extracts five critical parameters per partner to define the conflict's anatomy: the Conflict Stage (stage_id) ranging from Pre-conflict to Resolution, the Intensity (strange_id) of emotional heat, and the broader Emotion Group (group_id). Additionally, it performs a deep dive into twenty nuanced emotional states (emotion_id) and identifies the primary Trigger (trigger_id) behind the dispute, such as Household, Jealousy, or Money.

### 2. Contextualization Layer (Knowledge Base)
The system enriches this raw classification data by mapping model IDs to detailed human-readable psychological interpretations from a local knowledge base. This process involves a data enrichment phase that explains the significance of specific stages or triggers and a context synthesis phase that prepares a comprehensive prompt for the LLM. This prompt integrates the original messages, gender context, and multi-dimensional NLU analysis to provide the generative model with a complete picture of the relationship dynamic.

### 3. Reasoning Layer (Generative AI)
The final stage synthesizes personalized and empathetic recommendations using a Llama-3-8B model accessed via the OllamaAsyncClient. Acting in the role of a professional family psychologist, the model analyzes the feelings of both partners and explains one partner's perspective to the other to foster mutual understanding. The ultimate objective is to provide actionable advice through a structured JSON response containing specific recommendations for each individual, helping the couple navigate their conflict constructively.

## 🚀 Quick Deployment Guide
Prerequisites: Docker and Docker Compose installed.
### 1. Environment Setup
- Create `./backend/.env` file based on following requirements:
```
DATABASE_URL=postgresql://postgres:your-secret-pass@db:5432/db_name
JWT_SECRET=your-jwt-secret

GOOGLE_CLIENT_ID=secret-token
GOOGLE_CLIENT_SECRET=secret-token
SESSION_SECRET=secret-token

SWAGGER_USER=swagger-docs-name
SWAGGER_PASS=swagger-docs-password

S3_ACCESS_KEY=secret-token
S3_SECRET_KEY=secret-token
S3_ENDPOINT_URL=secret-token
S3_BUCKET_NAME=s3-bucket-name

TELEGRAM_BOT_KEY=token-to-identify-telegram-client
```
- Create `./core/.env` file with **empty** content.
- Create `./database/init.sql` file with following content:
```sql
CREATE DATABASE db_name;
```
### 2. Launch with Docker Compose
Run the following command to start the PostgreSQL database and the FastAPI backend:

```bash
docker-compose up -d
```

**Notice:** If you are using Windows - change `postres_data` volume in `db` service to your location.

The backend will be available at http://localhost:8000.
### 3. Nginx Configuration
To expose the service and handle WebSockets for real-time updates, use the following Nginx configuration as a template:

```conf
server {
    listen 80;
    server_name alignedhearts.ru;

    location / {
        proxy_pass http://localhost:3000; # React Frontend
    }

    location /api {
        proxy_pass http://localhost:8000; # FastAPI Backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws {
        proxy_pass http://localhost:8000; # WebSocket Support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

## 👥 Credits
|   Name   |   Role   | 
|----------|----------|
| [Golov Alexsandr](https://github.com/lamerous)    | Lead Architect, Backend | 
| [Zakhvey Ivan](https://github.com/vaveyko)    | ML Engineer  | 
| [Scherbak Rodion](https://github.com/eepyGato)    | ML Engineer | 
| [Solonovich Violetta](https://github.com/viosolo)    | Telegram Client, Backend | 
| [Popov Kirill](https://github.com/OldPole)    | Frontend | 

## 📄 License
This project is licensed under the [GPL-3.0 license](LICENSE).
