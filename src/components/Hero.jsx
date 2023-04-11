import React from 'react';
import styles from '../style';
import BtnContactUs from './utils/BtnContactUs';
import { landingvideo } from '../assets';
import { hero } from '../constants';


const Hero = () => (
    <div id="home" className="static flex flex-col">
      <div className={`flex flex-col justify-between px-[10%] sm:px-[150px] items-left w-full z-10 ${styles.boxWidth}`}>
        <h1 className='flex-1 font-poppins font-semibold text-[40px] text-white text-shadow'>
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
)

export default Hero