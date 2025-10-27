import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, BookOpen } from 'lucide-react';
import { useBusiness } from '@/contexts/BusinessContext';

const BusinessMediaDisplay = () => {
  const { business } = useBusiness();

  if (!business) return null;

  const photos = business.media.filter((m) => m.type === 'photo');
  const videos = business.media.filter((m) => m.type === 'video');
  const publishedPosts = business.blog.filter((p) => p.published);

  if (photos.length === 0 && videos.length === 0 && publishedPosts.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue="photos" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {photos.length > 0 && (
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Gallery</span>
          </TabsTrigger>
        )}
        {videos.length > 0 && (
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
        )}
        {publishedPosts.length > 0 && (
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </TabsTrigger>
        )}
      </TabsList>

      {photos.length > 0 && (
        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Photo Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="rounded-lg overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform"
                    />
                    <div className="p-3 bg-muted">
                      <h4 className="font-semibold text-sm">{photo.title}</h4>
                      {photo.description && (
                        <p className="text-xs text-muted-foreground mt-1">{photo.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {videos.length > 0 && (
        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{video.title}</h4>
                    {video.description && (
                      <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                    )}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Video className="h-4 w-4" />
                      Watch on {video.url.includes('youtube') ? 'YouTube' : 'Vimeo'} →
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {publishedPosts.length > 0 && (
        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>Latest Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {publishedPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex gap-4">
                      {post.image && (
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{post.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default BusinessMediaDisplay;

