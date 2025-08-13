#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { generateJson } from '../src/lib/generateJson.ts';
import { loadOptionsFromJson } from '../src/lib/loadOptionsFromJson.ts';
import { DEFAULT_OPTIONS } from '../src/lib/defaultOptions.ts';
import { OPTION_FLAG_MAP } from '../src/lib/optionFlagMap.ts';
import type { SoraOptions } from '../src/lib/soraOptions.ts';

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function buildOptionsFromFlags(values: Record<string, string | boolean>): SoraOptions {
  const updates: Partial<SoraOptions> = {};

  Object.entries(values).forEach(([key, value]) => {
    if (key === 'file') return;
    const defaultVal = DEFAULT_OPTIONS[key as keyof SoraOptions];
    if (defaultVal === undefined) return;

    let parsed: any = value;
    if (typeof defaultVal === 'number') {
      parsed = Number(value);
    } else if (typeof defaultVal === 'boolean') {
      parsed = value === 'true' || value === true;
    } else if (Array.isArray(defaultVal)) {
      parsed = String(value).split(',');
    }
    (updates as any)[key] = parsed;

    const flag = OPTION_FLAG_MAP[key];
    if (flag) (updates as any)[flag] = true;
    if (key.startsWith('dnd_')) (updates as any).use_dnd_section = true;
    if (key === 'width' || key === 'height') (updates as any).use_dimensions = true;
  });

  return { ...DEFAULT_OPTIONS, ...updates };
}

export function runCli(argv: string[]): string {
  const args = parseArgs(argv);

  let options: SoraOptions | null = null;

  if (typeof args.file === 'string') {
    try {
      const json = readFileSync(args.file, 'utf8');
      options = loadOptionsFromJson(json);
    } catch {
      options = null;
    }
  }

  if (!options) {
    options = buildOptionsFromFlags(args);
  }

  return generateJson(options);
}

if (process.argv[1]?.includes('cli/index')) {
  process.stdout.write(runCli(process.argv.slice(2)));
}
