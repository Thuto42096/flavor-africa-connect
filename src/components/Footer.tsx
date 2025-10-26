import { Link } from "react-router-dom";
import { MapPin, Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">TasteLocal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your digital home for local flavor and entrepreneurship across Africa.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Discover</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/discover" className="hover:text-primary transition-colors">Browse Restaurants</Link></li>
              <li><Link to="/discover" className="hover:text-primary transition-colors">Hidden Gems</Link></li>
              <li><Link to="/discover" className="hover:text-primary transition-colors">Popular This Week</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">For Businesses</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/for-businesses" className="hover:text-primary transition-colors">Register Your Business</Link></li>
              <li><Link to="/vendor-dashboard" className="hover:text-primary transition-colors">Vendor Dashboard</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><Link to="/community" className="hover:text-primary transition-colors">Community</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 TasteLocal. All rights reserved. Made with ❤️ for local businesses.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
