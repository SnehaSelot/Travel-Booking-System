import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, Hotel, CreditCard, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statusColor = (s: string) => {
  switch (s) {
    case "confirmed":
    case "success":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.Email === "admin@example.com" || user?.role === "admin";
  const [bookings, setBookings] = useState<any[]>(JSON.parse(localStorage.getItem("bookings") || "[]"));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const allBookings = useMemo(() => bookings, [bookings]);
  const tripBookings = allBookings.filter((b: any) => b.type === "trip");
  const hotelBookings = allBookings.filter((b: any) => b.type === "hotel");
  const allPayments = allBookings.map((b: any) => ({
    id: `p-${b.id}`,
    bookingId: b.id,
    userId: b.userId,
    method: b.paymentMethod || "UPI",
    amount: b.amount,
    date: b.date,
    status: "success",
  }));

  const handleEditOpen = (item: any) => {
    setEditingId(item.id);
    setEditFormData({ ...item });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      // Update in localStorage
      const updated = bookings.map(b => b.id === editingId ? editFormData : b);
      setBookings(updated);
      localStorage.setItem("bookings", JSON.stringify(updated));

      // Update in database
      const isHotel = editFormData.type === "hotel";
      const apiUrl = isHotel
        ? "http://localhost/travel-booking-system/api/hotel-bookings/update.php"
        : "http://localhost/travel-booking-system/api/bookings/update.php";

      const payload = isHotel
        ? {
            Hotel_Booking_Id: editFormData.bookingId,
            Status: editFormData.status,
            Total_Amount: editFormData.amount
          }
        : {
            Booking_Id: editFormData.bookingId,
            Status: editFormData.status,
            Total_Amount: editFormData.amount
          };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Updated",
          description: "Booking updated successfully"
        });
        setEditingId(null);
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem("bookings", JSON.stringify(updated));
      toast({
        title: "Deleted",
        description: "Booking deleted successfully"
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-1 text-center">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground">You do not have permission to view this page. Please log in with an admin account.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">View all bookings and payments for every user.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Trip Bookings", count: tripBookings.length, icon: Plane, color: "text-accent" },
            { label: "Total Hotel Bookings", count: hotelBookings.length, icon: Hotel, color: "text-secondary" },
            { label: "Total Payments", count: allPayments.length, icon: CreditCard, color: "text-green-600" },
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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading">All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allBookings.map((b: any) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">{b.id}</TableCell>
                    <TableCell>{b.userId || "-"}</TableCell>
                    <TableCell>{b.type}</TableCell>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>₹{b.amount}</TableCell>
                    <TableCell><Badge className={statusColor(b.status)}>{b.status}</Badge></TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog open={editingId === b.id} onOpenChange={(open) => !open && setEditingId(null)}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditOpen(b)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Booking</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={editFormData.title || ""}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Date</Label>
                              <Input
                                type="date"
                                value={editFormData.date || ""}
                                onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Amount</Label>
                              <Input
                                type="number"
                                value={editFormData.amount || ""}
                                onChange={(e) => setEditFormData({ ...editFormData, amount: parseFloat(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select value={editFormData.status} onValueChange={(val) => setEditFormData({ ...editFormData, status: val })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleSaveEdit} className="w-full">Save Changes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteBooking(b.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {allBookings.length === 0 && <p className="text-center text-muted-foreground py-8">No bookings found.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">All Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPayments.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell>{p.userId || "-"}</TableCell>
                    <TableCell className="font-mono text-xs">{p.bookingId}</TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell>₹{p.amount}</TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell><Badge className={statusColor(p.status)}>{p.status}</Badge></TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog open={editingId === p.id} onOpenChange={(open) => !open && setEditingId(null)}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditOpen(p)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Payment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Method</Label>
                              <Select value={editFormData.method} onValueChange={(val) => setEditFormData({ ...editFormData, method: val })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="UPI">UPI</SelectItem>
                                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Amount</Label>
                              <Input
                                type="number"
                                value={editFormData.amount || ""}
                                onChange={(e) => setEditFormData({ ...editFormData, amount: parseFloat(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select value={editFormData.status} onValueChange={(val) => setEditFormData({ ...editFormData, status: val })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="success">Success</SelectItem>
                                  <SelectItem value="failed">Failed</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleSaveEdit} className="w-full">Save Changes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteBooking(p.bookingId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {allPayments.length === 0 && <p className="text-center text-muted-foreground py-8">No payments found.</p>}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
