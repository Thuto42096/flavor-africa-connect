import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Calendar, Star, Heart } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sharp sharp! See you later! 👋");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out. Please try again.");
    }
  };

  // Mock data for user's reviews and favorites
  const userReviews = [
    {
      id: "1",
      businessName: "Mama Thandi's Shisa Nyama",
      rating: 5,
      comment: "Yoh! The best braai in Soweto, no cap! 🔥",
      date: "2024-01-15",
    },
    {
      id: "2",
      businessName: "Kota King",
      rating: 4,
      comment: "Solid kota, but could use more chips 😅",
      date: "2024-01-10",
    },
  ];

  const favoriteSpots = [
    { id: "1", name: "Mama Thandi's Shisa Nyama", location: "Soweto" },
    { id: "2", name: "Kota King", location: "Alexandra" },
    { id: "3", name: "Bunny Chow Palace", location: "Durban" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container max-w-4xl">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(user.joinedDate)}</span>
                    </div>
                  </div>
                  <Badge className="mt-4 bg-secondary">Kasi Food Lover 🔥</Badge>
                </div>

                <Button variant="outline" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  My Reviews ({userReviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userReviews.length > 0 ? (
                  userReviews.map((review, index) => (
                    <div key={review.id}>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{review.businessName}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-accent text-accent"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.date)}
                        </p>
                      </div>
                      {index < userReviews.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet. Go explore and share your thoughts! 🚀
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Favorite Spots Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Favorite Spots ({favoriteSpots.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {favoriteSpots.length > 0 ? (
                  favoriteSpots.map((spot) => (
                    <div
                      key={spot.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => navigate(`/business/${spot.id}`)}
                    >
                      <div>
                        <h4 className="font-medium">{spot.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{spot.location}</span>
                        </div>
                      </div>
                      <Heart className="h-5 w-5 fill-primary text-primary" />
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No favorites yet. Start exploring! 💚
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">{userReviews.length}</div>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">{favoriteSpots.length}</div>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">12</div>
                  <p className="text-sm text-muted-foreground">Spots Visited</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;

