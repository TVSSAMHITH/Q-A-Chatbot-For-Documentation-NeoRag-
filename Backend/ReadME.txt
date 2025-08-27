Hybrid RAG Chatbot with n8n, Qdrant & Neo4j

This repository contains an n8n workflow template that implements a Hybrid Retrieval-Augmented Generation (RAG) chatbot.
It integrates Qdrant (vector search), Neo4j (knowledge graph), PostgreSQL (logging), Tesseract OCR (scanned PDFs/images), and a React frontend for chat interaction.

✨ Features

n8n as backend orchestration

Webhook-based chatbot trigger

Parses both text input and uploaded files

Qdrant Vector DB

Stores embeddings & metadata for semantic search

Neo4j Graph DB

Structured knowledge retrieval via Cypher queries

PostgreSQL

Stores chat logs, ingestion metadata

OCR with Tesseract

Supports scanned PDFs & images

Crawling Agent

Optionally ingest docs/websites automatically

React Frontend

Chat UI with history, file upload, typing indicators, light/dark themes

📂 Files

Project (5).json → n8n workflow export (import into n8n)

frontend/ → React frontend (separate repo, see instructions)

⚙️ Setup Instructions
1. Prerequisites

n8n (self-hosted or cloud) → Install Guide

Qdrant running → Qdrant Docs

Neo4j running → Neo4j Docs

PostgreSQL (optional, for logs)

Node.js + npm (for frontend)

2. Import Workflow into n8n

Open your n8n Editor

Click Import from File

Upload Project (5).json

Save workflow

3. Configure Connections

Inside n8n:

Qdrant Node

API URL & API Key

Neo4j Node

Bolt URL, Username, Password

PostgreSQL Node (optional)

Host, User, Password, Database

Webhook Trigger

Set Path (e.g., /chatbot)

Use Production Webhook URL for frontend

4. Activate Workflow

Click Activate (top-right) so n8n listens continuously

Production webhook URL will look like:

https://<your-n8n-domain>/webhook/chatbot

5. Frontend Integration

In your React frontend (useChat.ts hook):

const WEBHOOK_URL = "https://<your-n8n-domain>/webhook/chatbot";


Supports sending:

Messages

File uploads (PDFs, Docs, Images)

Displays:

Typing indicators

Chat history

Export (JSON/Markdown)

6. Example Request (from frontend)
{
  "message": "Where is India?",
  "sessionId": "session-123",
  "file": {
    "name": "example.pdf",
    "type": "application/pdf",
    "size": 123456,
    "data": "base64-encoded-content"
  }
}

🧠 How it Works

Frontend sends user message & file → Webhook (n8n)

n8n workflow:

Parses request (JSON & binary)

OCR if file is scanned

Embedding search in Qdrant

Structured query in Neo4j

Merge results → pass to LLM

Respond with citations + answer

Frontend renders chatbot response

🔮 Roadmap

Add real-time streaming responses (SSE/WebSockets)

Multi-user sessions with PostgreSQL backend

Auto-ingestion pipeline with crawling + OCR

