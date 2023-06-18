import React from 'react'
import styles from '../../style'
import { Link } from 'react-router-dom';

const BtnRouter = ({name, link}) => {
    return(
    <div className={`${styles.btn1}`}>
        <Link to={link} className={`py-2 px-4 w-full h-full rounded-full text-[17px] text-center`}>
            {name}
        </Link>
    </div>);
}


export default BtnRouter