import React, { useRef} from 'react'
import emailjs from '@emailjs/browser';

const ContactFormPart = ({title, placeholder}) => {
  return (
    <div className='flex flex-col justify-start py-2 w-[80%]'>
        <h1 className='justify-start text-white text-[16px] max-w-[376px] py-2 px-4'>
          {title}
        </h1>
        <input type="text" name={title} placeholder={placeholder} className={`placeholder-dimWhite text-white border border-white bg-black bg-opacity-10 rounded px-4 py-2`}/>
     </div>
  )
}

const ContactForm = () => {
  const form = useRef();
  
  const sendEmail = (e) => {
    e.preventDefault(); // prevents the page from reloading when you hit “Send”
  
    emailjs.sendForm('service_52ufzhm', 'template_2adt37o', form.current, 'y3R3vYlPub36f3Si_')
      .then((result) => {
          alert("Message sent");
      }, (error) => {
          alert("An error has occurred");
      });
  };
  return (
    <form ref={form} onSubmit={sendEmail} className='flex flex-col items-center w-[90%] max-w-[416px] py-5 bg-gray-100 bg-opacity-5 rounded border border-white'>
        <ContactFormPart title="Name" placeholder="Name"/>
        <ContactFormPart title="Email" placeholder="example@insurance.com"/>
        <div className='flex flex-col justify-start pt-2 pb-10 w-[80%]'>
          <h1 className='justify-start text-white text-[16px] w-[376px] py-2 px-4'>
            Message
          </h1>
          <textarea name="message" placeholder="How can we help you?" rows="4" className={`placeholder-dimWhite text-white border border-white bg-black bg-opacity-10 rounded px-4 py-2`}/>
        </div>
        <input type="submit" value="Send message" className='rounded-full bg-black bg-opacity-10 border border-white text-white hover:bg-white hover:text-black py-2 px-4'/>
    </form>
  )
}

export default ContactForm


    
