import { injectCustomCode } from '../inject-custom-code';
import { CUSTOM_CSS, CUSTOM_JS } from '../storage-keys';

describe('injectCustomCode', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('injects style and script when values exist', () => {
    localStorage.setItem(CUSTOM_CSS, 'body{color:red;}');
    localStorage.setItem(CUSTOM_JS, 'window.testInjected=true;');
    injectCustomCode();
    const style = document.head.querySelector('style');
    const script = document.body.querySelector('script');
    expect(style?.textContent).toBe('body{color:red;}');
    expect(script?.textContent).toBe('window.testInjected=true;');
  });

  it('does nothing when no values', () => {
    injectCustomCode();
    expect(document.head.querySelector('style')).toBeNull();
    expect(document.body.querySelector('script')).toBeNull();
  });
});
