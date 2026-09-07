from datetime import datetime, timezone
import logging
from typing import Dict, Any

from app.models import EmergencyReport, EmergencyAnalysis, FirstAidGuidance
from app.agents.state import EmergencyState

logger = logging.getLogger("resq_ai.agents.report")

async def run_report_agent(state: EmergencyState) -> Dict[str, Any]:
    """Node: Synthesizes workflow results into a concise structured emergency report."""
    analysis: EmergencyAnalysis = state.get("analysis") or EmergencyAnalysis(
        emergency_type="Emergency Incident",
        severity="HIGH",
        observations=[]
    )
    first_aid: FirstAidGuidance = state.get("first_aid") or FirstAidGuidance(
        immediate_actions=["Contact local emergency services immediately."],
        things_to_avoid=[],
        escalation_message="Dial 112 for immediate response."
    )
    
    lat = state.get("latitude")
    lng = state.get("longitude")
    loc_status = f"Coordinates ({lat:.4f}, {lng:.4f})" if (lat is not None and lng is not None) else "Location not provided"

    report = EmergencyReport(
        timestamp=datetime.now(timezone.utc).isoformat(),
        emergency_type=analysis.emergency_type,
        severity=analysis.severity,
        observations=analysis.observations[:4],
        immediate_actions=first_aid.immediate_actions[:4],
        location_status=loc_status
    )

    return {"report": report}
