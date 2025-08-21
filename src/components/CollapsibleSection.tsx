import React, { useId, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isOptional?: boolean;
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  isOptional = false,
  isEnabled = true,
  onToggle,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="border border-border rounded-lg">
      <div className="flex items-center gap-3 p-4 bg-muted/30">
        {isOptional && (
          <Checkbox
            checked={isEnabled}
            onCheckedChange={onToggle}
            className="flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className="flex items-center justify-between w-full text-left"
          aria-expanded={isOpen}
          aria-controls={contentId}
          title={title}
        >
          <h3 className="font-semibold text-lg">{title}</h3>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
      {isOpen && (
        <div
          id={contentId}
          className={`p-4 space-y-4 ${!isEnabled && isOptional ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
