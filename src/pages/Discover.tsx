import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { firestoreBusinessService } from "@/services/firestoreBusinessService";
import { Business } from "@/contexts/BusinessContext";

const Discover = () => {
  const [searchParams] = useSearchParams();
  const [cuisine, setCuisine] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Transform Business data for display in BusinessCard
  const transformBusinessForDisplay = (business: Business) => ({
    id: business.id,
    name: business.name || "New Business (Setup Pending)",
    image: business.image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    cuisine: business.description || "Local Food",
    location: business.location || "Location not set",
    rating: business.rating || 0,
    priceRange: "R",
    distance: "Near you",
  });

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setLoading(true);
        // Fetch all businesses from Firestore
        const allBiz = await firestoreBusinessService.getAllBusinesses();

        if (allBiz && allBiz.length > 0) {
          console.log('Loaded businesses:', allBiz);
          setAllBusinesses(allBiz);
          setBusinesses(allBiz);
        } else {
          console.log('No businesses found in database');
          setAllBusinesses([]);
          setBusinesses([]);
        }
      } catch (error) {
        console.error('Error loading businesses:', error);
        setAllBusinesses([]);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
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
        const name = (business.name || 'new business').toLowerCase();
        const location = (business.location || '').toLowerCase();
        const description = (business.description || '').toLowerCase();

        // Check if search query matches any field
        return name.includes(query) ||
               location.includes(query) ||
               description.includes(query);
      });
    }

    // Cuisine/Description filter
    if (cuisine && cuisine !== "all") {
      filtered = filtered.filter(business =>
        business.description?.toLowerCase().includes(cuisine.toLowerCase())
      );
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

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No restaurants found</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setCuisine('all');
                  setPriceRange('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    {...transformBusinessForDisplay(business)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Discover;
