import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGallery, useCreateGalleryItem, useDeleteGalleryItem, useUpdateGalleryItem } from '@/hooks/useGallery';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Loader2, Plus, Trash2, Image, Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AdminGallery = () => {
  const { data: gallery, isLoading } = useGallery();
  const createItem = useCreateGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const { uploadImage, deleteImage, isUploading } = useImageUpload();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    const url = await uploadImage(selectedFile, 'gallery');
    if (url) {
      await createItem.mutateAsync({
        image_url: url,
        caption: caption || null,
        display_order: gallery?.length || 0,
      });
    }
    
    setCaption('');
    setPreviewUrl('');
    setSelectedFile(null);
    setIsDialogOpen(false);
  };

  const handleDelete = async (item: { id: string; image_url: string }) => {
    await deleteImage(item.image_url);
    await deleteItem.mutateAsync(item.id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCaption('');
    setPreviewUrl('');
    setSelectedFile(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface">Gallery</h1>
          <p className="text-surface/60 mt-2">Manage your gallery images</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleDialogClose()}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-primary hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-secondary border-surface/10">
            <DialogHeader>
              <DialogTitle className="text-surface">Add Gallery Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-surface">Image *</Label>
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => {
                        setPreviewUrl('');
                        setSelectedFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-surface/20 rounded-lg p-8 text-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="gallery-image"
                    />
                    <Label
                      htmlFor="gallery-image"
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-surface/40" />
                      <span className="text-surface/60">Click to upload image</span>
                    </Label>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-surface">Caption (optional)</Label>
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Image caption"
                  className="bg-primary border-surface/20 text-surface"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-accent text-primary hover:bg-accent/90"
                disabled={!selectedFile || isUploading || createItem.isPending}
              >
                {(isUploading || createItem.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Add to Gallery
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {gallery && gallery.length > 0 ? (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {gallery.map((item) => (
            <Card key={item.id} className="bg-secondary border-surface/10 overflow-hidden group">
              <div className="relative aspect-square">
                <img 
                  src={item.image_url} 
                  alt={item.caption || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-secondary border-surface/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-surface">Delete Image</AlertDialogTitle>
                        <AlertDialogDescription className="text-surface/60">
                          Are you sure you want to delete this image? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-surface/20 text-surface">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(item)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {item.caption && (
                <CardContent className="p-3">
                  <p className="text-surface/80 text-sm truncate">{item.caption}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-secondary border-surface/10">
          <CardContent className="py-12 text-center">
            <Image className="h-12 w-12 text-surface/40 mx-auto mb-4" />
            <p className="text-surface/60">No images in gallery. Add your first image!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminGallery;
