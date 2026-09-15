from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, JSON
from app.database import Base

class EmergencyHistory(Base):
    __tablename__ = "emergency_history"

    id = Column(Integer, primary_key=True, index=True)
    emergency_id = Column(String(100), unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    status = Column(String(50), default="ACTIVE", index=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    
    description = Column(Text, nullable=False)
    emergency_type = Column(String(100), nullable=True)
    severity = Column(String(50), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location = Column(String(255), nullable=True)
    
    key_observations = Column(JSON, nullable=True)
    nearby_hospitals = Column(JSON, nullable=True)
    first_aid_guidance = Column(JSON, nullable=True)
    incident_report = Column(JSON, nullable=True)
    alert_information = Column(JSON, nullable=True)

    # Store complete JSON representations of the responses
    analysis_data = Column(JSON, nullable=True)
    first_aid_data = Column(JSON, nullable=True)
    report_data = Column(JSON, nullable=True)
    
class AlertHistory(Base):
    __tablename__ = "alert_history"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    dispatch_id = Column(String(100), unique=True, index=True, nullable=False)
    emergency_type = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)
    formatted_text = Column(Text, nullable=False)
    success = Column(Boolean, default=True)

class DiseaseDataset(Base):
    """
    Dataset of common diseases and medical emergencies for fast retrieval.
    """
    __tablename__ = "disease_dataset"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False, default="Minor")
    disease_name = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    symptoms = Column(JSON, nullable=False)  # List of symptoms
    immediate_first_aid = Column(JSON, nullable=False)  # List of first aid steps
    requires_hospital = Column(Boolean, default=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="ADMIN", nullable=False) # ADMIN, HOSPITAL

