from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

# --- Health Models ---

class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Operational health status")
    service: str = Field(default="resq-ai-backend", description="Service identifier")

# --- Emergency Flow Input / Output Models ---

class EmergencyRequest(BaseModel):
    description: str = Field(..., min_length=1, description="User narrative describing the emergency")
    latitude: Optional[float] = Field(default=None, description="User latitude coordinate")
    longitude: Optional[float] = Field(default=None, description="User longitude coordinate")

    @field_validator("description")
    @classmethod
    def validate_description_not_empty(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Description cannot be empty or blank whitespace.")
        return cleaned

class EmergencyAnalysis(BaseModel):
    emergency_type: str = Field(..., description="Identified emergency category e.g. Cardiac, Bleeding Trauma, Burn")
    severity: str = Field(..., description="Severity rating: LOW, MEDIUM, HIGH, or CRITICAL")
    observations: List[str] = Field(default_factory=list, description="Key vital observations extracted from prompt")
    victim_conscious: Optional[str] = Field(default="Unknown", description="Consciousness state: Yes, No, or Unknown")
    visible_bleeding: Optional[str] = Field(default="Unknown", description="Bleeding state: Yes, No, or Unknown")
    breathing_concern: Optional[str] = Field(default="Unknown", description="Breathing concern: Yes, No, or Unknown")

class FirstAidGuidance(BaseModel):
    immediate_actions: List[str] = Field(..., description="Step-by-step immediate first aid actions")
    things_to_avoid: List[str] = Field(default_factory=list, description="Critical actions or substances to avoid")
    escalation_message: str = Field(..., description="Emergency contact guidance (recommends 112 for HIGH/CRITICAL in India)")

class HospitalInfo(BaseModel):
    name: str = Field(..., description="Real hospital or medical center name")
    address: str = Field(..., description="Physical address or area location")
    distance_km: Optional[float] = Field(default=None, description="Distance from user in kilometers")
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)
    maps_url: Optional[str] = Field(default=None, description="Direct Google Maps search/directions URL")
    is_real: bool = Field(default=True, description="Indicates verified real hospital data")

class EmergencyReport(BaseModel):
    timestamp: str = Field(..., description="ISO 8601 timestamp of response generation")
    emergency_type: str = Field(...)
    severity: str = Field(...)
    observations: List[str] = Field(default_factory=list)
    immediate_actions: List[str] = Field(default_factory=list)
    location_status: str = Field(..., description="Status of location lookup (Available / Location Required / Unavailable)")

class PreparedAlert(BaseModel):
    emergency_type: str = Field(...)
    severity: str = Field(...)
    observations: List[str] = Field(default_factory=list)
    location: str = Field(...)
    recommended_action: str = Field(...)
    is_demo: bool = Field(default=True, description="Explicit flag indicating prepared alert payload")
    formatted_text: str = Field(..., description="Pre-formatted SOS dispatch message text")

class EmergencyResponse(BaseModel):
    success: bool = Field(default=True)
    analysis: Optional[EmergencyAnalysis] = None
    first_aid: Optional[FirstAidGuidance] = None
    hospitals: List[HospitalInfo] = Field(default_factory=list)
    hospital_search_status: str = Field(..., description="Status of hospital tool execution")
    report: Optional[EmergencyReport] = None
    alert: Optional[PreparedAlert] = None
    error: Optional[str] = Field(default=None)
