export interface TrialOverview {
  title: string;
  drugName: string;
  phase: string;
  objective: string;
  population: string[];
  methodology: string[];
  primaryEndpoints: string[];
  secondaryEndpoints: string[];
}

export interface OutlineSection {
  id: string;
  title: string;
  subsections: string[];
  description: string;
}

export interface RationaleItem {
  section: string;
  rationale: string;
}

export interface RegulatoryGuideline {
  id: string;
  name: string;
  description: string;
  keyPoints: string[];
}
