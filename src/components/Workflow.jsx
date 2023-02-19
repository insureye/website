import React from 'react'
import styles from '../style'
import { logoImage } from '../assets';
import { workflow } from '../constants';
import { WorkflowStep} from '../components';

const Workflow = () => {
  return (
    <div className='flex flex-row w-full py-20'>
      <div className='flex flex-col flex-start basis-1/2 items-center px-6'>
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

      <div className='flex flex-col space-between basis-1/2 items-center px-6'>
        <WorkflowStep textContent={workflow.step[0]} ci={0}/>
        <WorkflowStep textContent={workflow.step[1]} ci={1}/>
        <WorkflowStep textContent={workflow.step[2]} ci={2}/>
        <WorkflowStep textContent={workflow.step[3]} ci={3}/>
        <WorkflowStep textContent={workflow.step[4]} ci={4}/>
      </div>
    </div>
  )
}

export default Workflow