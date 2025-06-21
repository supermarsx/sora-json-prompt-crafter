
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  defaultOpen = true
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg">
      <div
        className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {isOptional && (
            <Checkbox
              checked={isEnabled}
              onCheckedChange={onToggle}
              className="flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-1"
        >
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
      {isOpen && (
        <div className={`p-4 space-y-4 ${!isEnabled && isOptional ? 'opacity-50 pointer-events-none' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
};
