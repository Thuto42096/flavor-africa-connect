import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, User, LogOut, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success("Sharp sharp! See you later! 👋");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
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
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Join Now</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
