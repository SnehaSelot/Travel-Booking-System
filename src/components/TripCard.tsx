import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Trip } from "@/data/mockData";

const TripCard = ({ trip }: { trip: Trip }) => (
  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-semibold text-foreground text-sm md:text-base">{trip.vehicle}</h3>
        <Badge variant="secondary" className="capitalize">{trip.type}</Badge>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
        <MapPin className="h-4 w-4" />
        <span>{trip.source}</span>
        <span className="text-accent">→</span>
        <span>{trip.destination}</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{trip.departure} - {trip.arrival}</span>
        </div>
        <span className="text-xs">({trip.duration})</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-heading font-bold text-foreground">₹{trip.price}</span>
          <span className="text-xs text-muted-foreground ml-1">per seat</span>
        </div>
        <Link to={`/trip/${trip.id}`}>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Book Now
          </Button>
        </Link>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{trip.seatsAvailable} seats available</p>
    </CardContent>
  </Card>
);

export default TripCard;
