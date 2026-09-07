import urllib.parse
import logging
from typing import Dict, Any

from app.models import PreparedAlert, EmergencyAnalysis, FirstAidGuidance
from app.agents.state import EmergencyState

logger = logging.getLogger("resq_ai.agents.alert")

async def run_alert_prep_step(state: EmergencyState) -> Dict[str, Any]:
    """Node (STEP): Formats structured prepared SOS alert payload."""
    analysis: EmergencyAnalysis = state.get("analysis") or EmergencyAnalysis(
        emergency_type="Emergency Incident",
        severity="HIGH",
        observations=[]
    )
    first_aid: FirstAidGuidance = state.get("first_aid") or FirstAidGuidance(
        immediate_actions=["Contact local emergency services immediately."],
        things_to_avoid=[],
        escalation_message="Dial 112 for emergency dispatch."
    )

    lat = state.get("latitude")
    lng = state.get("longitude")
    location_str = f"Lat: {lat}, Lng: {lng}" if (lat is not None and lng is not None) else "Location Not Provided"

    obs_str = ", ".join(analysis.observations[:3]) if analysis.observations else "Immediate assistance requested"
    rec_action = first_aid.escalation_message

    formatted_text = (
        f"[RESQ AI EMERGENCY SOS]\n"
        f"SEVERITY: {analysis.severity}\n"
        f"TYPE: {analysis.emergency_type}\n"
        f"OBSERVATIONS: {obs_str}\n"
        f"LOCATION: {location_str}\n"
        f"ACTION: {rec_action}"
    )

    # Optional native sms: URI link
    encoded_body = urllib.parse.quote(formatted_text)
    sms_uri = f"sms:112?body={encoded_body}"

    alert = PreparedAlert(
        emergency_type=analysis.emergency_type,
        severity=analysis.severity,
        observations=analysis.observations,
        location=location_str,
        recommended_action=rec_action,
        is_demo=True,
        formatted_text=formatted_text,
        status_message="Prepared SOS Alert (Demo Mode). Ready for manual copy or native SMS dispatch.",
        sms_uri=sms_uri
    )

    return {"alert": alert}
