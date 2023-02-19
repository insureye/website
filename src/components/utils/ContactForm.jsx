import React from 'react'
import BtnContactUs from './BtnContactUs'

const ContactFormPart = ({title, placeholder}) => {
  return (
    <div className='flex flex-col justify-start py-2'>
        <h1 className='justify-start text-white text-[16px] w-[376px] py-2 px-4'>
          {title}
        </h1>
        <input placeholder={placeholder} className={`placeholder-dimWhite text-white border border-white bg-black bg-opacity-10 rounded px-4 py-2`}/>
     </div>
  )
}

const ContactForm = () => {
  return (
    <form className='flex flex-col items-center w-[416px] py-5 bg-gray-100 bg-opacity-5 rounded border border-white'>
        <ContactFormPart title="Name" placeholder="Name"/>
        <ContactFormPart title="Email" placeholder="example@insurance.com"/>
        <div className='flex flex-col justify-start pt-2 pb-10'>
          <h1 className='justify-start text-white text-[16px] w-[376px] py-2 px-4'>
            Message
          </h1>
          <textarea placeholder="How can we help you?" rows="4" className={`placeholder-dimWhite text-white border border-white bg-black bg-opacity-10 rounded px-4 py-2`}/>
        </div>
        <button className='rounded-full bg-black bg-opacity-10 border border-white text-white hover:bg-white hover:text-black py-2 px-4'>
          Send message
        </button>
    </form>
  )
}

export default ContactForm