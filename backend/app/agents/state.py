from typing import TypedDict, List, Optional, Dict
from app.models import (
    EmergencyAnalysis,
    FirstAidGuidance,
    HospitalInfo,
    EmergencyReport,
    PreparedAlert,
)

class EmergencyState(TypedDict):
    # Input Data
    description: str
    latitude: Optional[float]
    longitude: Optional[float]
    triage_answers: Optional[Dict[str, str]]

    # Sequential Node Outputs
    analysis: Optional[EmergencyAnalysis]
    first_aid: Optional[FirstAidGuidance]
    hospitals: List[HospitalInfo]
    hospital_search_status: str
    report: Optional[EmergencyReport]
    alert: Optional[PreparedAlert]

    # Operational status & non-fatal errors
    error: Optional[str]
