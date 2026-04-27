export interface Trip {
  id: string;
  vehicle: string;
  type: "bus" | "train";
  source: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  totalSeats: number;
  amenities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  pricePerNight: number;
  rooms: Room[];
  amenities: string[];
}

export interface Room {
  id: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
}

export interface Booking {
  id: string;
  type: "trip" | "hotel";
  title: string;
  date: string;
  amount: number;
  status: "confirmed" | "pending" | "cancelled";
}

export const trips: Trip[] = [
  {
    id: "t1",
    vehicle: "Volvo Multi-Axle A/C Sleeper",
    type: "bus",
    source: "Mumbai",
    destination: "Goa",
    departure: "21:00",
    arrival: "06:30",
    duration: "9h 30m",
    price: 1200,
    seatsAvailable: 23,
    totalSeats: 36,
    amenities: ["WiFi", "Charging Point", "Blanket", "Water Bottle"],
  },
  {
    id: "t2",
    vehicle: "Rajdhani Express",
    type: "train",
    source: "Delhi",
    destination: "Mumbai",
    departure: "16:25",
    arrival: "08:35",
    duration: "16h 10m",
    price: 2450,
    seatsAvailable: 45,
    totalSeats: 72,
    amenities: ["Meals", "Bedding", "Charging Point"],
  },
  {
    id: "t3",
    vehicle: "Luxury A/C Seater",
    type: "bus",
    source: "Bangalore",
    destination: "Chennai",
    departure: "06:00",
    arrival: "12:30",
    duration: "6h 30m",
    price: 850,
    seatsAvailable: 15,
    totalSeats: 40,
    amenities: ["WiFi", "Charging Point", "Snacks"],
  },
  {
    id: "t4",
    vehicle: "Shatabdi Express",
    type: "train",
    source: "Chennai",
    destination: "Bangalore",
    departure: "06:00",
    arrival: "11:00",
    duration: "5h 00m",
    price: 780,
    seatsAvailable: 60,
    totalSeats: 90,
    amenities: ["Meals", "Charging Point"],
  },
  {
    id: "t5",
    vehicle: "Mercedes Multi-Axle Semi-Sleeper",
    type: "bus",
    source: "Pune",
    destination: "Hyderabad",
    departure: "19:30",
    arrival: "07:00",
    duration: "11h 30m",
    price: 1500,
    seatsAvailable: 8,
    totalSeats: 36,
    amenities: ["WiFi", "Charging Point", "Blanket", "Snacks", "Water Bottle"],
  },
  {
    id: "t6",
    vehicle: "Duronto Express",
    type: "train",
    source: "Kolkata",
    destination: "Delhi",
    departure: "20:05",
    arrival: "13:25",
    duration: "17h 20m",
    price: 2800,
    seatsAvailable: 30,
    totalSeats: 72,
    amenities: ["Meals", "Bedding", "Charging Point", "Pantry"],
  },
  // Additional trips
  {
    id: "t7",
    vehicle: "AC Volvo Multi-Axle",
    type: "bus",
    source: "Ahmedabad",
    destination: "Jaipur",
    departure: "22:00",
    arrival: "08:00",
    duration: "10h 00m",
    price: 1800,
    seatsAvailable: 20,
    totalSeats: 40,
    amenities: ["WiFi", "Charging Point", "Blanket", "Water Bottle", "Entertainment"],
  },
  {
    id: "t8",
    vehicle: "Garib Rath Express",
    type: "train",
    source: "Ahmedabad",
    destination: "Mumbai",
    departure: "14:30",
    arrival: "22:45",
    duration: "8h 15m",
    price: 950,
    seatsAvailable: 55,
    totalSeats: 80,
    amenities: ["Meals", "Bedding", "Charging Point"],
  },
  {
    id: "t9",
    vehicle: "Luxury Coach",
    type: "bus",
    source: "Delhi",
    destination: "Agra",
    departure: "07:00",
    arrival: "10:30",
    duration: "3h 30m",
    price: 600,
    seatsAvailable: 25,
    totalSeats: 45,
    amenities: ["WiFi", "Charging Point", "Snacks"],
  },
  {
    id: "t10",
    vehicle: "Tejas Express",
    type: "train",
    source: "Mumbai",
    destination: "Goa",
    departure: "06:25",
    arrival: "12:35",
    duration: "6h 10m",
    price: 1650,
    seatsAvailable: 40,
    totalSeats: 78,
    amenities: ["Meals", "WiFi", "Charging Point", "Entertainment"],
  },
  {
    id: "t11",
    vehicle: "Semi-Sleeper AC",
    type: "bus",
    source: "Chennai",
    destination: "Pondicherry",
    departure: "23:00",
    arrival: "02:30",
    duration: "3h 30m",
    price: 450,
    seatsAvailable: 18,
    totalSeats: 30,
    amenities: ["WiFi", "Charging Point", "Water Bottle"],
  },
  {
    id: "t12",
    vehicle: "Humsafar Express",
    type: "train",
    source: "Bangalore",
    destination: "Kolkata",
    departure: "21:45",
    arrival: "18:30",
    duration: "20h 45m",
    price: 3200,
    seatsAvailable: 35,
    totalSeats: 72,
    amenities: ["Meals", "Bedding", "Charging Point", "Pantry"],
  },
  {
    id: "t13",
    vehicle: "Volvo AC Seater",
    type: "bus",
    source: "Hyderabad",
    destination: "Bangalore",
    departure: "20:30",
    arrival: "05:00",
    duration: "8h 30m",
    price: 1100,
    seatsAvailable: 22,
    totalSeats: 40,
    amenities: ["WiFi", "Charging Point", "Blanket", "Snacks"],
  },
  {
    id: "t14",
    vehicle: "Vande Bharat Express",
    type: "train",
    source: "Delhi",
    destination: "Varanasi",
    departure: "06:00",
    arrival: "14:30",
    duration: "8h 30m",
    price: 1850,
    seatsAvailable: 48,
    totalSeats: 112,
    amenities: ["Meals", "WiFi", "Charging Point", "Entertainment"],
  },
  {
    id: "t15",
    vehicle: "Luxury Sleeper",
    type: "bus",
    source: "Kolkata",
    destination: "Puri",
    departure: "22:30",
    arrival: "06:00",
    duration: "7h 30m",
    price: 950,
    seatsAvailable: 16,
    totalSeats: 32,
    amenities: ["WiFi", "Charging Point", "Blanket", "Water Bottle"],
  },
];

export const hotels: Hotel[] = [
  {
    id: "h1",
    name: "The Grand Palace",
    location: "Goa, Calangute Beach",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    pricePerNight: 4500,
    amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Gym"],
    rooms: [
      { id: "r1", type: "Deluxe Room", price: 4500, capacity: 2, available: true },
      { id: "r2", type: "Suite", price: 8000, capacity: 3, available: true },
      { id: "r3", type: "Standard Room", price: 3000, capacity: 2, available: false },
    ],
  },
  {
    id: "h2",
    name: "Marina Bay Resort",
    location: "Mumbai, Marine Drive",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    pricePerNight: 7500,
    amenities: ["Sea View", "Restaurant", "Bar", "WiFi", "Gym", "Spa"],
    rooms: [
      { id: "r4", type: "Ocean View Room", price: 7500, capacity: 2, available: true },
      { id: "r5", type: "Presidential Suite", price: 15000, capacity: 4, available: true },
    ],
  },
  {
    id: "h3",
    name: "Heritage Haveli",
    location: "Jaipur, Old City",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    pricePerNight: 3200,
    amenities: ["Heritage Walk", "Restaurant", "WiFi", "Cultural Events"],
    rooms: [
      { id: "r6", type: "Heritage Room", price: 3200, capacity: 2, available: true },
      { id: "r7", type: "Royal Suite", price: 6500, capacity: 3, available: true },
    ],
  },
  {
    id: "h4",
    name: "Backwater Retreat",
    location: "Kerala, Alleppey",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
    pricePerNight: 5500,
    amenities: ["Houseboat", "Ayurveda Spa", "Restaurant", "WiFi", "Yoga"],
    rooms: [
      { id: "r8", type: "Lake View Room", price: 5500, capacity: 2, available: true },
      { id: "r9", type: "Premium Cottage", price: 9000, capacity: 4, available: true },
    ],
  },
  // Additional hotels
  {
    id: "h5",
    name: "Taj Mahal Palace",
    location: "Mumbai, Colaba",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
    pricePerNight: 25000,
    amenities: ["Luxury Spa", "Fine Dining", "Sea View", "WiFi", "Gym", "Concierge"],
    rooms: [
      { id: "r10", type: "Luxury Suite", price: 25000, capacity: 2, available: true },
      { id: "r11", type: "Presidential Suite", price: 50000, capacity: 4, available: true },
      { id: "r12", type: "Deluxe Room", price: 18000, capacity: 2, available: true },
    ],
  },
  {
    id: "h6",
    name: "ITC Grand Chola",
    location: "Chennai, Guindy",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
    pricePerNight: 12000,
    amenities: ["Pool", "Spa", "Multiple Restaurants", "WiFi", "Gym", "Business Center"],
    rooms: [
      { id: "r13", type: "Executive Room", price: 12000, capacity: 2, available: true },
      { id: "r14", type: "Club Suite", price: 22000, capacity: 3, available: true },
    ],
  },
  {
    id: "h7",
    name: "The Leela Palace",
    location: "Bangalore, Old Airport Road",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
    pricePerNight: 18000,
    amenities: ["Palace Heritage", "Spa", "Fine Dining", "WiFi", "Gym", "Tennis Court"],
    rooms: [
      { id: "r15", type: "Palace Room", price: 18000, capacity: 2, available: true },
      { id: "r16", type: "Royal Suite", price: 35000, capacity: 4, available: true },
    ],
  },
  {
    id: "h8",
    name: "Hyatt Regency",
    location: "Delhi, Bhikaji Cama Place",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    pricePerNight: 8500,
    amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Gym", "Business Center"],
    rooms: [
      { id: "r17", type: "Executive Room", price: 8500, capacity: 2, available: true },
      { id: "r18", type: "Suite", price: 15000, capacity: 3, available: true },
    ],
  },
  {
    id: "h9",
    name: "Radisson Blu",
    location: "Pune, Hinjewadi",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    pricePerNight: 6500,
    amenities: ["Pool", "Restaurant", "WiFi", "Gym", "Conference Rooms"],
    rooms: [
      { id: "r19", type: "Business Room", price: 6500, capacity: 2, available: true },
      { id: "r20", type: "Executive Suite", price: 11000, capacity: 3, available: true },
    ],
  },
  {
    id: "h10",
    name: "Novotel",
    location: "Hyderabad, Hitech City",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    pricePerNight: 5500,
    amenities: ["Pool", "Restaurant", "WiFi", "Gym", "Kids Club"],
    rooms: [
      { id: "r21", type: "Superior Room", price: 5500, capacity: 2, available: true },
      { id: "r22", type: "Family Suite", price: 9500, capacity: 4, available: true },
    ],
  },
  {
    id: "h11",
    name: "Courtyard by Marriott",
    location: "Ahmedabad, Satellite",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    pricePerNight: 7000,
    amenities: ["Pool", "Restaurant", "WiFi", "Gym", "Business Center"],
    rooms: [
      { id: "r23", type: "Guest Room", price: 7000, capacity: 2, available: true },
      { id: "r24", type: "Suite", price: 12000, capacity: 3, available: true },
    ],
  },
  {
    id: "h12",
    name: "Holiday Inn",
    location: "Kolkata, Salt Lake",
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    pricePerNight: 4800,
    amenities: ["Pool", "Restaurant", "WiFi", "Gym"],
    rooms: [
      { id: "r25", type: "Standard Room", price: 4800, capacity: 2, available: true },
      { id: "r26", type: "Executive Room", price: 7800, capacity: 2, available: true },
    ],
  },
];

export const mockBookings: Booking[] = [
  { id: "b1", type: "trip", title: "Mumbai → Goa (Volvo Sleeper)", date: "2026-04-20", amount: 1200, status: "confirmed" },
  { id: "b2", type: "trip", title: "Delhi → Mumbai (Rajdhani Express)", date: "2026-05-05", amount: 2450, status: "pending" },
  { id: "b3", type: "hotel", title: "The Grand Palace - Deluxe Room (2 nights)", date: "2026-04-20", amount: 9000, status: "confirmed" },
  { id: "b4", type: "hotel", title: "Marina Bay Resort - Ocean View (1 night)", date: "2026-05-10", amount: 7500, status: "confirmed" },
];

export const paymentHistory = [
  { id: "p1", bookingId: "b1", method: "UPI", amount: 1200, date: "2026-04-15", status: "success" },
  { id: "p2", bookingId: "b3", method: "Credit Card", amount: 9000, date: "2026-04-15", status: "success" },
  { id: "p3", bookingId: "b4", method: "Net Banking", amount: 7500, date: "2026-05-01", status: "success" },
];
