import React from 'react'
import styles from './style.js'
import { landingvideo } from './assets/index.js';
import { Navbar, Hero, Features, Description, Workflow, CTA, Team, ContactUs, Footer, Satellite } from './components';

const App = () => (
  <div className='bg-black w-full overflow-hidden'>
    <div className='flex flex-col w-full justify-center items-center'>
      <div className={`absolute top-0 center w-full xl:max-w-[1280px] h-[1000px] z-0`}>
        <video className="absolute object-cover z-0" autoPlay muted loop>
          <source src={ landingvideo } type="video/mp4"/>
        </video>
      </div>
      <Navbar/>
      <div className='nav-sep w-full h-[3px]'/>
      <Hero/>

      <div className={`bg-features z-10 ${styles.flexStart} w-full border-t-2 border-white shadow-component`}>
        <div className={`${styles.boxWidth}`}>
          <Features/>
        </div>
      </div>
    </div>

    <div className={`bg-primary ${styles.paddingX} flex justify-center`}>
      <div className={`${styles.boxWidth}`}>
        <Description/>
        <Satellite/>
        <Workflow/>
      </div>
    </div>

    <div className='flex'>
      <div className='bg-cta flex justify-center z-10 w-full border-t-2 border-white shadow-component'>
        <div className={`${styles.boxWidth}`}>
          <CTA/>
        </div>
      </div>
    </div>


    <div className={`bg-primary ${styles.paddingX} flex justify-center`}>
      <div className={`${styles.boxWidth}`}>
        <Team/>
        <ContactUs/>
        <Footer/>
      </div>
    </div>

  </div>
);

export default App
