Q-A Chatbot for Documentation (NeoRag)
This project is a hybrid RAG + Knowledge Graph AI Assistant, built using an n8n workflow. It combines document ingestion & OCR, embeddings + Qdrant (vector database), Neo4j (knowledge graph), and Large Language Models (Ollama & Google Gemini).
Repository Structure

Q-A-Chatbot-For-Documentation-NeoRag/
├── Backend/     ⬅ n8n workflow, configuration & orchestration logic
├── Frontend/    ⬅ UI or integration layer (depending on setup)
└── README.md    ⬅ This usage guide

Prerequisites
- Node.js
- n8n installed and accessible via CLI or container
- Running instances or access to Qdrant (vector database) and Neo4j (graph database)
- Access to Ollama & Google Gemini APIs or local endpoints
Setup
1. Clone Repository
git clone https://github.com/TVSSAMHITH/Q-A-Chatbot-For-Documentation-NeoRag-.git
cd Q-A-Chatbot-For-Documentation-NeoRag-
2. Configure Environment & Services
Set up your environment variables or config files (.env) to include Qdrant host/port, Neo4j credentials, and API keys for Ollama & Google Gemini.
3. Backend (n8n Workflow Setup)
If using Docker:
cd Backend
docker-compose up -d

Or via CLI:
cd Backend
n8n import:workflow --input your-workflow-settings.json
n8n start
4. Frontend
If the frontend includes a UI (React or Node.js based):
cd Frontend
npm install
npm start
How It Works

1. Document ingestion & OCR – Inputs are processed into text form.
2. Embeddings – Processed documents are embedded and stored in Qdrant.
3. Knowledge Graph – Structured data flows into Neo4j for relational inference.
4. User Query – A query triggers the RAG pipeline, retrieving relevant context from Qdrant and Neo4j.
5. Answer Generation – Context is sent to Ollama or Google Gemini for response generation.
6. Output – Response delivered to frontend/client.

Troubleshooting

- Ensure all services (n8n, Qdrant, Neo4j) are running.
- Verify environment configurations (API keys, endpoints).
- Check n8n logs for workflow errors.
- Confirm embeddings and graph ingestion succeed.

Contributors & License
Developed by TVSSAMHITH.
License: (add your license info).
Contributions welcome!
