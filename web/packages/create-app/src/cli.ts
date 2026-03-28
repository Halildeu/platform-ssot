#!/usr/bin/env node
import { createApp } from './index';
import prompts from 'prompts';
import kleur from 'kleur';

async function main() {
  console.log(kleur.bold().cyan('\n  @mfe/create-app\n'));

  const args = process.argv.slice(2);
  const name = args[0];

  if (!name) {
    console.log(kleur.red('Usage: npx @mfe/create-app <app-name>'));
    process.exit(1);
  }

  const response = await prompts([
    {
      type: 'select',
      name: 'template',
      message: 'Select a template',
      choices: [
        { title: 'Dashboard', value: 'dashboard', description: 'KPI cards + charts + activity feed' },
        { title: 'CRUD', value: 'crud', description: 'List + detail + create/edit forms' },
        { title: 'Admin', value: 'admin', description: 'Settings + user management' },
        { title: 'Minimal', value: 'minimal', description: 'Bare minimum with design-system' },
      ],
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      initial: true,
    },
  ]);

  await createApp({ name, ...response, installDeps: true, git: true });
}

main().catch(console.error);
