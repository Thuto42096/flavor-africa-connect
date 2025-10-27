import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { businessService, Business } from "@/services/businessService";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";

const Discover = () => {
  const [cuisine, setCuisine] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackBusinesses = [
    { id: "1", name: "Mama Thandi's Shisa Nyama", image: food1, cuisine: "Braai & Grill", location: "Soweto, Johannesburg", rating: 4.8, priceRange: "R", distance: "1.2km" },
    { id: "2", name: "Kota King", image: food2, cuisine: "Street Food", location: "Alexandra, Johannesburg", rating: 4.6, priceRange: "R", distance: "0.8km" },
    { id: "3", name: "Bunny Chow Palace", image: food1, cuisine: "Durban Curry", location: "Umlazi, Durban", rating: 4.9, priceRange: "R", distance: "2.1km" },
  ];

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await businessService.getAll();
        setBusinesses(data);
      } catch (error) {
        console.error('Firebase not configured, using fallback data');
        setBusinesses(fallbackBusinesses);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container py-8 flex-1">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Discover Local Food</h1>
            <p className="text-muted-foreground">Explore restaurants and food stalls in your area</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 p-6 bg-card rounded-lg border border-border">
            <Input placeholder="Search by name or location..." className="md:flex-1" />
            
            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Cuisine Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="traditional">Traditional</SelectItem>
                <SelectItem value="street">Street Food</SelectItem>
                <SelectItem value="west-african">West African</SelectItem>
                <SelectItem value="seafood">Seafood</SelectItem>
                <SelectItem value="fusion">Fusion</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="$">$ - Budget</SelectItem>
                <SelectItem value="$$">$$ - Moderate</SelectItem>
                <SelectItem value="$$$">$$$ - Premium</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Results */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {loading ? 'Loading...' : `Showing ${businesses.length} restaurants`}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} {...business} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Discover;
