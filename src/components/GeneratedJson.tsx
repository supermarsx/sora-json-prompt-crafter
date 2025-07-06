import React, { useEffect, useRef, useState } from 'react';
import { diffChars, Change } from 'diff';
import { trackEvent } from '@/lib/analytics';

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
      Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 5;
    const atTop = container.scrollTop === 0;
    if (atBottom) {
      container.scrollTop = container.scrollHeight;
    } else if (atTop) {
      container.scrollTop = 0;
    }
  }, [json]);

  return (
    <div className="h-full overflow-y-auto" ref={containerRef}>
      <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
        <code>
          {diffParts
            ? diffParts.map((part, idx) => (
                <span key={idx} className={part.added ? 'animate-highlight' : undefined}>
                  {part.value}
                </span>
              ))
            : json}
        </code>
      </pre>
    </div>
  );
};

export default GeneratedJson;
