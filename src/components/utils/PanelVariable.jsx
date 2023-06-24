import React from 'react'
import styles from '../../style'
import Chart from './Chart';
import RiskGauge from './RiskGauge';

const gaugedata = [
  {
    "name": "18-24",
    "risk": 100,
    "pv": 2400,
    "fill": "#222222"
  },
  {
    "name": "25-29",
    "risk": 83,
    "pv": 4567,
    "fill": "#DC143C"
  }
]

const PanelVariable = ({name, data, limit}) => {
  return (
    <div className='relative flex flex-row border border-[#bbbbbb] rounded-lg h-full w-full'>
      <div className='absolute left-[5%] top-[-10%] rounded-full bg-[#222222] w-[125px] h-[25px] z-[10000]'>
        <h1 className='text-white text-[20px] text-center'>
          {name}
        </h1>
      </div>
      <div className='flex flex-col w-[40%] items-center'>
        <div className='flex h-[60%] w-full text-white'>
          <RiskGauge data={gaugedata}/>
        </div>
        <div className='flex flex-row pt-2'>
            <div className='flex flex-col pl-2 px-2'>
                <h1 className={`${styles.paragraph2} leading-[30.8px]`}>Exposure</h1>
                <h1 className={`${styles.paragraph2} leading-[30.8px]`}>Vulnerability</h1>
            </div>
            <div className='flex flex-col px-2'>
                <h1 className='text-white text-[1rem] leading-[30.8px]'>63%</h1>
                <h1 className='text-white text-[1rem] leading-[30.8px]'>81%</h1>
            </div>
        </div>
      </div>
      <div className='flex w-[60%] px-4 py-4'>
        <Chart data={data} limit={limit}/>
      </div>
    </div>
  )
}

export default PanelVariable