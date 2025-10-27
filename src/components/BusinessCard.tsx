import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BusinessCardProps {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  location: string;
  rating: number;
  priceRange: string;
  distance?: string;
}

const BusinessCard = ({
  id,
  name,
  image,
  cuisine,
  location,
  rating,
  priceRange,
  distance,
}: BusinessCardProps) => {
  return (
    <Link to={`/business/${id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative h-48 overflow-hidden bg-gray-200">
          {image ? (
            <img
              src={image}
              alt={name || 'Restaurant'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <span className="text-gray-600 text-sm">No Image</span>
            </div>
          )}
          <Badge className="absolute top-3 right-3 bg-secondary">
            {cuisine}
          </Badge>
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{location}</span>
            {distance && <span className="text-xs">• {distance}</span>}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{priceRange}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BusinessCard;
