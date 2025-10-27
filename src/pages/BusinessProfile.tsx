import { useParams } from "react-router-dom";
import { MapPin, Phone, Clock, Star, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import { toast } from "sonner";
import food1 from "@/assets/food-1.jpg";

const BusinessProfile = () => {
  const { id } = useParams();

  const business = {
    name: "Mama Thandi's Shisa Nyama",
    image: food1,
    cuisine: "Traditional South African",
    location: "Vilakazi Street, Soweto, Johannesburg",
    phone: "+27 71 234 5678",
    whatsapp: "27712345678",
    rating: 4.8,
    reviews: 142,
    priceRange: "R",
    hours: "Mon-Sat: 10am - 10pm, Sun: 12pm - 8pm",
    description: "Eish! Welcome to the best shisa nyama in Soweto! Mama Thandi has been serving the community for over 15 years with authentic kasi flavors. From perfectly grilled boerewors to tender lamb chops, we bring you that real township taste. Come through and experience the vibe! 🔥",
    menu: [
      { name: "Pap & Vleis Combo", price: "R85" },
      { name: "Boerewors Roll", price: "R45" },
      { name: "Lamb Chops (4 pieces)", price: "R120" },
      { name: "Chicken Braai Quarter", price: "R65" },
      { name: "Chakalaka & Pap", price: "R35" },
      { name: "Kota (Quarter Loaf)", price: "R55" },
    ],
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Sawubona! I'd like to place an order from ${business.name}. Can you help me? 🍽️`
    );
    const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp... 📱");
  };

  const handleShare = async () => {
    const shareData = {
      title: business.name,
      text: `Check out ${business.name} on TasteLocal! ${business.description.slice(0, 100)}...`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Sharp! Thanks for sharing! 🙌");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied! Share it with your crew! 📋");
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

              {/* Reviews Section */}
              <ReviewSection businessId={id || "1"} businessName={business.name} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    onClick={handleWhatsAppOrder}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Order on WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share with Friends
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
