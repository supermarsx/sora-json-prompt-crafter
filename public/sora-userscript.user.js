// ==UserScript==
// @name         JSON Prompt Crafter Integration Sora Integration
// @namespace    supermarsx
// @version      1.0
// @description  Inject JSON prompt from external tab into Sora textarea
// @match        *
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
  const VERSION = '1.0';
  console.log(`[Sora Injector] Loaded v${VERSION}`);

  const isCrafter = document.querySelector(
    'meta[name="sora-json-prompt-crafter"]',
  );
  const isSora = document.querySelector(
    'meta[property="og:title"][content="Sora"]',
  );
  let readyInterval;

  const notifyReady = () => {
    try {
      if (isCrafter) {
        if (typeof window.soraUserscriptReady === 'function') {
          window.soraUserscriptReady(VERSION);
        } else {
          window.postMessage(
            { type: 'SORA_USERSCRIPT_READY', version: VERSION },
            '*',
          );
        }
      } else if (window.opener) {
        window.opener.postMessage(
          { type: 'SORA_USERSCRIPT_READY', version: VERSION },
          '*',
        );
      }
    } catch (e) {
      console.warn('[Sora Injector] Failed to notify readiness', e);
    }
  };

  const startNotify = () => {
    notifyReady();
    if (!isSora) {
      readyInterval = setInterval(notifyReady, 250);
    }
  };

  const stopNotify = () => {
    if (readyInterval) {
      clearInterval(readyInterval);
      readyInterval = undefined;
    }
  };

  startNotify();

  window.addEventListener(
    'message',
    (event) => {
      if (!isSora && event.data?.type === 'SORA_USERSCRIPT_ACK') {
        stopNotify();
      }
    },
    false,
  );

  const waitForTextarea = (callback) => {
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => waitForTextarea(callback), {
        once: true,
      });
      return;
    }
    const ta = document.querySelector('textarea');
    if (ta) return callback(ta);
    setTimeout(() => waitForTextarea(callback), 300);
  };

  window.addEventListener(
    'message',
    (event) => {
      if (
        event.origin !== window.origin &&
        event.data?.type === 'INSERT_SORA_JSON'
      ) {
        console.log('[Sora Injector] Received JSON payload');
        waitForTextarea((ta) => {
          ta.value = JSON.stringify(event.data.json, null, 2);
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('[Sora Injector] Textarea filled.');
          event.source?.postMessage({ type: 'INSERT_SORA_JSON_ACK' }, '*');
        });
      }
    },
    false,
  );
})();
