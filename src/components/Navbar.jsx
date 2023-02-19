import { useState } from 'react';
import styles from '../style';
import { logo } from '../assets';
import {BtnContactUs} from '../components';

const Navbar = () => {
  return (
    <div className={`z-10 ${styles.boxWidth} px-6 sm:px-16`}>
      <nav className='w-full flex py-3 justify-between items-center navbar'>
        <a>
          <img src={logo} alt="InsurEye" className='cursor-pointer w-[135px] h-[40px]'/>
        </a>
        <div>
          <BtnContactUs className='w-[146px] h-[48px]'/>
        </div>
      </nav>
    </div>
  )
}

export default Navbar