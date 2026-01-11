import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSiteContent, useUpdateSiteContent, useCreateSiteContent } from '@/hooks/useSiteContent';
import { Loader2, Save, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminHeroImages from './AdminHeroImages';

const AdminContent = () => {
  const { data: content, isLoading } = useSiteContent();
  const updateContent = useUpdateSiteContent();
  const createContent = useCreateSiteContent();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [newContent, setNewContent] = useState({ section_key: '', title: '', content: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (item: { id: string; title: string | null; content: string | null }) => {
    setEditingId(item.id);
    setEditForm({ title: item.title || '', content: item.content || '' });
  };

  const handleSave = async (id: string) => {
    await updateContent.mutateAsync({ id, ...editForm });
    setEditingId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createContent.mutateAsync(newContent);
    setNewContent({ section_key: '', title: '', content: '' });
    setIsDialogOpen(false);
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
          <h1 className="text-3xl font-bold text-surface">Site Content</h1>
          <p className="text-surface/60 mt-2">Manage your website's text content</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-primary hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-secondary border-surface/10">
            <DialogHeader>
              <DialogTitle className="text-surface">Add New Content Section</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-surface">Section Key</Label>
                <Input
                  value={newContent.section_key}
                  onChange={(e) => setNewContent({ ...newContent, section_key: e.target.value })}
                  placeholder="e.g., hero_subtitle"
                  className="bg-primary border-surface/20 text-surface"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-surface">Title</Label>
                <Input
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  placeholder="Section title"
                  className="bg-primary border-surface/20 text-surface"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-surface">Content</Label>
                <Textarea
                  value={newContent.content}
                  onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  placeholder="Section content..."
                  className="bg-primary border-surface/20 text-surface min-h-[100px]"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-accent text-primary hover:bg-accent/90"
                disabled={createContent.isPending}
              >
                {createContent.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Create Section
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hero Slider Images Section */}
      <AdminHeroImages />

      <div className="grid gap-6">
        {content?.map((item) => (
          <Card key={item.id} className="bg-secondary border-surface/10">
            <CardHeader>
              <CardTitle className="text-surface capitalize">
                {item.section_key.replace(/_/g, ' ')}
              </CardTitle>
              <CardDescription className="text-surface/60">
                Key: {item.section_key}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingId === item.id ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-surface">Title</Label>
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="bg-primary border-surface/20 text-surface"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-surface">Content</Label>
                    <Textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      className="bg-primary border-surface/20 text-surface min-h-[100px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSave(item.id)}
                      className="bg-accent text-primary hover:bg-accent/90"
                      disabled={updateContent.isPending}
                    >
                      {updateContent.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setEditingId(null)}
                      className="text-surface/60"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-surface/60">Title</p>
                    <p className="text-surface">{item.title || '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-surface/60">Content</p>
                    <p className="text-surface whitespace-pre-wrap">{item.content || '—'}</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    className="border-surface/20 text-surface hover:bg-accent hover:text-primary"
                  >
                    Edit
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminContent;
