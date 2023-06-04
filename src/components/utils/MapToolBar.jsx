import React from 'react'
import StatefulBtn from './StatefulBtn'

const MapToolBar = ({tools}) => {
  return (
    <div className='flex flex-col w-full items-center'>
        <h1 className='px-8 py-4 w-full text-[28px] font-bold bg-white text-center'>
            Toolbar
        </h1>
        <div className="flex flex-row w-full">
          <div className='flex w-[70%]'>
           <StatefulBtn tools={tools["AreaSelection"]}/>
          </div>
          <div className='flex w-[30%] py-4'>
            <button className="px-4 py-4 rounded w-[90%] bg-blue-300 hover:bg-blue-500" onClick={() => tools["PolygonRemove"]([])}>
              Delete
            </button>
          </div>
        </div>
    </div>
  )
}

export default MapToolBar