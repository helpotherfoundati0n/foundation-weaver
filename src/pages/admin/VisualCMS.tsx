import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Heart, Award, HeartPulse, BookOpen, Wrench, Calendar, MapPin, Mail, Phone, QrCode, Pencil, Trash2, Send, LogOut, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypewriterEffectSmooth } from '@/components/TypewriterEffect';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

import { useSiteContent, useUpdateSiteContent, useCreateSiteContent } from '@/hooks/useSiteContent';
import { useActiveEvents, useEvents } from '@/hooks/useEvents';
import { useGallery } from '@/hooks/useGallery';
import { useContactInfo, useUpdateContactInfo } from '@/hooks/useContactInfo';
import { useActiveActivities, useUpdateActivity, useCreateActivity, useDeleteActivity } from '@/hooks/useActivities';
import { useAuth } from '@/contexts/AuthContext';

import { InlineEditable } from '@/components/cms/InlineEditable';
import { InlineEditModal, EditFieldType } from '@/components/cms/InlineEditModal';
import ActivityEditModal from '@/components/cms/ActivityEditModal';
import ContactEditModal from '@/components/cms/ContactEditModal';

const iconMap: Record<string, React.ElementType> = {
  HeartPulse,
  BookOpen,
  Wrench,
  Users,
  Heart,
  Award,
};

interface InlineEditState {
  isOpen: boolean;
  fieldType: EditFieldType;
  fieldLabel: string;
  currentValue: string;
  sectionKey: string;
  fieldPath: 'title' | 'content';
}

const VisualCMS = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isEditMode, setIsEditMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  
  // Fetch data
  const { data: siteContent, isLoading: contentLoading } = useSiteContent();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: gallery, isLoading: galleryLoading } = useGallery();
  const { data: contactInfo, isLoading: contactLoading } = useContactInfo();
  const { data: activities, isLoading: activitiesLoading } = useActiveActivities();

  // Mutations
  const updateContent = useUpdateSiteContent();
  const createContent = useCreateSiteContent();
  const updateContact = useUpdateContactInfo();
  const updateActivity = useUpdateActivity();
  const createActivity = useCreateActivity();
  const deleteActivity = useDeleteActivity();

  // Inline edit state
  const [inlineEdit, setInlineEdit] = useState<InlineEditState | null>(null);

  // Activity modal states
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [isNewActivity, setIsNewActivity] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const getContent = (key: string) => siteContent?.find(c => c.section_key === key);

  const openInlineEdit = (sectionKey: string, fieldPath: 'title' | 'content', fieldLabel: string) => {
    const section = getContent(sectionKey);
    const currentValue = section ? (fieldPath === 'title' ? section.title : section.content) || '' : '';
    
    setInlineEdit({
      isOpen: true,
      fieldType: fieldPath === 'title' ? 'title' : 'content',
      fieldLabel,
      currentValue,
      sectionKey,
      fieldPath,
    });
  };

  const handleInlineSave = async (value: string) => {
    if (!inlineEdit) return;
    
    const section = getContent(inlineEdit.sectionKey);
    
    if (section) {
      await updateContent.mutateAsync({
        id: section.id,
        [inlineEdit.fieldPath]: value,
      });
    } else {
      // Create new section if it doesn't exist
      await createContent.mutateAsync({
        section_key: inlineEdit.sectionKey,
        [inlineEdit.fieldPath]: value,
      });
    }
  };

  const handleSaveActivity = async (data: any) => {
    if (data.id) {
      await updateActivity.mutateAsync(data);
    } else {
      await createActivity.mutateAsync(data);
    }
  };

  const handleSaveContact = async (data: any) => {
    if (contactInfo?.id) {
      await updateContact.mutateAsync({ id: contactInfo.id, ...data });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isLoading = contentLoading || eventsLoading || galleryLoading || contactLoading || activitiesLoading;
  const isSaving = updateContent.isPending || createContent.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-surface relative">
      {/* Floating Controls - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Button
          variant={isEditMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsEditMode(!isEditMode)}
          className={`shadow-lg ${isEditMode ? 'bg-accent text-primary' : 'bg-secondary/95 border-surface/20 text-surface'}`}
        >
          {isEditMode ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
          {isEditMode ? 'Edit ON' : 'Edit OFF'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/dashboard')}
          className="shadow-lg bg-secondary/95 border-surface/20 text-surface"
        >
          Dashboard
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="shadow-lg bg-secondary/95 border-surface/20 text-red-400 hover:bg-red-400/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Navbar Preview */}
      <Navbar activeSection={activeSection} />
      
      {/* Home Section */}
      <section id="home" className="w-full h-screen flex items-center px-4 bg-home bg-cover bg-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center animate-fade-in">
            <div className="flex flex-col items-center leading-tight">
              <TypewriterEffectSmooth className="my-0"
                words={[
                  { text: "If" }, { text: "you" }, { text: "help" }, { text: "other,", className: "text-accent"},
                ]}
              />
              <TypewriterEffectSmooth className="my-0"
                words={[
                  { text: "Allah", className: "text-accent" },
                  { text: "will" }, { text: "help" }, { text: "you" }, { text: "in" },
                  { text: "Return!", className: "text-accent" },
                ]}
              />
            </div>
            <InlineEditable
              isEditMode={isEditMode}
              onClick={() => openInlineEdit('hero_subtitle', 'content', 'Hero Subtitle')}
            >
              <p className="text-lg md:text-xl text-surface/80 max-w-2xl mx-auto mb-8">
                {getContent('hero_subtitle')?.content || 'Join us in our mission to assist the underprivileged through education and healthcare initiatives.'}
              </p>
            </InlineEditable>
            <InlineEditable
              isEditMode={isEditMode}
              onClick={() => openInlineEdit('hero_button', 'content', 'Hero Button Text')}
            >
              <button className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                {getContent('hero_button')?.content || 'Get Involved'} <ArrowRight size={20} />
              </button>
            </InlineEditable>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-what-we-do" className="py-8 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[
                  {text:"About"},{text:"Us"},{text:"&"},{text:"What"},{text:"We"},{text:"Do", className:"text-accent"}
                ]}
              />
            </div>
            <InlineEditable
              isEditMode={isEditMode}
              onClick={() => openInlineEdit('about_content', 'content', 'About Description')}
            >
              <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
                {getContent('about_content')?.content || 'Founded in 2025, our foundation grew out of a deep-rooted bond of friendship and a shared mission to serve.'}
              </p>
            </InlineEditable>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="animate-fade-in">
              <InlineEditable
                isEditMode={isEditMode}
                onClick={() => openInlineEdit('mission_title', 'content', 'Mission Title')}
              >
                <h2 className="text-3xl font-bold mb-6">
                  {getContent('mission_title')?.content || 'Our Mission'}
                </h2>
              </InlineEditable>
              <InlineEditable
                isEditMode={isEditMode}
                onClick={() => openInlineEdit('mission_content', 'content', 'Mission Description')}
              >
                <p className="text-surface/80">
                  {getContent('mission_content')?.content || 'To centralize efforts in aiding the needy and expanding our reach to help more individuals through medical assistance, education support, and self-reliance initiatives.'}
                </p>
              </InlineEditable>
            </div>
            <div className="animate-fade-in delay-100">
              <InlineEditable
                isEditMode={isEditMode}
                onClick={() => openInlineEdit('vision_title', 'content', 'Vision Title')}
              >
                <h2 className="text-3xl font-bold mb-6">
                  {getContent('vision_title')?.content || 'Our Vision'}
                </h2>
              </InlineEditable>
              <InlineEditable
                isEditMode={isEditMode}
                onClick={() => openInlineEdit('vision_content', 'content', 'Vision Description')}
              >
                <p className="text-surface/80">
                  {getContent('vision_content')?.content || 'To create a society where every individual has access to basic healthcare, quality education, and opportunities for self-reliance, regardless of their economic status.'}
                </p>
              </InlineEditable>
            </div>
          </div>

          {/* Key Activities */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Key <span className="text-accent">Activities</span>
            </h2>
            
            {activities && activities.map((activity, index) => {
              const IconComponent = iconMap[activity.icon] || HeartPulse;
              const isEven = index % 2 === 0;
              
              return (
                <div key={activity.id} className="mb-12">
                  <div 
                    className={`group relative grid md:grid-cols-2 gap-12 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    {isEditMode && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-primary hover:bg-accent/90 shadow-lg z-10"
                        onClick={() => {
                          setEditingActivity(activity);
                          setIsNewActivity(false);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <div className={`animate-fade-in ${!isEven ? 'md:order-2' : ''}`}>
                      <IconComponent size={48} className="text-accent mb-6" />
                      <h3 className="text-2xl font-bold mb-6">{activity.title}</h3>
                      <p className="text-surface/80 mb-4">{activity.description}</p>
                      {activity.list_items && activity.list_items.length > 0 && (
                        <ul className="list-disc list-inside text-surface/80 space-y-2">
                          {activity.list_items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className={`bg-primary p-8 rounded-lg animate-fade-in delay-100 ${!isEven ? 'md:order-1' : ''}`}>
                      {activity.image_url ? (
                        <img 
                          src={activity.image_url}
                          alt={activity.title}
                          className="rounded-lg w-full"
                          style={{ 
                            maxWidth: activity.image_width, 
                            maxHeight: activity.image_height,
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-surface/10 rounded-lg flex items-center justify-center">
                          <p className="text-surface/40">No image uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditMode && (
                    <div className="flex justify-center mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-400/20 text-red-400 hover:bg-red-400/10"
                        onClick={() => deleteActivity.mutate(activity.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Activity
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
            
            {isEditMode && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="border-dashed border-2 border-accent/50 text-accent hover:bg-accent/10"
                  onClick={() => {
                    setEditingActivity(null);
                    setIsNewActivity(true);
                  }}
                >
                  + Add New Activity
                </Button>
              </div>
            )}
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Our <span className="text-accent">Values</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 animate-fade-in">
                <Users size={48} className="text-accent mx-auto mb-4" />
                <InlineEditable
                  isEditMode={isEditMode}
                  onClick={() => openInlineEdit('value_1_title', 'content', 'Value 1 Title')}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    {getContent('value_1_title')?.content || 'Community First'}
                  </h3>
                </InlineEditable>
                <InlineEditable
                  isEditMode={isEditMode}
                  onClick={() => openInlineEdit('value_1_content', 'content', 'Value 1 Description')}
                >
                  <p className="text-surface/80">
                    {getContent('value_1_content')?.content || 'We prioritize the needs of our community in everything we do.'}
                  </p>
                </InlineEditable>
              </div>
              <div className="text-center p-6 animate-fade-in delay-100">
                <Heart size={48} className="text-accent mx-auto mb-4" />
                <InlineEditable
                  isEditMode={isEditMode}
                  onClick={() => openInlineEdit('value_2_title', 'content', 'Value 2 Title')}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    {getContent('value_2_title')?.content || 'Compassion'}
                  </h3>
                </InlineEditable>
                <InlineEditable
                  isEditMode={isEditMode}
                  onClick={() => openInlineEdit('value_2_content', 'content', 'Value 2 Description')}
                >
                  <p className="text-surface/80">
                    {getContent('value_2_content')?.content || 'We approach every situation with empathy and understanding.'}
                  </p>
                </InlineEditable>
              </div>
              <div className="text-center p-6 animate-fade-in delay-200">
                <Award size={48} className="text-accent mx-auto mb-4" />
                <InlineEditable
                  isEditMode={isEditMode}
                  onClick={() => openInlineEdit('value_3_title', 'content', 'Value 3 Title')}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    {getContent('value_3_title')?.content || 'Excellence'}
                  </h3>
                </InlineEditable>
                <InlineEditable
                  isEditMode={isEditMode}
                  onClick={() => openInlineEdit('value_3_content', 'content', 'Value 3 Description')}
                >
                  <p className="text-surface/80">
                    {getContent('value_3_content')?.content || 'We strive for excellence in our service to those in need.'}
                  </p>
                </InlineEditable>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-primary p-8 rounded-lg">
            <InlineEditable
              isEditMode={isEditMode}
              onClick={() => openInlineEdit('cta_title', 'content', 'CTA Title')}
            >
              <h2 className="text-3xl font-bold mb-6">
                {getContent('cta_title')?.content || 'Ready to Make a'} <span className="text-accent">Difference?</span>
              </h2>
            </InlineEditable>
            <InlineEditable
              isEditMode={isEditMode}
              onClick={() => openInlineEdit('cta_content', 'content', 'CTA Description')}
            >
              <p className="text-surface/80 mb-8 max-w-2xl mx-auto">
                {getContent('cta_content')?.content || 'Join us in our mission to create positive change. Whether through donations, volunteering, or spreading awareness, every contribution matters.'}
              </p>
            </InlineEditable>
            <div className="flex flex-wrap justify-center gap-4">
              <InlineEditable
                isEditMode={isEditMode}
                onClick={() => openInlineEdit('donate_button', 'content', 'Donate Button Text')}
              >
                <button className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                  <Heart size={16} />
                  {getContent('donate_button')?.content || 'Donate Now'}
                </button>
              </InlineEditable>
              <InlineEditable
                isEditMode={isEditMode}
                onClick={() => openInlineEdit('volunteer_button', 'content', 'Volunteer Button Text')}
              >
                <button className="border border-accent text-accent px-8 py-3 rounded-full font-medium hover:bg-accent/10 transition-colors">
                  {getContent('volunteer_button')?.content || 'Become a Volunteer'}
                </button>
              </InlineEditable>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-8 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[{text:"Our"},{text:"Events", className:"text-accent"}]}
              />
            </div>
            <InlineEditable
              isEditMode={isEditMode}
              onClick={() => openInlineEdit('events_description', 'content', 'Events Description')}
            >
              <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
                {getContent('events_description')?.content || 'Join us in making a difference. Check out our upcoming events.'}
              </p>
            </InlineEditable>
            {isEditMode && (
              <Button
                className="mt-4 bg-accent text-primary hover:bg-accent/90"
                onClick={() => navigate('/admin/events')}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Manage Events
              </Button>
            )}
          </div>

          {events && events.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {events.slice(0, 4).map((event) => (
                <div key={event.id} className="bg-primary p-6 rounded-lg">
                  {event.image_url && (
                    <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-6" />
                  )}
                  <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                  <div className="flex items-center gap-2 text-surface/80 mb-4">
                    <Calendar size={16} />
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  {event.description && <p className="text-surface/80">{event.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-primary rounded-lg">
              <Calendar className="h-12 w-12 text-surface/40 mx-auto mb-4" />
              <p className="text-surface/60">No events yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[{text:"Our"},{text:"Gallery", className:"text-accent"}]}
              />
            </div>
            <InlineEditable
              isEditMode={isEditMode}
              onClick={() => openInlineEdit('gallery_description', 'content', 'Gallery Description')}
            >
              <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
                {getContent('gallery_description')?.content || 'A visual journey through our initiatives and the lives we\'ve touched along the way.'}
              </p>
            </InlineEditable>
            {isEditMode && (
              <Button
                className="mt-4 bg-accent text-primary hover:bg-accent/90"
                onClick={() => navigate('/admin/gallery')}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Manage Gallery
              </Button>
            )}
          </div>

          {gallery && gallery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery.slice(0, 6).map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg">
                  <img
                    src={item.image_url}
                    alt={item.caption || 'Gallery image'}
                    className="w-full h-64 object-cover"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <p className="text-surface/80">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary rounded-lg">
              <p className="text-surface/60">Gallery images coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-8 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[{text:"Contact"},{text:"Us", className:"text-accent"}]}
              />
            </div>
            <InlineEditable
              isEditMode={isEditMode}
              onClick={() => openInlineEdit('contact_description', 'content', 'Contact Description')}
            >
              <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
                {getContent('contact_description')?.content || 'We\'re here to help. Reach out to us with any questions or concerns.'}
              </p>
            </InlineEditable>
          </div>

          <div className="grid md:grid-cols-2 gap-12 relative group">
            {isEditMode && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-primary hover:bg-accent/90 shadow-lg z-10"
                onClick={() => setIsContactModalOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {/* Contact Form */}
            <div className="animate-fade-in">
              <InlineEditable
                isEditMode={isEditMode}
                onClick={() => openInlineEdit('contact_form_title', 'content', 'Contact Form Title')}
              >
                <h2 className="text-3xl font-bold mb-8">
                  {getContent('contact_form_title')?.content || 'Send us a message'}
                </h2>
              </InlineEditable>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg bg-primary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg bg-primary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg bg-primary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
                >
                  Send Message <Send size={16} />
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="animate-fade-in delay-100">
              <InlineEditable
                isEditMode={isEditMode}
                onClick={() => openInlineEdit('contact_info_title', 'content', 'Contact Info Title')}
              >
                <h2 className="text-3xl font-bold mb-8">
                  {getContent('contact_info_title')?.content || 'Get in touch'}
                </h2>
              </InlineEditable>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-accent flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-surface/80">{contactInfo?.email || 'No email set'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-accent flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-surface/80">{contactInfo?.phone || 'No phone set'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-accent flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-surface/80 whitespace-pre-line">{contactInfo?.address || 'No address set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Make a Difference / Donate Section */}
      <section id="donate" className="py-8 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[{text:"Make"},{text:"a"},{text:"Difference", className:"text-accent"}]}
              />
            </div>
            <InlineEditable
              isEditMode={isEditMode}
              onClick={() => openInlineEdit('donate_description', 'content', 'Donate Description')}
            >
              <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
                {getContent('donate_description')?.content || 'Your contribution can help us continue our mission of supporting those in need through various initiatives.'}
              </p>
            </InlineEditable>
          </div>

          <div className="relative group">
            {isEditMode && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-primary hover:bg-accent/90 shadow-lg z-10"
                onClick={() => setIsContactModalOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <h2 className="text-3xl font-bold mb-12 text-center">
              Ways to <span className="text-accent">Donate</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Sadka & Zakat */}
              <div className="bg-primary p-6 rounded-lg flex flex-col items-center text-center">
                <QrCode className="text-accent mb-6" size={60} />
                <InlineEditable
                  isEditMode={isEditMode}
                  onClick={() => openInlineEdit('qr_1_title', 'content', 'QR Code 1 Title')}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    {getContent('qr_1_title')?.content || 'Sadka & Zakat'}
                  </h3>
                </InlineEditable>
                <div className="space-y-8 text-surface/80">
                  <InlineEditable
                    isEditMode={isEditMode}
                    onClick={() => openInlineEdit('qr_1_description', 'content', 'QR Code 1 Description')}
                  >
                    <p>{getContent('qr_1_description')?.content || 'Scan QR code for Sadka & Zakat donations:'}</p>
                  </InlineEditable>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    {contactInfo?.qr_code_url ? (
                      <img 
                        src={contactInfo.qr_code_url} 
                        alt="QR Code" 
                        className="w-48 h-48 md:w-64 md:h-64 object-contain"
                      />
                    ) : (
                      <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                        <QrCode size={100} className="text-primary/30" />
                      </div>
                    )}
                  </div>
                  <InlineEditable
                    isEditMode={isEditMode}
                    onClick={() => openInlineEdit('qr_1_upi', 'content', 'QR Code 1 UPI ID')}
                  >
                    <p>{getContent('qr_1_upi')?.content || 'UPI ID: sadkazakat@helpother'}</p>
                  </InlineEditable>
                </div>
              </div>

              {/* Lillah */}
              <div className="bg-primary p-6 rounded-lg flex flex-col items-center text-center">
                <QrCode className="text-accent mb-6" size={60} />
                <InlineEditable
                  isEditMode={isEditMode}
                  onClick={() => openInlineEdit('qr_2_title', 'content', 'QR Code 2 Title')}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    {getContent('qr_2_title')?.content || 'Lillah'}
                  </h3>
                </InlineEditable>
                <div className="space-y-8 text-surface/80">
                  <InlineEditable
                    isEditMode={isEditMode}
                    onClick={() => openInlineEdit('qr_2_description', 'content', 'QR Code 2 Description')}
                  >
                    <p>{getContent('qr_2_description')?.content || 'Scan QR code for Lillah donations:'}</p>
                  </InlineEditable>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    {contactInfo?.qr_code_url_2 ? (
                      <img 
                        src={contactInfo.qr_code_url_2} 
                        alt="QR Code 2" 
                        className="w-48 h-48 md:w-64 md:h-64 object-contain"
                      />
                    ) : (
                      <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                        <QrCode size={100} className="text-primary/30" />
                      </div>
                    )}
                  </div>
                  <InlineEditable
                    isEditMode={isEditMode}
                    onClick={() => openInlineEdit('qr_2_upi', 'content', 'QR Code 2 UPI ID')}
                  >
                    <p>{getContent('qr_2_upi')?.content || 'UPI ID: lillah@helpother'}</p>
                  </InlineEditable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-primary border-t border-surface/10">
        <div className="max-w-7xl mx-auto text-center">
          <InlineEditable
            isEditMode={isEditMode}
            onClick={() => openInlineEdit('footer_text', 'content', 'Footer Text')}
          >
            <p className="text-surface/60">
              {getContent('footer_text')?.content || '© 2025 Help Other Foundation. All rights reserved.'}
            </p>
          </InlineEditable>
        </div>
      </footer>

      {/* Modals */}
      <InlineEditModal
        isOpen={!!inlineEdit?.isOpen}
        onClose={() => setInlineEdit(null)}
        fieldType={inlineEdit?.fieldType || 'text'}
        fieldLabel={inlineEdit?.fieldLabel || ''}
        currentValue={inlineEdit?.currentValue || ''}
        onSave={handleInlineSave}
        isSaving={isSaving}
      />

      <ActivityEditModal
        isOpen={!!editingActivity || isNewActivity}
        onClose={() => {
          setEditingActivity(null);
          setIsNewActivity(false);
        }}
        activity={editingActivity}
        onSave={handleSaveActivity}
        isSaving={updateActivity.isPending || createActivity.isPending}
        isNew={isNewActivity}
      />

      <ContactEditModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contactInfo={contactInfo}
        onSave={handleSaveContact}
        isSaving={updateContact.isPending}
      />
    </div>
  );
};

export default VisualCMS;
