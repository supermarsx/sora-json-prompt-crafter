#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { generateJson } from '../src/lib/generateJson.ts';
import { loadOptionsFromJson } from '../src/lib/loadOptionsFromJson.ts';
import { DEFAULT_OPTIONS } from '../src/lib/defaultOptions.ts';
import { OPTION_FLAG_MAP } from '../src/lib/optionFlagMap.ts';
import type { SoraOptions } from '../src/lib/soraOptions.ts';

/**
 * Parse command-line arguments into a key-value map.
 *
 * @param argv - Arguments provided to the CLI.
 * @returns Object mapping flag names to their values or boolean presence.
 */
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

/**
 * Construct a complete options object from CLI flag values.
 *
 * @param values - Flag values supplied on the command line.
 * @returns Options merged with defaults and inferred enable flags.
 */
function buildOptionsFromFlags(
  values: Record<string, string | boolean>,
): SoraOptions {
  const updates: Partial<SoraOptions> = {};

  Object.entries(values).forEach(([key, value]) => {
    if (key === 'file') return;
    const typedKey = key as keyof SoraOptions;
    const defaultVal = DEFAULT_OPTIONS[typedKey];
    if (defaultVal === undefined) return;

    let parsed: unknown = value;
    if (typeof defaultVal === 'number') {
      parsed = Number(value);
    } else if (typeof defaultVal === 'boolean') {
      parsed = value === 'true' || value === true;
    } else if (Array.isArray(defaultVal)) {
      parsed = String(value).split(',');
    }

    // Cast to the specific option type before assignment
    updates[typedKey] = parsed as typeof defaultVal;

    const flag = OPTION_FLAG_MAP[key];
    if (flag) updates[flag] = true;
    if (key.startsWith('dnd_')) updates.use_dnd_section = true;
    if (key === 'width' || key === 'height') updates.use_dimensions = true;
  });

  return { ...DEFAULT_OPTIONS, ...updates };
}

/**
 * Entry point for the CLI.
 *
 * Parses flags, loads options from JSON input or file,
 * and outputs the generated JSON string.
 *
 * @param argv - CLI arguments excluding the node executable and script path.
 * @param stdinInput - Optional JSON string supplied via stdin (used in tests).
 * @returns Generated JSON string of active Sora options.
 */
export function runCli(argv: string[], stdinInput?: string): string {
  const args = parseArgs(argv);

  if (args.help) {
    return (
      'Usage: sora-crafter [options]\n' +
      '  --file <path>     Load options from JSON file\n' +
      '  --help            Show this help message\n' +
      '  --version         Show the package version\n'
    );
  }

  if (args.version) {
    const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
    return `${version}`;
  }

  const validKeys = new Set([
    'file',
    ...Object.keys(DEFAULT_OPTIONS),
  ]);

  const unknown = Object.keys(args).filter((k) => !validKeys.has(k));
  if (unknown.length) {
    throw new Error(`Unknown flag: --${unknown[0]}`);
  }

  let options: SoraOptions | null = null;

  if (typeof args.file === 'string') {
    try {
      const json = readFileSync(args.file, 'utf8');
      options = loadOptionsFromJson(json);
    } catch {
      options = null;
    }
  } else if (Object.keys(args).length === 0) {
    try {
      const json = stdinInput ?? readFileSync(0, 'utf8');
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
