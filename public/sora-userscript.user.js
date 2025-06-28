// ==UserScript==
// @name         JSON Prompt Crafter Integration Sora Integration
// @namespace    supermarsx
// @version      1.1
// @description  Inject JSON prompt from external tab into Sora textarea
// @match *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
  const VERSION = '1.1';
  const DEBUG = true;
  console.log(`[Sora Injector] Loaded v${VERSION}`);
  if (DEBUG) {
    console.debug(`[Sora Injector] Hostname: ${window.location.hostname}`);
  }

  const isCrafter = Boolean(
    document.querySelector('meta[name="sora-json-prompt-crafter"]'),
  );
  const isSora =
    Boolean(
      document.querySelector('meta[property="og:title"][content="Sora"]'),
    ) || window.location.hostname === 'sora.chatgpt.com'
    || window.location.hostname === 'chatgpt.com';

  if (!isCrafter && !isSora) {
    if (DEBUG) {
      console.debug(
        `[Sora Injector] Not a Sora or Crafter page on host ${window.location.hostname}, exiting`,
      );
    }
    return;
  }
  let readyInterval;

  /**
   * Notify the app or opener window that the userscript is active.
   * Sends the detected version in the message payload.
   */
  const notifyReady = () => {
    if (DEBUG) {
      console.debug('[Sora Injector] notifyReady');
    }
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
      if (DEBUG) {
        const target = isCrafter ? window : window.opener;
        target?.postMessage({ type: 'SORA_DEBUG_PING' }, '*');
        console.debug('[Sora Injector] Debug ping sent');
      }
    } catch (e) {
      console.warn('[Sora Injector] Failed to notify readiness', e);
    }
  };

  /**
   * Begin sending readiness notifications until an acknowledgement is received.
   */
  const startNotify = () => {
    if (DEBUG) {
      console.debug('[Sora Injector] startNotify');
    }
    notifyReady();
    if (!isSora) {
      readyInterval = setInterval(notifyReady, 250);
    }
  };

  /**
   * Stop the readiness notification interval.
   */
  const stopNotify = () => {
    if (DEBUG) {
      console.debug('[Sora Injector] stopNotify');
    }
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
        if (DEBUG) {
          console.debug('[Sora Injector] ACK received');
        }
        stopNotify();
      } else if (event.data?.type === 'SORA_DEBUG_PING') {
        if (DEBUG) {
          console.debug('[Sora Injector] Debug ping received');
        }
        event.source?.postMessage({ type: 'SORA_DEBUG_PONG' }, '*');
      } else if (event.data?.type === 'SORA_DEBUG_PONG') {
        if (DEBUG) {
          console.debug('[Sora Injector] Debug pong received');
        }
      }
    },
    false,
  );

  /**
   * Wait for the first textarea element on the page and invoke a callback.
   *
   * @param callback - Function to run once the textarea is available.
   */
  const waitForTextarea = (callback) => {
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => waitForTextarea(callback), {
        once: true,
      });
      return;
    }
    const ta = document.querySelector('textarea');
    if (ta) return callback(ta);
    if (DEBUG) {
      console.debug('[Sora Injector] Waiting for textarea');
    }
    setTimeout(() => waitForTextarea(callback), 300);
  };

  window.addEventListener(
    'message',
    (event) => {
      if (
        event.origin !== window.origin &&
        event.data?.type === 'INSERT_SORA_JSON'
      ) {
        if (DEBUG) {
          console.debug(
            `[Sora Injector] Received JSON payload from ${event.origin}`,
          );
        }
        waitForTextarea((ta) => {
          ta.value = JSON.stringify(event.data.json, null, 2);
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          if (DEBUG) {
            console.debug('[Sora Injector] Textarea filled');
          }
          event.source?.postMessage({ type: 'INSERT_SORA_JSON_ACK' }, '*');
          if (DEBUG) {
            console.debug('[Sora Injector] JSON ACK sent');
          }
        });
      }
    },
    false,
  );
})();
