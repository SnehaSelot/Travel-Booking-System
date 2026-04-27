import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, CreditCard, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statusColor = (s: string) => {
  switch (s) {
    case "confirmed": case "success": return "bg-green-100 text-green-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "cancelled": case "failed": return "bg-red-100 text-red-800";
    default: return "bg-muted text-muted-foreground";
  }
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.Email === "admin@example.com" || user?.role === "admin";
  const [savedBookings, setSavedBookings] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      setSavedBookings(JSON.parse(localStorage.getItem("bookings") || "[]"));
    } catch {
      setSavedBookings([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(savedBookings));
  }, [savedBookings]);

  const cancelBooking = async (booking: any) => {
    // Check if this is a real booking (has bookingId or hotelBookingId) or mock booking
    const isRealBooking = booking.bookingId || booking.hotelBookingId;

    if (!isRealBooking) {
      // For mock bookings, just update localStorage
      setSavedBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: "cancelled" } : b));
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully."
      });
      return;
    }

    try {
      const isHotel = booking.type === "hotel";
      const apiUrl = isHotel 
        ? "http://localhost/travel-booking-system/api/hotel-bookings/cancel.php"
        : "http://localhost/travel-booking-system/api/bookings/cancel.php";
      
      const payload = isHotel 
        ? { Hotel_Booking_Id: booking.hotelBookingId }
        : {
            Booking_Id: booking.bookingId,
            Refund_Amount: booking.amount * 0.8,
            seats: booking.seats || []
          };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setSavedBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: "cancelled" } : b));
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been cancelled successfully. Refund will be processed within 3-5 business days."
        });
      } else {
        toast({
          title: "Cancellation Failed",
          description: data.error || "Unable to cancel booking",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      });
    }
  };

  const userBookings = isAdmin ? savedBookings : savedBookings.filter((b: any) => b.userId == user.User_Id);
  const tripBookings = userBookings.filter((b: any) => b.type === "trip");
  const hotelBookings = userBookings.filter((b: any) => b.type === "hotel");
  const allPayments = userBookings.map((b: any) => ({
    id: `p-${b.id}`,
    bookingId: b.id,
    method: b.paymentMethod || "UPI",
    amount: b.amount,
    date: b.date,
    status: b.status || "success",
  }));

  const updateBookingStatus = (id: string, nextStatus: string) => {
    setSavedBookings((prev) => prev.map((booking) => booking.id === id ? { ...booking, status: nextStatus } : booking));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
         

<h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
    {user?.First_Name? `Welcome, ${user.First_Name} ${user.Last_Name}` : "My Dashboard"}
</h1>
          <p className="text-muted-foreground">{isAdmin ? "View all bookings and payments across the platform." : "Manage your trips, hotels, and payments."}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Trip Bookings", count: tripBookings.length, icon: Plane, color: "text-accent" },
            { label: "Hotel Bookings", count: hotelBookings.length, icon: Hotel, color: "text-secondary" },
            { label: "Payments", count: allPayments.length, icon: CreditCard, color: "text-green-600" },
          ].map(({ label, count, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`p-3 rounded-xl bg-muted ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">{count}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="trips">
          <TabsList className="mb-4">
            <TabsTrigger value="trips">My Trips</TabsTrigger>
            <TabsTrigger value="hotels">Hotel Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="trips">
            <Card>
              <CardHeader><CardTitle className="font-heading">Trip Bookings</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trip</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tripBookings.map((b: any) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.title}</TableCell>
                        <TableCell>{b.date}</TableCell>
                        <TableCell>₹{b.amount}</TableCell>
                        <TableCell><Badge className={statusColor(b.status)}>{b.status}</Badge></TableCell>
                        <TableCell>
                          {isAdmin ? (
                            <select
                              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                              value={b.status}
                              onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            >
                              <option value="confirmed">confirmed</option>
                              <option value="pending">pending</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          ) : (
                            b.status !== "cancelled" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelBooking(b)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {tripBookings.length === 0 && <p className="text-center text-muted-foreground py-8">No trip bookings yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotels">
            <Card>
              <CardHeader><CardTitle className="font-heading">Hotel Bookings</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hotelBookings.map((b: any) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.title}</TableCell>
                        <TableCell>{b.date}</TableCell>
                        <TableCell>₹{b.amount}</TableCell>
                        <TableCell><Badge className={statusColor(b.status)}>{b.status}</Badge></TableCell>
                        <TableCell>
                          {isAdmin ? (
                            <select
                              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                              value={b.status}
                              onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            >
                              <option value="confirmed">confirmed</option>
                              <option value="pending">pending</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          ) : (
                            b.status !== "cancelled" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelBooking(b)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {hotelBookings.length === 0 && <p className="text-center text-muted-foreground py-8">No hotel bookings yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader><CardTitle className="font-heading">Payment History</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPayments.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.id}</TableCell>
                        <TableCell>{p.method}</TableCell>
                        <TableCell>₹{p.amount}</TableCell>
                        <TableCell>{p.date}</TableCell>
                        <TableCell><Badge className={statusColor(p.status)}>{p.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
