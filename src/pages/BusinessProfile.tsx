import { useParams } from "react-router-dom";
import { MapPin, Phone, Clock, Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import food1 from "@/assets/food-1.jpg";

const BusinessProfile = () => {
  const { id } = useParams();

  const business = {
    name: "Mama Ngozi's Kitchen",
    image: food1,
    cuisine: "Traditional Nigerian",
    location: "123 Market Street, Lagos, Nigeria",
    phone: "+234 801 234 5678",
    rating: 4.8,
    reviews: 142,
    priceRange: "$$",
    hours: "Mon-Sat: 8am - 10pm",
    description: "Experience authentic Nigerian home cooking at its finest. Mama Ngozi has been serving the community for over 15 years with recipes passed down through generations.",
    menu: [
      { name: "Jollof Rice with Chicken", price: "₦2,500" },
      { name: "Egusi Soup with Pounded Yam", price: "₦3,000" },
      { name: "Suya Platter", price: "₦1,800" },
      { name: "Moi Moi", price: "₦800" },
      { name: "Chin Chin (Snack)", price: "₦500" },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Image */}
        <div className="h-96 relative">
          <img
            src={business.image}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 container text-white">
            <Badge className="mb-3 bg-secondary">{business.cuisine}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{business.name}</h1>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-accent text-accent mr-1" />
                <span className="font-semibold">{business.rating}</span>
                <span className="ml-1">({business.reviews} reviews)</span>
              </div>
              <span>•</span>
              <span>{business.priceRange}</span>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold">About</h2>
                  <p className="text-muted-foreground">{business.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold">Menu</h2>
                  <div className="space-y-3">
                    {business.menu.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center py-2">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-primary font-semibold">{item.price}</span>
                        </div>
                        {index < business.menu.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Button className="w-full" size="lg">
                    Contact Business
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{business.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{business.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Hours</p>
                        <p className="text-sm text-muted-foreground">{business.hours}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BusinessProfile;
