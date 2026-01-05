import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Save, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings = () => {
  const { user, session, updatePassword } = useAuth();
  
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error('You must be logged in to update your password');
      return;
    }
    
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsUpdatingPassword(true);
    
    const { error } = await updatePassword(passwordForm.password);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully');
      setPasswordForm({ password: '', confirmPassword: '' });
    }
    
    setIsUpdatingPassword(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-surface">Settings</h1>
        <p className="text-surface/60 mt-2">Manage your account settings</p>
      </div>

      {/* Current User Info */}
      <Card className="bg-secondary border-surface/10">
        <CardHeader>
          <CardTitle className="text-surface flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription className="text-surface/60">
            Your current account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-surface font-medium">{user?.email}</p>
              <p className="text-surface/60 text-sm">Administrator</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Password */}
      <Card className="bg-secondary border-surface/10">
        <CardHeader>
          <CardTitle className="text-surface flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Update Password
          </CardTitle>
          <CardDescription className="text-surface/60">
            Change your login password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label className="text-surface">New Password</Label>
              <PasswordInput
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                placeholder="••••••••"
                className="bg-primary border-surface/20 text-surface"
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-surface">Confirm New Password</Label>
              <PasswordInput
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="bg-primary border-surface/20 text-surface"
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-accent text-primary hover:bg-accent/90"
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;