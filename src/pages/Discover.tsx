import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { businessService, Business } from "@/services/businessService";
import { seedDatabase } from "@/services/seedData";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";

const Discover = () => {
  const [searchParams] = useSearchParams();
  const [cuisine, setCuisine] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackBusinesses = [
    { id: "1", name: "Mama Thandi's Shisa Nyama", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400", cuisine: "Shisa Nyama & Braai", location: "Soweto, Johannesburg", rating: 4.8, priceRange: "R", distance: "1.2km" },
    { id: "2", name: "Kota King", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400", cuisine: "Kota & Street Food", location: "Alexandra, Johannesburg", rating: 4.6, priceRange: "R", distance: "0.8km" },
    { id: "3", name: "Bunny Chow Palace", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400", cuisine: "Bunny Chow & Curry", location: "Umlazi, Durban", rating: 4.9, priceRange: "R", distance: "2.1km" },
    { id: "4", name: "Boerewors & Pap Spot", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400", cuisine: "Traditional Braai", location: "Mamelodi, Pretoria", rating: 4.7, priceRange: "R", distance: "1.5km" },
  ];

  useEffect(() => {
    const setupBusinessesListener = async () => {
      try {
        await seedDatabase(); // Auto-populate if empty

        // Subscribe to real-time updates
        const unsubscribe = businessService.subscribeToAllBusinesses((data) => {
          // Check if data has valid businesses (not empty objects)
          const validData = data.filter(business => business.name && business.name.trim() !== '');
          const businessData = validData.length > 0 ? validData : fallbackBusinesses;

          setAllBusinesses(businessData);
          setBusinesses(businessData);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Firebase error, using fallback data');
        setAllBusinesses(fallbackBusinesses);
        setBusinesses(fallbackBusinesses);
        setLoading(false);
      }
    };

    const unsubscribePromise = setupBusinessesListener();

    return () => {
      unsubscribePromise.then(unsub => unsub?.());
    };
  }, []);

  // Set initial search from URL parameter
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Filter businesses based on search and filters
  useEffect(() => {
    if (allBusinesses.length === 0) {
      setBusinesses([]);
      return;
    }
    
    let filtered = [...allBusinesses];

    // Search filter - only apply if there's a search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      filtered = filtered.filter(business => {
        const name = (business.name || '').toLowerCase();
        const location = (business.location || '').toLowerCase();
        const cuisine = (business.cuisine || '').toLowerCase();
        
        // Check if search query matches any field
        return name.includes(query) || 
               location.includes(query) || 
               cuisine.includes(query);
      });
    }

    // Cuisine filter
    if (cuisine && cuisine !== "all") {
      filtered = filtered.filter(business => 
        business.cuisine?.toLowerCase().includes(cuisine.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange && priceRange !== "all") {
      filtered = filtered.filter(business => business.priceRange === priceRange);
    }

    setBusinesses(filtered);
  }, [searchQuery, cuisine, priceRange, allBusinesses]);

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
            <Input 
              placeholder="Search by name or location..." 
              className="md:flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
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
