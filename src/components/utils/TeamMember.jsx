import React from 'react';
import styles from '../../style';

const TeamMember = ({name, teamMember}) => {
  return (
    <div className='flex flex-col items-center justify-center w-[200px] py-6'>
        <img src={teamMember.image} className='w-full py-4'/>
        <h1 className='text-white text-[20px] py-2'>
            {name}
        </h1>
        <p className={`text-dimWhite text-[16px] text-center`}>
            {teamMember.description}
        </p>
    </div>
  )
}

export default TeamMember