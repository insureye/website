import React from 'react'
import styles from '../../style';

const WorkflowStep = ({textContent, ci}) => {
  return (
    <div className={`flex grow flex-row w-full py-8 px-5`}>
        
        <h1 className=' text-white text-[22px] px-4'>
            {ci + 1} - {textContent}
        </h1>
    </div>
  )
}

export default WorkflowStep