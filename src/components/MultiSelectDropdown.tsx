import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, Search } from 'lucide-react';

interface MultiSelectDropdownProps {
  options: readonly string[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select options...',
  label = 'Options'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    return option
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleOption = (option: string) => {
    let newValues: string[];
    if (value.includes(option)) {
      newValues = value.filter(v => v !== option);
    } else {
      newValues = [...value, option];
    }
    onValueChange(newValues);
  };

  const displayValue = value.length > 0 ? value.map(formatLabel).join(', ') : placeholder;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="truncate">{displayValue}</span>
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
            />
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {filteredOptions.map(option => (
                <div key={option} className="flex items-center space-x-2 p-1">
                  <Checkbox
                    id={option}
                    checked={value.includes(option)}
                    onCheckedChange={() => toggleOption(option)}
                  />
                  <label htmlFor={option} className="text-sm cursor-pointer">
                    {formatLabel(option)}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
