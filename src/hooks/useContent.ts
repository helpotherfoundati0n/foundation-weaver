import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useContent = () => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [sectionsData, contactData] = await Promise.all([
        supabase.from('content_sections').select('*'),
        supabase.from('contact_info').select('*').order('order_index')
      ]);

      if (sectionsData.data) setContentSections(sectionsData.data);
      if (contactData.data) setContactInfo(contactData.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContent = (sectionKey: string) => {
    const section = contentSections.find(s => s.section_key === sectionKey);
    return {
      title: section?.title || '',
      content: section?.content || ''
    };
  };

  const getContactByKey = (key: string) => {
    return contactInfo.find(c => c.info_key === key);
  };

  return {
    contentSections,
    contactInfo,
    loading,
    getContent,
    getContactByKey,
    refetch: fetchContent
  };
};