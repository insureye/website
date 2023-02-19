import React from 'react';
import styles from '../style';
import BtnContactUs from './utils/BtnContactUs';
import { landingvideo } from '../assets';
import { hero } from '../constants';


const Hero = () => (
    <div id="home" className={`${styles.boxWidth} flex md:flex-row flex-col`}>
      <div className={`z-10 flex-1 ${styles.flexStart} flex-row px-6 sm:px-16 py-[125px]`}>
        <div className='flex flex-col justify-between items-left w-full'>
          <h1 className='flex-1 font-poppins font-semibold ss:text-[42px] text-white text-shadow'>
            {hero.title1} <br/>
            {hero.title2}
          </h1>
          <p className={`${styles.paragraph} max-w-[470px] mt-5 py-5`}>
            { hero.content }
          </p>
          <div className='flex items-start py-3'>
            <BtnContactUs/>
          </div>
        </div>
      </div>
    </div>
)

export default Hero