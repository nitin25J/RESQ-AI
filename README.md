<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-alert.svg" width="80" alt="RESQ AI Logo"/>
  <h1>RESQ AI — Ambient Emergency Response</h1>
  <p>An AI-powered, highly-responsive emergency triage system utilizing Google Gemini 2.5 Flash, real-time hospital routing, and automated SOS dispatching.</p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a>
  </p>
</div>

---

## ⚡️ The Vision

In critical medical emergencies, every second counts. **RESQ AI** acts as an ambient first responder. By simply typing or speaking into the scanner, the AI instantly categorizes the severity of the emergency, extracts critical patient vitals, generates immediate, safe first-aid protocols, and instantly locates the nearest real hospitals using Google Maps data. 

In high-priority situations, it automatically formats and prepares a localized SOS dispatch payload that can be broadcasted to real-world command centers or SMS gateways.

## ✨ Core Features

*   **🎙️ Multi-modal Emergency Scanner**: Input symptoms via text or voice.
*   **🧠 Agentic AI Triage**: Powered by LangGraph and Google Gemini 2.5 Flash. It asks dynamic follow-up questions if it needs more context before classifying the emergency (Low, Medium, High, Critical).
*   **🚑 Live Hospital Routing**: Integrates with Google Places API to find the closest real hospitals, complete with distance metrics and direct Google Maps navigation links.
*   **📡 Command Center Dashboard**: A live WebSocket (SSE) dashboard for dispatchers to monitor incoming SOS signals on a simulated global radar map, complete with 1-click navigation to the incident scene.
*   **📚 Emergency Reference Library**: A comprehensive, beautifully designed database of 50+ critical emergencies (Trauma, Environmental, Critical, Minor) with immediate first-aid instructions.
*   **📱 Native SMS Handoff**: Seamlessly generates `sms:` URIs to hand off critical data to native phone applications.

## 🛠 Tech Stack

**Frontend:**
*   Next.js 15 (App Router)
*   React 19
*   Tailwind CSS (Vanilla, heavily customized)
*   Framer Motion (Micro-animations and fluid layout transitions)
*   Lucide React (Icons)

**Backend:**
*   FastAPI (Python async framework)
*   LangChain / LangGraph (Agentic AI orchestration)
*   Google Gemini 2.5 Flash (LLM)
*   SQLAlchemy & SQLite (Async database for dispatch history and library)
*   Server-Sent Events (SSE) (Real-time dashboard streaming)

---

## 🚀 Installation & Setup

You will need **Node.js 18+**, **Python 3.10+**, and API keys for Google Gemini and Google Maps.

### 1. Clone the repository
```bash
git clone https://github.com/resq-ai/resq-ai.git
cd resq-ai
```

### 2. Setup the Backend API (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables
cp .env.example .env
# Edit .env and insert your GOOGLE_API_KEY and GOOGLE_MAPS_API_KEY

# Seed the Database with the Emergency Library
python seed_data.py

# Run the backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Setup the Frontend (Next.js)
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Configure Environment Variables
cp .env.example .env.local

# Run the development server
npm run dev
```

### 4. Open the Application
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.
The API documentation (Swagger) is available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 📸 Usage

1. **Scanner**: On the homepage, describe an emergency (e.g., "My friend just collapsed and isn't breathing").
2. **Triage**: Answer any dynamic follow-up questions the AI agent asks.
3. **Response**: View the categorized severity, immediate first-aid steps, and click on nearby hospitals to route there via Google Maps.
4. **Auto-Dispatch**: If severity is HIGH or CRITICAL, view the prepared SOS payload and click "Auto-Dispatch via Server".
5. **Dashboard**: Open `http://localhost:3000/dashboard` in a new tab to see the incoming alert appear instantly on the live radar!

## 📜 License

This project is licensed under the MIT License.

<div align="center">
  <sub>Built for the future of emergency response.</sub>
</div>
