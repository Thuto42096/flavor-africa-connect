import { useState } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MapPin, User, LogOut, Heart, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout, isBusinessOwner } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sharp sharp! See you later! 👋");
    } catch (error) {
      toast.error("Error signing out. Please try again.");
    }
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/discover"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/discover') ? 'text-primary' : 'text-foreground'
            }`}
          >
            Discover
          </Link>

          {/* Conditional link based on user role */}
          {isAuthenticated && user ? (
            isBusinessOwner ? (
              <Link
                to="/vendor-dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/vendor-dashboard') ? 'text-primary' : 'text-foreground'
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/profile') ? 'text-primary' : 'text-foreground'
                }`}
              >
                Orders
              </Link>
            )
          ) : (
            <Link
              to="/for-businesses"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/for-businesses') ? 'text-primary' : 'text-foreground'
              }`}
            >
              For Businesses
            </Link>
          )}

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

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-3">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>TasteLocal</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  to="/discover"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors hover:text-primary py-2 ${
                    isActive('/discover') ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Discover
                </Link>

                {/* Conditional link based on user role */}
                {isAuthenticated && user ? (
                  isBusinessOwner ? (
                    <Link
                      to="/vendor-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-medium transition-colors hover:text-primary py-2 ${
                        isActive('/vendor-dashboard') ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-medium transition-colors hover:text-primary py-2 ${
                        isActive('/profile') ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      Orders
                    </Link>
                  )
                ) : (
                  <Link
                    to="/for-businesses"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium transition-colors hover:text-primary py-2 ${
                      isActive('/for-businesses') ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    For Businesses
                  </Link>
                )}

                <Link
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors hover:text-primary py-2 ${
                    isActive('/blog') ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Blog
                </Link>
                <Link
                  to="/community"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors hover:text-primary py-2 ${
                    isActive('/community') ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  Community
                </Link>

                {/* Mobile Auth Buttons */}
                {!isAuthenticated && (
                  <div className="flex flex-col space-y-3 pt-4 border-t">
                    <Button variant="outline" asChild>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                        Join Now
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Mobile User Menu */}
                {isAuthenticated && user && (
                  <div className="flex flex-col space-y-3 pt-4 border-t">
                    <div className="flex items-center space-x-3 pb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Heart className="h-4 w-4 mr-2" />
                        Favorites
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop User Menu */}
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
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Join Now</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
