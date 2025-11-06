import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Plus, Eye, EyeOff } from 'lucide-react';
import { useBusiness, BlogPost } from '@/contexts/BusinessContext';
import { toast } from 'sonner';
import FirebaseImageUpload from './FirebaseImageUpload';

const BlogManagement = () => {
  const { business, addBlogPost, updateBlogPost, deleteBlogPost } = useBusiness();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    published: false,
  });

  if (!business) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No business data found</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      const now = new Date().toISOString();

      if (editingId) {
        const existingPost = business.blog.find((p) => p.id === editingId);
        if (existingPost) {
          const updatedPost: BlogPost = {
            id: editingId,
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            image: formData.image,
            author: existingPost.author,
            createdAt: existingPost.createdAt,
            updatedAt: now,
            published: formData.published,
          };
          await updateBlogPost(editingId, updatedPost);
          toast.success('Blog post updated! 📝');
          setEditingId(null);
        }
      } else {
        const newPost: BlogPost = {
          id: `blog_${Date.now()}`,
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          image: formData.image,
          author: 'Business Owner',
          createdAt: now,
          updatedAt: now,
          published: formData.published,
        };
        await addBlogPost(newPost);
        toast.success('Blog post created! 📝');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post. Please try again.');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image || '',
      published: post.published,
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteBlogPost(id);
        toast.success('Blog post deleted');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      published: false,
    });
    setShowForm(false);
  };

  const publishedPosts = business.blog.filter((p) => p.published);
  const draftPosts = business.blog.filter((p) => !p.published);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <p className="text-muted-foreground">Share stories and updates with your customers</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Post Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., New Menu Items This Season"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary for preview..."
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog post content here..."
                  rows={6}
                />
              </div>

              <FirebaseImageUpload
                onImageSelect={(url) => setFormData({ ...formData, image: url })}
                currentImage={formData.image}
                label="Featured Image"
                storagePath={`businesses/${business.id}/blog`}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publish immediately
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? 'Update Post' : 'Create Post'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {publishedPosts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Published ({publishedPosts.length})
            </h3>
            <div className="space-y-4">
              {publishedPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {post.image && (
                        <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{post.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge>Published</Badge>
                        </div>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {draftPosts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <EyeOff className="h-5 w-5" />
              Drafts ({draftPosts.length})
            </h3>
            <div className="space-y-4">
              {draftPosts.map((post) => (
                <Card key={post.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {post.image && (
                        <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{post.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary">Draft</Badge>
                        </div>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {business.blog.length === 0 && !showForm && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No blog posts yet</p>
              <Button onClick={() => setShowForm(true)}>Create Your First Post</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;

