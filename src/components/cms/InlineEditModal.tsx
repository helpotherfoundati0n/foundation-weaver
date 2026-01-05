import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';

export type EditFieldType = 'title' | 'content' | 'text' | 'button';

interface InlineEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldType: EditFieldType;
  fieldLabel: string;
  currentValue: string;
  onSave: (value: string) => Promise<void>;
  isSaving: boolean;
}

export const InlineEditModal: React.FC<InlineEditModalProps> = ({
  isOpen,
  onClose,
  fieldType,
  fieldLabel,
  currentValue,
  onSave,
  isSaving,
}) => {
  const [value, setValue] = useState(currentValue || '');

  // Reset value when modal opens with new currentValue
  useEffect(() => {
    if (isOpen) {
      setValue(currentValue || '');
    }
  }, [currentValue, isOpen]);

  const handleSave = async () => {
    await onSave(value);
    onClose();
  };

  const isMultiline = fieldType === 'content' || fieldType === 'text';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-secondary border-surface/10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-surface">
            Edit {fieldLabel}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-surface">{fieldLabel}</Label>
            {isMultiline ? (
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-primary border-surface/20 text-surface min-h-[150px]"
                placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                autoFocus
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-primary border-surface/20 text-surface"
                placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
                autoFocus
              />
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleSave}
            className="flex-1 bg-accent text-primary hover:bg-accent/90"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-surface/20 text-surface"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InlineEditModal;
