import { useState } from 'react';
import styles from '../style';
import { logo } from '../assets';
import {BtnContactUs} from '../components';

const Navbar = () => {
  return (
    <div className="flex justify-center">
      <nav className={`${styles.boxWidth} flex py-3 flex-row justify-between items-center`}>
        <a className="px-10">
          <img src={logo} href="#top" alt="InsurEye" className='cursor-pointer w-[135px] h-[40px]'/>
        </a>
        <div className='flex flex-row items-left'>
          <div className="pr-6">
            <BtnContactUs name="Contact Us" link="#ContactUs"/>
          </div>
          <div className="pr-6 right-0">
            <BtnContactUs name="Try it" link="app"/>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar