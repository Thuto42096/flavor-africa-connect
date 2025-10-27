import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Image as ImageIcon, Video } from 'lucide-react';
import { useBusiness, MediaItem } from '@/contexts/BusinessContext';
import { toast } from 'sonner';
import FirebaseImageUpload from './FirebaseImageUpload';

const MediaGallery = () => {
  const { business, addMediaItem, deleteMediaItem } = useBusiness();
  const [showForm, setShowForm] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
  });

  if (!business) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No business data found</p>
      </div>
    );
  }

  const handlePhotoSubmit = (url: string) => {
    if (!formData.title) {
      toast.error('Please add a title');
      return;
    }

    const newMedia: MediaItem = {
      id: `media_${Date.now()}`,
      type: 'photo',
      title: formData.title,
      description: formData.description,
      url: url,
      uploadedAt: new Date().toISOString(),
    };

    addMediaItem(newMedia);
    toast.success('Photo added to gallery! 📸');
    resetForm();
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate YouTube/Vimeo URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\//;

    if (!youtubeRegex.test(formData.url) && !vimeoRegex.test(formData.url)) {
      toast.error('Please enter a valid YouTube or Vimeo URL');
      return;
    }

    const newMedia: MediaItem = {
      id: `media_${Date.now()}`,
      type: 'video',
      title: formData.title,
      description: formData.description,
      url: formData.url,
      uploadedAt: new Date().toISOString(),
    };

    addMediaItem(newMedia);
    toast.success('Video added! 🎬');
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', url: '' });
    setShowForm(false);
  };

  const photos = business.media.filter((m) => m.type === 'photo');
  const videos = business.media.filter((m) => m.type === 'video');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Media Gallery</h2>
          <p className="text-muted-foreground">Showcase your food and restaurant</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Media
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-6">
            <Tabs value={mediaType} onValueChange={(v) => setMediaType(v as 'photo' | 'video')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="photo">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Photo
                </TabsTrigger>
                <TabsTrigger value="video">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="photo" className="space-y-4">
                <div>
                  <Label htmlFor="photo-title">Title *</Label>
                  <Input
                    id="photo-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Grilled Lamb Chops"
                  />
                </div>

                <div>
                  <Label htmlFor="photo-desc">Description</Label>
                  <Textarea
                    id="photo-desc"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the photo..."
                    rows={2}
                  />
                </div>

                <FirebaseImageUpload
                  onImageSelect={handlePhotoSubmit}
                  label="Upload Photo"
                  storagePath={`businesses/${business.id}/media`}
                />

                <Button variant="outline" onClick={resetForm} className="w-full">
                  Cancel
                </Button>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <form onSubmit={handleVideoSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="video-title">Title *</Label>
                    <Input
                      id="video-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Restaurant Tour"
                    />
                  </div>

                  <div>
                    <Label htmlFor="video-url">YouTube or Vimeo URL *</Label>
                    <Input
                      id="video-url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="video-desc">Description</Label>
                    <Textarea
                      id="video-desc"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the video..."
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Add Video
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos">
            Photos ({photos.length})
          </TabsTrigger>
          <TabsTrigger value="videos">
            Videos ({videos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4">
          {photos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No photos yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-sm text-muted-foreground mb-3">{photo.description}</p>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMediaItem(photo.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          {videos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No videos yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((video) => (
                <Card key={video.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                    )}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm mb-3 block"
                    >
                      Watch on {video.url.includes('youtube') ? 'YouTube' : 'Vimeo'} →
                    </a>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMediaItem(video.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaGallery;

