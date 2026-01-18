/** @jest-environment node */
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import * as fs from 'node:fs';
import { runCli } from '../index.ts';
import { deserializeOptions } from '../../src/lib/urlOptions.ts';

test('generates JSON from flags', async () => {
  const out = await runCli(['--prompt', 'hello', '--width', '123']);
  const obj = JSON.parse(out);
  expect(obj.prompt).toBe('hello');
  expect(obj.width).toBe(123);
});

test('generates JSON from file', async () => {
  const file = join(tmpdir(), 'options.json');
  fs.writeFileSync(file, JSON.stringify({ prompt: 'from file', width: 456 }));
  const out = await runCli(['--file', file]);
  const obj = JSON.parse(out);
  expect(obj.prompt).toBe('from file');
  expect(obj.width).toBe(456);
});

test('shows help with --help', async () => {
  const out = await runCli(['--help']);
  expect(out).toMatch(/Usage: sora-crafter/);
  expect(out).toMatch(/--share-url/);
});

test('prints version with --version', async () => {
  const version = JSON.parse(
    fs.readFileSync(join(__dirname, '../../package.json'), 'utf8'),
  ).version;
  expect((await runCli(['--version'])).trim()).toBe(version);
});

test('throws on unknown flag', async () => {
  await expect(runCli(['--unknown'])).rejects.toThrow(/Unknown flag/);
});

test('reads options from stdin when no flags are given', async () => {
  const out = await runCli([], JSON.stringify({ prompt: 'stdin', width: 321 }));
  const obj = JSON.parse(out);
  expect(obj.prompt).toBe('stdin');
  expect(obj.width).toBe(321);
});

test('writes output to file when --output is provided', async () => {
  const file = join(tmpdir(), 'cli-output.json');
  const out = await runCli(['--prompt', 'file test', '--output', file]);
  expect(out).toBe('');
  const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(obj.prompt).toBe('file test');
});

test('minifies JSON when --minify is set', async () => {
  const out = await runCli(['--prompt', 'mini', '--minify']);
  const parsed = JSON.parse(out);
  expect(out).toBe(JSON.stringify(parsed));
});

test('loads options from url', async () => {
  const mockResponse = { prompt: 'from url', width: 789 };
  const mockFetch = jest
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue({
      text: async () => JSON.stringify(mockResponse),
    } as unknown as Response);

  const out = await runCli(['--url', 'https://example.com/data.json']);
  const obj = JSON.parse(out);
  expect(mockFetch).toHaveBeenCalledWith('https://example.com/data.json');
  expect(obj.prompt).toBe('from url');
  expect(obj.width).toBe(789);
  mockFetch.mockRestore();
});

test('falls back to defaults when url fetch fails', async () => {
  const mockFetch = jest
    .spyOn(globalThis, 'fetch')
    .mockRejectedValue(new Error('network'));
  const out = await runCli(['--url', 'https://example.com/data.json']);
  const obj = JSON.parse(out);
  expect(obj.prompt).toBeDefined();
  expect(obj.prompt.length).toBeGreaterThan(0);
  mockFetch.mockRestore();
});

test('outputs share URL when --share-url is provided', async () => {
  const out = await runCli(['--prompt', 'share', '--width', '111', '--share-url']);
  const url = new URL(out.trim());
  expect(url.searchParams.get('ref')).toBe('share');
  const decoded = deserializeOptions(url.hash.slice(1));
  expect(decoded?.prompt).toBe('share');
  expect(decoded?.width).toBe(111);
});

test('writes share URL to file when --share-url and --output are provided', async () => {
  const file = join(tmpdir(), 'share-url.txt');
  const out = await runCli([
    '--prompt',
    'file share',
    '--share-url',
    '--output',
    file,
  ]);
  expect(out).toBe('');
  const url = new URL(fs.readFileSync(file, 'utf8').trim());
  const decoded = deserializeOptions(url.hash.slice(1));
  expect(decoded?.prompt).toBe('file share');
});
