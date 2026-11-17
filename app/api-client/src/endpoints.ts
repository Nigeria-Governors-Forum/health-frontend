
export const Endpoints = {
  auth: {
    login: "/user/login",
    register: "/user/register",
    profile: "/user/me",
  },
  dashboard: {
    summary: "/dashboard",
    flagship: "/dashboard/flagship",
  },
  demography: {
    summary: "/demography",
  },
  healthFacilities: {
    summary: "/health-facilities",
    zone: "/health-facilities/zonal",
  },
  healthInsurance: {
    summary: "/health-insurance",
    zone: "/health-insurance/zonal",
  },
  humanResource: {
    summary: "/human-resource",
    zone: "/human-resource/zonal",
  },
  partnersMapping: {
    summary: "/partners-mapping",
    zone: "/partners-mapping/zonal",
  },
  scorecard: {
    summary: "/scorecard",
  },
  healthFinance: {
    summary: "/health-finance",
    zone: "/health-finance/zonal",
  },
  healthOutcomes: {
    summary: "/health-outcomes",
    zone: "/health-outcomes/zonal",
  },
  serviceCoverage: {
    summary: "/service-coverage",
    zonal: "/service-coverage/zonal",
  },
  threatAssessment: {
    all: "/threat-assessment",
    summary: "/threat-assessment/summary",
    years: "/threat-assessment/years",
    bulk: "/threat-assessment/bulk",
    seed: (year?: number) =>
      year ? `/threat-assessment/seed?year=${year}` : "/threat-assessment/seed",
    upload: (year: number) => `/threat-assessment/upload/${year}`,
    byState: (state: string) => `/threat-assessment/state/${state}`,
    byZone: (zone: string) => `/threat-assessment/zone/${zone}`,
    byLga: (lga: string) => `/threat-assessment/lga/${lga}`,
    lgas: "/threat-assessment/lgas",
    byId: (id: number) => `/threat-assessment/${id}`,
  },
  users: {
    list: "/user",
    email: (id: string) => `/user/${id}`,
  },
  documents: {
    list: "/documents",
    upload: "/documents/upload",
  },
  health: {
    stats: "/stats",
    reports: "/reports",
  },
};
