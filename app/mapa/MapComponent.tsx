import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon, LatLngTuple } from 'leaflet'

interface Location {
  id: number
  name: string
  position: LatLngTuple
}

const MapComponent = () => {
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    const fetchLocations = async () => {
      const mockLocations: Location[] = [
        { id: 1, name: 'Hospital A', position: [-23.550520, -46.633309] },
        { id: 2, name: 'Clínica B', position: [-23.557820, -46.639813] },
        { id: 3, name: 'Farmácia C', position: [-23.543130, -46.642981] },
      ]
      setLocations(mockLocations)
    }

    fetchLocations()
  }, [])

  const customIcon = new Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })

  return (
    <div className="h-screen w-full">
      <MapContainer center={[-23.550520, -46.633308]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          <Marker key={location.id} position={location.position} icon={customIcon}>
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapComponent