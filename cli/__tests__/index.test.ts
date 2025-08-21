/** @jest-environment node */
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import * as fs from 'node:fs';
import { runCli } from '../index.ts';

test('generates JSON from flags', () => {
  const out = runCli(['--prompt', 'hello', '--width', '123']);
  const obj = JSON.parse(out);
  expect(obj.prompt).toBe('hello');
  expect(obj.width).toBe(123);
});

test('generates JSON from file', () => {
  const file = join(tmpdir(), 'options.json');
  fs.writeFileSync(file, JSON.stringify({ prompt: 'from file', width: 456 }));
  const out = runCli(['--file', file]);
  const obj = JSON.parse(out);
  expect(obj.prompt).toBe('from file');
  expect(obj.width).toBe(456);
});

test('shows help with --help', () => {
  const out = runCli(['--help']);
  expect(out).toMatch(/Usage: sora-crafter/);
});

test('prints version with --version', () => {
  const version = JSON.parse(
    fs.readFileSync(join(__dirname, '../../package.json'), 'utf8'),
  ).version;
  expect(runCli(['--version']).trim()).toBe(version);
});

test('throws on unknown flag', () => {
  expect(() => runCli(['--unknown'])).toThrow(/Unknown flag/);
});

test('reads options from stdin when no flags are given', () => {
  const out = runCli([], JSON.stringify({ prompt: 'stdin', width: 321 }));
  const obj = JSON.parse(out);
  expect(obj.prompt).toBe('stdin');
  expect(obj.width).toBe(321);
});

test('writes output to file when --output is provided', () => {
  const file = join(tmpdir(), 'cli-output.json');
  const out = runCli(['--prompt', 'file test', '--output', file]);
  expect(out).toBe('');
  const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(obj.prompt).toBe('file test');
});

test('minifies JSON when --minify is set', () => {
  const out = runCli(['--prompt', 'mini', '--minify']);
  const parsed = JSON.parse(out);
  expect(out).toBe(JSON.stringify(parsed));
});
