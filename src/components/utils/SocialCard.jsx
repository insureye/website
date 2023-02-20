import React from 'react'

const SocialCard = ({image, name, url}) => {
  return (
    <a href={url}className='flex flex-row items-center px-5'>
        <img src={image} className='w-full'/>
        <h1 className='text-[16px] text-white text-shadow px-1'>
            {name}
        </h1>
    </a>
  )
}

export default SocialCard