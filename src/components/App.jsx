import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer, 
  useMap, 
  Polygon,
  useMapEvents,
} from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import StatefulBtn from './utils/StatefulBtn';
import { app } from '../constants'
import styles from '../style';


function LeafletgeoSearch() {
  const map = useMap(); //here use useMap hook

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl)
  }, []);

  return null;
}


async function flyToLocation(location) {
  const map = useMap();
  const provider = new OpenStreetMapProvider();
  const results = await provider.search({ query: location });
  console.log(results)

  map.flyTo([results.y, results.x], 10)
}

function PolygonDrawer({areaSelection, polygonPoints, setPolygonPoints}) {
  const map = useMapEvents({
    click(e) {
      areaSelection == true ? setPolygonPoints([...polygonPoints, e.latlng]) : null
    }
  });

  return (
    <Polygon pathOptions={{ color : 'black'}} positions={polygonPoints} />
  )
}

function MapBtnClickHandler(state, setState, navigate) {
  if (state) {
    navigate("/dashboard")
  } else {
    setState(!state)
  }
}

const App = () => {
  const [areaSelection, setAreaSelection] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [location, setLocation] = useState([51.505, -0.09]);
  const navigate = useNavigate();
  
  return (
    <div className='flex flex-col bg-[#222222] h-screen w-screen items-start'>
        <h1 className='text-white text-[25px] pt-10 px-10'>{app.title}</h1>
        <div className='px-10 py-4 w-full'>
          <input type="text" placeholder="Region, city, coordinate" className={`placeholder-dimWhite text-white border border-white bg-black bg-opacity-10 rounded pl-6 pr-[30%] py-2`} onKeyDown={
            (e) => {
              if (e.key === 'Enter') {
                setLocation(this.value);
                flyToLocation(this.value);
              }
            }
          }/>
        </div>

        <div className="flex flex-col px-10 pb-10 w-screen h-full items-center">
          <MapContainer className="h-full w-full px-10 py-10 rounded border-white border" center={[51.505, -0.09]} zoom={10} scrollWheelZoom={true}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <PolygonDrawer areaSelection={areaSelection} polygonPoints={polygonPoints} setPolygonPoints={setPolygonPoints}/>
            <LeafletgeoSearch/>
          </MapContainer>
          <div className='absolute bottom-[10%] z-[1000] '>
            <StatefulBtn onClick={() => MapBtnClickHandler(areaSelection, setAreaSelection, navigate)} btnstyle={styles.btn1} text={areaSelection? "Analyze":"Draw your area"}/>
          </div>
        </div>
    </div>
  )
}

export default App