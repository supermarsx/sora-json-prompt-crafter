
import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, Search } from 'lucide-react';

interface SearchableDropdownProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  label = "Options",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const sortedOptions = useMemo(() => {
    const priorityOptions = ['default', 'as is', 'not defined', 'keep original'];
    const regularOptions = options.filter(opt => !priorityOptions.includes(opt)).sort();
    const presentPriorityOptions = priorityOptions.filter(opt => options.includes(opt));
    return [...presentPriorityOptions, ...regularOptions];
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return sortedOptions;
    return sortedOptions.filter(option =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedOptions, searchQuery]);

  const formatLabel = (option: string) => {
    return option.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleSelect = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !disabled && setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="truncate">{formatLabel(value)}</span>
          <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={disabled}
            />
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-1">
              {filteredOptions.map((option) => (
                <Button
                  key={option}
                  variant={value === option ? "default" : "ghost"}
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => handleSelect(option)}
                  disabled={disabled}
                >
                  <span className="break-words">{formatLabel(option)}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
