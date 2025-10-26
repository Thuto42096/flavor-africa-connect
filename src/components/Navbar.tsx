import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">TasteLocal</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/discover" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/discover') ? 'text-primary' : 'text-foreground'
            }`}
          >
            Discover
          </Link>
          <Link 
            to="/for-businesses" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/for-businesses') ? 'text-primary' : 'text-foreground'
            }`}
          >
            For Businesses
          </Link>
          <Link 
            to="/blog" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/blog') ? 'text-primary' : 'text-foreground'
            }`}
          >
            Blog
          </Link>
          <Link 
            to="/community" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/community') ? 'text-primary' : 'text-foreground'
            }`}
          >
            Community
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button size="sm">Join Now</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
