import React, { useState } from 'react'
import {
    MapContainer,
    TileLayer,
    Polygon,
  } from 'react-leaflet';
import {StatefulBtn, DropdownBtn, PanelVariable} from '../components';
import styles from '../style';
import {pencil} from "../assets";
import { Link, useLocation } from 'react-router-dom';

const data = [
  {
    name: '2017',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: '2018',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: '2019',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: '2020',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: '2021',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: '2022',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: '2023',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const Dashboard = () => {

  const location = useLocation();
  const [timeFrame, changeTimeFrame] = useState("5");
  const [insuranceParameter, setInsuranceParameter] = useState("Risk");
  const stylebtnpressed = "border-2 w-[80%] border-white rounded text-white";
  const stylebtnrest = "w-[80%] border-white border-x rounded text-white"

  return (
    <div className='flex flex-row w-screen h-screen bg-[#222222]'>
        <div className='flex flex-col h-screen w-[15%]'>
            <div className='flex flex-col h-[30%] pl-10 pt-10'>
                <h1 className={`${styles.paragraph} pb-2`}>Time</h1>
                <DropdownBtn timeFrame={timeFrame} changeTimeFrame={changeTimeFrame} btnstyle="border-white border-x bg-[#222222] w-[80%]"/>
            </div>


            <div className='flex flex-col h-[70%] w-full pl-10 py-5'>
              <h1 className={`${styles.paragraph} pb-2`}>Graph Detail</h1>
              <div className='py-2'/>
              <StatefulBtn onClick={() => setInsuranceParameter("Risk")} btnstyle={insuranceParameter == "Risk"? stylebtnpressed : stylebtnrest} text="Risk"/>
              <div className='pt-3'/>
              <StatefulBtn onClick={() => setInsuranceParameter("Exposure")} btnstyle={insuranceParameter == "Exposure"? stylebtnpressed : stylebtnrest} text="Exposure"/>
              <div className='pt-3'/>
              <StatefulBtn onClick={() => setInsuranceParameter("Vulnerability")} btnstyle={insuranceParameter == "Vulnerability"? stylebtnpressed : stylebtnrest} text="Vulnerability"/>
            </div>
        </div>


        <div className='flex flex-col h-screen w-[85%]'>
            <div className='flex flex-row h-[30%] pt-10 px-4'>
                <div className='flex flex-row justify-end w-[50%] h-full px-2'>
                    <div className='flex flex-col h-full justify-between'>
                        <div className='flex flex-row pt-2'>
                            <div className='flex flex-col px-4'>
                                <h1 className={`${styles.paragraph}`}>Area Population(now)</h1>
                                <h1 className={`${styles.paragraph}`}>
                                    {timeFrame=="1"? "Area Population(In 1 year)": "Area Population(In " + timeFrame + " years)"}
                                </h1>
                            </div>
                            <div className='flex flex-col px-4'>
                                <h1 className='text-white text-[18px] leading-[30.8px]'>123.456ca</h1>
                                <h1 className='text-white text-[18px] leading-[30.8px]'>165.432ca</h1>
                            </div>
                        </div>

                        <Link to='/app'className='flex flex-row justify-end items-end text-white text-right text-end pb-1'>
                            <img src={pencil} className='h-[20px] px-2'/>
                            <u className='font-semibold text-[15px]'>Draw your own area</u>
                        </Link>
                    </div>
                </div>

                <div className='w-[50%] px-4'>
                    <MapContainer className="h-full w-[90%] px-10 py-10 rounded border-white border" center={location.state.mapState.center} zoom={location.state.mapState.zoom} scrollWheelZoom={true}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <Polygon pathOptions={{ color : 'white'}} positions={location.state.polygonPoints} />
                    </MapContainer>
                </div>
            </div>


            <div className='flex flex-row h-[70%] py-5'>
                <div className='flex flex-col w-[50%] px-4'>
                    <div className='h-[50%] py-4'>
                        <PanelVariable name="Water" data={data} limit={3000}/>
                    </div>
                    <div className='h-[50%] py-4'>
                        <PanelVariable name="Ground" data={data} limit={3000}/>
                    </div>
                </div>
                <div className='flex flex-col w-[50%] px-4'>
                    <div className='h-[50%] py-4'>
                        <PanelVariable name="Air" data={data} limit={3000}/>
                    </div>
                    <div className='flex flex-row h-[50%] py-4 justify-center items-center'>
                        <StatefulBtn btnstyle={styles.btn1} text="Download report"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard