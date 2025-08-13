/** @jest-environment node */
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readFileSync, writeFileSync } from 'node:fs';
import { runCli } from '../index.ts';

test('generates JSON from flags', () => {
  const out = runCli(['--prompt', 'hello', '--width', '123']);
  const obj = JSON.parse(out);
  expect(obj.prompt).toBe('hello');
  expect(obj.width).toBe(123);
});

test('generates JSON from file', () => {
  const file = join(tmpdir(), 'options.json');
  writeFileSync(file, JSON.stringify({ prompt: 'from file', width: 456 }));
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
    readFileSync(join(__dirname, '../../package.json'), 'utf8'),
  ).version;
  expect(runCli(['--version']).trim()).toBe(version);
});

test('throws on unknown flag', () => {
  expect(() => runCli(['--unknown'])).toThrow(/Unknown flag/);
});
