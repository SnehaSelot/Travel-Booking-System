import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarIcon, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hotels } from "@/data/mockData";

const HotelBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const hotel = hotels.find((h) => h.id === id);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.User_Id;

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Hotel not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const room = hotel.rooms.find((r) => r.id === selectedRoom);
  const total = room ? room.price * nights : 0;

  const handleBook = () => {
    if (!userId) { toast({ title: "Please login first", variant: "destructive" }); navigate("/login"); return; }
    if (!selectedRoom) { toast({ title: "Select a room", variant: "destructive" }); return; }
    if (!checkIn || !checkOut) { toast({ title: "Select check-in/out dates", variant: "destructive" }); return; }
    if (nights <= 0) { toast({ title: "Check-out must be after check-in", variant: "destructive" }); return; }
    localStorage.setItem("currentBooking", JSON.stringify({
      type: "hotel",
      hotelId: id,
      checkIn,
      checkOut,
      totalAmount: total,
      userId,
      title: `${hotel.name} - ${room!.type} (${nights} night${nights > 1 ? "s" : ""})`,
      amount: total,
      date: checkIn,
    }));
    navigate("/payment");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hotel Info */}
          <Card className="lg:col-span-1 animate-fade-in">
            <div className="h-48 overflow-hidden rounded-t-lg">
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-5">
              <h2 className="font-heading font-bold text-xl text-foreground">{hotel.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{hotel.location}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {hotel.amenities.map((a) => (
                  <span key={a} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{a}</span>
                ))}
              </div>
              {total > 0 && (
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">{nights} night{nights > 1 ? "s" : ""} × ₹{room!.price}</p>
                  <p className="text-2xl font-heading font-bold text-foreground">Total: ₹{total}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {/* Room Selection */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Choose a Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hotel.rooms.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => r.available && setSelectedRoom(r.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      !r.available
                        ? "opacity-50 cursor-not-allowed border-border"
                        : selectedRoom === r.id
                        ? "border-accent bg-accent/5 shadow-md"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{r.type}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-3.5 w-3.5" /> Up to {r.capacity} guests
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-heading font-bold text-foreground">₹{r.price}</p>
                        <p className="text-xs text-muted-foreground">/night</p>
                      </div>
                    </div>
                    {!r.available && <Badge variant="destructive" className="mt-2">Sold Out</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-accent" /> Select Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Check-in</label>
                    <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Check-out</label>
                    <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleBook} className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                  <CreditCard className="h-4 w-4" />
                  Book Now — {total > 0 ? `₹${total}` : "Select room & dates"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HotelBooking;
