import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, Bus, Train, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TripCard from "@/components/TripCard";
import MapSearch from "@/components/MapSearch";
import { trips } from "@/data/mockData";

const Index = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [mapSource, setMapSource] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [mapDestination, setMapDestination] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'bus' | 'train'>('all');

  const handleSearch = () => {
    const searchSource = mapSource?.name || source;
    const searchDest = mapDestination?.name || destination;

    const results = trips.filter((t) => {
      const matchSource = !searchSource || t.source.toLowerCase().includes(searchSource.toLowerCase());
      const matchDest = !searchDest || t.destination.toLowerCase().includes(searchDest.toLowerCase());
      const matchType = selectedType === 'all' || t.type === selectedType;
      return matchSource && matchDest && matchType;
    });
    setFilteredTrips(results);
  };

  const handleTypeFilter = (type: 'all' | 'bus' | 'train') => {
    setSelectedType(type);
    const searchSource = mapSource?.name || source;
    const searchDest = mapDestination?.name || destination;

    const results = trips.filter((t) => {
      const matchSource = !searchSource || t.source.toLowerCase().includes(searchSource.toLowerCase());
      const matchDest = !searchDest || t.destination.toLowerCase().includes(searchDest.toLowerCase());
      const matchType = type === 'all' || t.type === type;
      return matchSource && matchDest && matchType;
    });
    setFilteredTrips(results);
  };

  const handleMapSourceSelect = (location: { name: string; lat: number; lng: number }) => {
    setMapSource(location);
    setSource(location.name);
  };

  const handleMapDestinationSelect = (location: { name: string; lat: number; lng: number }) => {
    setMapDestination(location);
    setDestination(location.name);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground mb-3">
              Explore India, Your Way
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
              Book buses, trains, and hotels at the best prices. Your journey starts here.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-2xl p-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="From (e.g. Mumbai)"
                  className="pl-10"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="To (e.g. Goa)"
                  className="pl-10"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-10" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Dialog open={showMap} onOpenChange={setShowMap}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Map className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Select Locations on Map</DialogTitle>
                    </DialogHeader>
                    <MapSearch
                      onSourceSelect={handleMapSourceSelect}
                      onDestinationSelect={handleMapDestinationSelect}
                      source={mapSource || undefined}
                      destination={mapDestination || undefined}
                    />
                  </DialogContent>
                </Dialog>
                <Button onClick={handleSearch} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 flex-1">
                  <Search className="h-4 w-4" />
                  Search Trips
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => handleTypeFilter('bus')}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              selectedType === 'bus' ? 'bg-accent text-accent-foreground' : 'bg-card'
            }`}
          >
            <Bus className={`h-5 w-5 ${selectedType === 'bus' ? 'text-accent-foreground' : 'text-accent'}`} />
            <span className="font-medium text-sm">Bus Tickets</span>
          </button>
          <button
            onClick={() => handleTypeFilter('train')}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              selectedType === 'train' ? 'bg-secondary text-secondary-foreground' : 'bg-card'
            }`}
          >
            <Train className={`h-5 w-5 ${selectedType === 'train' ? 'text-secondary-foreground' : 'text-secondary'}`} />
            <span className="font-medium text-sm">Train Tickets</span>
          </button>
          <button
            onClick={() => handleTypeFilter('all')}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              selectedType === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card'
            }`}
          >
            <span className="font-medium text-sm">All Trips</span>
          </button>
          <Link to="/hotels" className="flex items-center gap-2 bg-card rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <span className="text-lg">🏨</span>
            <span className="font-medium text-sm text-foreground">Hotels</span>
          </Link>
        </div>
      </section>

      {/* Available Trips */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8">
            {selectedType === 'all' ? 'Available Trips' : selectedType === 'bus' ? 'Bus Tickets' : 'Train Tickets'}
          </h2>
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No trips found matching your search.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSource(""); setDestination(""); setSelectedType('all'); setFilteredTrips(trips); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
