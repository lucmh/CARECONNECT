'use client'

import { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url'

const containerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: -23.5505,
  lng: -46.6333
}

interface Location {
  lat: number;
  lng: number;
}

interface Hospital {
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  name: string;
}

const libraries: Libraries = ['places']

export default function MapaPage() {
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [hospitals, setHospitals] = useState<Hospital[]>([])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting user location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  useEffect(() => {
    if (userLocation && window.google) {
      const service = new google.maps.places.PlacesService(document.createElement('div'))
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        radius: 5000,
        type: 'hospital'
      }

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setHospitals(results as Hospital[])
        }
      })
    }
  }, [userLocation])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hospitais Próximos</h1>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} libraries={libraries}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || center}
          zoom={13}
        >
          {userLocation && <Marker position={userLocation} />}
          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              position={{
                lat: hospital.geometry.location.lat(),
                lng: hospital.geometry.location.lng()
              }}
              title={hospital.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}