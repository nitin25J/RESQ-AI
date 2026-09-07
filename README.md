# RESQ AI — Agentic Emergency Response System 🚨

RESQ AI is an intelligent, agentic emergency response assistant designed for rapid emergency situation analysis, immediate first-aid instructions, verified nearby hospital discovery, incident reporting, and pre-formatted SOS alert generation.

---

## 🏗️ System Architecture

```
User Emergency Input (Text / Voice / GPS)
                    ↓
     Next.js Frontend (App Router, Tailwind CSS)
                    ↓
       FastAPI Backend API (/api/emergency/analyze)
                    ↓
     LangGraph Agentic Sequential Workflow
       ├── 1. Emergency Analysis Agent (Gemini AI)
       ├── 2. First Aid Agent (Gemini AI)
       ├── 3. Hospital Search Tool (Google Places / OpenStreetMap / Nominatim)
       ├── 4. Incident Report Agent
       └── 5. Prepared SOS Alert Builder
                    ↓
      Structured Pydantic Emergency Response
```

---

## ⚡ Key Features

- 🧠 **Agentic AI Analysis**: Uses Gemini 3.6 Flash via LangGraph orchestration for zero-hallucination emergency classification (Severity: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- 🩺 **Conservative First-Aid Guidance**: Generates clear step-by-step immediate actions, critical things to avoid, and country-specific emergency escalation (Dial `112` in India).
- 🏥 **Dynamic GPS Hospital Discovery**: Strictly filters hospitals within a 25km radius centered on the user's exact latitude/longitude with Haversine distance sorting and Google Maps navigation links.
- 📋 **Incident Report & Prepared SOS**: Pre-formats ready-to-dispatch emergency SOS payloads.
- 🎯 **8 Exhibition Demo Presets**: Includes quick-fill scenarios for Bike Accident, Chest Pain, Severe Burn, Unconscious Person, Heavy Bleeding, Breathing Difficulty, Electric Shock, and Poisoning.

---

## ☁️ Cloud Deployment Guide (Render + Vercel)

### 1. Deploying Backend to Render 🚀

1. Go to **[Render Dashboard](https://dashboard.render.com)** → **New** → **Web Service**.
2. Connect your GitHub repository (`nitin25J/RESQ-AI`).
3. Configure settings:
   - **Name**: `resq-ai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `GEMINI_API_KEY`: *Your Gemini API Key*
   - `GOOGLE_MAPS_API_KEY`: *(Optional) Your Google Places API Key*
   - `CORS_ORIGINS`: `*`
5. Click **Deploy Web Service**. Copy your backend URL (e.g. `https://resq-ai-backend.onrender.com`).

---

### 2. Deploying Frontend to Vercel 🌐

1. Go to **[Vercel Dashboard](https://vercel.com/new)**.
2. Import your GitHub repository (`nitin25J/RESQ-AI`).
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://resq-ai-backend.onrender.com` (Your Render Backend URL)
5. Click **Deploy**. Vercel will build and launch your live frontend site!

---

## 🚀 Local Development Setup

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=optional_google_places_api_key_here
```

Start the FastAPI server:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security Note

All API keys are strictly maintained on the backend server only. No sensitive credentials or API keys are exposed to the browser or frontend bundle.
