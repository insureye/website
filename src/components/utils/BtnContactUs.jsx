import React from 'react'
import styles from '../../style'

const BtnContactUs = () => {
    return(
    <div className={`${styles.btnContactUs} ${styles.btnContactUsHover} flex flex-col items-center justify-center rounded-full p-[1px] min-w-[100px] max-w-[146px]`}>
        <a href="#ContactUs" className={`py-2 px-4 w-full h-full rounded-full text-[17px] text-center`}>
            Contact Us
        </a>
    </div>);
}


export default BtnContactUs