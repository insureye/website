import React, {useEffect, useState} from 'react'
import { Helmet } from 'react-helmet';
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
import { logoImage } from '../assets';

function locationChange(setMapState, result, zoom) {
  setMapState({center:[result.lat, result.lng], zoom:zoom})
}

function LeafletgeoSearch({setMapState}) {
  const map = useMap(); //here use useMap hook

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
    });

    map.addControl(searchControl);
    map.on('moveend', (result) => locationChange(setMapState, map.getCenter(), map.getZoom()))
    return () => map.removeControl(searchControl)
  }, []);

  return null;
}

function PolygonDrawer({areaSelection, polygonPoints, setPolygonPoints}) {
  const map = useMapEvents({
    click(e) {
      areaSelection == true ? setPolygonPoints([...polygonPoints, e.latlng]) : null
    }
  });

  return (
    <Polygon pathOptions={{ color : 'white'}} positions={polygonPoints} />
  )
}

function MapBtnClickHandler(state, setState, polygonPoints, mapState, navigate) {
  if (state) {
    navigate("/dashboard", {state:{polygonPoints:polygonPoints, mapState:mapState}})
  } else {
    setState(!state)
  }
}

const App = () => {
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [areaSelection, setAreaSelection] = useState(false);
  const [mapState, setMapState] = useState({center:[51.505, -0.09], zoom:10})
  const navigate = useNavigate();
  
  return (
    <div className='flex flex-col bg-[#222222] h-screen w-screen items-start'>
        <Helmet>
          <title>InsurEye</title>
          <link rel="icon" type="image/png" href={logoImage} sizes="16x16" />
        </Helmet>
        <h1 className='text-white text-[25px] py-10 px-10'>{app.title}</h1>
        {/*
        <div className='px-10 py-4 w-full'>
          <input type="text" placeholder="Region, city, coordinate" className={`placeholder-dimWhite text-white border border-white bg-black bg-opacity-10 rounded pl-6 pr-[30%] py-2`}
          />
        </div>
        */}
        <div className="flex flex-col px-10 pb-10 w-screen h-full items-center">
          <MapContainer className="h-full w-full px-10 py-10 rounded border-white border" center={[51.505, -0.09]} zoom={10} scrollWheelZoom={true}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <PolygonDrawer areaSelection={areaSelection} polygonPoints={polygonPoints} setPolygonPoints={setPolygonPoints}/>
            <LeafletgeoSearch setMapState={setMapState}/>
          </MapContainer>
          <div className='absolute bottom-[10%] z-[1000] '>
            <StatefulBtn onClick={() => MapBtnClickHandler(areaSelection, setAreaSelection, polygonPoints, mapState, navigate)} btnstyle={styles.btn1} text={areaSelection? "Analyze":"Draw your area"}/>
          </div>
        </div>
    </div>
  )
}

export default App