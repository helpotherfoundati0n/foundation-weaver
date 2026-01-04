import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useContactInfo, useUpdateContactInfo } from '@/hooks/useContactInfo';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Loader2, Save, Upload, X, QrCode, Phone, Mail, MapPin } from 'lucide-react';

const AdminContact = () => {
  const { data: contactInfo, isLoading } = useContactInfo();
  const updateContact = useUpdateContactInfo();
  const { uploadImage, isUploading } = useImageUpload();
  
  const [form, setForm] = useState({
    phone: '',
    email: '',
    address: '',
    qr_code_url: '',
  });

  useEffect(() => {
    if (contactInfo) {
      setForm({
        phone: contactInfo.phone || '',
        email: contactInfo.email || '',
        address: contactInfo.address || '',
        qr_code_url: contactInfo.qr_code_url || '',
      });
    }
  }, [contactInfo]);

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await uploadImage(file, 'qr-codes');
    if (url) {
      setForm({ ...form, qr_code_url: url });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo?.id) return;
    
    await updateContact.mutateAsync({ id: contactInfo.id, ...form });
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
      <div>
        <h1 className="text-3xl font-bold text-surface">Contact & QR Code</h1>
        <p className="text-surface/60 mt-2">Manage contact information and QR code</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact Details */}
          <Card className="bg-secondary border-surface/10">
            <CardHeader>
              <CardTitle className="text-surface">Contact Details</CardTitle>
              <CardDescription className="text-surface/60">
                Update your organization's contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-surface flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+352 123 456 789"
                  className="bg-primary border-surface/20 text-surface"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-surface flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contact@example.com"
                  className="bg-primary border-surface/20 text-surface"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-surface flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter your address"
                  className="bg-primary border-surface/20 text-surface min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="bg-secondary border-surface/10">
            <CardHeader>
              <CardTitle className="text-surface flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code
              </CardTitle>
              <CardDescription className="text-surface/60">
                Upload a QR code for donations or contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.qr_code_url ? (
                <div className="relative inline-block">
                  <img 
                    src={form.qr_code_url} 
                    alt="QR Code" 
                    className="w-48 h-48 object-contain bg-white rounded-lg p-2"
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
              ) : (
                <div className="border-2 border-dashed border-surface/20 rounded-lg p-8 text-center">
                  <QrCode className="h-12 w-12 text-surface/40 mx-auto mb-4" />
                  <p className="text-surface/60 mb-4">No QR code uploaded</p>
                </div>
              )}
              
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleQrUpload}
                  className="hidden"
                  id="qr-upload"
                />
                <Label
                  htmlFor="qr-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary border border-surface/20 rounded-md text-surface cursor-pointer hover:bg-surface/10"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {form.qr_code_url ? 'Replace QR Code' : 'Upload QR Code'}
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button 
          type="submit" 
          className="bg-accent text-primary hover:bg-accent/90"
          disabled={updateContact.isPending}
        >
          {updateContact.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default AdminContact;
