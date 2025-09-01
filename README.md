# Q-A Chatbot for Documentation (NeoRag)

**NeoRag** is a hybrid **Retrieval-Augmented Generation (RAG) + Knowledge Graph AI Assistant**, built using an **n8n workflow**.
It combines **document ingestion & OCR**, **vector search with Qdrant**, **knowledge graph with Neo4j**, and **Large Language Models (Ollama & Google Gemini)** to deliver accurate, context-aware answers from documentation.

---

## 📂 Repository Structure

```
Q-A-Chatbot-For-Documentation-NeoRag/
├── Backend/     # n8n workflow, orchestration & service configuration
├── Frontend/    # UI or integration layer
└── README.md    # Usage guide & documentation
```

---

## ✅ Prerequisites

Make sure you have the following installed and running:

* [Node.js](https://nodejs.org/)
* [n8n](https://n8n.io/) (CLI or Docker setup)
* [Qdrant](https://qdrant.tech/) (vector database)
* [Neo4j](https://neo4j.com/) (graph database)
* Access to **Ollama** & **Google Gemini APIs** (local or cloud endpoints)

---

## ⚙️ Setup

### 1. Clone Repository

```bash
git clone https://github.com/TVSSAMHITH/Q-A-Chatbot-For-Documentation-NeoRag-.git
cd Q-A-Chatbot-For-Documentation-NeoRag-
```

### 2. Configure Environment

Create a `.env` file (or update config) with:

```ini
QDRANT_HOST=localhost
QDRANT_PORT=6333
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
OLLAMA_API_KEY=your_ollama_key
GEMINI_API_KEY=your_gemini_key
```

### 3. Backend (n8n Workflow)

Run using Docker:

```bash
cd Backend
docker-compose up -d
```

Or via CLI:

```bash
cd Backend
n8n import:workflow --input your-workflow-settings.json
n8n start
```

### 4. Frontend (Optional UI Layer)

If a UI is provided (React/Node.js based):

```bash
cd Frontend
npm install
npm start
```

---

## 🔎 How It Works

1. **Document Ingestion & OCR** – Extract text from uploaded documents.
2. **Embeddings** – Generate vector embeddings & store in **Qdrant**.
3. **Knowledge Graph** – Insert structured relationships into **Neo4j**.
4. **User Query** – Triggers RAG pipeline, retrieving context from Qdrant + Neo4j.
5. **Answer Generation** – Context passed to **Ollama / Google Gemini** for response.
6. **Response Delivery** – Answer sent to the **frontend / client**.

---

## 🛠 Troubleshooting

* ✅ Ensure **n8n, Qdrant, and Neo4j** are running.
* ✅ Double-check environment variables (`.env`).
* ✅ Review **n8n logs** for workflow execution errors.
* ✅ Verify embeddings are created and Neo4j graph ingestion succeeds.

---

## 👨‍💻 Contributors & License

* Developed by **[TVSSAMHITH](https://github.com/TVSSAMHITH)**
               **[Sandeep B](https://github.com/Sandeepsriramulu)**
               **[Vishnu](https://github.com/vishnu8299)**
               **[Venkat](https://github.com/venkat0056)**
* Contributions, issues, and feature requests are welcome! 🎉

📜 Licensed under MIT.

---

✨ With this setup, **NeoRag** lets you query documentation using both **vector search** and **graph reasoning**, powered by **LLMs** for precise and context-rich answers.

---

Would you like me to also create a **visual architecture diagram** (showing OCR → Qdrant → Neo4j → LLM → Answer) that you can add to this README?
