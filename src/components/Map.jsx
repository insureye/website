import {
  MapContainer,
  TileLayer, 
  Polygon,
  useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { useState } from 'react';
import MapToolBar from './utils/MapToolBar';


const polygonStyle = { color: 'black' }
const polygon = [
  [51.515, -0.09],
  [51.52, -0.1],
  [51.52, -0.12],
]

function PolygonDrawer({areaSelection, polygonPoints, setPolygonPoints}) {
  const map = useMapEvents({
    click(e) {
      areaSelection == true ? setPolygonPoints([...polygonPoints, e.latlng]) : null
    }
  });

  return (
    <Polygon pathOptions={polygonStyle} positions={polygonPoints} />
  )
}

const Map = () => {
  const [areaSelection, setAreaSelection] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const tools = {
    "AreaSelection": [areaSelection, setAreaSelection],
    "PolygonRemove": setPolygonPoints,
  }
  return (
    <div className='flex flex-row h-screen w-screen'>
      <MapContainer className="h-screen w-[70%]" center={[51.505, -0.09]} zoom={10} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <PolygonDrawer areaSelection={areaSelection} polygonPoints={polygonPoints} setPolygonPoints={setPolygonPoints}/>
      </MapContainer>
      <div className='flex w-[30%] h-screen bg-gray-200'>
        <MapToolBar tools={tools}/>
      </div>
    </div>
  )
}

export default Map