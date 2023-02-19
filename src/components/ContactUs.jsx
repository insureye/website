import React from 'react';
import styles from '../style';
import { ContactForm } from '../components';
import { logoImage } from '../assets';

const ContactUs = () => {
  return (
    <div className='flex flex-col items-center py-10'>
      <h1 className={`${styles.textTitle2} py-10`}>
        Contact
      </h1>
      <ContactForm/>
    </div>
  )
}

export default ContactUs