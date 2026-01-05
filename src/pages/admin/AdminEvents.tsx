import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useEvents';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Loader2, Plus, Pencil, Trash2, Calendar, X, Upload, MapPin, Clock, Link as LinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface EventForm {
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  registration_deadline: string;
  location: string;
  google_form_url: string;
  image_url: string;
  is_active: boolean;
}

const emptyForm: EventForm = {
  title: '',
  description: '',
  event_date: '',
  event_time: '',
  registration_deadline: '',
  location: '',
  google_form_url: '',
  image_url: '',
  is_active: true,
};

const AdminEvents = () => {
  const { data: events, isLoading, refetch } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const { uploadImage, isUploading } = useImageUpload();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const url = await uploadImage(file, 'events');
      if (url) {
        setForm({ ...form, image_url: url });
      }
    } catch (error: any) {
      toast.error('Failed to upload image: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!form.event_date) {
      toast.error('Event date is required');
      return;
    }
    
    try {
      const eventData = {
        title: form.title,
        description: form.description || null,
        event_date: form.event_date,
        event_time: form.event_time || null,
        registration_deadline: form.registration_deadline || null,
        location: form.location || null,
        google_form_url: form.google_form_url || null,
        image_url: form.image_url || null,
        is_active: form.is_active,
      };

      if (editingId) {
        await updateEvent.mutateAsync({ id: editingId, ...eventData });
      } else {
        await createEvent.mutateAsync(eventData);
      }
      
      setForm(emptyForm);
      setEditingId(null);
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date,
      event_time: event.event_time || '',
      registration_deadline: event.registration_deadline ? event.registration_deadline.split('T')[0] : '',
      location: event.location || '',
      google_form_url: event.google_form_url || '',
      image_url: event.image_url || '',
      is_active: event.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent.mutateAsync(id);
      refetch();
    } catch (error: any) {
      console.error('Error deleting event:', error);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleOpenDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const isPastEvent = (eventDate: string) => {
    return new Date(eventDate) < new Date(new Date().toISOString().split('T')[0]);
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
          <h1 className="text-3xl font-bold text-surface">Events</h1>
          <p className="text-surface/60 mt-2">Manage your events</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleDialogClose()}>
          <DialogTrigger asChild>
            <Button 
              className="bg-accent text-primary hover:bg-accent/90"
              onClick={handleOpenDialog}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-secondary border-surface/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-surface">
                {editingId ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-surface">Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Event title"
                  className="bg-primary border-surface/20 text-surface"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-surface">Event Date *</Label>
                  <Input
                    type="date"
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="bg-primary border-surface/20 text-surface"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-surface">Event Time</Label>
                  <Input
                    type="time"
                    value={form.event_time}
                    onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                    className="bg-primary border-surface/20 text-surface"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-surface">Registration Deadline</Label>
                <Input
                  type="date"
                  value={form.registration_deadline}
                  onChange={(e) => setForm({ ...form, registration_deadline: e.target.value })}
                  className="bg-primary border-surface/20 text-surface"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-surface">Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Event location"
                  className="bg-primary border-surface/20 text-surface"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-surface">Registration Link (Google Form URL)</Label>
                <Input
                  type="url"
                  value={form.google_form_url}
                  onChange={(e) => setForm({ ...form, google_form_url: e.target.value })}
                  placeholder="https://forms.google.com/..."
                  className="bg-primary border-surface/20 text-surface"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-surface">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Event description..."
                  className="bg-primary border-surface/20 text-surface min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-surface">Cover Image</Label>
                {form.image_url && (
                  <div className="relative mb-2">
                    <img 
                      src={form.image_url} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
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
                    id="event-image"
                  />
                  <Label
                    htmlFor="event-image"
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
              
              <div className="flex items-center justify-between">
                <Label className="text-surface">Active</Label>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-accent text-primary hover:bg-accent/90"
                disabled={createEvent.isPending || updateEvent.isPending}
              >
                {(createEvent.isPending || updateEvent.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {editingId ? 'Update Event' : 'Create Event'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className={`bg-secondary border-surface/10 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 ${isPastEvent(event.event_date) ? 'opacity-70' : ''}`}>
              {event.image_url && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-surface text-lg">{event.title}</CardTitle>
                  <div className="flex gap-1">
                    {isPastEvent(event.event_date) && (
                      <span className="px-2 py-1 rounded text-xs bg-orange-400/10 text-orange-400">
                        Past
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.is_active 
                        ? 'bg-green-400/10 text-green-400' 
                        : 'bg-surface/10 text-surface/60'
                    }`}>
                      {event.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-surface/60 text-sm">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(event.event_date), 'PPP')}
                </div>
                {event.event_time && (
                  <div className="flex items-center gap-2 text-surface/60 text-sm">
                    <Clock className="h-4 w-4" />
                    {event.event_time}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-surface/60 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                {event.google_form_url && (
                  <div className="flex items-center gap-2 text-accent text-sm">
                    <LinkIcon className="h-4 w-4" />
                    <a href={event.google_form_url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                      Registration Link
                    </a>
                  </div>
                )}
                {event.description && (
                  <p className="text-surface/80 text-sm line-clamp-2">{event.description}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(event)}
                    className="border-surface/20 text-surface hover:bg-accent hover:text-primary"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-red-400/20 text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-secondary border-surface/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-surface">Delete Event</AlertDialogTitle>
                        <AlertDialogDescription className="text-surface/60">
                          Are you sure you want to delete "{event.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-surface/20 text-surface">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(event.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-secondary border-surface/10">
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-surface/40 mx-auto mb-4" />
            <p className="text-surface/60">No events yet. Create your first event!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminEvents;