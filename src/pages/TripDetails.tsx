import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Clock, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trips } from "@/data/mockData";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const trip = trips.find((t) => t.id === id);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passenger, setPassenger] = useState({ name: "", age: "", gender: "" });
  const [travelDate, setTravelDate] = useState("");

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Trip not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate seat layout (6 columns for bus, 8 for train)
  const cols = trip.type === "bus" ? 4 : 6;
  const rows = Math.ceil(trip.totalSeats / cols);
  const bookedSeats = Array.from({ length: trip.totalSeats - trip.seatsAvailable }, (_, i) => i + 1);

  const toggleSeat = (seat: number) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : prev.length < 4 ? [...prev, seat] : prev
    );
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast({ title: "Select at least one seat", variant: "destructive" });
      return;
    }
    if (!travelDate) {
      toast({ title: "Select a travel date", variant: "destructive" });
      return;
    }
    if (!passenger.name || !passenger.age || !passenger.gender) {
      toast({ title: "Fill in passenger details", variant: "destructive" });
      return;
    }
    const total = trip.price * selectedSeats.length;
    localStorage.setItem("currentBooking", JSON.stringify({
      type: "trip",
      tripId: id,
      userId: user.User_Id,
      title: `${trip.source} → ${trip.destination} (${trip.vehicle})`,
      amount: total,
      seats: selectedSeats,
      passenger,
      date: travelDate,
      tripDate: travelDate,
    }));
    navigate("/payment");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trip Info */}
          <Card className="lg:col-span-1 animate-fade-in">
            <CardHeader>
              <CardTitle className="font-heading text-xl">{trip.vehicle}</CardTitle>
              <Badge variant="secondary" className="w-fit capitalize">{trip.type}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{trip.source} → {trip.destination}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-accent" />
                <span>{trip.departure} - {trip.arrival} ({trip.duration})</span>
              </div>
              <div className="text-2xl font-heading font-bold text-foreground">
                ₹{trip.price} <span className="text-sm font-normal text-muted-foreground">per seat</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {trip.amenities.map((a) => (
                  <span key={a} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{a}</span>
                ))}
              </div>
              <div className="pt-4">
                <label className="text-sm font-medium text-foreground block mb-2">Travel Date</label>
                <Input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
              </div>
              {selectedSeats.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Selected: {selectedSeats.join(", ")}</p>
                  <p className="text-lg font-heading font-bold text-foreground">
                    Total: ₹{trip.price * selectedSeats.length}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {/* Seat Selection */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Select Seats</CardTitle>
                <p className="text-sm text-muted-foreground">Click to select (max 4 seats)</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-muted border" /> Available</div>
                  <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-accent" /> Selected</div>
                  <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-muted-foreground/30" /> Booked</div>
                </div>
                <div className="inline-grid gap-2 p-4 bg-muted/50 rounded-xl" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                  {Array.from({ length: rows * cols }, (_, i) => {
                    const seat = i + 1;
                    if (seat > trip.totalSeats) return <div key={i} />;
                    const isBooked = bookedSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);
                    return (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        disabled={isBooked}
                        className={`w-10 h-10 rounded-lg text-xs font-medium transition-all ${
                          isBooked
                            ? "bg-muted-foreground/30 text-muted-foreground cursor-not-allowed"
                            : isSelected
                            ? "bg-accent text-accent-foreground shadow-md scale-105"
                            : "bg-card border border-border hover:border-accent hover:shadow-sm"
                        }`}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Passenger Form */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" /> Passenger Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input placeholder="Full Name" value={passenger.name} onChange={(e) => setPassenger((p) => ({ ...p, name: e.target.value }))} />
                  <Input placeholder="Age" type="number" min="1" max="120" value={passenger.age} onChange={(e) => setPassenger((p) => ({ ...p, age: e.target.value }))} />
                  <Select onValueChange={(v) => setPassenger((p) => ({ ...p, gender: v }))}>
                    <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleProceed} className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                  <CreditCard className="h-4 w-4" />
                  Proceed to Payment
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

export default TripDetails;
