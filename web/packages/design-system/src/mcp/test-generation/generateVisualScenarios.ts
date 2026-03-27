import type { MCPComponentInfo } from '../types';

export interface VisualScenario {
  name: string;
  theme: 'light' | 'dark';
  density: 'comfortable' | 'compact';
  props: Record<string, unknown>;
}

export function generateVisualScenarios(component: MCPComponentInfo): VisualScenario[] {
  const scenarios: VisualScenario[] = [];
  const themes: ('light' | 'dark')[] = ['light', 'dark'];
  const densities: ('comfortable' | 'compact')[] = ['comfortable', 'compact'];

  for (const theme of themes) {
    for (const density of densities) {
      scenarios.push({
        name: `${component.name}-${theme}-${density}`,
        theme,
        density,
        props: {},
      });
    }
  }

  // Add variant scenarios
  for (const prop of component.props) {
    if (prop.type.includes("'") && prop.type.includes('|')) {
      const values = prop.type.split('|').map(v => v.trim().replace(/'/g, '')).filter(Boolean);
      for (const value of values.slice(0, 3)) {
        scenarios.push({
          name: `${component.name}-${prop.name}-${value}`,
          theme: 'light',
          density: 'comfortable',
          props: { [prop.name]: value },
        });
      }
    }
  }

  return scenarios;
}
