import React from 'react';
import { Polyline } from 'react-leaflet';


type TripProps = {
    trip: {
      GPS_LAT: string;
      GPS_LONG: string;
    }[];
  };
  
  const Trip: React.FC<TripProps> = ({ trip }) => {
    return (
      <Polyline positions={trip.map(point => ({lat: parseFloat(point.GPS_LAT), lng: parseFloat(point.GPS_LONG)}))} />
    );
  };
  export default Trip;
