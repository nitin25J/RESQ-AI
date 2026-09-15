# RESQ AI — Project Analysis Report

## Overview
**RESQ AI** (Ambient Emergency Response) is a full-stack web application designed to act as an intelligent, real-time emergency triage and response system. It leverages artificial intelligence to rapidly analyze emergency situations, provide immediate first-aid instructions, locate nearby medical facilities, and automatically dispatch SOS alerts. 

## Technical Architecture
The project is divided into two main components:
1. **Backend (Python / FastAPI):** 
   - Uses **FastAPI** for high-performance API routing.
   - Powered by **Google Gemini 2.5 Flash** for AI-driven triage and analysis.
   - Implements an agentic workflow using **LangGraph** with multiple specialized agents: Analysis Agent, First Aid Agent, Hospital Search Tool, Report Agent, and Alert Preparation.
   - Integrates with the **Google Maps Places API** to find nearby hospitals.
   - Uses **SQLAlchemy** for database management (PostgreSQL/SQLite) to log emergency histories, alerts, and disease datasets.
   - Features Server-Sent Events (SSE) to stream real-time dispatch data to monitoring dashboards.

2. **Frontend (Next.js / React):**
   - Built on the modern **Next.js** framework with React 19.
   - Styled with **Tailwind CSS** and animated using **Framer Motion**.
   - Provides user interfaces for both the emergency reporter (submitting distress calls) and the dispatcher (monitoring incoming alerts in real-time).

## What the System Does
When an emergency is reported (with description and GPS coordinates), the system performs the following automated workflow:
- **Dynamic Triage:** Generates specific triage questions based on the initial description to gather crucial details.
- **AI Analysis:** Analyzes the severity and type of the emergency.
- **First Aid Generation:** Generates instant, step-by-step first-aid instructions tailored to the specific situation.
- **Hospital Routing:** Identifies the nearest hospitals based on the provided latitude and longitude.
- **SOS Dispatching:** Automatically formats and simulates sending SOS payloads (via platforms like Twilio/WhatsApp) for "HIGH" or "CRITICAL" severity emergencies.
- **Dispatcher Monitoring:** Broadcasts the alert in real-time to a dispatcher dashboard so human operators are immediately informed.

## Benefits and Impact
- **Saves Critical Time:** By instantly triaging the situation and locating the nearest hospital, the system minimizes delays during the "golden hour" of an emergency.
- **Immediate Life-Saving Guidance:** Bystanders or victims receive instant, AI-tailored first-aid instructions before professional help arrives, potentially saving lives.
- **Automated Communication:** High-severity emergencies automatically trigger alerts to designated contacts and dispatchers, ensuring that no call for help goes unnoticed.
- **Scalability & Efficiency:** The agentic workflow allows the system to handle multiple complex tasks concurrently (analysis, routing, alerting) without human bottlenecks.
- **Real-Time Awareness:** The SSE-powered dashboard provides emergency services with a live feed of ongoing crises, enabling better resource allocation and situational awareness.
