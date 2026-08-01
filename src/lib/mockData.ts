// Scientific Data Center for RAPID-iNose Atlas

export interface OrganismDetail {
  id: string;
  genus: string;
  species: string;
  gramStatus: 'Gram-positive' | 'Gram-negative' | 'Fungi' | 'Acid-fast';
  kingdom: 'Bacteria' | 'Fungi';
  bslLevel: 'BSL-1' | 'BSL-2' | 'BSL-3';
  eskapee: boolean;
  clinicalRelevance: string;
  dodRelevance: string;
  strainCount: number;
  availableStrains: Array<{
    strainName: string;
    sourceType: string;
    institution: string;
    clinicalContext: string;
    amrStatus: string;
    replicates: number;
    dataStatus: string;
  }>;
  dominantVOCs: string[];
  ttdMinutes: number;
  readinessScore: number;
}

export const MOCK_ORGANISMS_EXPANDED: OrganismDetail[] = [
  {
    id: 'pa-01',
    genus: 'Pseudomonas',
    species: 'aeruginosa',
    gramStatus: 'Gram-negative',
    kingdom: 'Bacteria',
    bslLevel: 'BSL-2',
    eskapee: true,
    clinicalRelevance: 'Chronic wound, Burn infection, NPWT effluent, Bloodstream, Cystic fibrosis',
    dodRelevance: 'Combat wound, Austere environment infection, Trauma sepsis',
    strainCount: 8,
    availableStrains: [
      { strainName: 'ATCC 27853', sourceType: 'ATCC Reference', institution: 'ATCC', clinicalContext: 'Quality Control Standard', amrStatus: 'Susceptible', replicates: 6, dataStatus: 'Sensor + GC-MS + AI' },
      { strainName: 'PAO1', sourceType: 'Lab Reference', institution: 'Frederick Health', clinicalContext: 'Lab Model Strain', amrStatus: 'Susceptible', replicates: 5, dataStatus: 'Sensor + GC-MS' },
      { strainName: 'Mayo-PA-104', sourceType: 'Clinical Isolate', institution: 'Mayo Clinic', clinicalContext: 'Diabetic Foot Ulcer', amrStatus: 'MDR (Carbapenem-R)', replicates: 4, dataStatus: 'Sensor + GC-MS + AMR' },
      { strainName: 'HSS-PA-209', sourceType: 'Implant Effluent', institution: 'HSS', clinicalContext: 'Joint Prosthesis Infection', amrStatus: 'Biofilm Producer', replicates: 4, dataStatus: 'Sensor + Biofilm' }
    ],
    dominantVOCs: ['2-Aminoacetophenone', 'Hydrogen Cyanide', '1-Undecene', '2-Nonanone', 'Pyocyanin precursor'],
    ttdMinutes: 28,
    readinessScore: 96
  },
  {
    id: 'sa-02',
    genus: 'Staphylococcus',
    species: 'aureus',
    gramStatus: 'Gram-positive',
    kingdom: 'Bacteria',
    bslLevel: 'BSL-2',
    eskapee: true,
    clinicalRelevance: 'Surgical site infection, MRSA bacteremia, Implant infection, Burn wound',
    dodRelevance: 'Combat trauma wound infection, Field dressing monitoring',
    strainCount: 12,
    availableStrains: [
      { strainName: 'ATCC 25923', sourceType: 'ATCC Reference', institution: 'ATCC', clinicalContext: 'MSSA Reference', amrStatus: 'MSSA', replicates: 8, dataStatus: 'Sensor + GC-MS' },
      { strainName: 'ATCC 43300', sourceType: 'ATCC Reference', institution: 'ATCC', clinicalContext: 'MRSA Reference', amrStatus: 'MRSA (MecA+)', replicates: 8, dataStatus: 'Sensor + GC-MS + AMR' },
      { strainName: 'Mayo-SA-88', sourceType: 'Clinical Isolate', institution: 'Mayo Clinic', clinicalContext: 'Chronic Pressure Ulcer', amrStatus: 'MRSA', replicates: 5, dataStatus: 'Sensor + AMR' },
      { strainName: 'Zimmer-SA-04', sourceType: 'Implant Surface', institution: 'Zimmer Biomet', clinicalContext: 'Total Knee Arthroplasty', amrStatus: 'Biofilm-Mature', replicates: 6, dataStatus: 'Sensor + Biofilm' }
    ],
    dominantVOCs: ['Isoamyl alcohol', 'Acetoin', '3-Methyl-1-butanol', '2,5-Dimethylpyrazinyl', 'Isovaleric acid'],
    ttdMinutes: 32,
    readinessScore: 94
  },
  {
    id: 'kp-03',
    genus: 'Klebsiella',
    species: 'pneumoniae',
    gramStatus: 'Gram-negative',
    kingdom: 'Bacteria',
    bslLevel: 'BSL-2',
    eskapee: true,
    clinicalRelevance: 'Bloodstream infection, Ventilator pneumonia, NPWT infection, CRE outbreak',
    dodRelevance: 'Trauma ICU sepsis, Austere hospital triage',
    strainCount: 6,
    availableStrains: [
      { strainName: 'ATCC 700603', sourceType: 'ATCC Reference', institution: 'ATCC', clinicalContext: 'ESBL Positive Control', amrStatus: 'ESBL+', replicates: 5, dataStatus: 'Sensor + GC-MS' },
      { strainName: 'Labcorp-KP-12', sourceType: 'Clinical Isolate', institution: 'Labcorp', clinicalContext: 'Blood Culture Bottle', amrStatus: 'KPC / CRE', replicates: 4, dataStatus: 'Sensor + AMR' }
    ],
    dominantVOCs: ['Ethanol', '1-Butanol', 'Acetoin', 'Ethyl acetate', '2-Pentanone'],
    ttdMinutes: 35,
    readinessScore: 91
  },
  {
    id: 'ab-04',
    genus: 'Acinetobacter',
    species: 'baumannii',
    gramStatus: 'Gram-negative',
    kingdom: 'Bacteria',
    bslLevel: 'BSL-2',
    eskapee: true,
    clinicalRelevance: 'Combat wound infection, Intensive care unit outbreak, CRAB bacteremia',
    dodRelevance: 'High-priority combat wound pathogen, Blast injury colonization',
    strainCount: 7,
    availableStrains: [
      { strainName: 'ATCC 19606', sourceType: 'ATCC Reference', institution: 'ATCC', clinicalContext: 'Type Strain', amrStatus: 'Susceptible', replicates: 6, dataStatus: 'Sensor + GC-MS' },
      { strainName: 'DoD-AB-09', sourceType: 'Military Isolate', institution: 'Frederick Health', clinicalContext: 'Combat Blast Injury', amrStatus: 'CRAB (Carbapenem-R)', replicates: 5, dataStatus: 'Sensor + AMR' }
    ],
    dominantVOCs: ['1-Hexanol', 'Benzaldehyde', 'Phenylacetaldehyde', '2-Heptanone'],
    ttdMinutes: 40,
    readinessScore: 89
  },
  {
    id: 'ca-05',
    genus: 'Candida',
    species: 'albicans',
    gramStatus: 'Fungi',
    kingdom: 'Fungi',
    bslLevel: 'BSL-2',
    eskapee: false,
    clinicalRelevance: 'Fungal wound infection, Bloodstream candidiasis, Catheter biofilm',
    dodRelevance: 'Immunosuppressed trauma wound fungal superinfection',
    strainCount: 5,
    availableStrains: [
      { strainName: 'ATCC 10231', sourceType: 'ATCC Reference', institution: 'ATCC', clinicalContext: 'Fungal Control', amrStatus: 'Fluconazole-S', replicates: 4, dataStatus: 'Sensor + GC-MS' },
      { strainName: 'Mayo-CA-33', sourceType: 'Clinical Isolate', institution: 'Mayo Clinic', clinicalContext: 'Blood Culture', amrStatus: 'Fluconazole-R', replicates: 3, dataStatus: 'Sensor' }
    ],
    dominantVOCs: ['Fusel alcohols', '2-Phenylethanol', 'Isoamyl acetate', 'Ethyl butyrate'],
    ttdMinutes: 55,
    readinessScore: 85
  },
  {
    id: 'ec-06',
    genus: 'Escherichia',
    species: 'coli',
    gramStatus: 'Gram-negative',
    kingdom: 'Bacteria',
    bslLevel: 'BSL-1',
    eskapee: true,
    clinicalRelevance: 'Urinary tract, Abdominal sepsis, Foodborne outbreak',
    dodRelevance: 'Food safety monitoring, Field water quality',
    strainCount: 9,
    availableStrains: [
      { strainName: 'ATCC 25922', sourceType: 'ATCC Reference', institution: 'ATCC', clinicalContext: 'Standard Control', amrStatus: 'Susceptible', replicates: 6, dataStatus: 'Sensor + GC-MS' }
    ],
    dominantVOCs: ['Indole', '1-Propanol', 'Acetoin', 'Isoamyl alcohol'],
    ttdMinutes: 30,
    readinessScore: 93
  }
];

// PCA & UMAP Projection coordinates for Compare Lab
export const MOCK_PCA_DATA = [
  { name: 'P. aeruginosa (ATCC)', x: -4.2, y: 3.5, group: 'P. aeruginosa', source: 'ATCC', gram: 'Gram-negative' },
  { name: 'P. aeruginosa (Mayo)', x: -3.9, y: 3.8, group: 'P. aeruginosa', source: 'Clinical', gram: 'Gram-negative' },
  { name: 'P. aeruginosa (HSS NPWT)', x: -4.5, y: 2.9, group: 'P. aeruginosa', source: 'NPWT', gram: 'Gram-negative' },
  { name: 'S. aureus MSSA', x: 3.8, y: -2.1, group: 'S. aureus', source: 'ATCC', gram: 'Gram-positive' },
  { name: 'S. aureus MRSA', x: 4.2, y: -1.8, group: 'S. aureus', source: 'Clinical', gram: 'Gram-positive' },
  { name: 'S. aureus Biofilm', x: 4.8, y: -2.5, group: 'S. aureus', source: 'Implant', gram: 'Gram-positive' },
  { name: 'K. pneumoniae ESBL+', x: -1.5, y: -3.8, group: 'K. pneumoniae', source: 'Clinical', gram: 'Gram-negative' },
  { name: 'A. baumannii CRAB', x: -2.8, y: -1.2, group: 'A. baumannii', source: 'DoD Military', gram: 'Gram-negative' },
  { name: 'C. albicans (Fungi)', x: 2.2, y: 4.5, group: 'C. albicans', source: 'ATCC', gram: 'Fungi' },
  { name: 'E. coli ATCC', x: -1.1, y: 1.2, group: 'E. coli', source: 'ATCC', gram: 'Gram-negative' },
  { name: 'Media Blank Control', x: 0.2, y: 0.1, group: 'Control', source: 'Blank', gram: 'Control' }
];

// GC-MS VOC Heatmap data (Pathogen x VOC)
export const MOCK_VOC_HEATMAP = {
  compounds: [
    { name: '2-Aminoacetophenone', class: 'amine', mass: 135.16 },
    { name: 'Hydrogen Cyanide', class: 'nitrogen', mass: 27.03 },
    { name: '1-Undecene', class: 'hydrocarbon', mass: 154.29 },
    { name: 'Isoamyl alcohol', class: 'alcohol', mass: 88.15 },
    { name: 'Acetoin', class: 'ketone', mass: 88.11 },
    { name: 'Indole', class: 'aromatic', mass: 117.15 },
    { name: 'Isovaleric acid', class: 'acid', mass: 102.13 },
    { name: '2-Phenylethanol', class: 'alcohol', mass: 122.16 },
    { name: 'Dimethyl disulfide', class: 'sulfur', mass: 94.20 }
  ],
  matrix: [
    { pathogen: 'P. aeruginosa', values: [98, 92, 85, 15, 10, 5, 12, 8, 75] },
    { pathogen: 'S. aureus (MSSA)', values: [4, 0, 8, 88, 95, 2, 78, 14, 40] },
    { pathogen: 'S. aureus (MRSA)', values: [6, 0, 12, 92, 98, 3, 90, 18, 48] },
    { pathogen: 'K. pneumoniae', values: [8, 0, 5, 60, 82, 45, 20, 10, 30] },
    { pathogen: 'A. baumannii', values: [12, 0, 30, 40, 50, 8, 15, 22, 60] },
    { pathogen: 'C. albicans', values: [0, 0, 5, 70, 30, 0, 10, 95, 15] },
    { pathogen: 'E. coli', values: [2, 0, 4, 52, 40, 96, 25, 12, 35] }
  ]
};

// AMR Strain Pair Comparison Curves
export const MOCK_AMR_KINETICS = {
  timeMinutes: [0, 15, 30, 45, 60, 90, 120, 180, 240, 300, 360],
  mssa_no_abx: [0, 0.05, 0.12, 0.28, 0.55, 1.10, 1.85, 2.70, 3.40, 3.80, 4.10],
  mssa_with_oxacillin: [0, 0.04, 0.08, 0.12, 0.15, 0.18, 0.16, 0.14, 0.12, 0.10, 0.08], // Suppressed by antibiotic
  mrsa_no_abx: [0, 0.06, 0.15, 0.32, 0.60, 1.25, 1.98, 2.85, 3.60, 4.00, 4.25],
  mrsa_with_oxacillin: [0, 0.06, 0.14, 0.30, 0.58, 1.20, 1.92, 2.78, 3.52, 3.95, 4.18] // Resistant - continues growing!
};

// Biofilm vs Planktonic Maturation Kinetics
export const MOCK_BIOFILM_KINETICS = {
  timeHours: [0, 4, 8, 12, 16, 24, 36, 48, 72],
  planktonic: [0, 0.2, 0.8, 1.8, 2.4, 2.8, 2.6, 2.4, 2.0], // Peaks and declines
  biofilm_early: [0, 0.1, 0.4, 1.2, 2.1, 3.2, 4.1, 4.8, 5.2], // Continuous accumulation
  biofilm_mature: [0, 0.3, 0.9, 2.0, 3.5, 5.0, 6.2, 6.8, 7.1],
  biofilm_disrupted: [0, 0.3, 0.9, 2.0, 3.5, 3.8, 2.1, 1.2, 0.8] // Cleared by enzyme/antibiotic treatment
};

// Sensor Panel Combinations (6-sensor vs 40-sensor combos)
export const MOCK_SENSOR_COMBOS = [
  { id: 'combo-01', name: 'Feasibility 6-Channel (Current)', sensors: 6, accuracy: 93.4, ttdAvgMin: 32, costPerRun: 12, targetApp: 'General Screening' },
  { id: 'combo-02', name: 'Wound Infection Optimized Panel', sensors: 8, accuracy: 98.2, ttdAvgMin: 22, costPerRun: 18, targetApp: 'Wound & NPWT Care' },
  { id: 'combo-03', name: 'Rapid AMR Differentiation Panel', sensors: 12, accuracy: 96.8, ttdAvgMin: 25, costPerRun: 24, targetApp: 'Pharma & Hospital AMR' },
  { id: 'combo-04', name: 'Blood Culture Early Alert Panel', sensors: 10, accuracy: 97.5, ttdAvgMin: 18, costPerRun: 20, targetApp: 'BD-type Blood Culture' },
  { id: 'combo-05', name: 'High-Density 40-Combination Array', sensors: 40, accuracy: 99.4, ttdAvgMin: 15, costPerRun: 65, targetApp: 'Big Tech AI & Regulatory Gold' }
];

// Customer Solutions Dashboard Profiles
export const MOCK_CUSTOMER_SECTORS = [
  {
    id: 'dod',
    name: 'DoD / DHA / Military Medicine',
    tagline: 'Combat Wound Infection & Field Triage',
    focus: 'Rapid combat wound pathogen detection, severe burn/trauma infection, austere field deployment, and AMR surveillance.',
    recommendedVisualizations: ['Pathogen Coverage Map', 'Wound/Trauma Relevance Matrix', 'Time-to-Detection Ranking', 'Rugged Performance Score'],
    keyMetrics: [
      { label: 'Field TTD Average', value: '24 min' },
      { label: 'Combat Pathogen Coverage', value: '98.5%' },
      { label: 'Austere Temp Robustness', value: '25°C - 40°C' }
    ]
  },
  {
    id: 'wound-care',
    name: 'Wound-Care Product Companies',
    tagline: 'Smart Dressing Integration & Infection Early Alert',
    focus: 'Transforming traditional wound dressings into continuous smart infection monitors with zero false-positive rate.',
    recommendedVisualizations: ['Wound Pathogens Panel', 'Infected vs Non-Infected Headspace Curves', 'Ex Vivo Wound Validation', 'False-Positive Control'],
    keyMetrics: [
      { label: 'Smart Dressing Sensitivity', value: '97.8%' },
      { label: 'False-Positive Rate', value: '< 1.2%' },
      { label: 'Ex-Vivo Validation Cohorts', value: '14' }
    ]
  },
  {
    id: 'npwt',
    name: 'NPWT Companies (e.g. Solventum)',
    tagline: 'Smart NPWT Tubing & Effluent Infection Layer',
    focus: 'Integrating nanosensor channels into NPWT suction tubing and exudate canisters for real-time infection tracking during therapy.',
    recommendedVisualizations: ['NPWT Tubing Flow Headspace Curves', 'Sterile Tubing Blank Controls', 'Infected Wound Response', 'Threshold Alarm Map'],
    keyMetrics: [
      { label: 'Effluent Headspace TTD', value: '20 min' },
      { label: 'Tubing Background Subtraction', value: '99.1%' },
      { label: 'Continuous Run Stability', value: '7 days' }
    ]
  },
  {
    id: 'orthopedics',
    name: 'Orthopedic / Implant Companies (e.g. Zimmer Biomet)',
    tagline: 'Implant-Associated Infection & Biofilm Signature',
    focus: 'Detecting low-grade chronic prosthetic joint infections and mature surface biofilms before clinical symptoms manifest.',
    recommendedVisualizations: ['Implant Isolate Database', 'Biofilm vs Planktonic UMAP', 'Low Bacterial Burden Detection', 'Surface Material VOC Impact'],
    keyMetrics: [
      { label: 'Biofilm Detection Sensitivity', value: '96.4%' },
      { label: 'Low-Burden Limit (CFU/mL)', value: '< 100' },
      { label: 'Implant Isolate Count', value: '85' }
    ]
  },
  {
    id: 'blood-culture',
    name: 'BD / Blood Culture Companies',
    tagline: 'Ultra-Early Sepsis & Blood Culture Alert',
    focus: 'Accelerating time-to-detection in blood culture bottles by detecting headspace VOCs hours before CO2 gas production.',
    recommendedVisualizations: ['BD-like Media Controls', 'Blood Media VOC Background', 'Early Organism Recovery Signatures', 'Aerobic/Anaerobic Panel'],
    keyMetrics: [
      { label: 'Time Saved vs Standard Culture', value: '8 - 14 hrs' },
      { label: 'Aerobic & Anaerobic Accuracy', value: '98.9%' },
      { label: 'Fungal Sepsis Alert TTD', value: '45 min' }
    ]
  },
  {
    id: 'atcc',
    name: 'ATCC / Reference Biobanks',
    tagline: 'Standard Strain VOC Phenotype Mapping',
    focus: 'Expanding reference strain catalog from genome sequence to VOC phenotype & sensor kinetic fingerprints.',
    recommendedVisualizations: ['ATCC Strain VOC Profile', 'Strain-to-Strain Variance', 'Reference Standards QC', 'Genome-to-VOC Map'],
    keyMetrics: [
      { label: 'ATCC Reference Strains Ingested', value: '64' },
      { label: 'GC-MS Certified Features', value: '320' },
      { label: 'Replicate Reproducibility R²', value: '0.982' }
    ]
  },
  {
    id: 'pharma',
    name: 'Pharma / AMR Drug Developers',
    tagline: 'Rapid Functional AST & Antibiotic Kinetics',
    focus: 'Monitoring metabolic shutdowns under antibiotic exposure to accelerate drug candidate screening and AMR phenotyping.',
    recommendedVisualizations: ['Resistant vs Susceptible Kinetics', 'Antibiotic Pressure Curve', 'Metabolic Shift Map', 'Rapid AST Timeline'],
    keyMetrics: [
      { label: 'Functional AST Speed', value: '60 min' },
      { label: 'AMR Classification Accuracy', value: '97.2%' },
      { label: 'Antibiotic Panels Tested', value: '18' }
    ]
  },
  {
    id: 'big-tech',
    name: 'Big Tech / AI Cloud (e.g. Google / Amazon)',
    tagline: 'Biological Time-Series Foundation Models & API',
    focus: 'Providing multi-channel biological time-series training data, sensor embeddings, and API endpoints for AI foundation model training.',
    recommendedVisualizations: ['Time-Series API Endpoint Schema', 'Biological Embedding Space', 'Model Architecture Benchmarks', 'Multimodal Datasets'],
    keyMetrics: [
      { label: 'Time-Series Data Points', value: '4.8 Million' },
      { label: 'Multi-Channel Sensor Embeddings', value: '512-dim' },
      { label: 'REST / gRPC API Endpoints', value: '15' }
    ]
  }
];

// AI Model Registry & Benchmarks
export const MOCK_AI_MODELS = [
  {
    id: 'model-01',
    name: 'Pathogen Species Classifier v2.4',
    type: 'Multi-class Nanosensor Kinematics Transformer',
    target: 'Species Identification across 48 Pathogens',
    accuracy: 98.4,
    sensitivity: 97.9,
    specificity: 98.8,
    precision: 98.1,
    f1Score: 0.980,
    rocAuc: 0.994,
    domain: 'In Vitro & Ex Vivo',
    status: 'Locked / Regulatory Ready'
  },
  {
    id: 'model-02',
    name: 'Gram +/- / Fungi Rapid Triage',
    type: 'LightGBM Nanosensor Ensemble',
    target: '3-Way Gram Triage (Gram+, Gram-, Fungi)',
    accuracy: 99.1,
    sensitivity: 99.0,
    specificity: 99.3,
    precision: 99.2,
    f1Score: 0.991,
    rocAuc: 0.998,
    domain: 'Point-of-Care Triage',
    status: 'Validation Passed'
  },
  {
    id: 'model-03',
    name: 'AMR Resistance Phenotype Predictor',
    type: 'ResNet Nanosensor + VOC Feature Fusion',
    target: 'MRSA, VRE, CRE, CRAB Differentiation',
    accuracy: 96.7,
    sensitivity: 95.8,
    specificity: 97.4,
    precision: 96.2,
    f1Score: 0.960,
    rocAuc: 0.985,
    domain: 'Hospital & Pharma AST',
    status: 'Active R&D'
  },
  {
    id: 'model-04',
    name: 'Biofilm Maturation & Surface Detector',
    type: 'Temporal Graph Neural Network',
    target: 'Biofilm vs Planktonic Growth Phase',
    accuracy: 95.9,
    sensitivity: 94.7,
    specificity: 96.8,
    precision: 95.4,
    f1Score: 0.950,
    rocAuc: 0.978,
    domain: 'Orthopedics & Implant',
    status: 'Active R&D'
  }
];
