import React from 'react'
import styles from '../../style'
import { Link } from 'react-router-dom';

const BtnContactUs = ({name, link}) => {
    return(
    <div className={`${styles.btnContactUs} ${styles.btnContactUsHover} flex flex-col items-center justify-center rounded-full p-[1px] min-w-[100px] max-w-[146px]`}>
        <Link to={link} className={`py-2 px-4 w-full h-full rounded-full text-[17px] text-center`}>
            {name}
        </Link>
    </div>);
}


export default BtnContactUs