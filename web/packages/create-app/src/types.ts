export type Template = 'dashboard' | 'crud' | 'admin' | 'minimal';

export interface CreateAppOptions {
  name: string;
  template: Template;
  typescript: boolean;
  installDeps: boolean;
  git: boolean;
}

export interface TemplateFile {
  path: string;
  content: string;
}
