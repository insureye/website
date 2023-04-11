import React from 'react';
import Feature from './Feature';
import { features } from '../constants';
import styles from '../style';

const Features = () => (
  <div id="features" className='flex flex-col py-20'>
    <h1 className={`${styles.textTitle2}`}>
      { features.title }
    </h1>

    <div className='flex flex-row flex-wrap items-center justify-center py-6 px-6 sm:px-16'>
      <Feature features={features.multispectral} className='flex flex-1'/>
      <Feature features={features.deeplearning} className='flex flex-1'/>
      <Feature features={features.smartcontract} className='flex flex-1'/>
    </div>
  </div>
)

export default Features