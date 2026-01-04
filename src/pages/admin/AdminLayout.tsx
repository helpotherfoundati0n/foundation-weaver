import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Image, 
  Phone, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/content', icon: FileText, label: 'Site Content' },
    { to: '/admin/events', icon: Calendar, label: 'Events' },
    { to: '/admin/gallery', icon: Image, label: 'Gallery' },
    { to: '/admin/contact', icon: Phone, label: 'Contact & QR' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const NavItem = ({ to, icon: Icon, label, end }: { to: string; icon: any; label: string; end?: boolean }) => (
    <NavLink
      to={to}
      end={end}
      onClick={() => setIsMobileMenuOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-accent text-primary' 
            : 'text-surface/70 hover:bg-surface/10 hover:text-surface'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-secondary flex-col border-r border-surface/10">
        <div className="p-6 border-b border-surface/10">
          <h1 className="text-xl font-bold text-surface">Admin Panel</h1>
          <p className="text-sm text-surface/60 mt-1 truncate">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        
        <div className="p-4 border-t border-surface/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-surface/70 hover:text-red-400 hover:bg-red-400/10"
            onClick={handleSignOut}
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-secondary border-b border-surface/10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-surface">Admin Panel</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-surface"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-primary/95 pt-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-surface/70 hover:text-red-400 hover:bg-red-400/10 mt-4"
              onClick={handleSignOut}
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
