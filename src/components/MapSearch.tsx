import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface MapSearchProps {
  onLocationSelect: (location: Location) => void;
  selectedType: "source" | "destination";
}

const LocationSelector = ({ onLocationSelect, selectedType }: MapSearchProps) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      // Reverse geocoding using Nominatim (OpenStreetMap)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
        );
        const data = await response.json();

        const location: Location = {
          name: data.display_name?.split(',')[0] || `Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          lat,
          lng,
        };

        onLocationSelect(location);
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        const location: Location = {
          name: `Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          lat,
          lng,
        };
        onLocationSelect(location);
      }
    },
  });

  return null;
};

interface MapSearchComponentProps {
  onSourceSelect: (location: Location) => void;
  onDestinationSelect: (location: Location) => void;
  source?: Location;
  destination?: Location;
}

const MapSearch = ({ onSourceSelect, onDestinationSelect, source, destination }: MapSearchComponentProps) => {
  const [center, setCenter] = useState<LatLngTuple>([20.5937, 78.9629]); // Center of India

  useEffect(() => {
    if (source) {
      setCenter([source.lat, source.lng]);
    } else if (destination) {
      setCenter([destination.lat, destination.lng]);
    }
  }, [source, destination]);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border">
      <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationSelector
          onLocationSelect={(location) => {
            if (!source) {
              onSourceSelect(location);
            } else if (!destination) {
              onDestinationSelect(location);
            } else {
              // Reset and set as source
              onSourceSelect(location);
              onDestinationSelect({ name: "", lat: 0, lng: 0 });
            }
          }}
          selectedType={!source ? "source" : "destination"}
        />

        {source && source.lat && source.lng && (
          <Marker position={[source.lat, source.lng]}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-green-600">Source</div>
                <div className="text-sm">{source.name}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {destination && destination.lat && destination.lng && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-red-600">Destination</div>
                <div className="text-sm">{destination.name}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="p-2 bg-muted text-sm text-center">
        Click on the map to select {!source ? "source" : !destination ? "destination" : "new source"} location
      </div>
    </div>
  );
};

export default MapSearch;