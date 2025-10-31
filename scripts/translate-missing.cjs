const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const localesDir = path.join(__dirname, '..', 'src', 'locales');
const baseLocalePath = path.join(localesDir, 'en-US.json');
const baseData = JSON.parse(fs.readFileSync(baseLocalePath, 'utf8'));

const languageMap = {
  'bn-IN': 'bn',
  'da-DK': 'da',
  'de-AT': 'de',
  'de-DE': 'de',
  'el-GR': 'el',
  'es-AR': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  'et-EE': 'et',
  'fi-FI': 'fi',
  'fr-BE': 'fr',
  'fr-FR': 'fr',
  'it-IT': 'it',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'ne-NP': 'ne',
  'pt-BR': 'pt',
  'pt-PT': 'pt',
  'ro-RO': 'ro',
  'ru-RU': 'ru',
  'sv-SE': 'sv',
  'th-TH': 'th',
  'uk-UA': 'uk',
  'zh-CN': 'zh-CN',
};

const placeholderRegex = /\{\{[^}]+\}\}/g;
const BATCH_SIZE = 1;

const targetKeys = new Set([
  'general',
  'sponsor',
  'github',
  'star',
  'fork',
  'issues',
  'githubStatsError',
  'urlPlaceholder',
  'fetch',
  'requestBlocked',
  'presetPackUrl',
  'loadPresets',
  'presetsLoaded',
  'failedToLoadPresets',
  'presets',
  'noPresets',
  'savePreset',
  'presetNamePrompt',
  'exportPresets',
  'importPresets',
  'presetsExported',
  'presetsImported',
  'presetsUpdated',
  'presetsCleared',
  'invalidPresetFile',
]);

const maskPlaceholders = (text) => {
  const placeholders = [];
  const masked = text.replace(placeholderRegex, (match, idx) => {
    const token = `__VAR${idx}__`;
    placeholders.push({ token, value: match });
    return token;
  });
  return { masked, placeholders };
};

const unmaskPlaceholders = (text, placeholders) => {
  let result = text;
  for (const { token, value } of placeholders) {
    result = result.replaceAll(token, value);
  }
  return result;
};

const gatherTranslations = (baseObj, localeObj, pathKeys = [], results = []) => {
  for (const key of Object.keys(baseObj)) {
    const baseVal = baseObj[key];
    const localeVal = localeObj?.[key];
    const nextPath = [...pathKeys, key];
    if (typeof baseVal === 'string') {
      if (!targetKeys.has(key)) continue;
      if (typeof localeVal !== 'string') continue;
      if (localeVal === baseVal) {
        const { masked, placeholders } = maskPlaceholders(baseVal);
        results.push({ path: nextPath, masked, placeholders });
      }
    } else if (baseVal && typeof baseVal === 'object' && !Array.isArray(baseVal)) {
      if (!localeVal || typeof localeVal !== 'object') continue;
      gatherTranslations(baseVal, localeVal, nextPath, results);
    }
  }
  return results;
};

const setByPath = (obj, pathKeys, value) => {
  let current = obj;
  for (let i = 0; i < pathKeys.length - 1; i++) {
    current = current[pathKeys[i]];
  }
  current[pathKeys[pathKeys.length - 1]] = value;
};

const fixPlaceholders = (baseObj, localeObj) => {
  for (const key of Object.keys(baseObj)) {
    const baseVal = baseObj[key];
    const localeVal = localeObj?.[key];
    if (typeof baseVal === 'string' && typeof localeVal === 'string') {
      const basePlaceholders = baseVal.match(placeholderRegex) || [];
      if (!basePlaceholders.length) continue;
      const localePlaceholders = localeVal.match(placeholderRegex) || [];
      let updated = localeVal;
      if (
        localePlaceholders.length !== basePlaceholders.length ||
        localePlaceholders.some((ph, idx) => ph !== basePlaceholders[idx])
      ) {
        let idx = 0;
        updated = localeVal.replace(placeholderRegex, () => {
          const replacement = basePlaceholders[idx] ?? basePlaceholders[basePlaceholders.length - 1];
          idx += 1;
          return replacement;
        });
        if (localePlaceholders.length === 0) {
          // If placeholders were missing entirely, append them at the end in order.
          const suffix = basePlaceholders.join(' ');
          updated = `${localeVal} ${suffix}`.trim();
        }
      }
      if (updated !== localeVal) {
        localeObj[key] = updated;
      }
    } else if (baseVal && typeof baseVal === 'object' && !Array.isArray(baseVal) && localeVal) {
      fixPlaceholders(baseVal, localeVal);
    }
  }
};

const MARKER = '@@@';

const translateBatch = (texts, targetLang) => {
  if (!texts.length) return [];
  const query = texts
    .map((text, idx) => `${MARKER}${idx}${MARKER}\n${text}\n`)
    .join('');
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t&dj=1&source=input&tl=' +
    encodeURIComponent(targetLang) +
    '&q=' +
    encodeURIComponent(query);
  const output = execFileSync(
    'curl',
    ['-s', '--max-time', '15', '--retry', '3', '--retry-delay', '1', url],
    { encoding: 'utf8' },
  );
  const data = JSON.parse(output);
  const combined = (data.sentences || []).map((s) => s.trans).join('');
  return extractByMarkers(combined, texts.length);
};

const extractByMarkers = (combined, expected) => {
  const results = new Array(expected).fill('');
  const regex = /@@@(\d+)@@@/g;
  let match;
  let currentId = null;
  let lastIndex = 0;
  while ((match = regex.exec(combined)) !== null) {
    if (currentId !== null) {
      results[currentId] += combined.slice(lastIndex, match.index);
    }
    currentId = Number(match[1]);
    lastIndex = regex.lastIndex;
  }
  if (currentId !== null) {
    results[currentId] += combined.slice(lastIndex);
  }
  return results.map((str) => str.replace(/^[\s\n]+|[\s\n]+$/g, ''));
};

const chunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const onlyLocale = process.argv[2];

const localeFiles = fs
  .readdirSync(localesDir)
  .filter((file) => file.endsWith('.json') && !file.startsWith('en-'))
  .filter((file) => !onlyLocale || file === onlyLocale);

for (const file of localeFiles) {
  const localeName = path.basename(file, '.json');
  const targetLang = languageMap[localeName];
  if (!targetLang) continue;
  const localePath = path.join(localesDir, file);
  const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  const entries = gatherTranslations(baseData, localeData);
  if (!entries.length) {
    fixPlaceholders(baseData, localeData);
    fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2) + '\n');
    continue;
  }
  console.log(`Translating ${file} (${entries.length} strings)...`);
  const batches = chunk(entries, BATCH_SIZE);
  for (const batch of batches) {
    const translations = translateBatch(
      batch.map((item) => item.masked),
      targetLang,
    );
    if (translations.length !== batch.length) {
      throw new Error(
        `Translation length mismatch for ${file}: expected ${batch.length} got ${translations.length}`,
      );
    }
    for (let i = 0; i < batch.length; i++) {
      const translated = unmaskPlaceholders(translations[i], batch[i].placeholders);
      setByPath(localeData, batch[i].path, translated);
    }
  }
  console.log(`Translated ${file}.`);
  fixPlaceholders(baseData, localeData);
  fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2) + '\n');
}
