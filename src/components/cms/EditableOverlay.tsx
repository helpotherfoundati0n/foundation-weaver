import React from 'react';
import { Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditableOverlayProps {
  isEditMode: boolean;
  onEdit: () => void;
  children: React.ReactNode;
  label?: string;
  className?: string;
}

export const EditableOverlay: React.FC<EditableOverlayProps> = ({
  isEditMode,
  onEdit,
  children,
  label,
  className = '',
}) => {
  if (!isEditMode) return <>{children}</>;

  return (
    <div className={`group relative ${className}`}>
      {children}
      <div className="absolute inset-0 border-2 border-dashed border-accent/0 group-hover:border-accent/50 transition-colors rounded-lg pointer-events-none" />
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-primary hover:bg-accent/90 shadow-lg z-10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      {label && (
        <span className="absolute top-2 left-2 text-xs bg-accent text-primary px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {label}
        </span>
      )}
    </div>
  );
};

interface AddSectionButtonProps {
  isEditMode: boolean;
  onClick: () => void;
}

export const AddSectionButton: React.FC<AddSectionButtonProps> = ({
  isEditMode,
  onClick,
}) => {
  if (!isEditMode) return null;

  return (
    <div className="flex items-center justify-center py-4">
      <Button
        variant="outline"
        className="border-dashed border-2 border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
        onClick={onClick}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Section
      </Button>
    </div>
  );
};

export default EditableOverlay;
