import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Image, GripVertical, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useAlbums, useCreateAlbum, useUpdateAlbum, useDeleteAlbum, useReorderAlbums, Album } from '@/hooks/useAlbums';
import { useGallery, useCreateGalleryItem, useDeleteGalleryItem, useReorderGallery, GalleryItem } from '@/hooks/useGallery';
import { useImageUpload } from '@/hooks/useImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortablePhotoProps {
  photo: GalleryItem;
  onDelete: (id: string) => void;
}

interface SortableAlbumItemProps {
  album: Album;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableAlbumItem: React.FC<SortableAlbumItemProps> = ({ 
  album, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: album.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-accent/20 border border-accent/30'
          : 'bg-surface/5 hover:bg-surface/10 border border-transparent'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="p-1.5 rounded bg-surface/10 text-surface/50 cursor-grab active:cursor-grabbing hover:bg-surface/20 hover:text-surface transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={16} />
      </div>
      
      <div className="w-16 h-12 rounded-lg overflow-hidden bg-surface/10 flex-shrink-0">
        {album.cover_image_url ? (
          <img
            src={album.cover_image_url}
            alt={album.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera size={20} className="text-surface/30" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-surface font-medium truncate">{album.title}</h3>
        <p className="text-surface/50 text-sm">{album.photo_count || 0} photos</p>
      </div>
      
      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-surface/50 hover:text-surface"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil size={16} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-400/10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

const SortablePhoto: React.FC<SortablePhotoProps> = ({ photo, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden bg-surface/5"
    >
      <img
        src={photo.image_url}
        alt={photo.caption || 'Photo'}
        className="w-full aspect-square object-cover"
      />
      
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1.5 rounded bg-black/50 text-white cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical size={16} />
      </div>
      
      {/* Delete button */}
      <button
        onClick={() => onDelete(photo.id)}
        className="absolute top-2 right-2 p-1.5 rounded bg-red-500/80 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={16} />
      </button>
      
      {photo.caption && (
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-xs line-clamp-1">{photo.caption}</p>
        </div>
      )}
    </div>
  );
};

const AdminAlbums: React.FC = () => {
  const { data: albums, isLoading: albumsLoading } = useAlbums();
  const { data: allPhotos } = useGallery();
  const createAlbum = useCreateAlbum();
  const updateAlbum = useUpdateAlbum();
  const deleteAlbum = useDeleteAlbum();
  const reorderAlbums = useReorderAlbums();
  const createPhoto = useCreateGalleryItem();
  const deletePhoto = useDeleteGalleryItem();
  const reorderPhotos = useReorderGallery();
  const { uploadImage, isUploading } = useImageUpload();

  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [localAlbums, setLocalAlbums] = useState<Album[]>([]);

  // Form states
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Photo upload
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoCaption, setPhotoCaption] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Sync local albums with fetched data
  React.useEffect(() => {
    if (albums) {
      setLocalAlbums(albums);
    }
  }, [albums]);

  const albumPhotos = selectedAlbum
    ? allPhotos?.filter((p) => (p as any).album_id === selectedAlbum.id) || []
    : [];

  const resetForm = () => {
    setAlbumTitle('');
    setAlbumDescription('');
    setCoverPreview(null);
    setCoverFile(null);
    setEditingAlbum(null);
  };

  const handleOpenAlbumDialog = (album?: Album) => {
    if (album) {
      setEditingAlbum(album);
      setAlbumTitle(album.title);
      setAlbumDescription(album.description || '');
      setCoverPreview(album.cover_image_url);
    } else {
      resetForm();
    }
    setIsAlbumDialogOpen(true);
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAlbum = async () => {
    if (!albumTitle.trim()) {
      toast.error('Please enter an album title');
      return;
    }

    let coverUrl = editingAlbum?.cover_image_url || null;

    if (coverFile) {
      coverUrl = await uploadImage(coverFile);
      if (!coverUrl) return;
    }

    if (editingAlbum) {
      await updateAlbum.mutateAsync({
        id: editingAlbum.id,
        title: albumTitle,
        description: albumDescription || null,
        cover_image_url: coverUrl,
      });
    } else {
      await createAlbum.mutateAsync({
        title: albumTitle,
        description: albumDescription || null,
        cover_image_url: coverUrl,
      });
    }

    setIsAlbumDialogOpen(false);
    resetForm();
  };

  const handleDeleteAlbum = async (id: string) => {
    await deleteAlbum.mutateAsync(id);
    if (selectedAlbum?.id === id) {
      setSelectedAlbum(null);
    }
    setDeleteConfirm(null);
  };

  const handlePhotoFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotoFiles(files);
  };

  const handleUploadPhotos = async () => {
    if (!selectedAlbum || photoFiles.length === 0) return;

    const maxOrder = albumPhotos.length > 0
      ? Math.max(...albumPhotos.map((p) => p.display_order || 0))
      : 0;

    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      const imageUrl = await uploadImage(file);
      
      if (imageUrl) {
        // Directly insert with album_id
        const { error } = await supabase
          .from('gallery')
          .insert({
            image_url: imageUrl,
            caption: photoCaption || null,
            display_order: maxOrder + i + 1,
            album_id: selectedAlbum.id,
          });
        
        if (error) {
          toast.error('Failed to add photo: ' + error.message);
        }
      }
    }

    setPhotoFiles([]);
    setPhotoCaption('');
    // Refresh
    window.location.reload();
  };

  const handlePhotoDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = albumPhotos.findIndex((p) => p.id === active.id);
    const newIndex = albumPhotos.findIndex((p) => p.id === over.id);

    const reordered = arrayMove(albumPhotos, oldIndex, newIndex);
    const updates = reordered.map((photo, index) => ({
      id: photo.id,
      display_order: index,
    }));

    reorderPhotos.mutate(updates);
  };

  const handleAlbumDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localAlbums.findIndex((a) => a.id === active.id);
    const newIndex = localAlbums.findIndex((a) => a.id === over.id);

    const reordered = arrayMove(localAlbums, oldIndex, newIndex);
    
    // Update local state immediately for smooth UI
    setLocalAlbums(reordered);
    
    // Persist to database
    const updates = reordered.map((album, index) => ({
      id: album.id,
      display_order: index,
    }));

    reorderAlbums.mutate(updates);
  };

  if (albumsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface">Event Albums</h1>
          <p className="text-surface/60">Manage photo albums for events and activities</p>
        </div>
        <Button onClick={() => handleOpenAlbumDialog()} className="bg-accent text-primary hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" /> New Album
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Albums List */}
        <div className="bg-secondary rounded-xl p-6 border border-surface/10">
          <h2 className="text-lg font-semibold text-surface mb-4">Albums <span className="text-surface/40 text-sm font-normal">(drag to reorder)</span></h2>
          
          {localAlbums && localAlbums.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAlbumDragEnd}>
              <SortableContext items={localAlbums.map((a) => a.id)} strategy={rectSortingStrategy}>
                <div className="space-y-3">
                  {localAlbums.map((album) => (
                    <SortableAlbumItem
                      key={album.id}
                      album={album}
                      isSelected={selectedAlbum?.id === album.id}
                      onSelect={() => setSelectedAlbum(album)}
                      onEdit={() => handleOpenAlbumDialog(album)}
                      onDelete={() => setDeleteConfirm(album.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 text-surface/50">
              <Camera size={48} className="mx-auto mb-3 opacity-50" />
              <p>No albums yet. Create your first album!</p>
            </div>
          )}
        </div>

        {/* Album Photos */}
        <div className="bg-secondary rounded-xl p-6 border border-surface/10">
          <h2 className="text-lg font-semibold text-surface mb-4">
            {selectedAlbum ? `Photos in "${selectedAlbum.title}"` : 'Select an Album'}
          </h2>
          
          {selectedAlbum ? (
            <div className="space-y-4">
              {/* Upload Section */}
              <div className="p-4 border border-dashed border-surface/20 rounded-lg">
                <Label className="text-surface/70 text-sm">Add Photos</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoFilesSelect}
                    className="flex-1 bg-surface/5 border-surface/10"
                  />
                  <Button
                    onClick={handleUploadPhotos}
                    disabled={photoFiles.length === 0 || isUploading}
                    className="bg-accent text-primary"
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
                  </Button>
                </div>
                {photoFiles.length > 0 && (
                  <p className="text-sm text-surface/50 mt-1">
                    {photoFiles.length} file(s) selected
                  </p>
                )}
              </div>

              {/* Photo Grid with Drag & Drop */}
              {albumPhotos.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePhotoDragEnd}>
                  <SortableContext items={albumPhotos.map((p) => p.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-3 gap-2">
                      {albumPhotos.map((photo) => (
                        <SortablePhoto
                          key={photo.id}
                          photo={photo}
                          onDelete={(id) => deletePhoto.mutate(id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-8 text-surface/50">
                  <Image size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No photos yet. Upload some!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-surface/50">
              <p>Select an album to manage its photos</p>
            </div>
          )}
        </div>
      </div>

      {/* Album Dialog */}
      <Dialog open={isAlbumDialogOpen} onOpenChange={setIsAlbumDialogOpen}>
        <DialogContent className="bg-secondary border-surface/10">
          <DialogHeader>
            <DialogTitle className="text-surface">
              {editingAlbum ? 'Edit Album' : 'Create New Album'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-surface/70">Title *</Label>
              <Input
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="e.g., Education Drive 2024"
                className="mt-1 bg-surface/5 border-surface/10 text-surface"
              />
            </div>
            
            <div>
              <Label className="text-surface/70">Description</Label>
              <Textarea
                value={albumDescription}
                onChange={(e) => setAlbumDescription(e.target.value)}
                placeholder="Brief description of the event..."
                className="mt-1 bg-surface/5 border-surface/10 text-surface"
              />
            </div>
            
            <div>
              <Label className="text-surface/70">Cover Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                className="mt-1 bg-surface/5 border-surface/10"
              />
              {coverPreview && (
                <div className="mt-2 w-32 h-24 rounded-lg overflow-hidden">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAlbumDialogOpen(false)}
                className="border-surface/20 text-surface"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAlbum}
                disabled={createAlbum.isPending || updateAlbum.isPending || isUploading}
                className="bg-accent text-primary"
              >
                {(createAlbum.isPending || updateAlbum.isPending || isUploading) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingAlbum ? 'Save Changes' : 'Create Album'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-secondary border-surface/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-surface">Delete Album</AlertDialogTitle>
            <AlertDialogDescription className="text-surface/60">
              This will permanently delete the album and all its photos. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-surface/20 text-surface">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteAlbum(deleteConfirm)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAlbums;
