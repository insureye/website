import React from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'
import styles from '../../style'

const RiskGauge = ({data}) => {
  return (
    <div className='flex flex-row w-full h-full items-center'>
        <ResponsiveContainer width="60%" height="100%">
            <RadialBarChart 
            width="100%"
            height="5%"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            innerRadius="0%" 
            outerRadius="100%" 
            data={data} 
            startAngle={0} 
            endAngle={360}
            >
                <RadialBar minAngle={15} background clockWise={true} dataKey='risk' />
                <Tooltip/>
            </RadialBarChart>
        </ResponsiveContainer>
        <div className='flex flex-col justify-center'>
            <h1 className={`${styles.paragraph} text-center`}>
                Risk
            </h1>
            <h1 className='text-white text-[22px] text-center'>
                83%
            </h1>
        </div>
    </div>
  )
}

export default RiskGauge