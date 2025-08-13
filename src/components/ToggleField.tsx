import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ToggleFieldProps {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
}

const cloneChildrenWithDisabled = (
  children: React.ReactNode,
  disabled: boolean,
): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(
        child,
        {
          ...(child.props as Record<string, unknown>),
          disabled,
          children: cloneChildrenWithDisabled(child.props.children, disabled),
        },
      );
    }
    return child;
  });
};

export const ToggleField: React.FC<ToggleFieldProps> = ({
  id,
  label,
  checked,
  onCheckedChange,
  children,
}) => {
  const disabled = !checked;
  const clonedChildren = cloneChildrenWithDisabled(children, disabled);
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(!!value)}
        />
        <Label htmlFor={id}>{label}</Label>
      </div>
      <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>{clonedChildren}</div>
    </div>
  );
};

export default ToggleField;

