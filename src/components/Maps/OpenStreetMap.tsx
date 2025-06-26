// src/components/OpenStreetMapComponent.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { getLockStatusByPhoneNumber } from 'services/api';

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
  phoneNumber?: string;
}

const OpenStreetMapComponent: React.FC<OpenStreetMapComponentProps> = ({
  lat,
  lng,
  height = 180,
  phoneNumber,
}) => {
  const [copied, setCopied] = useState(false);
  const [live, setLive] = useState(false);
  const [liveLat, setLiveLat] = useState(lat);
  const [liveLng, setLiveLng] = useState(lng);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  //Polling for live location
  useEffect(() => {
    if (live && phoneNumber) {
      const poll = async () => {
        try {
          const res = await getLockStatusByPhoneNumber(phoneNumber);
          if (res?.data?.latitude && res?.data?.longitude) {
            setLiveLat(Number(res.data.latitude));
            setLiveLng(Number(res.data.longitude));
          }
        } catch {}
      };
      poll();
      intervalRef.current = setInterval(poll, 20000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [live, phoneNumber]);
// useEffect(() => {
//   if (live && phoneNumber) {
//     let counter = 0;
//     const poll = async () => {
//       // MOCK: Simulate changing coordinates for testing
//       // You can use Math.random() or increment a counter
//       const mockLat = lat + Math.sin(counter / 5) * 0.01;
//       const mockLng = lng + Math.cos(counter / 5) * 0.01;
//       setLiveLat(mockLat);
//       setLiveLng(mockLng);
//       counter++;
//     };
//     poll();
//     intervalRef.current = setInterval(poll, 20000);
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }
// }, [live, phoneNumber, lat, lng]);

  const handleCopy = () => {
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenMap = () => setLive(true);
  const handleCloseLive = () => setLive(false);

  return (
    <div>
      {!live ? (
        <>
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
              <Popup>Lock Location</Popup>
            </Marker>
          </MapContainer>
          <div style={{ margin: '8px 0', textAlign: 'center' }}>
            <button
              onClick={handleCopy}
              style={{
                padding: '6px 16px',
                borderRadius: 4,
                border: 'none',
                background: '#1976d2',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Copy Location URL
            </button>
            {copied && (
              <span style={{ marginLeft: 8, color: 'green', fontWeight: 500 }}>Copied!</span>
            )}
            <button
              onClick={handleOpenMap}
              style={{
                marginLeft: 8,
                padding: '6px 16px',
                borderRadius: 4,
                border: 'none',
                background: '#388e3c',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Live Location
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <iframe
            title="Live Location"
            width="100%"
            height={height}
            style={{ border: 0, borderRadius: 8 }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${liveLng - 0.01}%2C${liveLat - 0.01}%2C${liveLng + 0.01}%2C${liveLat + 0.01}&layer=mapnik&marker=${liveLat}%2C${liveLng}`}
            allowFullScreen
          />
          <div style={{ marginTop: 8 }}>
            <button
              onClick={handleCloseLive}
              style={{
                padding: '6px 16px',
                borderRadius: 4,
                border: 'none',
                background: '#d32f2f',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Close Live
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenStreetMapComponent;