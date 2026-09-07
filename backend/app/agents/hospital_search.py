import logging
from typing import Dict, Any

from app.agents.state import EmergencyState
from app.services.maps_service import search_nearby_hospitals

logger = logging.getLogger("resq_ai.agents.hospital_search")

async def run_hospital_search_tool(state: EmergencyState) -> Dict[str, Any]:
    """Node (TOOL): Searches real nearby hospitals via Maps/OSM services."""
    lat = state.get("latitude")
    lng = state.get("longitude")

    try:
        hospitals, status_msg = await search_nearby_hospitals(latitude=lat, longitude=lng)
        return {
            "hospitals": hospitals,
            "hospital_search_status": status_msg
        }
    except Exception as e:
        logger.error(f"Hospital search tool execution error: {e}")
        return {
            "hospitals": [],
            "hospital_search_status": "Hospital search tool encountered an error. Please dial 112 directly."
        }
