import json
import logging
import asyncio
from app.config import settings
from app.models import TriageQuestionResponse

logger = logging.getLogger("resq_ai.agents.triage")

TRIAGE_PROMPT = """
You are a Medical Triage AI. Your job is to instantly generate 3 to 4 critical, highly specific Yes/No/Unsure questions based on the user's emergency description.

User Emergency Description: "{description}"

CRITICAL GUARDRAILS:
1. Always ask about Consciousness and Breathing if the description is vague about them.
2. Ask specific questions related to the injury/illness (e.g., if burn, ask about blistering. if fall, ask about neck/back pain. if allergic reaction, ask about throat swelling).
3. The questions MUST be easily answerable by a bystander with Yes, No, or Unsure.
4. Keep questions short and urgent.

Return ONLY valid JSON matching this structure:
{{
  "questions": [
    "Is the person conscious and responding to you?",
    "Are they breathing normally?",
    "Is there any severe or spurting bleeding?"
  ]
}}
"""

async def generate_triage_questions(description: str) -> TriageQuestionResponse:
    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY missing. Returning default triage questions.")
        return TriageQuestionResponse(questions=[
            "Is the victim conscious and responding?",
            "Are they breathing normally?",
            "Is there any severe or active bleeding?"
        ])

    try:
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = TRIAGE_PROMPT.format(description=description)

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
                logger.warning(f"Gemini Triage attempt {attempt+1}: {e_mod}")
                if "429" in str(e_mod) or "RESOURCE_EXHAUSTED" in str(e_mod):
                    break
                else:
                    await asyncio.sleep(0.5)

        if not response or not response.text:
            raise ValueError("No response text received from Gemini models.")

        data = json.loads(response.text.strip())
        questions = data.get("questions", [])
        
        if not questions or len(questions) < 3:
            questions = [
                "Is the victim conscious and responding?",
                "Are they breathing normally?",
                "Is there any severe or active bleeding?"
            ]
            
        return TriageQuestionResponse(questions=questions[:4])

    except Exception as e:
        logger.error(f"Gemini Triage Agent error: {e}. Using default questions.")
        return TriageQuestionResponse(questions=[
            "Is the victim conscious and responding?",
            "Are they breathing normally?",
            "Is there any severe or active bleeding?"
        ])
