import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2, Save, Plus, X, Upload } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Activity } from '@/hooks/useActivities';

interface ActivityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSave: (data: Partial<Activity> & { id?: string }) => Promise<void>;
  isSaving: boolean;
  isNew?: boolean;
}

const iconOptions = [
  'HeartPulse',
  'BookOpen',
  'Wrench',
  'Users',
  'Heart',
  'Award',
  'Home',
  'Briefcase',
  'GraduationCap',
  'Stethoscope',
];

export const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  isOpen,
  onClose,
  activity,
  onSave,
  isSaving,
  isNew = false,
}) => {
  const { uploadImage, isUploading } = useImageUpload();
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: 'HeartPulse',
    image_url: '',
    image_width: 400,
    image_height: 300,
    list_items: [] as string[],
    order_index: 0,
    is_active: true,
  });

  const [newListItem, setNewListItem] = useState('');

  useEffect(() => {
    if (activity) {
      setForm({
        title: activity.title,
        description: activity.description || '',
        icon: activity.icon,
        image_url: activity.image_url || '',
        image_width: activity.image_width,
        image_height: activity.image_height,
        list_items: activity.list_items || [],
        order_index: activity.order_index,
        is_active: activity.is_active,
      });
    } else if (isNew) {
      setForm({
        title: '',
        description: '',
        icon: 'HeartPulse',
        image_url: '',
        image_width: 400,
        image_height: 300,
        list_items: [],
        order_index: 0,
        is_active: true,
      });
    }
  }, [activity, isNew]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await uploadImage(file, 'activities');
    if (url) {
      setForm({ ...form, image_url: url });
    }
  };

  const handleAddListItem = () => {
    if (newListItem.trim()) {
      setForm({
        ...form,
        list_items: [...form.list_items, newListItem.trim()],
      });
      setNewListItem('');
    }
  };

  const handleRemoveListItem = (index: number) => {
    setForm({
      ...form,
      list_items: form.list_items.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    const data = activity ? { id: activity.id, ...form } : form;
    await onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-secondary border-surface/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-surface">
            {isNew ? 'Add New Activity' : `Edit: ${activity?.title}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-surface">Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-primary border-surface/20 text-surface"
              placeholder="Activity title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-surface">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-primary border-surface/20 text-surface min-h-[100px]"
              placeholder="Activity description..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-surface">Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map((icon) => (
                <Button
                  key={icon}
                  type="button"
                  size="sm"
                  variant={form.icon === icon ? 'default' : 'outline'}
                  className={form.icon === icon ? 'bg-accent text-primary' : 'border-surface/20 text-surface'}
                  onClick={() => setForm({ ...form, icon })}
                >
                  {icon}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-surface">Image</Label>
            {form.image_url && (
              <div className="relative mb-2">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="rounded-lg object-cover"
                  style={{ width: form.image_width, height: form.image_height, maxWidth: '100%' }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => setForm({ ...form, image_url: '' })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="activity-image"
              />
              <Label
                htmlFor="activity-image"
                className="flex items-center gap-2 px-4 py-2 bg-primary border border-surface/20 rounded-md text-surface cursor-pointer hover:bg-surface/10"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload Image
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-surface">Image Width: {form.image_width}px</Label>
              <Slider
                value={[form.image_width]}
                onValueChange={([value]) => setForm({ ...form, image_width: value })}
                min={100}
                max={800}
                step={10}
                className="py-2"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-surface">Image Height: {form.image_height}px</Label>
              <Slider
                value={[form.image_height]}
                onValueChange={([value]) => setForm({ ...form, image_height: value })}
                min={100}
                max={600}
                step={10}
                className="py-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-surface">List Items</Label>
            <div className="space-y-2">
              {form.list_items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...form.list_items];
                      newItems[index] = e.target.value;
                      setForm({ ...form, list_items: newItems });
                    }}
                    className="bg-primary border-surface/20 text-surface flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() => handleRemoveListItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newListItem}
                  onChange={(e) => setNewListItem(e.target.value)}
                  placeholder="Add new item..."
                  className="bg-primary border-surface/20 text-surface flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddListItem())}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="border-surface/20 text-surface hover:bg-accent hover:text-primary"
                  onClick={handleAddListItem}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 bg-accent text-primary hover:bg-accent/90"
              disabled={isSaving || !form.title}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isNew ? 'Create Activity' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-surface/20 text-surface"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityEditModal;
