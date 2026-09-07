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
