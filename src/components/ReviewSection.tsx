import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewSectionProps {
  businessId: string;
  businessName: string;
}

const ReviewSection = ({ businessId, businessName }: ReviewSectionProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      userName: "Sipho Khumalo",
      rating: 5,
      comment: "Yoh! This place is fire 🔥 Best pap and vleis in the area, no cap!",
      date: "2024-01-20",
    },
    {
      id: "2",
      userName: "Nomsa Dlamini",
      rating: 4,
      comment: "Sharp sharp! Good food, friendly service. Will definitely come back 👌",
      date: "2024-01-18",
    },
    {
      id: "3",
      userName: "Thabo Mokoena",
      rating: 5,
      comment: "Eish, this is the real deal! Reminds me of my gogo's cooking 😍",
      date: "2024-01-15",
    },
  ]);

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast.error("Eish! You need to sign in first, my bru 😅");
      navigate("/login");
      return;
    }

    if (rating === 0) {
      toast.error("Please give a star rating, sho! ⭐");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment about your experience 📝");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: `review_${Date.now()}`,
        userName: user?.name || "Anonymous",
        rating,
        comment,
        date: new Date().toISOString(),
      };

      setReviews([newReview, ...reviews]);
      setRating(0);
      setComment("");
      setIsSubmitting(false);
      toast.success("Yebo! Your review has been posted! 🎉");
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{averageRating}</div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(parseFloat(averageRating))
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{reviews.length} reviews</p>
            </div>
          </div>

          {/* Write Review Section */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold">Share Your Experience</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Review</label>
              <Textarea
                placeholder="Tell us about your experience... Was the food fire? 🔥"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleSubmitReview} disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Posting..." : "Post Review"}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Reviews List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">What People Are Saying</h3>
          {reviews.map((review, index) => (
            <div key={review.id}>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(review.userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{review.userName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.date)}
                    </span>
                  </div>
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
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              </div>
              {index < reviews.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;

