import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { useBusiness, MenuItem } from '@/contexts/BusinessContext';
import { toast } from 'sonner';

const MenuManagement = () => {
  const { business, addMenuItem, updateMenuItem, deleteMenuItem } = useBusiness();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    available: true,
  });

  if (!business) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No business data found</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateMenuItem(editingId, formData);
      toast.success('Menu item updated! 🎉');
      setEditingId(null);
    } else {
      const newItem: MenuItem = {
        id: `item_${Date.now()}`,
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || '',
        category: formData.category || 'Main Course',
        available: formData.available ?? true,
      };
      addMenuItem(newItem);
      toast.success('Menu item added! 🍽️');
    }

    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      available: true,
    });
    setShowForm(false);
  };

  const handleEdit = (item: MenuItem) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteMenuItem(id);
    toast.success('Menu item deleted! 🗑️');
  };

  const categories = ['Main Course', 'Sides', 'Drinks', 'Desserts', 'Snacks'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              category: 'Main Course',
              available: true,
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Pap & Vleis"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (R) *</Label>
                  <Input
                    id="price"
                    value={formData.price || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="e.g., 85"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || 'Main Course'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your dish..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? 'Update Item' : 'Add Item'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {business.menu.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                <Badge variant={item.available ? 'default' : 'secondary'}>
                  {item.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
              )}
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-primary">R{item.price}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {business.menu.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No menu items yet</p>
            <Button onClick={() => setShowForm(true)}>Add Your First Item</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuManagement;

