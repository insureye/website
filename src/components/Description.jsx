import React from 'react'
import { scoop } from '../assets';
import { cdescription } from '../constants';
import styles from '../style';
import BtnContactUs from './utils/BtnContactUs';

const Description = () => {
  return (
    <div className='flex flex-row flex-wrap py-[75px] w-full'>
      <div className='flex flex-1 basis-1/2 min-w-[200px] justify-center items-center'>
        <img src={ scoop } alt="Scoop" className='w-3/4'/>
      </div>

      <div className='flex flex-1 flex-col min-w-[200px] basis-1/2 justify-center items-center'>
        <h1 className={`${styles.textTitle2} flex-1 w-full py-4`}>
          { cdescription.title }
        </h1>
        <p className={`${styles.paragraph2} py-4 pb-8`}>
          { cdescription.content}
        </p>
        <BtnContactUs/>
      </div>
    </div>
  )
}

export default Description