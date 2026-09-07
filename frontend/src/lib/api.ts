import { EmergencyPayload, EmergencyResponse } from "@/types/emergency";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeEmergency(payload: EmergencyPayload): Promise<EmergencyResponse> {
  const endpoint = `${API_BASE_URL}/api/emergency/analyze`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000); // 50s timeout to allow for Render free tier cold starts

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 422) {
        return {
          success: false,
          hospitals: [],
          hospital_search_status: "Invalid input.",
          error: "Please enter a valid description of the emergency before analyzing.",
        };
      }
      const errJson = await response.json().catch(() => ({}));
      return {
        success: false,
        hospitals: [],
        hospital_search_status: "Server error.",
        error: errJson.error || `Server responded with HTTP error code ${response.status}.`,
      };
    }

    const data: EmergencyResponse = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        hospitals: [],
        hospital_search_status: "Request timed out.",
        error: "The request took too long to complete. In an urgent emergency, dial 112 directly.",
      };
    }
    return {
      success: false,
      hospitals: [],
      hospital_search_status: "Network offline.",
      error: "Unable to connect to RESQ AI backend server. Please verify the backend is running at " + API_BASE_URL,
    };
  }
}

export async function checkBackendHealth(): Promise<{ healthy: boolean; service: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      return { healthy: data.status === "ok", service: data.service };
    }
    return { healthy: false, service: "Backend Error" };
  } catch {
    return { healthy: false, service: "Backend Offline" };
  }
}
