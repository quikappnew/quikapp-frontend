// src/components/OpenStreetMapComponent.tsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet's default icon path issues with Webpack
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface OpenStreetMapComponentProps {
  lat: number;
  lng: number;
  height?: number;
}

const OpenStreetMapComponent: React.FC<OpenStreetMapComponentProps> = ({ lat, lng, height = 180 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <MapContainer 
        center={[lat, lng]} 
        zoom={3} 
        style={{ height, width: '100%' }}
      >
        <TileLayer
          attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            Lock Location
          </Popup>
        </Marker>
      </MapContainer>
      <div style={{ marginTop: 8, textAlign: 'center' }}>
        <button
          onClick={handleCopy}
          style={{
            padding: '6px 16px',
            borderRadius: 4,
            border: 'none',
            background: '#1976d2',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Copy Location URL
        </button>
        {copied && (
          <span style={{ marginLeft: 8, color: 'green', fontWeight: 500 }}>Copied!</span>
        )}
      </div>
    </div>
  );
};

export default OpenStreetMapComponent;