import React from 'react'
import styles from '../style.js'
import { landingvideo } from '../assets/index.js';
import { Navbar, Hero, Features, Description, Workflow, CTA, Team, ContactUs, Footer, Satellite } from './index.js';

const Home = () => (
    <div className='bg-black w-screen overflow-hidden'>
      <div className='static w-screen'>
        <div className='flex flex-col h-screen items-center'>
          <div className='top-0 w-screen z-20'>
            <Navbar/>
              <div className='nav-sep w-full h-[3px]'/>
          </div> 

          <video id="video" className="absolute object-none top-0 right-0 h-screen w-auto" autoPlay muted loop>
            <source src={ landingvideo } type="video/mp4"/>
          </video>
          

          <div className="flex flex-1 justify-start w-full items-center max-w-[1280px]">
            <Hero/>
          </div>
        </div>
      </div>

      <div className={`bg-features flex w-full border-t-2 border-white z-10`}>
        <div className='flex justify-center w-full shadow-component'>
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
      

      <div className={`bg-primary ${styles.paddingX} flex justify-center pb-10`}>
        <div className={`${styles.boxWidth}`}>
          <Team/>
          <div id="ContactUs">
            <ContactUs/>
          </div>
        </div>
      </div>

      <div>
        <div className='bg-white w-full h-[3px]'/>
        <Footer/>
      </div>
    </div>
)


export default Home
