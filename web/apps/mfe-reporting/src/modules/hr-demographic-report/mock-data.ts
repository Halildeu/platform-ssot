import type { HrDemographicRow, DemographicSummary } from './types';

// ---------------------------------------------------------------------------
// Seeded pseudo-random generator (simple mulberry32)
// ---------------------------------------------------------------------------
function createRng(seed: number) {
  let s = seed | 0;
  return (): number => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller for normal distribution
function normalRandom(rng: () => number, mean: number, std: number): number {
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
  return mean + z * std;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// ---------------------------------------------------------------------------
// Name pools
// ---------------------------------------------------------------------------
const FIRST_NAMES_MALE = [
  'Ahmet', 'Mehmet', 'Mustafa', 'Ali', 'Hüseyin', 'Hasan', 'İbrahim', 'İsmail',
  'Yusuf', 'Osman', 'Murat', 'Ömer', 'Ramazan', 'Halil', 'Süleyman', 'Abdullah',
  'Recep', 'Fatih', 'Emre', 'Burak', 'Serkan', 'Kadir', 'Cem', 'Onur', 'Erhan',
  'Tolga', 'Baran', 'Deniz', 'Enes', 'Kaan', 'Tuncay', 'Volkan', 'Kerem',
  'Barış', 'Uğur', 'Gökhan', 'Selim', 'Furkan', 'Taha', 'Yiğit', 'Can',
  'Berkay', 'Caner', 'Batuhan', 'Doğukan', 'Emir', 'Koray', 'Alp', 'Çağrı',
  'Oğuz', 'Tarık', 'Eren',
] as const;

const FIRST_NAMES_FEMALE = [
  'Fatma', 'Ayşe', 'Emine', 'Hatice', 'Zeynep', 'Elif', 'Meryem', 'Şerife',
  'Zehra', 'Sultan', 'Hanife', 'Havva', 'Merve', 'Büşra', 'Esra', 'Derya',
  'Selin', 'Gül', 'Aslı', 'Ebru', 'Pınar', 'Özlem', 'Sevgi', 'Sibel', 'Dilek',
  'Ece', 'İrem', 'Başak', 'Ceren', 'Damla', 'Gizem', 'Tuğçe', 'Melike',
  'Nur', 'Yasemin', 'Burcu', 'Beyza', 'Simge', 'Cansu', 'Duygu', 'Hande',
  'İlknur', 'Seda', 'Şeyma', 'Nihal', 'Serap', 'Elif', 'Berfin', 'Ezgi',
  'Aleyna', 'Deniz', 'Naz',
] as const;

const LAST_NAMES = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk',
  'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara',
  'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Korkmaz', 'Acar', 'Güneş',
  'Tekin', 'Akın', 'Aktaş', 'Erdoğan', 'Yalçın', 'Esen', 'Kaplan', 'Taş',
  'Karaca', 'Güler', 'Bulut', 'Karataş', 'Sarı', 'Bozkurt', 'Aksoy', 'Turan',
  'Çalışkan', 'Bayram', 'Erdem', 'Yavuz', 'Toprak', 'Altın', 'Duman', 'Uçar',
  'Peker', 'Başaran', 'Avcı', 'Tuncer',
] as const;

const DEPARTMENTS = [
  'Finans', 'İnsan Kaynakları', 'Bilgi Teknolojileri', 'Satış',
  'Pazarlama', 'Üretim', 'Hukuk', 'Lojistik',
] as const;

const POSITIONS_BY_DEPT: Record<string, readonly string[]> = {
  Finans: ['Finans Uzmanı', 'Muhasebe Sorumlusu', 'Bütçe Analisti', 'Mali Müşavir'],
  'İnsan Kaynakları': ['İK Uzmanı', 'İK Koordinatörü', 'Eğitim Uzmanı', 'Bordro Sorumlusu'],
  'Bilgi Teknolojileri': ['Yazılım Geliştirici', 'Sistem Yöneticisi', 'Veri Analisti', 'DevOps Mühendisi', 'QA Mühendisi'],
  Satış: ['Satış Temsilcisi', 'Bölge Müdürü', 'Satış Koordinatörü', 'Anahtar Müşteri Yöneticisi'],
  Pazarlama: ['Pazarlama Uzmanı', 'Dijital Pazarlama Uzmanı', 'İçerik Editörü', 'Marka Yöneticisi'],
  Üretim: ['Üretim Operatörü', 'Kalite Kontrol Uzmanı', 'Bakım Teknisyeni', 'Vardiya Amiri'],
  Hukuk: ['Hukuk Danışmanı', 'Sözleşme Uzmanı', 'Uyum Yöneticisi'],
  Lojistik: ['Lojistik Uzmanı', 'Depo Sorumlusu', 'Sevkiyat Koordinatörü', 'Tedarik Zinciri Analisti'],
};

const LOCATIONS = ['İstanbul', 'Ankara', 'İzmir'] as const;

const EDUCATION_LEVELS = ['İlkokul', 'Lise', 'Lisans', 'Yüksek Lisans', 'Doktora'] as const;
const EDUCATION_WEIGHTS = [3, 25, 45, 20, 7] as const;

const EMPLOYMENT_TYPES = ['Tam Zamanlı', 'Yarı Zamanlı', 'Sözleşmeli', 'Stajyer'] as const;
const EMPLOYMENT_WEIGHTS = [75, 10, 10, 5] as const;

const MARITAL_STATUSES = ['Bekar', 'Evli', 'Boşanmış'] as const;

const POSITION_LEVELS = ['Uzman', 'Kıdemli Uzman', 'Müdür', 'Direktör', 'Genel Müdür Yrd.'] as const;
const POSITION_LEVEL_WEIGHTS = [60, 20, 12, 5, 3] as const;

// ---------------------------------------------------------------------------
// Generation derivation
// ---------------------------------------------------------------------------
function getGeneration(birthYear: number): string {
  if (birthYear >= 1997) return 'Gen Z';
  if (birthYear >= 1981) return 'Milenyum';
  if (birthYear >= 1965) return 'Gen X';
  return 'Baby Boomer';
}

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------
export function generateMockEmployees(count: number): HrDemographicRow[] {
  const rng = createRng(42);
  const currentYear = 2026;
  const rows: HrDemographicRow[] = [];

  for (let i = 0; i < count; i++) {
    const isFemale = rng() < 0.48;
    const gender: HrDemographicRow['gender'] = isFemale ? 'Kadın' : 'Erkek';
    const firstName = isFemale
      ? pick(FIRST_NAMES_FEMALE, rng)
      : pick(FIRST_NAMES_MALE, rng);
    const lastName = pick(LAST_NAMES, rng);
    const fullName = `${firstName} ${lastName}`;

    const age = Math.round(clamp(normalRandom(rng, 34, 8), 20, 62));
    const birthYear = currentYear - age;
    const birthMonth = Math.floor(rng() * 12) + 1;
    const birthDay = Math.floor(rng() * 28) + 1;
    const birthDate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    const department = pick(DEPARTMENTS, rng);
    const position = pick(POSITIONS_BY_DEPT[department] ?? ['Uzman'], rng);
    const location = pick(LOCATIONS, rng);

    const education = weightedPick(EDUCATION_LEVELS, [...EDUCATION_WEIGHTS], rng);
    const employmentType = weightedPick(EMPLOYMENT_TYPES, [...EMPLOYMENT_WEIGHTS], rng);

    // Tenure: log-normal, capped by (age - 18)
    const maxTenure = Math.max(1, age - 18);
    const rawTenure = Math.exp(normalRandom(rng, 1.5, 0.8));
    const tenureYears = Math.round(clamp(rawTenure, 0, maxTenure) * 10) / 10;

    const hireYear = currentYear - Math.round(tenureYears);
    const hireMonth = Math.floor(rng() * 12) + 1;
    const hireDay = Math.floor(rng() * 28) + 1;
    const hireDate = `${hireYear}-${String(hireMonth).padStart(2, '0')}-${String(hireDay).padStart(2, '0')}`;

    const maritalStatus = pick(MARITAL_STATUSES, rng);
    const positionLevel = weightedPick(POSITION_LEVELS, [...POSITION_LEVEL_WEIGHTS], rng);
    const isManager = rng() < 0.12;
    const hasDisability = rng() < 0.04;
    const ethicsTrainingComplete = rng() < 0.88;

    let militaryStatus = 'Yok';
    if (gender === 'Erkek') {
      const mRoll = rng();
      if (mRoll < 0.70) militaryStatus = 'Yapıldı';
      else if (mRoll < 0.90) militaryStatus = 'Tecilli';
      else militaryStatus = 'Muaf';
    }

    const generation = getGeneration(birthYear);

    rows.push({
      id: `EMP-${String(i + 1).padStart(4, '0')}`,
      fullName,
      department,
      position,
      gender,
      birthDate,
      age,
      education,
      maritalStatus,
      employmentType,
      hireDate,
      tenureYears,
      location,
      isManager,
      hasDisability,
      militaryStatus,
      generation,
      ethicsTrainingComplete,
      positionLevel,
    });
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Summary computation
// ---------------------------------------------------------------------------
function countBy<T>(arr: readonly T[], keyFn: (item: T) => string): Array<{ label: string; value: number }> {
  const map = new Map<string, number>();
  for (const item of arr) {
    const key = keyFn(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));
}

function getAgeGroup(age: number): string {
  if (age < 25) return '20-24';
  if (age < 30) return '25-29';
  if (age < 35) return '30-34';
  if (age < 40) return '35-39';
  if (age < 45) return '40-44';
  if (age < 50) return '45-49';
  return '50+';
}

function getAgePyramidGroup(age: number): string {
  if (age < 25) return '20-24';
  if (age < 30) return '25-29';
  if (age < 35) return '30-34';
  if (age < 40) return '35-39';
  if (age < 45) return '40-44';
  if (age < 50) return '45-49';
  if (age < 55) return '50-54';
  if (age < 60) return '55-59';
  return '60+';
}

const AGE_PYRAMID_ORDER = ['20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'];

function getTenureGroup(years: number): string {
  if (years < 1) return '<1 yıl';
  if (years < 3) return '1-3 yıl';
  if (years < 5) return '3-5 yıl';
  if (years < 10) return '5-10 yıl';
  return '10+ yıl';
}

export function computeSummary(rows: HrDemographicRow[]): DemographicSummary {
  const total = rows.length;
  const males = rows.filter((r) => r.gender === 'Erkek').length;
  const females = rows.filter((r) => r.gender === 'Kadın').length;
  const _others = total - males - females;

  const malePercent = Math.round((males / total) * 100);
  const femalePercent = Math.round((females / total) * 100);
  const otherPercent = 100 - malePercent - femalePercent;

  const avgAge = rows.reduce((sum, r) => sum + r.age, 0) / total;
  const avgTenure = rows.reduce((sum, r) => sum + r.tenureYears, 0) / total;

  const managers = rows.filter((r) => r.isManager);
  const femaleManagers = managers.filter((r) => r.gender === 'Kadın');
  const femaleManagerRate = managers.length > 0
    ? Math.round((femaleManagers.length / managers.length) * 100)
    : 0;

  const disabilityCount = rows.filter((r) => r.hasDisability).length;
  const disabilityRate = Math.round((disabilityCount / total) * 1000) / 10;
  const managerRatio = Math.round((managers.length / total) * 1000) / 10;

  // Simple DEI score: gender balance (40%) + disability compliance (30%) + female manager rate (30%)
  const genderBalance = 100 - Math.abs(50 - femalePercent) * 2;
  const disabilityCompliance = Math.min(100, (disabilityRate / 3) * 100);
  const fmScore = Math.min(100, (femaleManagerRate / 50) * 100);
  const deiScore = Math.round(genderBalance * 0.4 + disabilityCompliance * 0.3 + fmScore * 0.3);

  // Simulated turnover rate
  const turnoverRate = 14.2;

  // --- New APQC metric computations ---

  // Temel Demografik (HC-1)
  const maritalStatusDistribution = countBy(rows, (r) => r.maritalStatus);
  const maleRows = rows.filter((r) => r.gender === 'Erkek');
  const militaryStatusDistribution = countBy(maleRows, (r) => r.militaryStatus);
  const disabledCount = rows.filter((r) => r.hasDisability).length;
  const disabilityDistribution = [
    { label: 'Var', value: disabledCount },
    { label: 'Yok', value: total - disabledCount },
  ];

  // Organizasyonel (HC-2)
  const locationDistribution = countBy(rows, (r) => r.location);
  const positionLevelDistribution = countBy(rows, (r) => r.positionLevel);
  const spanOfControl = managers.length > 0
    ? Math.round((total / managers.length) * 10) / 10
    : 0;

  // Isgucu Dinamikleri (HC-4) — simulated realistic values
  const absenteeismRate = 4.2;
  const timeToFillDays = 38;
  const internalTransferRate = 8.5;
  const promotionRate = 6.2;
  const voluntaryTurnoverRate = 9.1;
  const involuntaryTurnoverRate = 2.9;

  // Etik & Uyum
  const ethicsTrainingRate = Math.round(
    (rows.filter((r) => r.ethicsTrainingComplete).length / total) * 1000,
  ) / 10;
  const whistleblowerCases = 7;
  const disciplinaryActions = [
    { label: 'Uyarı', value: 12 },
    { label: 'Kınama', value: 4 },
    { label: 'Fesih', value: 2 },
  ];
  const dataPrivacyComplianceRate = 94.5;

  // Maas & Esitlik
  const avgSalaryByGender = [
    { label: 'Erkek', value: 28500 },
    { label: 'Kadın', value: 26800 },
  ];
  const genderPayGapPercent = 5.9;

  // Yas Piramidi
  const pyramidMap = new Map<string, { male: number; female: number }>();
  for (const g of AGE_PYRAMID_ORDER) {
    pyramidMap.set(g, { male: 0, female: 0 });
  }
  for (const r of rows) {
    const grp = getAgePyramidGroup(r.age);
    const entry = pyramidMap.get(grp);
    if (entry) {
      if (r.gender === 'Erkek') entry.male++;
      else if (r.gender === 'Kadın') entry.female++;
    }
  }
  const agePyramid = AGE_PYRAMID_ORDER.map((g) => ({
    ageGroup: g,
    ...(pyramidMap.get(g) ?? { male: 0, female: 0 }),
  }));

  return {
    totalHeadcount: total,
    genderRatio: { male: malePercent, female: femalePercent, other: otherPercent },
    avgAge,
    avgTenure,
    turnoverRate,
    deiScore,
    genderDistribution: countBy(rows, (r) => r.gender),
    ageGroups: countBy(rows, (r) => getAgeGroup(r.age)),
    educationLevels: countBy(rows, (r) => r.education),
    departments: countBy(rows, (r) => r.department),
    tenureDistribution: countBy(rows, (r) => getTenureGroup(r.tenureYears)),
    employmentTypes: countBy(rows, (r) => r.employmentType),
    generationDistribution: countBy(rows, (r) => r.generation),
    disabilityRate,
    managerRatio,
    femaleManagerRate,

    // APQC HC-1
    maritalStatusDistribution,
    militaryStatusDistribution,
    disabilityDistribution,

    // APQC HC-2
    locationDistribution,
    positionLevelDistribution,
    spanOfControl,

    // APQC HC-4
    absenteeismRate,
    timeToFillDays,
    internalTransferRate,
    promotionRate,
    voluntaryTurnoverRate,
    involuntaryTurnoverRate,

    // Etik & Uyum
    ethicsTrainingRate,
    whistleblowerCases,
    disciplinaryActions,
    dataPrivacyComplianceRate,

    // Maas & Esitlik
    avgSalaryByGender,
    genderPayGapPercent,

    // Yas piramidi
    agePyramid,
  };
}
