import React, { useEffect, useRef, useState } from 'react';
import { diffChars, Change } from 'diff';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism-light';
import jsonLang from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { safeGet, safeSet } from '@/lib/storage';
import {
  JSON_CHANGE_COUNT,
  JSON_CHANGE_MILESTONES,
} from '@/lib/storage-keys';

SyntaxHighlighter.registerLanguage('json', jsonLang);

interface Props {
  json: string;
  trackingEnabled: boolean;
}

const CHANGE_MILESTONES: [number, AnalyticsEvent][] = [
  [250, AnalyticsEvent.JsonChanged250],
  [1500, AnalyticsEvent.JsonChanged1500],
  [10000, AnalyticsEvent.JsonChanged10000],
  [25000, AnalyticsEvent.JsonChanged25000],
  [100000, AnalyticsEvent.JsonChanged100000],
];

/**
 * Displays the generated JSON output with diff-based highlighting.
 *
 * The component keeps track of the previous JSON and highlights newly added
 * segments for a short period. It auto-scrolls to keep the latest content in
 * view when at the top or bottom of the container and optionally records JSON
 * change events for analytics.
 *
 * @param json - The JSON string to render and diff against the previous value.
 * @param trackingEnabled - Whether analytics tracking events should be sent.
 * @returns JSX structure containing a scrollable `<div>` with highlighted JSON
 * within a `<pre>` element.
 */
const GeneratedJson: React.FC<Props> = ({ json, trackingEnabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef(json);
  const [diffParts, setDiffParts] = useState<Change[] | null>(null);

  useEffect(() => {
    const diff = diffChars(prevRef.current, json).filter((p) => !p.removed);
    prevRef.current = json;
    setDiffParts(diff);
    const timer = setTimeout(() => {
      setDiffParts(diff.map((p) => ({ ...p, added: false }) as Change));
    }, 2000);
    try {
      const count =
        (safeGet<number>(JSON_CHANGE_COUNT, 0, true) as number) ?? 0;
      const newCount = count + 1;
      safeSet(JSON_CHANGE_COUNT, newCount, true);
      const milestones =
        (safeGet<number[]>(JSON_CHANGE_MILESTONES, [], true) as number[]) ?? [];
      for (const [threshold, event] of CHANGE_MILESTONES) {
        if (newCount >= threshold && !milestones.includes(threshold)) {
          trackEvent(trackingEnabled, event);
          milestones.push(threshold);
        }
      }
      safeSet(JSON_CHANGE_MILESTONES, milestones, true);
    } catch {
      console.error('Change counter: There was an error.');
    }
    trackEvent(trackingEnabled, AnalyticsEvent.JsonChanged);
    return () => clearTimeout(timer);
  }, [json, trackingEnabled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const atBottom =
      Math.abs(
        container.scrollHeight - container.scrollTop - container.clientHeight,
      ) < 5;
    const atTop = container.scrollTop === 0;
    if (atBottom) {
      container.scrollTop = container.scrollHeight;
    } else if (atTop) {
      container.scrollTop = 0;
    }
  }, [json]);

  const renderHighlighted = (value: string, added: boolean, key: number) => (
    <span key={key} className={added ? 'animate-highlight' : undefined}>
      <SyntaxHighlighter
        language="json"
        style={vscDarkPlus}
        PreTag="span"
        CodeTag="span"
        wrapLongLines
        codeTagProps={{
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          },
        }}
        customStyle={{
          margin: 0,
          padding: 0,
          background: 'none',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </span>
  );

  return (
    <div
      className="h-full overflow-y-auto overflow-x-hidden"
      ref={containerRef}
    >
      <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
        {diffParts
          ? diffParts.map((part, idx) =>
              renderHighlighted(part.value, Boolean(part.added), idx),
            )
          : renderHighlighted(json, false, 0)}
      </pre>
    </div>
  );
};

export default GeneratedJson;
