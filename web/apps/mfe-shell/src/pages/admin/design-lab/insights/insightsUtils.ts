/* ------------------------------------------------------------------ */
/*  insightsUtils — Priority scoring, trend calculation, mock data     */
/*                                                                     */
/*  Provides simulated adoption data for design system components.     */
/*  In production this would come from telemetry / analytics API.      */
/* ------------------------------------------------------------------ */

export type AdoptionEntry = {
  component: string;
  apps: Record<string, boolean>; // appName → isUsed
  weeklyTrend: number[];         // last 12 weeks usage count
  status: "rising" | "stable" | "declining";
  documented: boolean;
  priority: number;              // 0-100
};

export const CONSUMER_APPS = [
  "shell",
  "crm",
  "finance",
  "hr",
  "analytics",
  "portal",
];

/* ---- Mock adoption data ---- */

const COMPONENTS: Array<{
  name: string;
  apps: string[];
  trend: number[];
  documented: boolean;
}> = [
  { name: "Button", apps: ["shell", "crm", "finance", "hr", "analytics", "portal"], trend: [120, 125, 130, 128, 135, 140, 142, 145, 150, 155, 160, 165], documented: true },
  { name: "Input", apps: ["shell", "crm", "finance", "hr", "analytics", "portal"], trend: [100, 102, 105, 108, 110, 112, 115, 118, 120, 122, 125, 128], documented: true },
  { name: "Select", apps: ["shell", "crm", "finance", "hr", "analytics"], trend: [60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88], documented: true },
  { name: "Modal", apps: ["shell", "crm", "finance", "hr"], trend: [30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58], documented: true },
  { name: "Alert", apps: ["shell", "crm", "finance", "analytics"], trend: [20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48], documented: true },
  { name: "Toast", apps: ["shell", "crm", "portal"], trend: [10, 12, 15, 18, 22, 26, 30, 35, 40, 45, 50, 55], documented: true },
  { name: "Tabs", apps: ["shell", "crm", "analytics", "portal"], trend: [40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62], documented: true },
  { name: "Pagination", apps: ["shell", "crm", "finance"], trend: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], documented: true },
  { name: "Checkbox", apps: ["shell", "crm", "finance", "hr", "portal"], trend: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], documented: true },
  { name: "Switch", apps: ["shell", "crm", "hr"], trend: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 25, 28], documented: true },
  { name: "Badge", apps: ["shell", "crm", "portal"], trend: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], documented: true },
  { name: "Avatar", apps: ["shell", "crm"], trend: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], documented: true },
  { name: "Tooltip", apps: ["shell", "crm", "finance", "analytics"], trend: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], documented: true },
  { name: "Divider", apps: ["shell", "crm", "finance", "hr", "analytics", "portal"], trend: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50], documented: false },
  { name: "Skeleton", apps: ["shell", "crm"], trend: [5, 6, 7, 8, 10, 12, 15, 18, 22, 26, 30, 35], documented: false },
  { name: "Drawer", apps: ["shell"], trend: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], documented: false },
  { name: "Popover", apps: ["shell", "crm"], trend: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], documented: false },
  { name: "DataTable", apps: ["shell", "crm", "finance", "analytics"], trend: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42], documented: false },
  { name: "FileUpload", apps: ["shell", "hr"], trend: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7], documented: false },
  { name: "ColorPicker", apps: ["shell"], trend: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4], documented: false },
  { name: "Stepper", apps: ["shell", "finance"], trend: [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10], documented: false },
  { name: "Timeline", apps: ["shell", "crm"], trend: [8, 8, 9, 9, 10, 10, 8, 7, 6, 5, 4, 3], documented: false },
  { name: "TreeView", apps: ["shell"], trend: [6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1], documented: false },
];

function getStatus(trend: number[]): "rising" | "stable" | "declining" {
  const first = trend.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
  const last = trend.slice(-4).reduce((a, b) => a + b, 0) / 4;
  const change = (last - first) / (first || 1);
  if (change > 0.15) return "rising";
  if (change < -0.10) return "declining";
  return "stable";
}

function calcPriority(entry: { apps: string[]; documented: boolean; trend: number[]; status: string }): number {
  let score = 0;
  // More apps = higher priority if undocumented
  score += entry.apps.length * 10;
  // Rising trend bonus
  if (entry.status === "rising") score += 20;
  if (entry.status === "declining") score -= 10;
  // Undocumented penalty (higher priority to document)
  if (!entry.documented) score += 25;
  // Recent usage volume
  const recentAvg = entry.trend.slice(-4).reduce((a, b) => a + b, 0) / 4;
  score += Math.min(recentAvg / 5, 20);
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getAdoptionData(): AdoptionEntry[] {
  return COMPONENTS.map((c) => {
    const apps: Record<string, boolean> = {};
    CONSUMER_APPS.forEach((app) => {
      apps[app] = c.apps.includes(app);
    });
    const status = getStatus(c.trend);
    return {
      component: c.name,
      apps,
      weeklyTrend: c.trend,
      status,
      documented: c.documented,
      priority: calcPriority({ ...c, status }),
    };
  });
}

export function getTopRising(data: AdoptionEntry[], limit = 5): AdoptionEntry[] {
  return data
    .filter((d) => d.status === "rising")
    .sort((a, b) => {
      const aGrowth = a.weeklyTrend[a.weeklyTrend.length - 1] - a.weeklyTrend[0];
      const bGrowth = b.weeklyTrend[b.weeklyTrend.length - 1] - b.weeklyTrend[0];
      return bGrowth - aGrowth;
    })
    .slice(0, limit);
}

export function getTopDeclining(data: AdoptionEntry[], limit = 5): AdoptionEntry[] {
  return data
    .filter((d) => d.status === "declining")
    .sort((a, b) => {
      const aDecline = a.weeklyTrend[0] - a.weeklyTrend[a.weeklyTrend.length - 1];
      const bDecline = b.weeklyTrend[0] - b.weeklyTrend[b.weeklyTrend.length - 1];
      return bDecline - aDecline;
    })
    .slice(0, limit);
}

export function getUndocumentedBacklog(data: AdoptionEntry[]): AdoptionEntry[] {
  return data
    .filter((d) => !d.documented)
    .sort((a, b) => b.priority - a.priority);
}
