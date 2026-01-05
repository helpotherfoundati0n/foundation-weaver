import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, History, RotateCcw } from 'lucide-react';
import { useContentHistory, useRestoreContentVersion } from '@/hooks/useContentHistory';

interface SectionStyles {
  backgroundColor?: string;
  titleColor?: string;
  titleSize?: string;
  contentColor?: string;
  contentSize?: string;
}

interface SectionData {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  styles?: SectionStyles;
}

interface SectionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: SectionData | null;
  onSave: (id: string, data: { title?: string; content?: string; styles?: SectionStyles }) => Promise<void>;
  isSaving: boolean;
}

const colorPresets = [
  { label: 'Primary', value: 'hsl(var(--primary))' },
  { label: 'Secondary', value: 'hsl(var(--secondary))' },
  { label: 'Accent', value: 'hsl(var(--accent))' },
  { label: 'Surface', value: 'hsl(var(--surface))' },
  { label: 'Transparent', value: 'transparent' },
];

const fontSizes = [
  { label: 'Small', value: '0.875rem' },
  { label: 'Base', value: '1rem' },
  { label: 'Large', value: '1.25rem' },
  { label: 'XL', value: '1.5rem' },
  { label: '2XL', value: '2rem' },
  { label: '3XL', value: '2.5rem' },
];

export const SectionEditModal: React.FC<SectionEditModalProps> = ({
  isOpen,
  onClose,
  section,
  onSave,
  isSaving,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [styles, setStyles] = useState<SectionStyles>({});
  const [activeTab, setActiveTab] = useState('content');

  const { data: history, isLoading: historyLoading } = useContentHistory(section?.id || '');
  const restoreVersion = useRestoreContentVersion();

  useEffect(() => {
    if (section) {
      setTitle(section.title || '');
      setContent(section.content || '');
      setStyles(section.styles || {});
    }
  }, [section]);

  const handleSave = async () => {
    if (!section) return;
    await onSave(section.id, { title, content, styles });
    onClose();
  };

  const handleRestore = async (historyId: string) => {
    if (!section) return;
    await restoreVersion.mutateAsync({ contentId: section.id, historyId });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-secondary border-surface/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-surface">
            Edit: {section?.section_key.replace(/_/g, ' ')}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-primary">
            <TabsTrigger value="content" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
              Content
            </TabsTrigger>
            <TabsTrigger value="styles" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
              Styles
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
              <History className="h-4 w-4 mr-1" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-surface">Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-primary border-surface/20 text-surface"
                placeholder="Section title"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-surface">Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-primary border-surface/20 text-surface min-h-[150px]"
                placeholder="Section content..."
              />
            </div>
          </TabsContent>

          <TabsContent value="styles" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-surface">Background Color</Label>
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    type="button"
                    size="sm"
                    variant={styles.backgroundColor === preset.value ? 'default' : 'outline'}
                    className={styles.backgroundColor === preset.value ? 'bg-accent text-primary' : 'border-surface/20 text-surface'}
                    onClick={() => setStyles({ ...styles, backgroundColor: preset.value })}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <Input
                type="text"
                value={styles.backgroundColor || ''}
                onChange={(e) => setStyles({ ...styles, backgroundColor: e.target.value })}
                className="bg-primary border-surface/20 text-surface"
                placeholder="Custom color (e.g., #ff5500)"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-surface">Title Size</Label>
              <div className="flex gap-2 flex-wrap">
                {fontSizes.map((size) => (
                  <Button
                    key={size.value}
                    type="button"
                    size="sm"
                    variant={styles.titleSize === size.value ? 'default' : 'outline'}
                    className={styles.titleSize === size.value ? 'bg-accent text-primary' : 'border-surface/20 text-surface'}
                    onClick={() => setStyles({ ...styles, titleSize: size.value })}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-surface">Title Color</Label>
              <Input
                type="text"
                value={styles.titleColor || ''}
                onChange={(e) => setStyles({ ...styles, titleColor: e.target.value })}
                className="bg-primary border-surface/20 text-surface"
                placeholder="e.g., hsl(var(--accent)) or #ff5500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-surface">Content Color</Label>
              <Input
                type="text"
                value={styles.contentColor || ''}
                onChange={(e) => setStyles({ ...styles, contentColor: e.target.value })}
                className="bg-primary border-surface/20 text-surface"
                placeholder="e.g., hsl(var(--surface)) or #ffffff"
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : history && history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-primary p-4 rounded-lg border border-surface/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-surface/60">
                        {new Date(item.changed_at).toLocaleString()}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-surface/20 text-surface hover:bg-accent hover:text-primary"
                        onClick={() => handleRestore(item.id)}
                        disabled={restoreVersion.isPending}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                    <p className="text-surface text-sm font-medium">
                      {item.previous_title || '(No title)'}
                    </p>
                    <p className="text-surface/60 text-sm line-clamp-2">
                      {item.previous_content || '(No content)'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-surface/60 text-center py-8">
                No previous versions available
              </p>
            )}
          </TabsContent>
        </Tabs>

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
            Save Changes
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

export default SectionEditModal;
