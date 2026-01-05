import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Upload, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ContactInfo {
  id: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  qr_code_url: string | null;
  qr_code_url_2: string | null;
}

interface ContactEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo: ContactInfo | null;
  onSave: (data: Partial<ContactInfo>) => Promise<void>;
  isSaving: boolean;
}

export const ContactEditModal: React.FC<ContactEditModalProps> = ({
  isOpen,
  onClose,
  contactInfo,
  onSave,
  isSaving,
}) => {
  const { uploadImage, isUploading } = useImageUpload();
  
  const [form, setForm] = useState({
    phone: '',
    email: '',
    address: '',
    qr_code_url: '',
    qr_code_url_2: '',
  });

  useEffect(() => {
    if (contactInfo) {
      setForm({
        phone: contactInfo.phone || '',
        email: contactInfo.email || '',
        address: contactInfo.address || '',
        qr_code_url: contactInfo.qr_code_url || '',
        qr_code_url_2: contactInfo.qr_code_url_2 || '',
      });
    }
  }, [contactInfo]);

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'qr_code_url' | 'qr_code_url_2') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await uploadImage(file, 'contact');
    if (url) {
      setForm({ ...form, [field]: url });
    }
  };

  const handleSave = async () => {
    await onSave(form);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-secondary border-surface/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-surface">Edit Contact Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-surface">Phone Number</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="bg-primary border-surface/20 text-surface"
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-surface">Email Address</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-primary border-surface/20 text-surface"
              placeholder="contact@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-surface">Address</Label>
            <Textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="bg-primary border-surface/20 text-surface min-h-[80px]"
              placeholder="Full address..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* QR Code 1 - Sadka & Zakat */}
            <div className="space-y-2">
              <Label className="text-surface">QR Code - Sadka & Zakat</Label>
              {form.qr_code_url && (
                <div className="relative mb-2 inline-block">
                  <img
                    src={form.qr_code_url}
                    alt="QR Code 1"
                    className="w-32 h-32 object-contain rounded-lg border border-surface/20"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => setForm({ ...form, qr_code_url: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleQRUpload(e, 'qr_code_url')}
                  className="hidden"
                  id="qr-image-1"
                />
                <Label
                  htmlFor="qr-image-1"
                  className="flex items-center gap-2 px-4 py-2 bg-primary border border-surface/20 rounded-md text-surface cursor-pointer hover:bg-surface/10 text-sm"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload
                </Label>
              </div>
            </div>

            {/* QR Code 2 - Lillah */}
            <div className="space-y-2">
              <Label className="text-surface">QR Code - Lillah</Label>
              {form.qr_code_url_2 && (
                <div className="relative mb-2 inline-block">
                  <img
                    src={form.qr_code_url_2}
                    alt="QR Code 2"
                    className="w-32 h-32 object-contain rounded-lg border border-surface/20"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => setForm({ ...form, qr_code_url_2: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleQRUpload(e, 'qr_code_url_2')}
                  className="hidden"
                  id="qr-image-2"
                />
                <Label
                  htmlFor="qr-image-2"
                  className="flex items-center gap-2 px-4 py-2 bg-primary border border-surface/20 rounded-md text-surface cursor-pointer hover:bg-surface/10 text-sm"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactEditModal;