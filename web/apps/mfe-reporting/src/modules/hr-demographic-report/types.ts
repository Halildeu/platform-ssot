export interface HrDemographicFilters {
  [key: string]: unknown;
  search: string;
  department: string;
  location: string;
  employmentType: string;
  gender: string;
  ageGroup: string;
  dateRange: { start: string; end: string } | null;
}

export interface HrDemographicRow {
  id: string;
  fullName: string;
  department: string;
  position: string;
  gender: 'Erkek' | 'Kadın' | 'Diğer';
  birthDate: string;
  age: number;
  education: string;
  maritalStatus: string;
  employmentType: string;
  hireDate: string;
  tenureYears: number;
  location: string;
  isManager: boolean;
  hasDisability: boolean;
  militaryStatus: string;
  generation: string;
  ethicsTrainingComplete: boolean;
  positionLevel: string;
}

export interface DemographicSummary {
  totalHeadcount: number;
  genderRatio: { male: number; female: number; other: number };
  avgAge: number;
  avgTenure: number;
  turnoverRate: number;
  deiScore: number;
  genderDistribution: Array<{ label: string; value: number }>;
  ageGroups: Array<{ label: string; value: number }>;
  educationLevels: Array<{ label: string; value: number }>;
  departments: Array<{ label: string; value: number }>;
  tenureDistribution: Array<{ label: string; value: number }>;
  employmentTypes: Array<{ label: string; value: number }>;
  generationDistribution: Array<{ label: string; value: number }>;
  disabilityRate: number;
  managerRatio: number;
  femaleManagerRate: number;

  // Temel Demografik (APQC HC-1) — ek metrikler
  maritalStatusDistribution: Array<{ label: string; value: number }>;
  militaryStatusDistribution: Array<{ label: string; value: number }>;
  disabilityDistribution: Array<{ label: string; value: number }>;

  // Organizasyonel (APQC HC-2) — ek metrikler
  locationDistribution: Array<{ label: string; value: number }>;
  positionLevelDistribution: Array<{ label: string; value: number }>;
  spanOfControl: number;

  // Isgucu Dinamikleri (APQC HC-4)
  absenteeismRate: number;
  timeToFillDays: number;
  internalTransferRate: number;
  promotionRate: number;
  voluntaryTurnoverRate: number;
  involuntaryTurnoverRate: number;

  // Etik & Uyum
  ethicsTrainingRate: number;
  whistleblowerCases: number;
  disciplinaryActions: Array<{ label: string; value: number }>;
  dataPrivacyComplianceRate: number;

  // Maas & Esitlik
  avgSalaryByGender: Array<{ label: string; value: number }>;
  genderPayGapPercent: number;

  // Yas piramidi
  agePyramid: Array<{ ageGroup: string; male: number; female: number }>;
}
