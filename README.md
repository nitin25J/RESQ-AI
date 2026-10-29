# RESQ AI
### Agentic AI Emergency Response Platform

RESQ AI is a full-stack AI-powered emergency response platform that combines **dynamic emergency triage, first-aid guidance, GPS-based hospital discovery, SOS preparation, and real-time dispatcher monitoring** into a unified workflow.

The system uses Google Gemini and LangGraph to assist with emergency analysis while connecting location services and incident information to a dispatcher-facing interface.

**Core idea:** Turn an emergency description into structured, location-aware information that supports human decision-making.

> ⚠️ RESQ AI is an assistive prototype and does not replace professional medical care or emergency services.

## 🌐 Live Application

| Component | Link |
|---|---|
| Frontend | https://resq-ai-emergency.vercel.app/ |
| Backend API | https://resq-ai-ls67.onrender.com |
| Health Check | https://resq-ai-ls67.onrender.com/api/health |

## 🏗️ System Architecture

```mermaid
flowchart TD
    A["Emergency Reporter"] --> B["Next.js Frontend"]
    B <--> C["FastAPI Backend"]

    C <--> D["LangGraph Agent Workflow"]

    D <--> E["Google Gemini API"]
    D --> F["Emergency Triage"]
    D --> G["First-Aid Guidance"]
    D --> H["Hospital Discovery"]
    D --> I["SOS Preparation"]

    H <--> J["Google Maps Places API"]

    C <--> K[("Incident Database")]

    C --> L["SSE Event Stream"]
    L --> M["Dispatcher Dashboard"]

    M --> N["Human Review & Response"]

    classDef frontend fill:#12365B,stroke:#60A5FA,color:#FFFFFF
    classDef backend fill:#173D65,stroke:#60A5FA,color:#FFFFFF
    classDef ai fill:#263449,stroke:#A5B4FC,color:#FFFFFF
    classDef safety fill:#49351B,stroke:#FBBF24,color:#FFFFFF

    class A,B frontend
    class C,D,K,L,M backend
    class E,F,G,H,J ai
    class I,N safety
```

**Architecture overview**

- **Frontend:** Captures emergency information and displays results.
- **Backend:** Coordinates API requests, processing, and incident data.
- **Agent workflow:** Orchestrates AI-assisted analysis and emergency-related tasks.
- **External services:** Provide generative AI and nearby hospital information.
- **Dispatcher dashboard:** Presents configured incident updates for human review.

*The diagram represents the intended architecture. Confirm actual database persistence, event streaming, and integrations against the deployed implementation.*



## ⚙️ Emergency Processing Pipeline

```mermaid
flowchart TD
    A(["Emergency Report"]) --> B["Capture Description"]
    B --> C["Dynamic AI Triage"]
    C --> D["Gemini Analysis"]
    D --> E["Classify Emergency"]
    E --> F["Determine Severity"]
    F --> G["Extract Key Observations"]

    G --> H{"Additional Information Required?"}

    H -- Yes --> I["Ask Follow-up Questions"]
    I --> C

    H -- No --> J["Generate First-Aid Guidance"]
    J --> K["Obtain GPS Location"]
    K --> L["Discover Nearby Hospitals"]
    L --> M["Structure Incident Report"]

    M --> N{"High-Severity Emergency?"}

    N -- Yes --> O["Prepare SOS Information"]
    N -- No --> P["Retain Incident Details"]

    O --> Q["Dispatcher Update"]
    P --> Q

    Q --> R["Real-Time Dashboard via SSE"]
    R --> S["Authorized Human Review"]
    S --> T(["Emergency Response Coordination"])

    classDef input fill:#153A63,stroke:#60A5FA,color:#FFFFFF
    classDef process fill:#102F50,stroke:#3B82F6,color:#FFFFFF
    classDef decision fill:#173D65,stroke:#60A5FA,color:#FFFFFF
    classDef output fill:#174D3A,stroke:#4ADE80,color:#FFFFFF

    class A,B input
    class C,D,E,F,G,I,J,K,L,M,O,P,Q,R process
    class H,N decision
    class S,T output
```

### Pipeline stages

| Stage | Operation |
|---|---|
| 01 | Capture the emergency description |
| 02 | Analyze the report using the AI workflow |
| 03 | Determine category, severity, and observations |
| 04 | Ask follow-up questions when needed |
| 05 | Generate situation-specific first-aid guidance |
| 06 | Use GPS to support nearby hospital discovery |
| 07 | Prepare structured incident and SOS information |
| 08 | Stream configured updates to the dispatcher dashboard |
| 09 | Support human review and response coordination |

**Important:** AI severity classification is advisory. The application must not delay emergency services while collecting additional information or processing an incident.


## 🚑 Core Capabilities

```mermaid
flowchart LR
    A["RESQ AI"] --> B["AI Triage"]
    A --> C["First Aid"]
    A --> D["GPS & Hospitals"]
    A --> E["SOS Preparation"]
    A --> F["Dispatcher Monitoring"]

    B --> G["Structured Emergency Information"]
    C --> G
    D --> G
    E --> G
    F --> H["Human Oversight"]

    classDef main fill:#12365B,stroke:#60A5FA,color:#FFFFFF
    classDef feature fill:#173D65,stroke:#60A5FA,color:#FFFFFF
    classDef outcome fill:#174D3A,stroke:#4ADE80,color:#FFFFFF

    class A main
    class B,C,D,E,F feature
    class G,H outcome
```

### Feature breakdown

- **AI Triage:** Emergency classification, severity assessment, and relevant observations.
- **First Aid:** Concise, situation-specific assistance.
- **GPS & Hospitals:** Browser geolocation and nearby hospital discovery.
- **SOS Preparation:** Structured incident details for potential alert workflows.
- **Dispatcher Monitoring:** Incident visibility and configured real-time updates.
- **Human Oversight:** Emergency information remains subject to professional judgment.
