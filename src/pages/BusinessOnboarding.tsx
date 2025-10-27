import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { firestoreBusinessService } from '@/services/firestoreBusinessService';

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { business } = useBusiness();
  const [formData, setFormData] = useState({
    name: business?.name || '',
    phone: business?.phone || '',
    location: business?.location || '',
    description: business?.description || '',
  });

  if (!user?.businessId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                You need to register as a business owner to access this page.
              </p>
              <Button onClick={() => navigate('/register')}>Register as Business Owner</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Update business data in Firestore
      const businessData = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        description: formData.description,
        menu: business?.menu || [],
        orders: business?.orders || [],
        hours: business?.hours || [
          { day: 'Monday', open: '10:00', close: '22:00', closed: false },
          { day: 'Tuesday', open: '10:00', close: '22:00', closed: false },
          { day: 'Wednesday', open: '10:00', close: '22:00', closed: false },
          { day: 'Thursday', open: '10:00', close: '22:00', closed: false },
          { day: 'Friday', open: '10:00', close: '23:00', closed: false },
          { day: 'Saturday', open: '10:00', close: '23:00', closed: false },
          { day: 'Sunday', open: '12:00', close: '20:00', closed: false },
        ],
        notifications: business?.notifications || [],
        media: business?.media || [],
        blog: business?.blog || [],
        rating: business?.rating || 4.5,
        totalOrders: business?.totalOrders || 0,
      };

      await firestoreBusinessService.updateBusiness(user.businessId!, businessData);
      toast.success('Business profile updated! 🎉');
      navigate('/vendor-dashboard');
    } catch (error) {
      console.error('Error updating business:', error);
      toast.error('Failed to update business profile');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-muted/30">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Set Up Your Business Profile</h1>
              <p className="text-muted-foreground">
                Complete your business information to start managing orders and menu items.
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Mama Thandi's Shisa Nyama"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+27 71 234 5678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="e.g., Soweto, Johannesburg"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Tell customers about your business..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Save & Go to Dashboard
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BusinessOnboarding;

