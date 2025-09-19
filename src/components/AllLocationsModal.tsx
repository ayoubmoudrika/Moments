"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface Activity {
  id?: number;
  title: string;
  address: string;
  date: string;
  rating: number;
}

interface AllLocationsModalProps {
  activities: Activity[];
  onClose: () => void;
}

export default function AllLocationsModal({ activities, onClose }: AllLocationsModalProps) {
  const [locations, setLocations] = useState<Array<{activity: Activity, coords: [number, number]}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('leaflet/dist/leaflet.css');
    
    const geocodeActivities = async () => {
      const locationsWithCoords = [];
      
      for (const activity of activities.filter(act => act.address)) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(activity.address)}`);
          const data = await response.json();
          
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            locationsWithCoords.push({ activity, coords: [lat, lon] as [number, number] });
          }
        } catch (error) {
          console.error('Geocoding error for', activity.title, error);
        }
      }
      
      setLocations(locationsWithCoords);
      setLoading(false);
    };

    geocodeActivities();
  }, [activities]);

  const createPlanetIcon = (isPast: boolean) => {
    const color = isPast ? '#4facfe' : '#ff6b9d'; // Blue for past, red for future
    
    return new (window as any).L.DivIcon({
      html: `
        <div style="
          background: radial-gradient(circle at 30% 30%, ${color}, ${isPast ? '#00f2fe' : '#ff8fab'});
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 15px ${color}80;
          position: relative;
          animation: planetFloat 3s ease-in-out infinite;
        ">
          <div style="
            position: absolute;
            top: 6px;
            left: 8px;
            width: 3px;
            height: 3px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'planet-marker',
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    });
  };

  if (loading) {
    return (
      <div className="map-modal-overlay" onClick={onClose}>
        <div className="map-modal" onClick={(e) => e.stopPropagation()}>
          <button className="map-close" onClick={onClose}>✕</button>
          <h3 className="map-title">All Activity Locations</h3>
          <div className="map-loading">Loading locations...</div>
        </div>
      </div>
    );
  }

  const center: [number, number] = locations.length > 0 
    ? [locations[0].coords[0], locations[0].coords[1]]
    : [48.8566, 2.3522]; // Default to Paris

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal" onClick={(e) => e.stopPropagation()}>
        <button className="map-close" onClick={onClose}>✕</button>
        <h3 className="map-title">All Activity Locations</h3>
        <div className="map-legend">
          <span className="legend-item">🔴 Future Activities</span>
          <span className="legend-item">🔵 Past Activities</span>
        </div>
        <div className="map-container">
          <MapContainer
            center={center}
            zoom={10}
            style={{ height: '400px', width: '100%', borderRadius: '15px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map(({ activity, coords }, index) => {
              const isPast = new Date(activity.date) < new Date();
              return (
                <Marker key={index} position={coords} icon={createPlanetIcon(isPast)}>
                  <Popup>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#667eea' }}>
                      {activity.title}<br/>
                      📅 {activity.date}<br/>
                      ⭐ {activity.rating}/10<br/>
                      📍 {activity.address}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}