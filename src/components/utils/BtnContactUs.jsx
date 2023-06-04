import React from 'react'
import styles from '../../style'

const BtnContactUs = ({name, link}) => {
    return(
    <div className={`${styles.btnContactUs} ${styles.btnContactUsHover} flex flex-col items-center justify-center rounded-full p-[1px] min-w-[100px] max-w-[146px]`}>
        <a href={link} className={`py-2 px-4 w-full h-full rounded-full text-[17px] text-center`}>
            {name}
        </a>
    </div>);
}


export default BtnContactUs