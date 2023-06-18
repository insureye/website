import React, { useState } from 'react'
import {
    MapContainer,
    TileLayer,
  } from 'react-leaflet';
import {StatefulBtn, DropdownBtn, PanelVariable} from '../components';
import style from "../style";
import {pencil} from "../assets";
import { Link } from 'react-router-dom';

const Dashboard = () => {

  const [timeFrame, changeTimeFrame] = useState("5");
  const [insuranceParameter, setInsuranceParameter] = useState("Risk");
  const stylebtnpressed = "border-2 w-[80%] border-white rounded text-white";
  const stylebtnrest = "w-[80%] border-white border-x rounded text-white"

  return (
    <div className='flex flex-row w-screen h-screen bg-[#222222]'>
        <div className='flex flex-col h-screen w-[15%]'>
            <div className='flex flex-col h-[30%] pl-10 pt-10'>
                <h1 className={`${style.paragraph} pb-2`}>Time</h1>
                <DropdownBtn timeFrame={timeFrame} changeTimeFrame={changeTimeFrame} btnstyle="border-white border-x bg-[#222222] w-[80%]"/>
            </div>


            <div className='flex flex-col h-[70%] w-full pl-10 py-5'>
              <h1 className={`${style.paragraph} pb-2`}>Graph Detail</h1>
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
                                <h1 className={`${style.paragraph}`}>Area Population(now)</h1>
                                <h1 className={`${style.paragraph}`}>
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
                    <MapContainer className="h-full w-[90%] px-10 py-10 rounded border-white border" center={[51.505, -0.09]} zoom={10} scrollWheelZoom={true}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    </MapContainer>
                </div>
            </div>


            <div className='flex flex-row h-[70%] py-5'>
                <div className='flex flex-col w-[50%]'>
                    <div className='h-[50%]'>
                        <PanelVariable name="Water"/>
                    </div>
                    <div className='h-[50%]'>
                        <PanelVariable name="Air"/>
                    </div>
                </div>
                <div className='flex flex-col w-[50%]'>
                    <div className='h-[50%]'>
                        <PanelVariable name="Greenhouse gas"/>
                    </div>
                    <div className='h-[50%]'>
                        <PanelVariable name="Ground"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard