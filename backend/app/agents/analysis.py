import json
import logging
import asyncio
from typing import Dict, Any

from app.config import settings
from app.models import EmergencyAnalysis
from app.agents.state import EmergencyState

logger = logging.getLogger("resq_ai.agents.analysis")

ANALYSIS_PROMPT = """
You are an expert Emergency Analysis AI Agent for RESQ AI.
Your task is to analyze the user's emergency description and return a JSON object.

User Description: "{description}"

Rules:
1. Determine `emergency_type` (e.g., "Cardiac Emergency", "Trauma / Heavy Bleeding", "Thermal Burn", "Respiratory Distress", "General Medical Emergency").
2. Determine `severity` from exactly one of: "LOW", "MEDIUM", "HIGH", "CRITICAL".
   - CRITICAL: Cardiac arrest, unconsciousness, severe arterial bleeding, head trauma, not breathing.
   - HIGH: Fractures, deep wounds, severe burns, chest pain, breathing difficulty.
   - MEDIUM: Sprains, moderate cuts, mild burns, fever.
   - LOW: Minor scrapes, mild discomfort.
3. Extract 2-5 concise `observations`.
4. State `victim_conscious`: "Yes" if stated conscious, "No" if stated unconscious, "Unknown" if not mentioned.
5. State `visible_bleeding`: "Yes" if bleeding mentioned, "No" if explicitly no bleeding, "Unknown" if not mentioned.
6. State `breathing_concern`: "Yes" if breathing issue mentioned, "No" if breathing fine, "Unknown" if not mentioned.

DO NOT FABRICATE facts not present in the user text. Distinguish unknown facts cleanly as "Unknown".

Return ONLY valid JSON matching this structure:
{{
  "emergency_type": "...",
  "severity": "...",
  "observations": ["..."],
  "victim_conscious": "...",
  "visible_bleeding": "...",
  "breathing_concern": "..."
}}
"""

async def run_analysis_agent(state: EmergencyState) -> Dict[str, Any]:
    """Node: Analyzes user description using Gemini AI structured output."""
    description = state.get("description", "")

    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY missing. Returning structured fallback analysis.")
        fallback = EmergencyAnalysis(
            emergency_type="General Emergency Incident",
            severity="HIGH",
            observations=["User reported emergency", "Gemini API Key missing for AI analysis"],
            victim_conscious="Unknown",
            visible_bleeding="Unknown",
            breathing_concern="Unknown"
        )
        return {"analysis": fallback}

    try:
        # Import google.genai or langchain_google_genai
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = ANALYSIS_PROMPT.format(description=description)
        
        response = None
        for attempt in range(2):
            try:
                response = client.models.generate_content(
                    model='gemini-3.6-flash',
                    contents=prompt,
                    config={'response_mime_type': 'application/json'}
                )
                if response and response.text:
                    break
            except Exception as e_mod:
                logger.warning(f"Gemini Analysis attempt {attempt+1}: {e_mod}")
                if "429" in str(e_mod) or "RESOURCE_EXHAUSTED" in str(e_mod):
                    # Quota limit reached; break immediately to trigger rules-engine fallback instantly
                    break
                else:
                    await asyncio.sleep(0.5)

        if not response or not response.text:
            raise ValueError("No response text received from Gemini models.")

        raw_text = response.text.strip()
        data = json.loads(raw_text)

        # Validate severity enum
        sev = str(data.get("severity", "HIGH")).upper()
        if sev not in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
            sev = "HIGH"

        analysis = EmergencyAnalysis(
            emergency_type=data.get("emergency_type", "General Emergency"),
            severity=sev,
            observations=data.get("observations", ["Emergency prompt received"]),
            victim_conscious=data.get("victim_conscious", "Unknown"),
            visible_bleeding=data.get("visible_bleeding", "Unknown"),
            breathing_concern=data.get("breathing_concern", "Unknown")
        )
        return {"analysis": analysis}

    except Exception as e:
        logger.error(f"Gemini Analysis Agent error: {e}. Using fallback analysis.")
        # Fallback to simple rules engine if LLM fails
        desc_lower = description.lower()
        sev = "CRITICAL" if any(w in desc_lower for w in ["unconscious", "bleeding heavily", "stroke", "cardiac", "chest pain"]) else "HIGH"
        fallback = EmergencyAnalysis(
            emergency_type="Medical Emergency",
            severity=sev,
            observations=[description[:100]],
            victim_conscious="No" if "unconscious" in desc_lower else ("Yes" if "conscious" in desc_lower else "Unknown"),
            visible_bleeding="Yes" if "bleed" in desc_lower else "Unknown",
            breathing_concern="Yes" if "breath" in desc_lower else "Unknown"
        )
        return {"analysis": fallback}
