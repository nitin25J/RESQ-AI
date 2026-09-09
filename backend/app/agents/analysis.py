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
Your task is to analyze the user's emergency description along with their direct answers to specific triage questions, and return a JSON object.

User Description: "{description}"

Explicit Triage Answers:
{triage_answers_text}

Rules:
1. Determine `emergency_type` (e.g., "Cardiac Emergency", "Trauma / Heavy Bleeding", "Thermal Burn", "Respiratory Distress", "General Medical Emergency").
2. Determine `severity` from exactly one of: "LOW", "MEDIUM", "HIGH", "CRITICAL".
   - CRITICAL: Cardiac arrest, unconsciousness, severe arterial bleeding, head trauma, not breathing.
   - HIGH: Fractures, deep wounds, severe burns, chest pain, breathing difficulty.
   - MEDIUM: Sprains, moderate cuts, mild burns, fever.
   - LOW: Minor scrapes, mild discomfort.
3. Extract 2-5 concise `observations`. Incorporate facts from the Explicit Triage Answers.
4. State `victim_conscious`: "Yes" / "No" / "Unknown" based heavily on the Triage Answers if provided, else infer from description.
5. State `visible_bleeding`: "Yes" / "No" / "Unknown" based heavily on the Triage Answers if provided, else infer from description.
6. State `breathing_concern`: "Yes" / "No" / "Unknown" based heavily on the Triage Answers if provided, else infer from description.

DO NOT FABRICATE facts not present in the user text or triage answers. Distinguish unknown facts cleanly as "Unknown".

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

    triage_answers = state.get("triage_answers") or {}
    triage_answers_text = "\n".join([f"- Q: {q}\n  A: {a}" for q, a in triage_answers.items()]) if triage_answers else "None provided."

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
        
        prompt = ANALYSIS_PROMPT.format(description=description, triage_answers_text=triage_answers_text)
        
        response = None
        for attempt in range(2):
            try:
                response = await client.aio.models.generate_content(
                    model='gemini-1.5-flash',
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
        
        # Parse triage_answers for fallback to avoid "Unknown" tags during API Rate Limits
        triage_answers = state.get("triage_answers") or {}
        v_conscious = "Unknown"
        v_bleeding = "Unknown"
        v_breathing = "Unknown"
        
        for q, a in triage_answers.items():
            ql = q.lower()
            if "conscious" in ql or "respond" in ql:
                v_conscious = a
            elif "bleed" in ql or "blood" in ql:
                v_bleeding = a
            elif "breath" in ql or "chok" in ql:
                v_breathing = a

        # Fallback to simple rules engine if LLM fails
        desc_lower = description.lower()
        sev = "CRITICAL" if any(w in desc_lower for w in ["unconscious", "bleeding heavily", "stroke", "cardiac", "chest pain"]) or v_conscious == "No" or v_breathing == "No" else "HIGH"
        
        if v_conscious == "Unknown":
            v_conscious = "No" if "unconscious" in desc_lower else ("Yes" if "conscious" in desc_lower else "Unknown")
        if v_bleeding == "Unknown":
            v_bleeding = "Yes" if "bleed" in desc_lower else "Unknown"
        if v_breathing == "Unknown":
            v_breathing = "Yes" if "breath" in desc_lower else "Unknown"

        fallback = EmergencyAnalysis(
            emergency_type="Medical Emergency",
            severity=sev,
            observations=["Emergency reported", "API Rate Limit active. Used manual fallback triage."],
            victim_conscious=v_conscious,
            visible_bleeding=v_bleeding,
            breathing_concern=v_breathing
        )
        return {"analysis": fallback}
