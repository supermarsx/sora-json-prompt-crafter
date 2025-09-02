import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, Search } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { addCustomValue } from '@/lib/storage';

interface SearchableDropdownProps {
  options: readonly string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  getOptionLabel?: (option: string) => string;
  optionKey?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onValueChange,
  placeholder,
  label,
  disabled = false,
  getOptionLabel,
  optionKey,
}) => {
  const { t } = useTranslation();
  const placeholderText = placeholder ?? t('searchablePlaceholder');
  const labelText = label ?? t('searchableLabel');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const sortedOptions = useMemo(() => {
    const priorityOptions = [
      'default',
      'as is',
      'not defined',
      'keep original',
    ];
    const regularOptions = options
      .filter((opt) => !priorityOptions.includes(opt))
      .sort();
    const presentPriorityOptions = priorityOptions.filter((opt) =>
      options.includes(opt),
    );
    return [...presentPriorityOptions, ...regularOptions];
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return sortedOptions;
    return sortedOptions.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [sortedOptions, searchQuery]);

  const formatLabel = (option: string) => {
    if (getOptionLabel) return getOptionLabel(option);
    return option
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSelect = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !disabled && setIsOpen(open)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
              disabled={disabled}
            >
              <span className="truncate">
                {value ? formatLabel(value) : placeholderText}
              </span>
              <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {value ? formatLabel(value) : placeholderText}
        </TooltipContent>
      </Tooltip>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{labelText}</DialogTitle>
          <DialogDescription>{t('searchableDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('searchOptionsPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={disabled}
            />
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-1">
              {filteredOptions.map((option) => (
                <Tooltip key={option}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={value === option ? 'default' : 'ghost'}
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => handleSelect(option)}
                      disabled={disabled}
                    >
                      <span className="break-words">{formatLabel(option)}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{formatLabel(option)}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </ScrollArea>
          {optionKey && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const input = window.prompt('Enter custom value');
                const custom = input?.trim();
                if (!custom) return;
                addCustomValue(optionKey, custom);
                onValueChange(custom);
                setIsOpen(false);
                setSearchQuery('');
              }}
              disabled={disabled}
            >
              Add custom value
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
