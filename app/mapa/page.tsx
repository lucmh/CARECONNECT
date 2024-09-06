'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false })

import { Icon, LatLngTuple } from 'leaflet'

interface Location {
  id: number
  name: string
  position: LatLngTuple
}

export default function Mapa() {
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: 'Hospital A', position: [-23.550520, -46.633308] },
    { id: 2, name: 'Clínica B', position: [-23.557820, -46.640309] },
    { id: 3, name: 'Farmácia C', position: [-23.553990, -46.628310] },
  ])

  useEffect(() => {
    // Aqui você pode carregar localizações de uma API ou banco de dados
  }, [])

  const customIcon = new Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })

  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold mb-4">Mapa de Serviços de Saúde</h1>
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer center={[-23.550520, -46.633308]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location) => (
            <Marker key={location.id} position={location.position} icon={customIcon}>
              <Popup>
                {location.name}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}