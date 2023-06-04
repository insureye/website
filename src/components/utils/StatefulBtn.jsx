import React from 'react'

const StatefulBtn = ({tools}) => {
    const state = tools[0];
    const setState = tools[1];
    var color = state ? "bg-blue-500" : "bg-blue-300";
  return (
    <div className='py-4 flex flex-row w-full justify-center'>
        <button className={`px-4 py-4 rounded ${color} w-[90%]`} onClick={() => {state ? setState(false) : setState(true)}}>
            {state ? "Deactivate area selection" : "Activate area selection"}
        </button>
    </div>
  )
}

export default StatefulBtn