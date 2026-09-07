# RESQ AI

## Agentic AI Emergency Response System

RESQ AI is an Agentic AI-powered emergency response system designed to assist users during emergency situations by combining artificial intelligence, real-time location services, nearby hospital discovery, first-aid guidance, incident reporting, and emergency response preparation into a single workflow.

The system analyzes a user's emergency description, determines the type and severity of the situation, provides immediate first-aid guidance, identifies nearby hospitals based on the user's current GPS location, generates a structured incident report, and prepares an emergency alert payload.

> RESQ AI is an AI-assisted emergency response prototype. It does not replace doctors, paramedics, hospitals, ambulances, or emergency services.

---

## Live Application

**Live Application**

https://resq-ai-emergency.vercel.app/

**Backend API**

https://resq-ai-ls67.onrender.com

**Backend Health Check**

https://resq-ai-ls67.onrender.com/api/health

---

# 1. Project Overview

During an emergency, users may need to make several decisions very quickly:

- Understand what type of emergency is occurring
- Determine the severity of the situation
- Know what immediate first-aid steps can be taken
- Find a nearby hospital
- Share important emergency information
- Prepare an organized emergency report

RESQ AI combines these tasks into one application.

Instead of acting as a conventional chatbot that simply generates a response, RESQ AI uses an agentic workflow where specialized components perform different tasks and pass their results through the system.

### Core Workflow

```text
User Emergency Description
          |
          v
   Emergency Analysis
          |
          v
   Severity Assessment
          |
          v
     First Aid Agent
          |
          v
   Hospital Search Tool
          |
          v
   Incident Report Agent
          |
          v
   Alert Preparation
          |
          v
      Final Response


2. Project Structure
RESQ-AI/
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── analysis.py
│   │   │   ├── first_aid.py
│   │   │   ├── hospital_search.py
│   │   │   ├── report.py
│   │   │   ├── alert.py
│   │   │   ├── graph.py
│   │   │   └── state.py
│   │   │
│   │   ├── services/
│   │   │   └── maps_service.py
│   │   │
│   │   ├── config.py
│   │   ├── models.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   │       └── api.ts
│   │
│   ├── package.json
│   └── .env.local


3. Technology Stack
Frontend
Next.js
TypeScript
Tailwind CSS
Lucide React
Browser Geolocation API
Web Speech API
Backend
Python
FastAPI
Pydantic
HTTPX
Uvicorn
AI and Agent Orchestration
Google Gemini API
LangGraph
Location and Maps
Google Places API
OpenStreetMap
Overpass API
Google Maps
Deployment
Vercel
Render
│
└── README.md


## 7. Key Features

### Emergency Analysis

* Uses Google Gemini to analyze the emergency description.
* Determines the emergency category.
* Estimates the severity level.
* Identifies key observations.
* Provides immediate considerations.

### First-Aid Guidance

* Provides immediate, conservative first-aid guidance.
* Tailors guidance according to the detected emergency category and severity.

### Real-Time GPS

* Uses browser-based geolocation to obtain the user's current location.
* Uses latitude and longitude coordinates for location-based services.

### Nearby Hospital Discovery

* Searches for hospitals near the user's current location.
* Uses geographic search services to identify relevant healthcare facilities.

### Distance Calculation

* Calculates the distance between the user and nearby hospitals.
* Sorts hospitals based on proximity to the user.

### Google Maps Navigation

* Provides navigation links for selected hospitals.
* Allows users to quickly open hospital directions in Google Maps.

### Incident Report

* Generates a concise, structured emergency incident report.
* Organizes important information such as emergency type, severity, observations, and guidance.

### Emergency Alert Preparation

* Generates a structured emergency alert payload.
* Prepares essential incident information for potential future notification or dispatch integrations.

### Voice Input

* Allows users to describe emergency situations using speech recognition.
* Converts spoken input into text for emergency analysis.

### Demo Presets

* Provides predefined emergency scenarios.
* Enables quick testing and demonstration of the system's capabilities.





