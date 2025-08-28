import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LatLng {
  lat: number;
  lng: number;
}

interface MapViewProps {
  departure?: LatLng | null;
  arrival?: LatLng | null;
  departureLabel?: string;
  arrivalLabel?: string;
}

const MapView: React.FC<MapViewProps> = ({
  departure,
  arrival,
  departureLabel,
  arrivalLabel,
}) => {
  const center = departure || arrival || { lat: 36.5, lng: 127.5 };

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {departure && (
        <Marker position={[departure.lat, departure.lng]}>
          <Popup>{departureLabel || '출발지'}</Popup>
        </Marker>
      )}
      {arrival && (
        <Marker position={[arrival.lat, arrival.lng]}>
          <Popup>{arrivalLabel || '도착지'}</Popup>
        </Marker>
      )}
      {departure && arrival && (
        <Polyline
          positions={[
            [departure.lat, departure.lng],
            [arrival.lat, arrival.lng],
          ]}
          pathOptions={{ color: 'red', weight: 4 }}
        />
      )}
    </MapContainer>
  );
};

export default MapView;
