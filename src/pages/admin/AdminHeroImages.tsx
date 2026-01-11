import { useState, useRef } from 'react';
import { useHeroImages, useAddHeroImage, useDeleteHeroImage, useUpdateHeroImage, useReorderHeroImages } from '@/hooks/useHeroImages';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, Upload, GripVertical, Loader2, ImageIcon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

interface SortableImageItemProps {
  image: {
    id: string;
    image_url: string;
    is_active: boolean;
    display_order: number;
  };
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

const SortableImageItem = ({ image, onToggleActive, onDelete }: SortableImageItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 bg-secondary/50 rounded-lg p-4 ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      
      <div className="w-32 h-20 rounded-md overflow-hidden flex-shrink-0">
        <img src={image.image_url} alt="Hero" className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">{image.image_url}</p>
        <p className="text-xs text-muted-foreground mt-1">Order: {image.display_order}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active</span>
          <Switch
            checked={image.is_active}
            onCheckedChange={(checked) => onToggleActive(image.id, checked)}
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(image.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const AdminHeroImages = () => {
  const { data: heroImages, isLoading } = useHeroImages();
  const addHeroImage = useAddHeroImage();
  const deleteHeroImage = useDeleteHeroImage();
  const updateHeroImage = useUpdateHeroImage();
  const reorderHeroImages = useReorderHeroImages();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localImages, setLocalImages] = useState<typeof heroImages>([]);

  // Sync local state with fetched data
  useState(() => {
    if (heroImages) setLocalImages(heroImages);
  });

  const images = localImages?.length ? localImages : heroImages || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        const nextOrder = (heroImages?.length || 0);
        await addHeroImage.mutateAsync({ image_url: imageUrl, display_order: nextOrder });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || !images.length) return;

    const oldIndex = images.findIndex(img => img.id === active.id);
    const newIndex = images.findIndex(img => img.id === over.id);

    const reordered = arrayMove(images, oldIndex, newIndex).map((img, index) => ({
      ...img,
      display_order: index
    }));

    setLocalImages(reordered);
    reorderHeroImages.mutate(reordered.map(img => ({ id: img.id, display_order: img.display_order })));
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateHeroImage.mutate({ id, is_active: isActive });
    setLocalImages(prev => prev?.map(img => img.id === id ? { ...img, is_active: isActive } : img));
  };

  const handleDelete = (id: string) => {
    deleteHeroImage.mutate(id);
    setLocalImages(prev => prev?.filter(img => img.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Hero Slider Images
        </CardTitle>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Add Image
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hero images yet. Add some to create a beautiful slider!</p>
            <p className="text-sm mt-2">Default placeholder images will be used until you add your own.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {images.map((image) => (
                  <SortableImageItem
                    key={image.id}
                    image={image}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminHeroImages;
