import json
import logging
import asyncio
from typing import Dict, Any

from app.config import settings
from app.models import FirstAidGuidance, EmergencyAnalysis
from app.agents.state import EmergencyState

logger = logging.getLogger("resq_ai.agents.first_aid")

FIRST_AID_PROMPT = """
You are a highly accurate, conservative First Aid AI Agent for RESQ AI.
Your primary objective is to provide strictly accurate, medically sound first-aid instructions based on official guidelines from organizations like the Red Cross, American Heart Association (AHA), and World Health Organization (WHO).

Given the emergency analysis below, generate safe, immediate first-aid instructions.

Emergency Type: {emergency_type}
Severity: {severity}
Observations: {observations}
Conscious: {victim_conscious}
Bleeding: {visible_bleeding}
Breathing Concern: {breathing_concern}

CRITICAL GUARDRAILS:
1. Provide 3-5 concise, highly accurate `immediate_actions`. They must reflect standard medical consensus (e.g., CPR protocols, direct pressure for bleeding, epi-pen for anaphylaxis).
2. Provide 2-4 `things_to_avoid` that prevent common misconceptions or harmful actions (e.g., do not give water to unconscious victims, do not apply ice directly to burns, do not remove tourniquets once applied).
3. Do NOT diagnose medical conditions.
4. Do NOT prescribe medications or dosages, except advising the use of a patient's own prescribed emergency medication (like an inhaler or EpiPen) if relevant.
5. Do NOT claim medical certainty. Keep instructions clear and actionable.
6. For HIGH or CRITICAL severity, recommend contacting emergency services immediately (Mention India's 112 / 108 emergency numbers).

Return ONLY valid JSON matching this structure:
{{
  "immediate_actions": ["..."],
  "things_to_avoid": ["..."],
  "escalation_message": "..."
}}
"""

async def run_first_aid_agent(state: EmergencyState) -> Dict[str, Any]:
    """Node: Generates conservative first aid guidance."""
    analysis: EmergencyAnalysis = state.get("analysis") or EmergencyAnalysis(
        emergency_type="General Medical Emergency",
        severity="HIGH",
        observations=["Immediate assistance requested"]
    )

    is_high_critical = analysis.severity in ["HIGH", "CRITICAL"]
    default_escalation = (
        "Contact local emergency services immediately (Dial 112 in India) for emergency dispatch."
        if is_high_critical else
        "Monitor condition closely. If symptoms worsen, contact local emergency services (Dial 112 in India)."
    )

    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY missing. Returning fallback first aid guidance.")
        fallback = FirstAidGuidance(
            immediate_actions=[
                "Keep the victim calm and still in a safe environment.",
                "Check for responsiveness and clear breathing airways.",
                "Apply direct pressure with a clean cloth if active bleeding is present.",
                "Do not leave the person unattended."
            ],
            things_to_avoid=[
                "Do not give food, drink, or oral medication to an injured or unconscious person.",
                "Do not move the person if neck or back injuries are suspected.",
                "Do not apply ice directly to open wounds or severe burns."
            ],
            escalation_message=default_escalation
        )
        return {"first_aid": fallback}

    try:
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        prompt = FIRST_AID_PROMPT.format(
            emergency_type=analysis.emergency_type,
            severity=analysis.severity,
            observations=", ".join(analysis.observations),
            victim_conscious=analysis.victim_conscious,
            visible_bleeding=analysis.visible_bleeding,
            breathing_concern=analysis.breathing_concern
        )

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
                logger.warning(f"Gemini First Aid attempt {attempt+1}: {e_mod}")
                if "429" in str(e_mod) or "RESOURCE_EXHAUSTED" in str(e_mod):
                    # Quota limit reached; break immediately to trigger rules-engine fallback instantly
                    break
                else:
                    await asyncio.sleep(0.5)

        if not response or not response.text:
            raise ValueError("No response text received from Gemini models.")

        data = json.loads(response.text.strip())

        guidance = FirstAidGuidance(
            immediate_actions=data.get("immediate_actions", ["Ensure scene safety and keep victim calm."]),
            things_to_avoid=data.get("things_to_avoid", ["Do not give food, water, or medication to unconscious victims."]),
            escalation_message=data.get("escalation_message", default_escalation)
        )
        return {"first_aid": guidance}

    except Exception as e:
        logger.error(f"Gemini First Aid Agent error: {e}. Using fallback guidance.")
        fallback = FirstAidGuidance(
            immediate_actions=[
                "Ensure scene safety and keep victim calm.",
                "If bleeding is present, apply firm, direct pressure with a clean cloth.",
                "Keep the victim seated or lying down comfortably."
            ],
            things_to_avoid=[
                "Do not administer food, liquids, or unprescribed medications.",
                "Do not attempt unnecessary physical movement if injury is severe."
            ],
            escalation_message=default_escalation
        )
        return {"first_aid": fallback}
