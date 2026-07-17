import { OutlineSection, RationaleItem, RegulatoryGuideline, TrialOverview } from './types';

export const trialData: TrialOverview = {
  title: "Efficacy and Safety of NeuroVax-12 in Early-Stage Alzheimer's Disease",
  drugName: "NeuroVax-12 (Hypothetical)",
  phase: "Phase 2b",
  objective: "To evaluate the safety, tolerability, and preliminary efficacy of NeuroVax-12 in delaying cognitive decline in patients with Mild Cognitive Impairment (MCI) due to Alzheimer's disease.",
  population: [
    "Adults aged 55-80 years",
    "Confirmed diagnosis of Mild Cognitive Impairment (MCI)",
    "Amyloid-PET positive scan",
    "Mini-Mental State Examination (MMSE) score between 22 and 30"
  ],
  methodology: [
    "Randomized, double-blind, placebo-controlled",
    "Multicenter (45 sites across North America and Europe)",
    "1:1 randomization (NeuroVax-12 50mg vs Placebo)",
    "78-week treatment duration with monthly intravenous administration"
  ],
  primaryEndpoints: [
    "Change from baseline in Clinical Dementia Rating-Sum of Boxes (CDR-SB) at 78 weeks."
  ],
  secondaryEndpoints: [
    "Incidence of treatment-emergent adverse events (TEAEs) and severe adverse events (SAEs).",
    "Change in amyloid beta burden as measured by PET imaging.",
    "Change from baseline in Alzheimer's Disease Assessment Scale-Cognitive Subscale (ADAS-Cog13)."
  ]
};

export const reportOutline: OutlineSection[] = [
  {
    id: "sec-1",
    title: "1. Introduction",
    description: "Sets the stage by explaining the disease context, the investigational product, and the specific rationale for the study.",
    subsections: [
      "1.1 Background of Alzheimer's Disease and Mild Cognitive Impairment",
      "1.2 Investigational Product Description (NeuroVax-12)",
      "1.3 Rationale for the Clinical Trial",
      "1.4 Study Objectives (Primary, Secondary, Exploratory)"
    ]
  },
  {
    id: "sec-2",
    title: "2. Methodology",
    description: "Details how the study was conducted, ensuring transparency and reproducibility.",
    subsections: [
      "2.1 Overall Study Design and Plan",
      "2.2 Selection of Study Population (Inclusion/Exclusion Criteria)",
      "2.3 Treatments Administered and Blinding",
      "2.4 Efficacy and Safety Variables Assessed",
      "2.5 Statistical Methods and Sample Size Determination"
    ]
  },
  {
    id: "sec-3",
    title: "3. Results",
    description: "Presents the objective findings of the trial without subjective interpretation.",
    subsections: [
      "3.1 Patient Disposition and Protocol Deviations",
      "3.2 Baseline Demographics and Disease Characteristics",
      "3.3 Efficacy Results (Primary and Secondary Endpoints)",
      "3.4 Safety Results (Adverse Events, Clinical Laboratory Evaluations, Vital Signs)"
    ]
  },
  {
    id: "sec-4",
    title: "4. Discussion",
    description: "Interprets the results in the context of the study objectives and existing medical literature.",
    subsections: [
      "4.1 Interpretation of Efficacy Findings",
      "4.2 Safety and Tolerability Profile",
      "4.3 Comparison with Existing Therapies",
      "4.4 Study Limitations"
    ]
  },
  {
    id: "sec-5",
    title: "5. Conclusion",
    description: "Provides a concise summary of the trial's outcomes and the drug's overall benefit-risk profile.",
    subsections: [
      "5.1 Summary of Key Findings",
      "5.2 Benefit-Risk Assessment",
      "5.3 Recommendations for Phase 3"
    ]
  }
];

export const structuralRationale: RationaleItem[] = [
  {
    section: "Introduction & Rationale",
    rationale: "Aligns with ICH E3 Section 9. Provides necessary scientific and clinical context so regulators understand the unmet need and why this specific intervention is being tested."
  },
  {
    section: "Methodology Details",
    rationale: "Separating 'Study Population' from 'Statistical Methods' ensures clarity. Regulatory bodies require granular detail on how bias was minimized (blinding/randomization) and how missing data was handled."
  },
  {
    section: "Objective Results Presentation",
    rationale: "Crucial for transparency. Efficacy and safety must be reported exactly as pre-specified in the Statistical Analysis Plan (SAP) before any interpretation occurs to prevent biased reporting."
  },
  {
    section: "Discussion vs. Conclusion Separation",
    rationale: "The Discussion allows for nuanced interpretation and addressing study limitations. The Conclusion must be a strict, brief distillation of the risk/benefit profile to inform labeling and subsequent trial phases."
  }
];

export const guidelines: RegulatoryGuideline[] = [
  {
    id: "ich-e3",
    name: "ICH E3: Structure and Content of Clinical Study Reports",
    description: "The primary international guideline detailing the required format and content of a clinical study report for regulatory submission.",
    keyPoints: [
      "Mandates a specific, standardized table of contents.",
      "Requires detailed descriptions of protocol amendments and statistical analysis plans.",
      "Emphasizes the clear separation of objective results from subjective discussion."
    ]
  },
  {
    id: "consort",
    name: "CONSORT Statement (Consolidated Standards of Reporting Trials)",
    description: "A 25-item checklist and flow diagram designed to improve the transparency and quality of reporting randomized controlled trials in medical journals.",
    keyPoints: [
      "Focuses on how the trial was designed, analyzed, and interpreted.",
      "Requires a flow diagram showing patient enrollment, allocation, follow-up, and analysis.",
      "Ensures readers can accurately assess the validity of the trial's results."
    ]
  },
  {
    id: "fda-cfr",
    name: "FDA 21 CFR Part 314",
    description: "US Food and Drug Administration regulations regarding applications for FDA approval to market a new drug.",
    keyPoints: [
      "Specifies the requirements for clinical data in New Drug Applications (NDAs).",
      "Mandates comprehensive safety updates and integrated summaries of efficacy (ISE) and safety (ISS)."
    ]
  }
];
