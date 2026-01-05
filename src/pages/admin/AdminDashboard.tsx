import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/hooks/useEvents';
import { useGallery } from '@/hooks/useGallery';
import { useSiteContent } from '@/hooks/useSiteContent';
import { Calendar, Image, FileText, TrendingUp, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const { data: events } = useEvents();
  const { data: gallery } = useGallery();
  const { data: content } = useSiteContent();

  const stats = [
    {
      title: 'Active Events',
      value: events?.filter(e => e.is_active).length || 0,
      icon: Calendar,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      title: 'Gallery Images',
      value: gallery?.length || 0,
      icon: Image,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      title: 'Content Sections',
      value: content?.length || 0,
      icon: FileText,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    {
      title: 'Total Events',
      value: events?.length || 0,
      icon: TrendingUp,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface">Dashboard</h1>
          <p className="text-surface/60 mt-2">Welcome to your admin dashboard</p>
        </div>
        <Link to="/admin/visual-cms">
          <Button className="bg-accent text-primary hover:bg-accent/90">
            <Eye className="h-4 w-4 mr-2" />
            Visual CMS Editor
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-secondary border-surface/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-surface/60 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-surface mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-secondary border-surface/10">
          <CardHeader>
            <CardTitle className="text-surface">Recent Events</CardTitle>
            <CardDescription className="text-surface/60">
              Your latest events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {events && events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-primary/50">
                    <Calendar className="h-5 w-5 text-accent" />
                    <div className="flex-1 min-w-0">
                      <p className="text-surface font-medium truncate">{event.title}</p>
                      <p className="text-surface/60 text-sm">
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.is_active 
                        ? 'bg-green-400/10 text-green-400' 
                        : 'bg-surface/10 text-surface/60'
                    }`}>
                      {event.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-surface/60 text-center py-8">No events yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-secondary border-surface/10">
          <CardHeader>
            <CardTitle className="text-surface">Quick Actions</CardTitle>
            <CardDescription className="text-surface/60">
              Common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a 
              href="/admin/events" 
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/50 hover:bg-accent/10 transition-colors group"
            >
              <Calendar className="h-5 w-5 text-surface/60 group-hover:text-accent" />
              <span className="text-surface group-hover:text-accent">Add New Event</span>
            </a>
            <a 
              href="/admin/gallery" 
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/50 hover:bg-accent/10 transition-colors group"
            >
              <Image className="h-5 w-5 text-surface/60 group-hover:text-accent" />
              <span className="text-surface group-hover:text-accent">Upload Images</span>
            </a>
            <a 
              href="/admin/content" 
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/50 hover:bg-accent/10 transition-colors group"
            >
              <FileText className="h-5 w-5 text-surface/60 group-hover:text-accent" />
              <span className="text-surface group-hover:text-accent">Edit Content</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
