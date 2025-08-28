import React, { useEffect, useMemo, useRef, useState } from 'react';
import { diffChars, Change } from 'diff';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism-light';
import jsonLang from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { VariableSizeList as List } from 'react-window';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { safeGet, safeSet } from '@/lib/storage';
import {
  JSON_CHANGE_COUNT,
  JSON_CHANGE_MILESTONES,
} from '@/lib/storage-keys';
import { toast } from '@/components/ui/sonner-toast';
import { useTranslation } from 'react-i18next';

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
  const outerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const prevRef = useRef(json);
  const [diffParts, setDiffParts] = useState<Change[] | null>(null);
  const [height, setHeight] = useState(0);
  const { t } = useTranslation();

  const rows = useMemo(
    () => diffParts ?? [{ value: json, added: false } as Change],
    [diffParts, json],
  );

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
          toast.success(t('milestoneReached', { threshold }));
          milestones.push(threshold);
        }
      }
      safeSet(JSON_CHANGE_MILESTONES, milestones, true);
    } catch {
      console.error('Change counter: There was an error.');
    }
    trackEvent(trackingEnabled, AnalyticsEvent.JsonChanged);
    return () => clearTimeout(timer);
  }, [json, trackingEnabled, t]);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(containerRef.current?.clientHeight || window.innerHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const atBottom =
      Math.abs(outer.scrollHeight - outer.scrollTop - outer.clientHeight) < 5;
    const atTop = outer.scrollTop === 0;
    if (atBottom) {
      listRef.current?.scrollToItem(rows.length - 1);
    } else if (atTop) {
      listRef.current?.scrollToItem(0);
    }
  }, [json, rows.length]);

  useEffect(() => {
    listRef.current?.resetAfterIndex(0);
  }, [diffParts]);

  const getItemSize = (index: number) => {
    const lineHeight = 26; // match leading-relaxed with text-sm
    const lines = rows[index].value.split('\n').length;
    return lines * lineHeight;
  };

  const Outer = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
    (props, ref) => <div ref={ref} data-testid="json-outer" {...props} />,
  );

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
      className="h-full overflow-hidden"
      ref={containerRef}
      data-testid="json-container"
    >
      {height > 0 && (
        <List
          height={height}
          width="100%"
          itemCount={rows.length}
          itemSize={getItemSize}
          ref={listRef}
          outerRef={outerRef}
          outerElementType={Outer}
          overscanCount={5}
        >
          {({ index, style }) => (
            <div style={style} data-testid="json-row">
              {renderHighlighted(
                rows[index].value,
                Boolean(rows[index].added),
                index,
              )}
            </div>
          )}
        </List>
      )}
    </div>
  );
};

export default GeneratedJson;
