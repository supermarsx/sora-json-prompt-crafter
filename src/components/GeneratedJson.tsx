import React, { useEffect, useRef, useState } from 'react';
import { diffChars, Change } from 'diff';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism-light';
import jsonLang from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { trackEvent } from '@/lib/analytics';

SyntaxHighlighter.registerLanguage('json', jsonLang);

interface Props {
  json: string;
  trackingEnabled: boolean;
}

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
    trackEvent(trackingEnabled, 'json_changed');
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
        customStyle={{
          margin: 0,
          padding: 0,
          background: 'none',
          overflowX: 'hidden',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
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
