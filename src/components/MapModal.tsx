"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Custom planet marker icon - created inside component to avoid SSR issues
const createCustomIcon = () => new L.DivIcon({
  html: `
    <div style="
      background: radial-gradient(circle at 30% 30%, #4facfe, #00f2fe, #667eea);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 20px rgba(79, 172, 254, 0.8), 0 0 40px rgba(79, 172, 254, 0.4);
      position: relative;
      animation: planetFloat 3s ease-in-out infinite;
    ">
      <div style="
        position: absolute;
        top: 8px;
        left: 10px;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
      "></div>
      <div style="
        position: absolute;
        top: 15px;
        right: 8px;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
      "></div>
    </div>
    <style>
      @keyframes planetFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(180deg); }
      }
    </style>
  `,
  className: 'planet-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

interface MapModalProps {
  address: string;
  onClose: () => void;
}

export default function MapModal({ address, onClose }: MapModalProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fix default icons
    
    // Fix Leaflet default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
    
    // Geocode the address
    const geocodeAddress = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setCoordinates([lat, lon]);
        } else {
          // Default to Paris if address not found
          setCoordinates([48.8566, 2.3522]);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setCoordinates([48.8566, 2.3522]);
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [address]);

  if (loading || !coordinates) {
    return (
      <div className="map-modal-overlay" onClick={onClose}>
        <div className="map-modal" onClick={(e) => e.stopPropagation()}>
          <button className="map-close" onClick={onClose}>✕</button>
          <h3 className="map-title">{address}</h3>
          <div className="map-loading">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal" onClick={(e) => e.stopPropagation()}>
        <button className="map-close" onClick={onClose}>✕</button>
        <h3 className="map-title">{address}</h3>
        <div className="map-container">
          <MapContainer
            center={coordinates}
            zoom={15}
            style={{ height: '400px', width: '100%', borderRadius: '15px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coordinates} icon={createCustomIcon()}>
              <Popup>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#667eea' }}>
                  🌍 {address}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}