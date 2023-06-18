import React from 'react'
import styles from '../../style'
import { Link } from 'react-router-dom';

const BtnContactUs = ({name, link}) => {
    return(
    <div className={`${styles.btn1}`}>
        <a href={link} className={`py-2 px-4 w-full h-full rounded-full text-[17px] text-center`}>
            {name}
        </a>
    </div>);
}


export default BtnContactUs