import React from 'react'
import { scoop } from '../assets';
import { cdescription } from '../constants';
import styles from '../style';
import BtnContactUs from './utils/BtnContactUs';

const Description = () => {
  return (
    <div className='flex flex-row flex-wrap w-full justify-center gap-[5%] py-20'>
      <div className='flex flex-col flex-start min-w-[350px] max-w-[45%] items-center px-6'>
        <img src={ scoop } alt="Scoop" className='w-3/4'/>
      </div>

      <div className='flex flex-col flex-start min-w-[350px] max-w-[45%] items-center px-6'>
        <h1 className={`${styles.textTitle2} w-[90%] pt-20`}>
          { cdescription.title }
        </h1>
        <p className={`${styles.paragraph2} py-4 pb-8 flex-1`}>
          { cdescription.content}
        </p>
        <BtnContactUs name="Contact Us" link="#ContactUs"/>
      </div>
    </div>
  )
}

export default Description