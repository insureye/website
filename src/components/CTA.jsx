import React from 'react';
import styles from '../style';
import { cta } from '../constants';
import { BtnContactUs } from '../components';

const CTA = () => {
  return (
    <div className='flex flex-row flex-wrap py-20 w-full items-center justify-center'>
      <h1 className={`${styles.textTitle2} px-6 pb-8 max-w-[400px] text-start`}>
        { cta.title }
      </h1>

      <div className='flex flex-col px-6'>
        <p className={`${styles.paragraph2} max-w-[400px] pb-6`}>
          { cta.content }
        </p>
        <BtnContactUs/>
      </div>
    </div>
  )
}

export default CTA