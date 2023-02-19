import React from 'react';
import styles from '../style';
import { cta } from '../constants';
import { BtnContactUs } from '../components';

const CTA = () => {
  return (
    <div className='flex flex-row py-20 w-full'>
      <h1 className={`${styles.textTitle2} px-6 basis-1/2 text-start`}>
        { cta.title }
      </h1>

      <div className='flex flex-col basis-1/2 px-6'>
        <p className={`${styles.paragraph2} pb-6`}>
          { cta.content }
        </p>
        <BtnContactUs/>
      </div>
    </div>
  )
}

export default CTA