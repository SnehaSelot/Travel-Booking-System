import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Hotel } from "@/data/mockData";

const HotelCard = ({ hotel }: { hotel: Hotel }) => (
  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    <div className="h-48 overflow-hidden">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <CardContent className="p-5">
      <h3 className="font-heading font-semibold text-foreground text-lg mb-1">{hotel.name}</h3>
      <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
        <MapPin className="h-3.5 w-3.5" />
        <span>{hotel.location}</span>
      </div>
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(hotel.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">{hotel.rating}</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {hotel.amenities.slice(0, 3).map((a) => (
          <span key={a} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{a}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-heading font-bold text-foreground">₹{hotel.pricePerNight}</span>
          <span className="text-xs text-muted-foreground ml-1">/night</span>
        </div>
        <Link to={`/hotel/${hotel.id}`}>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            View Rooms
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default HotelCard;
