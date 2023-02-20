import React from 'react'
import styles from '../../style'

const BtnContactUs = () => {
    return(
    <div className={`${styles.btnContactUsHover} rounded-full p-[1px] w-[146px] h-[48px]`}>
        <button className={`${styles.btnContactUs} ${styles.btnContactUsHover} py-1 px-4 w-full h-full rounded-full text-[18px]`}>
            Contact Us
        </button>
    </div>);
}


export default BtnContactUs