import math
import logging
from typing import List, Tuple, Optional
import httpx

from app.config import settings
from app.models import HospitalInfo

logger = logging.getLogger("resq_ai.maps")

MAX_ALLOWED_SEARCH_RADIUS_KM = 25.0  # Strict maximum radius threshold

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in kilometers using Haversine formula."""
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

async def search_nearby_hospitals(
    latitude: Optional[float],
    longitude: Optional[float]
) -> Tuple[List[HospitalInfo], str]:
    """
    Search for verified nearby hospitals dynamically given user's latitude and longitude.
    NEVER fabricates hospital names or returns hospitals outside search radius.
    Returns (List[HospitalInfo], status_message).
    """
    if latitude is None or longitude is None:
        return [], "Location permission or coordinates required for nearby hospital search."

    # 1. Try Google Places API (Nearby Search) if API Key is configured
    if settings.GOOGLE_MAPS_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                url = (
                    f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
                    f"?location={latitude},{longitude}&radius=15000&type=hospital&key={settings.GOOGLE_MAPS_API_KEY}"
                )
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    results = data.get("results", [])
                    hospitals: List[HospitalInfo] = []
                    for item in results:
                        h_name = item.get("name")
                        if not h_name:
                            continue
                        h_address = item.get("vicinity", item.get("formatted_address", "Address unavailable"))
                        loc = item.get("geometry", {}).get("location", {})
                        h_lat = loc.get("lat")
                        h_lng = loc.get("lng")
                        
                        if h_lat is not None and h_lng is not None:
                            dist = haversine_distance(latitude, longitude, h_lat, h_lng)
                            if dist <= MAX_ALLOWED_SEARCH_RADIUS_KM:
                                maps_url = f"https://www.google.com/maps/search/?api=1&query={h_lat},{h_lng}"
                                hospitals.append(HospitalInfo(
                                    name=h_name,
                                    address=h_address,
                                    distance_km=dist,
                                    latitude=h_lat,
                                    longitude=h_lng,
                                    maps_url=maps_url,
                                    is_real=True
                                ))
                    if hospitals:
                        hospitals.sort(key=lambda h: h.distance_km if h.distance_km is not None else 999)
                        return hospitals[:5], f"Found {len(hospitals[:5])} nearby hospitals via Google Places."
        except Exception as e:
            logger.warning(f"Google Places API lookup failed: {e}. Falling back to OpenStreetMap.")

    # 2. Try OpenStreetMap Overpass API (Strict Geographic Radius Search around user lat/lon)
    overpass_endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.private.coffee/api/interpreter",
    ]
    overpass_query = f"""
    [out:json][timeout:4];
    (
      node["amenity"="hospital"](around:15000,{latitude},{longitude});
      way["amenity"="hospital"](around:15000,{latitude},{longitude});
      relation["amenity"="hospital"](around:15000,{latitude},{longitude});
    );
    out center 15;
    """
    headers = {"User-Agent": "RESQ-AI-EmergencyResponseSystem/1.0 (Educational Emergency Prototype)"}

    for endpoint in overpass_endpoints:
        try:
            async with httpx.AsyncClient(timeout=3.5, headers=headers) as client:
                response = await client.post(endpoint, data={"data": overpass_query})
                if response.status_code == 200:
                    data = response.json()
                    elements = data.get("elements", [])
                    hospitals: List[HospitalInfo] = []
                    for el in elements:
                        tags = el.get("tags", {})
                        h_name = tags.get("name") or tags.get("name:en") or tags.get("official_name")
                        if not h_name:
                            continue
                        
                        h_lat = el.get("lat") or el.get("center", {}).get("lat")
                        h_lng = el.get("lon") or el.get("center", {}).get("lon")
                        
                        if h_lat is not None and h_lng is not None:
                            dist = haversine_distance(latitude, longitude, h_lat, h_lng)
                            if dist <= MAX_ALLOWED_SEARCH_RADIUS_KM:
                                street = tags.get("addr:street", "")
                                city = tags.get("addr:city", "")
                                h_address = f"{street}, {city}".strip(", ") or tags.get("operator") or tags.get("addr:full") or "Address recorded in OpenStreetMap"
                                maps_url = f"https://www.google.com/maps/search/?api=1&query={h_lat},{h_lng}"

                                hospitals.append(HospitalInfo(
                                    name=h_name,
                                    address=h_address,
                                    distance_km=dist,
                                    latitude=h_lat,
                                    longitude=h_lng,
                                    maps_url=maps_url,
                                    is_real=True
                                ))
                    if hospitals:
                        hospitals.sort(key=lambda h: h.distance_km if h.distance_km is not None else 999)
                        return hospitals[:5], f"Found {len(hospitals[:5])} nearby hospitals via OpenStreetMap."
        except Exception as e:
            logger.warning(f"Overpass API endpoint {endpoint} failed: {e}")

    # 3. Try Nominatim API with Strict Bounded Viewbox around user lat/lon
    try:
        min_lat, max_lat = latitude - 0.2, latitude + 0.2
        min_lon, max_lon = longitude - 0.2, longitude + 0.2
        viewbox = f"{min_lon},{max_lat},{max_lon},{min_lat}"
        nominatim_url = f"https://nominatim.openstreetmap.org/search?format=json&q=hospital&viewbox={viewbox}&bounded=1&limit=10"
        
        async with httpx.AsyncClient(timeout=3.5, headers=headers) as client:
            res = await client.get(nominatim_url)
            if res.status_code == 200:
                places = res.json()
                hospitals: List[HospitalInfo] = []
                for p in places:
                    h_name = p.get("display_name", "").split(",")[0]
                    h_address = p.get("display_name", "")
                    h_lat = float(p.get("lat")) if p.get("lat") else None
                    h_lng = float(p.get("lon")) if p.get("lon") else None
                    
                    if h_name and h_lat is not None and h_lng is not None:
                        dist = haversine_distance(latitude, longitude, h_lat, h_lng)
                        if dist <= MAX_ALLOWED_SEARCH_RADIUS_KM:
                            maps_url = f"https://www.google.com/maps/search/?api=1&query={h_lat},{h_lng}"
                            hospitals.append(HospitalInfo(
                                name=h_name,
                                address=h_address,
                                distance_km=dist,
                                latitude=h_lat,
                                longitude=h_lng,
                                maps_url=maps_url,
                                is_real=True
                            ))
                if hospitals:
                    hospitals.sort(key=lambda h: h.distance_km if h.distance_km is not None else 999)
                    return hospitals[:5], f"Found {len(hospitals[:5])} nearby hospitals via Nominatim."
    except Exception as e:
        logger.warning(f"Nominatim bounded lookup failed: {e}")

    # 4. Fallback when no hospitals found within radius or APIs fail
    return [], f"No nearby hospitals could be found for your current location within {int(MAX_ALLOWED_SEARCH_RADIUS_KM)}km. In an emergency, dial 112 immediately."
