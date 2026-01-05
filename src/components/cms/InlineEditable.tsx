import React from 'react';
import { Pencil } from 'lucide-react';

interface InlineEditableProps {
  isEditMode: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const InlineEditable: React.FC<InlineEditableProps> = ({
  isEditMode,
  onClick,
  children,
  className = '',
}) => {
  if (!isEditMode) return <>{children}</>;

  return (
    <span
      className={`group/inline relative inline cursor-pointer ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
      <span className="absolute -top-1 -right-6 opacity-0 group-hover/inline:opacity-100 transition-opacity">
        <span className="bg-accent text-primary p-1 rounded-full shadow-lg inline-flex">
          <Pencil className="h-3 w-3" />
        </span>
      </span>
      <span className="absolute inset-0 border-b-2 border-dashed border-accent/0 group-hover/inline:border-accent/50 transition-colors" />
    </span>
  );
};

export default InlineEditable;
