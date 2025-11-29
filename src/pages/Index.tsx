import { useState, useEffect } from "react";
import { Search, TrendingUp, MapPin, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { toast } from "sonner";
import heroImage from "@/assets/hero-food.jpg";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import kasiKota from "@/assets/tasteLocal-Kota.jpg";
import kasiChisanyama from "@/assets/tasteLocal-chisanyama.jpg";
import kasiCorner from "@/assets/tasteLocal-corner.jpg";
import vendorImage from "@/assets/vendor-business.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero carousel images
  const heroImages = [
    heroImage,
    kasiKota,
    kasiChisanyama,
    kasiCorner,
    food1,
    food2,
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/discover");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewAllRestaurants = () => {
    navigate("/discover");
  };

  const handleRegisterBusiness = () => {
    if (isAuthenticated && user?.role === "business_owner") {
      navigate("/vendor-dashboard");
      toast.success("Welcome back to your dashboard! 🏪");
    } else if (isAuthenticated) {
      navigate("/business-onboarding");
      toast.info("Let's set up your business profile! 🚀");
    } else {
      navigate("/register");
      toast.info("Register as a business owner to get started! 📝");
    }
  };

  const featuredBusinesses = [
    {
      id: "1",
      name: "Mama Thandi's Shisa Nyama",
      image: food1,
      cuisine: "Braai & Grill",
      location: "Soweto, Johannesburg",
      rating: 4.8,
      priceRange: "R",
      distance: "1.2km",
    },
    {
      id: "2",
      name: "Kota King",
      image: food2,
      cuisine: "Street Food",
      location: "Alexandra, Johannesburg",
      rating: 4.6,
      priceRange: "R",
      distance: "0.8km",
    },
    {
      id: "3",
      name: "Bunny Chow Palace",
      image: food1,
      cuisine: "Durban Curry",
      location: "Umlazi, Durban",
      rating: 4.9,
      priceRange: "R",
      distance: "2.1km",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Carousel Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/60" />
          </div>
        ))}

        <div className="relative z-10 container text-center text-white space-y-6 px-4">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Discover the Best
            <br />
            <span className="text-accent">Kasi Flavors 🔥</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white/90">
            Connect with local spots, shisa nyamas, and hidden gems in your township
          </p>

          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for kotas, bunny chow, pap & vleis..."
                className="pl-10 h-12 bg-white text-black placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button size="lg" className="h-12 px-8" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">5,000+</div>
              <p className="text-muted-foreground">Local Businesses</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">50,000+</div>
              <p className="text-muted-foreground">Happy Food Lovers</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">20+</div>
              <p className="text-muted-foreground">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16">
        <div className="container space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">
              Kasi Spots <span className="text-primary">Near You 📍</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover authentic township eateries handpicked by the community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} {...business} />
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" onClick={handleViewAllRestaurants}>
              View All Restaurants
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section for Businesses */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                Grow Your Food Business Online
              </h2>
              <p className="text-lg text-white/90">
                Join TasteLocal and reach thousands of hungry customers. Get access to analytics, 
                marketing tools, and a supportive community of entrepreneurs.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-6 w-6 text-accent mt-1" />
                  <div>
                    <h4 className="font-semibold">Increase Visibility</h4>
                    <p className="text-sm text-white/80">Be discovered by local food lovers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-accent mt-1" />
                  <div>
                    <h4 className="font-semibold">Learn & Grow</h4>
                    <p className="text-sm text-white/80">Access free business resources</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-accent mt-1" />
                  <div>
                    <h4 className="font-semibold">Connect Locally</h4>
                    <p className="text-sm text-white/80">Network with other entrepreneurs</p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" variant="secondary" className="mt-6" onClick={handleRegisterBusiness}>
                Register Your Business
              </Button>
            </div>
            
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={vendorImage}
                alt="Local business owner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
