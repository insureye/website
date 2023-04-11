import React from 'react'
import styles from '../style'
import { logoImage } from '../assets';
import { workflow } from '../constants';
import { WorkflowStep} from '../components';

const Workflow = () => {
  return (
    <div className='flex flex-row flex-wrap w-full justify-center gap-[5%] py-20'>
      <div className='flex flex-col flex-start min-w-[350px] max-w-[45%] items-center px-6'>
        <h1 className={`${styles.textTitle2} grow-0 py-8`}>
          { workflow.title }
        </h1>
        <p className={`${styles.paragraph2} grow-0 py-4`}>
          { workflow.content }
        </p>
        <div className='flex flex-start justify-center grow-0 w-full'>
          <img src={ logoImage } className='w-1/4 py-20'/>
        </div>
      </div>

      <div className='flex flex-col min-w-[350px] max-w-[45%] space-between items-center px-6'>
        {Array.from(workflow.step, (_,i) => <WorkflowStep key={i} textContent={workflow.step[i]} ci={i}/>)}
        
      </div>
    </div>
  )
}

export default Workflow