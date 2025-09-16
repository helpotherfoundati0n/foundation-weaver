import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Save, Trash2, Plus, Settings } from 'lucide-react';

interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
}

interface ContactInfo {
  id: string;
  info_key: string;
  label: string;
  value: string;
  icon: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_path: string;
  order_index: number;
  is_active: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_path: string;
  is_featured: boolean;
  is_active: boolean;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sectionsData, contactData, teamData, eventsData] = await Promise.all([
        supabase.from('content_sections').select('*').order('section_key'),
        supabase.from('contact_info').select('*').order('order_index'),
        supabase.from('team_members').select('*').order('order_index'),
        supabase.from('events').select('*').order('created_at', { ascending: false })
      ]);

      if (sectionsData.data) setContentSections(sectionsData.data);
      if (contactData.data) setContactInfo(contactData.data);
      if (teamData.data) setTeamMembers(teamData.data);
      if (eventsData.data) setEvents(eventsData.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContentSection = async (id: string, updates: Partial<ContentSection>) => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setContentSections(prev => 
        prev.map(section => 
          section.id === id ? { ...section, ...updates } : section
        )
      );

      toast({
        title: "Success",
        description: "Content updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive"
      });
    }
  };

  const updateContactInfo = async (id: string, updates: Partial<ContactInfo>) => {
    try {
      const { error } = await supabase
        .from('contact_info')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setContactInfo(prev => 
        prev.map(contact => 
          contact.id === id ? { ...contact, ...updates } : contact
        )
      );

      toast({
        title: "Success",
        description: "Contact info updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact info",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (file: File, imageKey: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${imageKey}-${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('website-images')
        .getPublicUrl(filePath);

      // Save to website_images table
      const { error: dbError } = await supabase
        .from('website_images')
        .upsert({
          image_key: imageKey,
          file_path: publicUrl,
          alt_text: `${imageKey} image`,
          title: imageKey
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });

      return publicUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your website content, images, and information
          </p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Content Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contentSections.map((section) => (
                  <div key={section.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground capitalize">
                        {section.section_key.replace(/_/g, ' ')}
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => updateContentSection(section.id, {
                          title: section.title,
                          content: section.content
                        })}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`${section.id}-title`}>Title</Label>
                        <Input
                          id={`${section.id}-title`}
                          value={section.title || ''}
                          onChange={(e) => setContentSections(prev =>
                            prev.map(s => s.id === section.id ? { ...s, title: e.target.value } : s)
                          )}
                          placeholder="Enter title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${section.id}-content`}>Content</Label>
                        <Textarea
                          id={`${section.id}-content`}
                          value={section.content || ''}
                          onChange={(e) => setContentSections(prev =>
                            prev.map(s => s.id === section.id ? { ...s, content: e.target.value } : s)
                          )}
                          placeholder="Enter content"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((contact) => (
                  <div key={contact.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{contact.label}</h3>
                      <Button
                        size="sm"
                        onClick={() => updateContactInfo(contact.id, {
                          label: contact.label,
                          value: contact.value,
                          icon: contact.icon
                        })}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`${contact.id}-label`}>Label</Label>
                        <Input
                          id={`${contact.id}-label`}
                          value={contact.label || ''}
                          onChange={(e) => setContactInfo(prev =>
                            prev.map(c => c.id === contact.id ? { ...c, label: e.target.value } : c)
                          )}
                          placeholder="Enter label"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${contact.id}-value`}>Value</Label>
                        <Input
                          id={`${contact.id}-value`}
                          value={contact.value || ''}
                          onChange={(e) => setContactInfo(prev =>
                            prev.map(c => c.id === contact.id ? { ...c, value: e.target.value } : c)
                          )}
                          placeholder="Enter value"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${contact.id}-icon`}>Icon</Label>
                        <Input
                          id={`${contact.id}-icon`}
                          value={contact.icon || ''}
                          onChange={(e) => setContactInfo(prev =>
                            prev.map(c => c.id === contact.id ? { ...c, icon: e.target.value } : c)
                          )}
                          placeholder="Lucide icon name"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Team management feature will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Events management feature will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;