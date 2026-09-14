export interface TelegramNewsPost {
  id: string;
  text: string;
  time: string;
  isBreaking: boolean;
  translatedText?: string;
  isTranslating?: boolean;
}

export interface FactCheckResult {
  claim: string;
  verdict: string;
  confidence?: number;
  analysis: string;
  sources: Array<{
    title: string;
    uri: string;
  }>;
}

export interface EmergencyBulletin {
  id: string;
  name: string;
  category: string;
  sourceUrl: string;
  status: string;
  threatLevel: string;
  lastUpdated: string;
  intelBrief: string;
}

export interface IntelligenceBriefing {
  sector: string;
  threatLevel: "LOW" | "ELEVATED" | "CRITICAL" | "SEVERE";
  threatRating: number;
  actors: string[];
  affectedRegions: string[];
  narrative: string;
  recommendations: string[];
  lastUpdated: string;
}
