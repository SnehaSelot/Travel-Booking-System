import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Smartphone, Landmark, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PaymentMethod = "upi" | "card" | "netbanking";

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const booking = JSON.parse(localStorage.getItem("currentBooking") || "{}");

  const methods: { key: PaymentMethod; label: string; icon: any }[] = [
    { key: "upi", label: "UPI", icon: Smartphone },
    { key: "card", label: "Credit / Debit Card", icon: CreditCard },
    { key: "netbanking", label: "Net Banking", icon: Landmark },
  ];

  const parseResponse = async (response: Response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: text || "Server returned invalid JSON" };
    }
  };

  const handlePay = async () => {
    if (!booking || !booking.amount) {
      toast({ title: "No booking found", description: "Please start a booking first", variant: "destructive" });
      return;
    }

    if (!booking.userId) {
      toast({ title: "Please login", description: "You must be logged in to complete payment", variant: "destructive" });
      navigate("/login");
      return;
    }

    setProcessing(true);

    try {
      let paymentResult;

      if (booking.type === "hotel") {
        const bookingResponse = await fetch("http://localhost/travel-booking-system/api/hotel-bookings/create.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            User_Id: booking.userId,
            Hotel_Id: booking.hotelId,
            Check_In: booking.checkIn,
            Check_Out: booking.checkOut,
            Total_Amount: booking.amount
          })
        });

        const bookingData = await parseResponse(bookingResponse);
        if (!bookingResponse.ok) throw new Error(bookingData.error || "Hotel booking failed");

        const paymentResponse = await fetch("http://localhost/travel-booking-system/api/payments/create.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Amount: booking.amount,
            Method: method,
            Hotel_Booking_Id: `hb${bookingData.booking.Hotel_Booking_Id}`
          })
        });

        paymentResult = await parseResponse(paymentResponse);
        if (!paymentResponse.ok) throw new Error(paymentResult.error || "Payment failed");

        booking.bookId = bookingData.booking.Hotel_Booking_Id;
      } else if (booking.type === "trip") {
        if (!booking.tripId) throw new Error("Trip ID missing");

        const bookingResponse = await fetch("http://localhost/travel-booking-system/api/bookings/create.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            User_Id: booking.userId,
            Trip_Id: booking.tripId,
            Total_Amount: booking.amount,
            seats: booking.seats,
            passenger: booking.passenger,
            Booking_Date: booking.date || new Date().toISOString().split("T")[0]
          })
        });

        const bookingData = await parseResponse(bookingResponse);
        if (!bookingResponse.ok) throw new Error(bookingData.error || "Trip booking failed");

        const paymentResponse = await fetch("http://localhost/travel-booking-system/api/payments/create.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Amount: booking.amount,
            Method: method,
            Booking_Id: `b${bookingData.booking.Booking_Id}`
          })
        });

        paymentResult = await parseResponse(paymentResponse);
        if (!paymentResponse.ok) throw new Error(paymentResult.error || "Payment failed");

        booking.bookId = bookingData.booking.Booking_Id;
      } else {
        throw new Error("Unsupported booking type");
      }

      setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
        existing.push({
          ...booking,
          id: `p${paymentResult.payment.Payment_Id}`,
          bookingId: booking.type === "trip" ? booking.bookId : undefined,
          hotelBookingId: booking.type === "hotel" ? booking.bookId : undefined,
          date: booking.date || new Date().toISOString().split("T")[0],
          status: "confirmed",
          paymentMethod: method,
        });
        localStorage.setItem("bookings", JSON.stringify(existing));
        localStorage.removeItem("currentBooking");
      }, 2000);
    } catch (error) {
      setProcessing(false);
      toast({ title: "Booking Failed", description: (error as Error).message, variant: "destructive" });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-muted/30 px-4">
          <Card className="max-w-md w-full text-center animate-scale-in">
            <CardContent className="py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-1">{booking.title}</p>
              <p className="text-3xl font-heading font-bold text-foreground mb-6">₹{booking.amount}</p>
              <p className="text-sm text-muted-foreground mb-6">
                Booking confirmed. A confirmation has been saved to your dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate("/dashboard")} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-muted/30 px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">Complete Payment</h1>

          {/* Order Summary */}
          <Card className="mb-6 animate-fade-in">
            <CardContent className="p-5">
              <h3 className="font-heading font-semibold text-foreground mb-2">Order Summary</h3>
              <p className="text-sm text-muted-foreground">{booking.title || "No booking found"}</p>
              <p className="text-2xl font-heading font-bold text-foreground mt-2">₹{booking.amount || 0}</p>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="mb-6 animate-fade-in">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {methods.map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  onClick={() => setMethod(key)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    method === key ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${method === key ? "text-accent" : "text-muted-foreground"}`} />
                  <span className="font-medium text-foreground">{label}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="mb-6 animate-fade-in">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {method === "upi" && (
                <Input placeholder="Enter UPI ID (e.g. name@upi)" />
              )}
              {method === "card" && (
                <>
                  <Input placeholder="Card Number" maxLength={19} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" maxLength={5} />
                    <Input placeholder="CVV" type="password" maxLength={3} />
                  </div>
                  <Input placeholder="Cardholder Name" />
                </>
              )}
              {method === "netbanking" && (
                <Input placeholder="Select Bank or enter bank name" />
              )}
            </CardContent>
          </Card>

          <Button
            onClick={handlePay}
            disabled={processing || !booking.amount}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-lg gap-2"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Pay ₹{booking.amount || 0}
              </>
            )}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
