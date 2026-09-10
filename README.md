🚨 RESQ AI

Ambient Emergency Response — AI-Powered Emergency Triage & Response Platform

RESQ AI is a full-stack, AI-powered emergency response platform designed to reduce the time between an emergency being reported and appropriate assistance being initiated.

It combines AI emergency triage, dynamic questioning, first-aid guidance, GPS-based hospital discovery, automated SOS preparation, and real-time dispatcher monitoring into a single system.

RESQ AI is designed to assist during emergencies, not replace professional emergency services or medical professionals.

🌟 Why RESQ AI?

During an emergency, people often face three immediate problems:

❓ What is happening and how serious is it?

🩹 What should I do right now?

🏥 Where is the nearest suitable medical facility?

RESQ AI brings these steps together into one guided workflow.

Instead of requiring a user or bystander to manually interpret the situation, search for hospitals, prepare an SOS message, and communicate the emergency separately, RESQ AI coordinates these actions through an AI-driven workflow.

🧠 Core Concept

Emergency Report
       │
       ▼
 Dynamic Triage
       │
       ▼
   AI Analysis
       │
       ├──────────────► Severity / Emergency Type
       │
       ▼
 First-Aid Guidance
       │
       ▼
 Hospital Discovery
       │
       ▼
 SOS / Alert Preparation
       │
       ▼
 Real-Time Dispatcher
       │
       ▼
 Human Response

✨ Key Features

🧠 AI Emergency Triage

RESQ AI uses Google Gemini 2.5 Flash to analyze emergency information and determine important characteristics of the incident.

The system can identify:

Emergency category

Severity level

Key observations

Relevant considerations

Information requiring further clarification

❓ Dynamic Triage Questions

Instead of asking every user the same set of questions, the system can generate questions based on the initial emergency description.

This helps collect information that is relevant to the specific situation.

Example:

User:
"My father suddenly collapsed and is not responding."

        ↓

AI-generated triage questions

        ↓

Relevant information is collected

        ↓

Emergency severity is assessed

🩹 AI-Powered First-Aid Guidance

RESQ AI generates immediate, situation-specific first-aid guidance based on the analyzed emergency.

The objective is to provide clear, actionable steps while professional medical assistance is being arranged.

Guidance is intended to be:

Immediate

Step-by-step

Situation-specific

Easy to understand

Conservative and safety-focused

📍 Real-Time GPS Location

The application can use browser geolocation to obtain the user's current coordinates.

These coordinates can then be used for:

Hospital discovery

Distance calculation

Emergency location reporting

Dispatcher situational awareness

🏥 Nearby Hospital Discovery

RESQ AI integrates with the Google Maps Places API to discover nearby hospitals.

The system can:

Receive the user's coordinates.

Search for nearby medical facilities.

Retrieve hospital locations.

Calculate approximate distances.

Sort hospitals based on proximity.

🚨 Intelligent SOS Preparation

For emergencies classified as HIGH or CRITICAL, RESQ AI can prepare an SOS alert containing relevant emergency information.

The system is designed to support communication workflows such as:

Emergency details

Severity

User location

Hospital information

Structured alert payloads

Dispatcher notifications

Integrations such as Twilio/WhatsApp can be used for alert delivery or simulation depending on the deployment configuration.

📡 Real-Time Dispatcher Dashboard

RESQ AI includes a dispatcher-facing interface for monitoring emergency incidents.

Using Server-Sent Events (SSE), emergency information can be streamed to the dispatcher dashboard in real time.

This enables operators to see incoming incidents without repeatedly refreshing the page.

🤖 Agentic Architecture

The backend uses LangGraph to organize the emergency-response workflow into specialized components.

Agent / Workflow Components

Component

Responsibility

Analysis Agent

Analyzes emergency information and determines severity/type

First Aid Agent

Generates immediate first-aid guidance

Hospital Search Tool

Finds nearby medical facilities

Report Agent

Structures emergency information into a report

Alert Preparation

Prepares SOS/dispatch information

Dispatcher Stream

Delivers emergency updates to the monitoring dashboard

This modular architecture allows individual responsibilities to remain separated while participating in one coordinated emergency workflow.

🏗️ Technology Stack

Frontend

Next.js

React 19

Tailwind CSS

Framer Motion

Browser Geolocation API

Backend

Python

FastAPI

LangGraph

Google Gemini 2.5 Flash

SQLAlchemy

Server-Sent Events (SSE)

External Services

Google Maps Places API — nearby hospital discovery

Twilio / WhatsApp — alert communication workflow

Google Gemini API — AI analysis and response generation

Database

The backend supports database configurations such as:

SQLite

PostgreSQL

The database can be used for storing information such as:

Emergency histories

Alerts

Reports

Relevant datasets

🔄 Emergency Response Workflow

Step 1 — Report Emergency

The user provides an emergency description and, where available, their location.

Emergency description
+
GPS coordinates

↓

Step 2 — Dynamic Triage

The system determines what additional information may be necessary and generates relevant questions.

↓

Step 3 — AI Analysis

Gemini analyzes the collected information and determines:

Emergency Type
Severity
Observations
Considerations

↓

Step 4 — First-Aid Guidance

The system generates immediate instructions appropriate to the detected emergency.

↓

Step 5 — Hospital Discovery

The user's location is used to identify nearby hospitals.

↓

Step 6 — Alert Preparation

For higher-severity emergencies, an SOS payload is prepared for dispatch/communication workflows.

↓

Step 7 — Dispatcher Notification

The emergency information is streamed to the dispatcher dashboard through SSE.

↓

Step 8 — Human Response

A dispatcher or appropriate emergency professional can use the available information to coordinate the next response.

🖥️ Application Interfaces

RESQ AI is designed around two primary experiences.

🚑 Emergency Reporter

The emergency reporter interface focuses on speed and clarity.

It allows users to:

Describe an emergency

Answer AI-generated triage questions

Share their location

View emergency analysis

Receive first-aid guidance

Discover nearby hospitals

Access navigation information

Trigger/prepare emergency alerts where applicable

🖥️ Dispatcher Dashboard

The dispatcher interface provides real-time awareness of incoming emergencies.

It can display information such as:

Active emergency alerts

Emergency severity

Emergency category

Location

Nearby hospitals

Emergency details

Real-time incoming updates

📊 Severity-Based Response

RESQ AI uses severity classification to determine how urgently an incident should be handled.

LOW
 │
 ├── Information / guidance
 │
 ▼
MEDIUM
 │
 ├── Guidance + relevant resources
 │
 ▼
HIGH
 │
 ├── Immediate guidance
 ├── Hospital information
 └── SOS preparation
 │
 ▼
CRITICAL
 │
 ├── Immediate guidance
 ├── Hospital information
 ├── SOS preparation
 └── Real-time dispatcher awareness

🔐 Safety & Reliability

RESQ AI is designed as an assistive emergency-response system.

Important principles include:

AI output should not be treated as a medical diagnosis.

First-aid guidance should not replace professional medical care.

Emergency services should be contacted when appropriate.

Location data should only be used with appropriate user permission.

External communication integrations should be securely configured.

API keys and credentials should never be committed to source control.

🔑 Environment Variables

Create the required environment configuration files for your local setup.

Example:

GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

DATABASE_URL=your_database_url

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

Do not commit .env files or secret API keys to GitHub.

The exact variables depend on the integrations enabled in your deployment.

🚀 Getting Started

1. Clone the Repository

git clone <your-repository-url>
cd <your-project-directory>

2. Backend Setup

Move into the backend directory:

cd backend

Create a virtual environment:

python -m venv venv

Activate it.

Windows:

venv\Scripts\activate

macOS / Linux:

source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Configure the required environment variables.

Start the FastAPI server:

uvicorn main:app --reload

3. Frontend Setup

Move into the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Open the local application in your browser.

📁 High-Level Project Structure

RESQ-AI/
│
├── backend/
│   ├── agents/
│   │   ├── analysis/
│   │   ├── first_aid/
│   │   ├── report/
│   │   └── alert/
│   │
│   ├── tools/
│   │   └── hospital_search/
│   │
│   ├── database/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .env.example
├── .gitignore
└── README.md

The exact folder structure may vary depending on the current implementation.

🔌 API / Communication Flow

A simplified communication flow looks like this:

Frontend
   │
   │ Emergency Request
   ▼
FastAPI Backend
   │
   ▼
LangGraph Workflow
   │
   ├── Gemini AI
   │
   ├── First Aid
   │
   ├── Hospital Search
   │
   ├── Report Generation
   │
   └── Alert Preparation
   │
   ▼
Database / External Services
   │
   ▼
SSE
   │
   ▼
Dispatcher Dashboard

🎯 Project Goals

RESQ AI aims to:

Reduce emergency response delays.

Make emergency triage faster and more structured.

Provide immediate first-aid assistance.

Simplify nearby hospital discovery.

Automate preparation of high-priority alerts.

Improve dispatcher situational awareness.

Demonstrate practical use of agentic AI in emergency response.

💡 What Makes RESQ AI Different?

Traditional emergency workflows often require multiple independent actions:

Describe emergency
      ↓
Figure out severity
      ↓
Search for first aid
      ↓
Search for hospital
      ↓
Find location
      ↓
Contact someone
      ↓
Inform dispatcher

RESQ AI attempts to coordinate these steps through one intelligent workflow:

                 ┌───────────────┐
                 │ Emergency     │
                 │ Report        │
                 └───────┬───────┘
                         │
                         ▼
                ┌─────────────────┐
                │ AI Triage       │
                └────────┬────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
     First Aid      Hospital Search   Alert
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                Dispatcher Dashboard

The focus is not simply on generating an AI response, but on coordinating multiple emergency-response actions around the user's situation.

🧪 Development & Testing

During development, the application should be tested locally before production deployment.

Recommended testing areas include:

Emergency submission

AI analysis

Dynamic triage

First-aid generation

GPS permission handling

Hospital discovery

Distance calculation

SOS payload generation

SSE connection

Dispatcher updates

Database operations

API error handling

Missing/invalid environment variables

🔮 Future Improvements

Potential future development areas include:

Dedicated emergency-service integrations

More advanced hospital capability matching

Ambulance availability integration

Multilingual emergency assistance

Voice-based emergency reporting

Improved offline/low-connectivity support

More robust authentication and authorization

Advanced dispatcher prioritization

Emergency analytics and reporting

Improved audit logging

Production-grade notification infrastructure

🌍 Potential Impact

Emergency response is highly time-sensitive.

By combining:

AI + Location + First Aid + Hospital Discovery + Automated Alerts + Real-Time Dispatch

RESQ AI aims to create a more connected emergency-response experience where useful information can be generated and shared within seconds rather than requiring users or responders to perform every step manually.

⚠️ Disclaimer

RESQ AI is an experimental/assistive technology project.

It is not a substitute for emergency medical services, doctors, paramedics, or other qualified professionals. AI-generated information may be incomplete or incorrect.

In a real emergency, contact the appropriate local emergency services and follow instructions from qualified professionals.

👨‍💻 Project

Project: RESQ AI
Category: AI / Healthcare Technology / Emergency Response
Architecture: Full-Stack + Agentic AI
Frontend: Next.js + React
Backend: FastAPI + Python
AI: Google Gemini 2.5 Flash
Agent Framework: LangGraph
Maps: Google Maps Places API
Database: SQLAlchemy + SQLite/PostgreSQL
Real-Time: Server-Sent Events (SSE)

⭐ Vision

RESQ AI — From emergency description to coordinated response.

The long-term vision is to build an intelligent emergency-response layer that can understand a situation, gather critical information, provide immediate assistance, identify nearby resources, and keep human responders informed in real time.
