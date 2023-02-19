import React from 'react'
import { SocialCard } from '../components';
import { twitter, linkedin } from '../assets';

const Footer = () => {
  return (
    <div className='flex flex-col pt-4 bg-gray-700 px-8 justify-between'>
      <div className='flex flex-row items-center' >
        <h1 className='text-white text-[20px] text-shadow pr-8'>
          Our galaxy:
        </h1>
        <SocialCard image={twitter} name="Twitter"/>
        <SocialCard image={linkedin} name="Linkedin"/>
      </div>
      <div className='flex flex-row justify-between pb-3 pt-5'>
        <h1 className='text-white text-[12px]'>
          Our terms & conditions
        </h1>
        <h1 className='text-white text-[12px]'>
          contact@insureye.space
        </h1>
      </div>

    </div>
  )
}

export default Footer