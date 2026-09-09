export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface EmergencyAnalysis {
  emergency_type: string;
  severity: SeverityLevel;
  observations: string[];
  victim_conscious?: string;
  visible_bleeding?: string;
  breathing_concern?: string;
}

export interface FirstAidGuidance {
  immediate_actions: string[];
  things_to_avoid: string[];
  escalation_message: string;
  disclaimer?: string;
}

export interface HospitalInfo {
  name: string;
  address: string;
  distance_km?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  maps_url?: string | null;
  phone_number?: string | null;
  operating_hours?: string | null;
  is_real: boolean;
}

export interface EmergencyReport {
  timestamp: string;
  emergency_type: string;
  severity: string;
  observations: string[];
  immediate_actions: string[];
  location_status: string;
}

export interface PreparedAlert {
  emergency_type: string;
  severity: string;
  observations: string[];
  location: string;
  recommended_action: string;
  is_demo: boolean;
  formatted_text: string;
  status_message?: string;
  sms_uri?: string | null;
}

export interface EmergencyResponse {
  success: boolean;
  analysis?: EmergencyAnalysis | null;
  first_aid?: FirstAidGuidance | null;
  hospitals: HospitalInfo[];
  hospital_search_status: string;
  report?: EmergencyReport | null;
  alert?: PreparedAlert | null;
  error?: string | null;
}

export interface EmergencyPayload {
  description: string;
  latitude?: number | null;
  longitude?: number | null;
  triage_answers?: Record<string, string>;
}

export interface TriageQuestionResponse {
  questions: string[];
}
