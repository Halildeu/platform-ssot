import type { CreateAppOptions, Template, TemplateFile } from './types';
import { generateDashboardTemplate } from './templates/dashboard';
import { generateCrudTemplate } from './templates/crud';
import { generateAdminTemplate } from './templates/admin';
import { generateMinimalTemplate } from './templates/minimal';

/* ------------------------------------------------------------------ */
/*  Template routing                                                   */
/* ------------------------------------------------------------------ */

const generators: Record<Template, (name: string) => TemplateFile[]> = {
  dashboard: generateDashboardTemplate,
  crud: generateCrudTemplate,
  admin: generateAdminTemplate,
  minimal: generateMinimalTemplate,
};

export function generateTemplate(options: CreateAppOptions): TemplateFile[] {
  const generate = generators[options.template];
  if (!generate) {
    throw new Error(`Unknown template: ${options.template}`);
  }
  return generate(options.name);
}

/* ------------------------------------------------------------------ */
/*  Main entry                                                         */
/* ------------------------------------------------------------------ */

export async function createApp(options: CreateAppOptions): Promise<void> {
  const files = generateTemplate(options);
  // Would normally write files to disk
  // For now, return the file list
  console.log(`Created ${files.length} files for "${options.name}"`);
}

/* ------------------------------------------------------------------ */
/*  Re-exports                                                         */
/* ------------------------------------------------------------------ */

export type { CreateAppOptions, Template, TemplateFile } from './types';
export { generateDashboardTemplate } from './templates/dashboard';
export { generateCrudTemplate } from './templates/crud';
export { generateAdminTemplate } from './templates/admin';
export { generateMinimalTemplate } from './templates/minimal';
