import { safeGet } from './storage';
import { CUSTOM_CSS, CUSTOM_JS } from './storage-keys';

/**
 * Injects user-provided CSS and JS into the document if present in storage.
 */
export function injectCustomCode() {
  const css = (safeGet<string>(CUSTOM_CSS, '') as string) || '';
  if (css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
  const js = (safeGet<string>(CUSTOM_JS, '') as string) || '';
  if (js) {
    const script = document.createElement('script');
    script.textContent = js;
    document.body.appendChild(script);
  }
}
