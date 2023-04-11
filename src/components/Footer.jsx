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
        <SocialCard image={twitter} name="Twitter" url="https://www.twitter.com"/>
        <SocialCard image={linkedin} name="Linkedin" url="https://www.linkedin.com"/>
      </div>
      <div className='flex flex-row justify-between pb-3 pt-5'>
        <h1 className='text-white text-[12px]'>
          Our terms & conditions
        </h1>
        <a href="#ContactUs"className='text-white text-[12px]'>
          insureye@gmail.com
        </a>
      </div>

    </div>
  )
}

export default Footer