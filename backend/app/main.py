import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.models import HealthResponse, EmergencyRequest, EmergencyResponse
from app.agents.graph import emergency_graph

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("resq_ai")

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Agentic Emergency Response System Backend"
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

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
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

@app.post("/api/emergency/analyze", response_model=EmergencyResponse, tags=["Emergency"])
async def analyze_emergency(payload: EmergencyRequest):
    """
    Executes LangGraph agentic emergency response workflow:
    Analysis Agent -> First Aid Agent -> Hospital Search Tool -> Report Agent -> Alert Preparation
    """
    initial_state = {
        "description": payload.description,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
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

        return EmergencyResponse(
            success=True,
            analysis=final_state.get("analysis"),
            first_aid=final_state.get("first_aid"),
            hospitals=final_state.get("hospitals", []),
            hospital_search_status=final_state.get("hospital_search_status", "Search completed"),
            report=final_state.get("report"),
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
