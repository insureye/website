import React from 'react'
import { satellite } from '../assets'

const Satellite = () => {
  return (
    <div className='flex flex-col w-full'>
      <video className='object-cover' autoPlay loop muted>
        <source src={ satellite } type="video/mp4"/>
      </video>
    </div>
  )
}

export default Satellite