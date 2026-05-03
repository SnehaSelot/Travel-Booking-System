import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hotels } from "@/data/mockData";

const Review = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hotelId, setHotelId] = useState<string>(hotels[0]?.id || "");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://sneha-dev.rf.gd/api/reviews/list.php");
        const data = await response.json();
        if (response.ok) {
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmit = async () => {
    if (!user?.User_Id) {
      toast({ title: "Please login", description: "You must be logged in to submit a review", variant: "destructive" });
      navigate("/login");
      return;
    }

    if (!comment.trim()) {
      toast({ title: "Review required", description: "Please enter your review comment", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch("http://sneha-dev.rf.gd/api/reviews/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          User_Id: user.User_Id,
          Hotel_Id: hotelId.replace(/^h/, ""),
          Rating: rating,
          Comment: comment,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Review submission failed");
      }

      setComment("");
      setRating(5);
      setReviews((prev) => [...prev, { ...data.review, Hotel_Id: hotelId }]);
      toast({ title: "Review submitted", description: "Thank you for your feedback" });
    } catch (error) {
      toast({ title: "Submission failed", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="font-heading">Leave a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Choose Hotel</label>
                <Select onValueChange={(value) => setHotelId(value)} defaultValue={hotelId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id}>{hotel.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`rounded-full p-2 ${rating >= value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Comment</label>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your hotel experience..." />
              </div>
              <Button type="button" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" /> Submit Review
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="font-heading">Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.Review_Id || review.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{hotels.find((hotel) => hotel.id === `h${review.Hotel_Id}`)?.name || "Hotel"}</p>
                        <span className="text-xs text-muted-foreground">{review.Rating} / 5</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.Comment}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Review;
