import React from 'react'

const StatefulBtn = ({onClick, btnstyle, text}) => {
  return (
    <button className={`${btnstyle}`} onClick={onClick}>
      <h1 className='text-[18px] px-4 py-2'>
        {text}
      </h1>
    </button>
  )
}

export default StatefulBtn