# RESQ AI

## Agentic AI Emergency Response Platform

RESQ AI is a full-stack Agentic AI emergency response platform designed to assist users during emergency situations.

It combines AI emergency triage, first-aid guidance, real-time GPS, nearby hospital discovery, SOS preparation, incident reporting, and real-time dispatcher monitoring into a single workflow.

> RESQ AI is designed to assist during emergencies and does not replace professional medical services.


## Live Application

Frontend:
https://resq-ai-emergency.vercel.app/

Backend API:
https://resq-ai-ls67.onrender.com

Health Check:
https://resq-ai-ls67.onrender.com/api/health


## What RESQ AI Does

During an emergency, users may need to quickly determine:

- What is happening?
- How serious is the situation?
- What should be done immediately?
- Where is the nearest hospital?
- What information should be communicated to responders?

RESQ AI brings these tasks together through an AI-driven workflow.


## Core Workflow

Emergency Report
       |
       v
Dynamic Triage
       |
       v
AI Emergency Analysis
       |
       +------> Emergency Type
       +------> Severity
       +------> Key Observations
       |
       v
First-Aid Guidance
       |
       v
Nearby Hospital Discovery
       |
       v
SOS / Alert Preparation
       |
       v
Dispatcher Dashboard
       |
       v
Human Response


## Key Features

### AI Emergency Triage

- Analyzes emergency descriptions using Google Gemini.
- Determines emergency category and severity.
- Identifies important observations.
- Generates relevant follow-up questions when required.

### First-Aid Guidance

- Provides immediate, situation-specific guidance.
- Presents concise and actionable steps.
- Uses a conservative, safety-focused approach.

### Real-Time Location

- Uses browser GPS to obtain the user's current location.
- Supports hospital discovery.
- Calculates approximate distance to hospitals.
- Provides location information for emergency reporting.

### Nearby Hospital Discovery

- Uses Google Maps Places API.
- Finds hospitals based on the user's current location.
- Sorts hospitals according to proximity.
- Provides navigation information.

### Emergency Alert Preparation

For high-severity emergencies, the system can prepare structured SOS information containing:

- Emergency details
- Severity
- User location
- Hospital information
- Emergency report data

External communication services can be integrated for actual notification workflows.

### Real-Time Dispatcher Dashboard

The system includes a separate dispatcher-facing dashboard for monitoring emergency incidents in real time.

The dashboard can display:

- Active emergencies
- Emergency severity
- Emergency category
- Location
- Nearby hospitals
- Emergency details
- Real-time updates

### Dashboard Access Control

The Dispatcher Dashboard is intended only for authorized users.

Access should be restricted to:

- Hospital personnel
- Authorized administrators
- Authorized emergency-response personnel

Regular emergency reporters/users should not have access to the dispatcher dashboard.


## Agentic Architecture

RESQ AI uses LangGraph to coordinate specialized components.

User
 |
 v
Analysis Agent
 |
 +----> First Aid Agent
 |
 +----> Hospital Search Tool
 |
 +----> Report Agent
 |
 +----> Alert Preparation
 |
 v
Dispatcher Stream
 |
 v
Authorized Dashboard


| Component | Responsibility |
|---|---|
| Analysis Agent | Emergency analysis and severity assessment |
| First Aid Agent | Immediate first-aid guidance |
| Hospital Search | Nearby hospital discovery |
| Report Agent | Structured emergency report |
| Alert Preparation | SOS/dispatch information |
| Dispatcher Stream | Real-time emergency updates |


## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Browser Geolocation API

### Backend

- Python
- FastAPI
- LangGraph
- SQLAlchemy
- Server-Sent Events (SSE)

### AI

- Google Gemini API

### External Services

- Google Maps Places API
- Google Maps
- Twilio / WhatsApp where configured

### Database

- SQLite
- PostgreSQL


## Application Architecture

                    RESQ AI
                       |
          +------------+------------+
          |                         |
          v                         v
   Emergency Reporter       Dispatcher Dashboard
          |                         |
          v                         ^
     Next.js Frontend               |
          |                         |
          v                         |
     FastAPI Backend                |
          |                         |
          v                         |
       LangGraph -------------------+
          |
     +----+----+--------+--------+
     |         |        |        |
     v         v        v        v
  Gemini    First Aid  Hospital  Report
                       Search
                          |
                          v
                  Google Places API


## Emergency Response Flow

1. User reports an emergency.
2. AI performs dynamic triage.
3. Gemini analyzes the emergency.
4. First-aid guidance is generated.
5. User location is used to find nearby hospitals.
6. Emergency information is structured into a report.
7. SOS information is prepared for high-severity cases.
8. Authorized dispatchers can receive real-time updates.
9. Human responders use the information to coordinate assistance.


## Security

- API keys are stored using environment variables.
- Secrets must never be committed to source control.
- Location data requires appropriate user permission.
- Dispatcher functionality should be protected through authentication and authorization.
- Emergency information should only be accessible to authorized personnel.

Example:

GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
DATABASE_URL=your_database_url


## Local Development

### Backend

cd backend

python -m venv venv

Windows:
venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload


### Frontend

cd frontend

npm install

npm run dev

Open the local application using the development URL provided by Next.js.


## Project Goals

RESQ AI aims to:

- Reduce delays in emergency information processing.
- Provide immediate AI-assisted first-aid guidance.
- Simplify nearby hospital discovery.
- Automate preparation of emergency information.
- Improve dispatcher situational awareness.
- Demonstrate practical applications of Agentic AI.


## What Makes RESQ AI Different?

Traditional emergency workflows may require multiple independent actions:

Describe Emergency
       |
Determine Severity
       |
Find First Aid
       |
Find Hospital
       |
Share Location
       |
Prepare Emergency Information
       |
Contact Responders


RESQ AI coordinates these tasks through a single intelligent workflow:

                Emergency
                    |
                    v
              AI Triage
                    |
        +-----------+-----------+
        |           |           |
        v           v           v
    First Aid   Hospital     Alert
                Search      Preparation
        |           |           |
        +-----------+-----------+
                    |
                    v
          Dispatcher Dashboard
                    |
                    v
              Human Response


## Safety Disclaimer

RESQ AI is an experimental and assistive emergency-response system.

It is not a substitute for:

- Doctors
- Paramedics
- Ambulances
- Hospitals
- Emergency services

AI-generated information may be incomplete or incorrect.

For a real emergency, contact the appropriate emergency services immediately.


## Project

Project: RESQ AI
Category: AI / Healthcare Technology / Emergency Response
Architecture: Full-Stack + Agentic AI
Frontend: Next.js + React
Backend: FastAPI + Python
AI: Google Gemini
Agent Framework: LangGraph
Maps: Google Maps Places API
Real-Time Communication: Server-Sent Events (SSE)


## Vision

RESQ AI aims to create an intelligent emergency-response layer that can understand an emergency, gather critical information, provide immediate assistance, identify nearby medical resources, and keep authorized human responders informed in real time.
