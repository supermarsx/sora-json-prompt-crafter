// ==UserScript==
// @name         JSON Prompt Crafter Integration Sora Integration
// @namespace    supermarsx
// @version      __USERSCRIPT_VERSION__
// @description  Inject JSON prompt from external tab into Sora textarea
// @match *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
  const VERSION = '__USERSCRIPT_VERSION__';
  const DEBUG = false;
  const SESSION_KEY = 'sora_json_payload';
  const SORA_ORIGIN = window.location.origin;
  let CRAFTER_ORIGIN = null;
  try {
    CRAFTER_ORIGIN = document.referrer
      ? new URL(document.referrer).origin
      : null;
  } catch {
    CRAFTER_ORIGIN = null;
  }
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
    ) ||
    window.location.hostname === 'sora.chatgpt.com' ||
    window.location.hostname === 'chatgpt.com';

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

  /**
   * Wait for the first textarea element on the page and invoke a callback.
   *
   * @param callback - Function to run once the textarea is available.
   */
  const waitForTextarea = (callback) => {
    const attempt = () => {
      const ta = document.querySelector('textarea');
      if (ta) {
        if (DEBUG) {
          console.debug('[Sora Injector] Textarea found');
        }
        callback(ta);
      } else {
        if (DEBUG) {
          console.debug('[Sora Injector] Textarea not found, retrying');
        }
        setTimeout(attempt, 300);
      }
    };

    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      attempt();
    } else {
      window.addEventListener('DOMContentLoaded', attempt, { once: true });
    }
  };

  startNotify();

  // Restore any stored JSON in case the page cleared it
  waitForTextarea((ta) => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored && ta.value.trim() === '') {
      ta.value = stored;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

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

  window.addEventListener(
    'message',
    (event) => {
      const isAllowedOrigin =
        event.origin !== SORA_ORIGIN &&
        (!CRAFTER_ORIGIN || event.origin === CRAFTER_ORIGIN);
      if (
        isAllowedOrigin &&
        event.data?.type === 'INSERT_SORA_JSON' &&
        typeof event.data.nonce === 'string'
      ) {
        if (DEBUG) {
          console.debug(
            `[Sora Injector] Received JSON payload from ${event.origin}`,
          );
        }
        waitForTextarea((ta) => {
          const jsonStr = JSON.stringify(event.data.json, null, 2);
          try {
            sessionStorage.setItem(SESSION_KEY, jsonStr);
          } catch {}
          ta.value = jsonStr;
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          const enforceOnFocus = () => {
            if (ta.value.trim() === '') {
              const stored = sessionStorage.getItem(SESSION_KEY) || jsonStr;
              ta.value = stored;
              ta.dispatchEvent(new Event('input', { bubbles: true }));
            }
          };
          const cancelEnforce = () => {
            ta.removeEventListener('focus', enforceOnFocus);
            ta.removeEventListener('input', cancelEnforce);
            try {
              sessionStorage.removeItem(SESSION_KEY);
            } catch {}
          };
          ta.addEventListener('focus', enforceOnFocus);
          ta.addEventListener('input', cancelEnforce);
          setTimeout(cancelEnforce, 5000);
          if (DEBUG) {
            console.debug('[Sora Injector] Textarea filled');
          }
          event.source?.postMessage(
            { type: 'INSERT_SORA_JSON_ACK', nonce: event.data.nonce },
            event.origin,
          );
          if (DEBUG) {
            console.debug('[Sora Injector] JSON ACK sent');
          }
        });
      }
    },
    false,
  );
})();
