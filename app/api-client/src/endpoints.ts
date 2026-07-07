
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
  humanResource: {
    summary: "/human-resource",
  },
  scorecard: {
    summary: "/scorecard",
  },
  healthFinance: {
    summary: "/health-finance",
    zone: "/health-finance/zonal",
  },
  serviceCoverage: {
    summary: "/service-coverage",
    zonal: "/service-coverage/zonal",
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
