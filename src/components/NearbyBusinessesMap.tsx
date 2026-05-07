import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { getCategoryInfo } from '../store/AppContext';

// Fix Leaflet default icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Business {
  uid: string;
  businessName: string;
  businessType: string;
  lat?: number;
  lng?: number;
  distance?: number;
  rating?: number;
  bannerImageURL?: string;
  isOpen?: boolean;
}

interface NearbyBusinessesMapProps {
  businesses: Business[];
  userLocation: { lat: number; lng: number } | null;
  onBusinessClick?: (businessId: string) => void;
}

// Component to recenter map when user location changes
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function NearbyBusinessesMap({ 
  businesses, 
  userLocation,
  onBusinessClick 
}: NearbyBusinessesMapProps) {
  const nav = useNavigate();
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default: Delhi

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  // Custom icon for user location
  const userIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="8" fill="#667EEA" stroke="white" stroke-width="3"/>
        <circle cx="16" cy="16" r="12" fill="none" stroke="#667EEA" stroke-width="2" opacity="0.3"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // Custom icon for businesses
  const businessIcon = (color: string) => new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
        <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" fill="${color}"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `),
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });

  const handleBusinessClick = (businessId: string) => {
    if (onBusinessClick) {
      onBusinessClick(businessId);
    } else {
      nav(`/customer/salon/${businessId}`);
    }
  };

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* OpenStreetMap tiles - FREE, no API key needed! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={mapCenter} />

        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={userIcon}
          >
            <Popup>
              <div className="text-center p-2">
                <p className="font-bold text-primary">📍 Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Business markers */}
        {businesses.map((business) => {
          if (!business.lat || !business.lng) return null;
          
          const catInfo = getCategoryInfo(business.businessType);
          const markerColor = business.isOpen ? '#10B981' : '#EF4444';

          return (
            <Marker
              key={business.uid}
              position={[business.lat, business.lng]}
              icon={businessIcon(markerColor)}
              eventHandlers={{
                click: () => handleBusinessClick(business.uid),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  {business.bannerImageURL && (
                    <img 
                      src={business.bannerImageURL} 
                      alt={business.businessName}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="font-black text-sm mb-1">{business.businessName}</p>
                  <p className="text-xs text-primary font-bold mb-1">
                    {catInfo.icon} {catInfo.label}
                  </p>
                  {business.distance !== undefined && (
                    <p className="text-xs text-gray-600 mb-1">
                      📍 {business.distance.toFixed(1)} km away
                    </p>
                  )}
                  {business.rating && (
                    <p className="text-xs text-gold mb-2">
                      ⭐ {business.rating}
                    </p>
                  )}
                  <button
                    onClick={() => handleBusinessClick(business.uid)}
                    className="w-full py-2 px-3 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-all"
                  >
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
