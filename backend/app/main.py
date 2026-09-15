import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config import settings
from app.models import HealthResponse, EmergencyRequest, EmergencyResponse, AlertDispatchRequest, AlertDispatchResponse
from app.agents.graph import emergency_graph
from app.database import engine, Base, get_db
from app.db_models import EmergencyHistory, AlertHistory, DiseaseDataset
from datetime import timedelta

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import seed_data

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("resq_ai")

# Database Lifespan Initialization
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    try:
        await seed_data.seed()
        logger.info("Auto-seeded database on startup.")
    except Exception as e:
        logger.error(f"Failed to auto-seed database: {e}")
    yield
    await engine.dispose()

# Initialize FastAPI App
app = FastAPI(
    title="RESQ AI — Ambient Emergency Response API",
    version="1.0.0",
    description="""
RESQ AI Backend API handles real-time emergency triage, first aid generation, nearest hospital routing, and SOS dispatching.
    
**Core Features:**
- AI Triage powered by Google Gemini 2.5 Flash
- Live Hospital proximity mapping via Places API
- Automated SOS formatted payload generation
- WebSocket / Server-Sent Events (SSE) for Dashboard Monitoring
""",
    contact={
        "name": "RESQ AI Team",
        "url": "https://github.com/resq-ai/resq-ai",
    },
    license_info={
        "name": "MIT",
    },
    lifespan=lifespan
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Exception Handlers ---

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Invalid input parameters. Please check your emergency description."
        }
    )

from fastapi import HTTPException

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        return JSONResponse(status_code=exc.status_code, content={"success": False, "error": exc.detail})
        
    logger.error(f"Unhandled exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "An internal error occurred during emergency processing. Please contact emergency services (112) immediately."
        }
    )

# --- API Endpoints ---

@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def get_health():
    """Returns application health status."""
    return HealthResponse(
        status="ok",
        service="resq-ai-backend"
    )

@app.get("/api/diseases", tags=["Knowledge Base"])
async def get_diseases(db: AsyncSession = Depends(get_db)):
    """Fetches common emergencies from PostgreSQL."""
    try:
        result = await db.execute(select(DiseaseDataset))
        diseases = result.scalars().all()
        return {
            "success": True,
            "data": [
                {
                    "id": d.id,
                    "category": d.category,
                    "disease_name": d.disease_name,
                    "description": d.description,
                    "symptoms": d.symptoms,
                    "immediate_first_aid": d.immediate_first_aid,
                    "requires_hospital": d.requires_hospital
                } for d in diseases
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching diseases from DB: {e}")
        return {"success": False, "error": str(e), "data": []}

from app.models import TriageQuestionRequest, TriageQuestionResponse
from app.agents.triage import generate_triage_questions

@app.post("/api/triage-questions", response_model=TriageQuestionResponse, tags=["Emergency"])
async def get_triage_questions(payload: TriageQuestionRequest):
    """Generates dynamic triage questions based on emergency description."""
    logger.info(f"Generating dynamic triage questions for: '{payload.description[:60]}...'")
    try:
        response = await generate_triage_questions(payload.description)
        return response
    except Exception as e:
        logger.error(f"Error generating triage questions: {e}")
        return TriageQuestionResponse(questions=[
            "Is the victim conscious and responding?",
            "Are they breathing normally?",
            "Is there any severe or active bleeding?"
        ])

@app.post("/api/emergency/analyze", response_model=EmergencyResponse, tags=["Emergency"])
async def analyze_emergency(payload: EmergencyRequest, db: AsyncSession = Depends(get_db)):
    """
    Executes LangGraph agentic emergency response workflow:
    Analysis Agent -> First Aid Agent -> Hospital Search Tool -> Report Agent -> Alert Preparation
    """
    initial_state = {
        "description": payload.description,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "triage_answers": payload.triage_answers,
        "analysis": None,
        "first_aid": None,
        "hospitals": [],
        "hospital_search_status": "",
        "report": None,
        "alert": None,
        "error": None
    }

    try:
        logger.info(f"Triggering LangGraph workflow for emergency: '{payload.description[:60]}...'")
        final_state = await emergency_graph.ainvoke(initial_state)

        # Save to DB
        analysis_data = final_state.get("analysis")
        first_aid_data = final_state.get("first_aid")
        report_data = final_state.get("report")
        
        db_history = EmergencyHistory(
            emergency_id=f"CASE-{uuid.uuid4().hex[:8].upper()}",
            description=payload.description,
            emergency_type=analysis_data.emergency_type if analysis_data else None,
            severity=analysis_data.severity if analysis_data else None,
            latitude=payload.latitude,
            longitude=payload.longitude,
            location=final_state.get("alert").location if final_state.get("alert") else None,
            key_observations=analysis_data.observations if analysis_data else None,
            nearby_hospitals=[h.model_dump() for h in final_state.get("hospitals", [])] if final_state.get("hospitals") else None,
            first_aid_guidance=first_aid_data.model_dump() if first_aid_data else None,
            incident_report=report_data.model_dump() if report_data else None,
            alert_information=final_state.get("alert").model_dump() if final_state.get("alert") else None,
            analysis_data=analysis_data.model_dump() if analysis_data else None,
            first_aid_data=first_aid_data.model_dump() if first_aid_data else None,
            report_data=report_data.model_dump() if report_data else None
        )
        db.add(db_history)
        await db.commit()

        return EmergencyResponse(
            success=True,
            analysis=analysis_data,
            first_aid=first_aid_data,
            hospitals=final_state.get("hospitals", []),
            hospital_search_status=final_state.get("hospital_search_status", "Search completed"),
            report=report_data,
            alert=final_state.get("alert"),
            error=final_state.get("error")
        )
    except Exception as e:
        logger.error(f"Error during LangGraph emergency analysis: {e}", exc_info=True)
        return EmergencyResponse(
            success=False,
            hospital_search_status="Analysis service encountered an error.",
            error=f"Emergency analysis pipeline error: {str(e)}"
        )

# --- Authentication API ---

from pydantic import BaseModel
from app.auth import verify_password, create_access_token, get_current_user
from app.db_models import User
from sqlalchemy import select

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    access_token: str
    token_type: str
    role: str

@app.post("/api/admin/login", response_model=LoginResponse, tags=["Authentication"])
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticates a user and returns a JWT token.
    """
    result = await db.execute(select(User).where(User.username == payload.username))
    user = result.scalars().first()
    
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        )
        
    # Create JWT
    access_token = create_access_token(data={"sub": user.username, "role": user.role}, expires_delta=timedelta(hours=8))
    
    return LoginResponse(
        success=True,
        access_token=access_token,
        token_type="bearer",
        role=user.role
    )

@app.post("/api/admin/logout", tags=["Authentication"])
async def logout():
    """
    Since we use client-side JWTs, the server just returns success.
    The client is responsible for deleting the token from localStorage.
    """
    return {"success": True, "message": "Successfully logged out. Please clear client-side token."}

from app.auth import require_admin
from app.models import EmergencyStatusUpdateRequest, AdminEmergencyResponse
from datetime import datetime

@app.get("/api/admin/emergencies", tags=["Admin"])
async def get_all_emergencies(user: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EmergencyHistory).order_by(EmergencyHistory.created_at.desc()))
    emergencies = result.scalars().all()
    # Pydantic will auto-convert these due to from_attributes=True
    return [
        {
            "id": e.id,
            "emergency_id": e.emergency_id,
            "description": e.description,
            "latitude": e.latitude,
            "longitude": e.longitude,
            "severity": e.severity,
            "emergency_type": e.emergency_type,
            "status": e.status,
            "created_at": str(e.created_at),
            "resolved_at": str(e.resolved_at) if e.resolved_at else None
        } for e in emergencies
    ]

@app.get("/api/admin/emergencies/{emergency_id}", tags=["Admin"])
async def get_emergency(emergency_id: str, user: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EmergencyHistory).where(EmergencyHistory.emergency_id == emergency_id))
    emergency = result.scalars().first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency not found")
    return emergency

@app.patch("/api/admin/emergencies/{emergency_id}/status", tags=["Admin"])
async def update_emergency_status(emergency_id: str, payload: EmergencyStatusUpdateRequest, user: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EmergencyHistory).where(EmergencyHistory.emergency_id == emergency_id))
    emergency = result.scalars().first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency not found")
        
    emergency.status = payload.status
    if payload.status == "RESOLVED":
        emergency.resolved_at = datetime.utcnow()
        
    await db.commit()
    
    # Broadcast status update via SSE
    event_data = {
        "event_type": "STATUS_UPDATE",
        "emergency_id": emergency.emergency_id,
        "status": emergency.status
    }
    for queue in active_dispatch_queues:
        await queue.put(event_data)
        
    return {"success": True}

@app.delete("/api/admin/emergencies/{emergency_id}", tags=["Admin"])
async def delete_emergency(emergency_id: str, user: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EmergencyHistory).where(EmergencyHistory.emergency_id == emergency_id))
    emergency = result.scalars().first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency not found")
        
    if emergency.status != "RESOLVED":
        raise HTTPException(status_code=400, detail="Cannot delete an emergency that is not RESOLVED")
        
    await db.delete(emergency)
    await db.commit()
    
    # Broadcast deletion via SSE
    event_data = {
        "event_type": "DELETED",
        "emergency_id": emergency_id
    }
    for queue in active_dispatch_queues:
        await queue.put(event_data)
        
    return {"success": True}


import asyncio
import uuid
import json
from fastapi.responses import StreamingResponse

# --- Global Broadcast Queues for SSE ---
active_dispatch_queues = []

@app.post("/api/send-alert", response_model=AlertDispatchResponse, tags=["Messaging"])
async def send_alert(payload: AlertDispatchRequest, db: AsyncSession = Depends(get_db)):
    """
    Simulates sending an SOS alert via Twilio/WhatsApp API to emergency contacts.
    Only allows HIGH or CRITICAL severity alerts to be auto-dispatched.
    """
    logger.info(f"Received dispatch request for {payload.severity} severity emergency: {payload.emergency_type}")
    
    if payload.severity not in ["HIGH", "CRITICAL"]:
        return AlertDispatchResponse(
            success=False,
            message="Auto-dispatch is only available for HIGH or CRITICAL emergencies.",
            dispatch_id=None
        )

    # Simulate network latency of connecting to external messaging API (e.g., Twilio)
    await asyncio.sleep(1.5)
    
    # Generate a mock tracking ID
    mock_dispatch_id = f"SM{uuid.uuid4().hex[:32]}"
    
    # Save alert to DB
    db_alert = AlertHistory(
        dispatch_id=mock_dispatch_id,
        emergency_type=payload.emergency_type,
        severity=payload.severity,
        formatted_text=payload.formatted_text,
        success=True
    )
    db.add(db_alert)
    await db.commit()
    
    logger.info(f"Successfully dispatched alert {mock_dispatch_id} via simulated messaging gateway.")
    
    # --- BROADCAST EVENT TO ALL DASHBOARDS ---
    event_data = {
        "dispatch_id": mock_dispatch_id,
        "emergency_type": payload.emergency_type,
        "severity": payload.severity,
        "text": payload.formatted_text
    }
    
    for queue in active_dispatch_queues:
        await queue.put(event_data)
        
    return AlertDispatchResponse(
        success=True,
        message="Alert successfully dispatched to registered emergency contacts.",
        dispatch_id=mock_dispatch_id
    )

@app.get("/api/dispatch-stream", tags=["Messaging"])
async def dispatch_stream(request: Request):
    """
    Server-Sent Events (SSE) endpoint for the Dispatcher Dashboard.
    Streams incoming alerts in real-time.
    """
    queue = asyncio.Queue()
    active_dispatch_queues.append(queue)
    logger.info("New dispatcher dashboard connected to SSE stream.")
    
    async def event_generator():
        try:
            while True:
                # Disconnect if client closes connection
                if await request.is_disconnected():
                    break
                    
                # Wait for a new alert or send a heartbeat
                try:
                    event_data = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield f"data: {json.dumps(event_data)}\n\n"
                except asyncio.TimeoutError:
                    # Send a heartbeat comment every 15 seconds to keep connection alive
                    yield ": heartbeat\n\n"
        finally:
            active_dispatch_queues.remove(queue)
            logger.info("Dispatcher dashboard disconnected from SSE stream.")

    return StreamingResponse(event_generator(), media_type="text/event-stream")
