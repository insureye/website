import React from 'react'
import styles from '../style';

const Feature = ({features}) => {
    return(
    <div className='flex flex-col items-center min-w-[200px] max-w-[350px] px-5'>
        <img src={ features.icon } alt={features.title} className='w-[120px] h-[120px]'/>
        <h1 className='flex-1 font-poppins font-semibold ss:text-[20px] text-white py-6'>
           {features.title}
        </h1>
        <p className={`${styles.paragraph2}`}>
            {features.content}
        </p>
    </div>
    )
}


export default Feature