// ==UserScript==
// @name         JSON Prompt Crafter Integration Sora Integration
// @namespace    supermarsx
// @version      1.0
// @description  Inject JSON prompt from external tab into Sora textarea
// @match        https://sora.chatgpt.com/*
// @match        https://sora-json-prompt-crafter.lovable.app/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  console.log('[Sora Injector] Loaded');

  const notifyReady = () => {
    try {
      const isCrafter = document.querySelector(
        'meta[name="sora-json-prompt-crafter"]',
      );
      if (isCrafter) {
        if (typeof window.soraUserscriptReady === 'function') {
          window.soraUserscriptReady();
        } else {
          window.postMessage({ type: 'SORA_USERSCRIPT_READY' }, '*');
        }
      } else if (window.opener) {
        window.opener.postMessage({ type: 'SORA_USERSCRIPT_READY' }, '*');
      }
    } catch (e) {
      console.warn('[Sora Injector] Failed to notify readiness', e);
    }
  };

  notifyReady();
  setTimeout(notifyReady, 1000);
  setTimeout(notifyReady, 3000);

  const waitForTextarea = (callback) => {
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
        });
      }
    },
    false,
  );
})();
