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

/**
 * Recursively clone the provided React node tree, applying a `disabled` prop to each element.
 * This ensures that all nested interactive components reflect the disabled state consistently.
 *
 * @param children - The React children to clone.
 * @param disabled - Whether the cloned elements should be disabled.
 * @returns A new React node tree with `disabled` applied to every element.
 */
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

/**
 * Render a checkbox that toggles the disabled state of its child elements.
 * When the checkbox is unchecked, all nested fields become disabled, preventing user interaction.
 *
 * @param props - {@link ToggleFieldProps} containing the checkbox `id`, display `label`,
 * `checked` state, change handler, and child elements to be conditionally disabled.
 * @returns JSX fragment with a toggleable checkbox and its associated children.
 */
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

