Object.defineProperty(globalThis, 'import', { value: {} });
Object.defineProperty(globalThis.import, 'meta', { value: { env: {} } });

// Initialize i18next for component tests
import './src/i18n';
