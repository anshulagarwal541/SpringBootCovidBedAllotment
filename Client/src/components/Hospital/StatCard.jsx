import React from 'react'

function StatCard(props) {
  return (
    <div className='flex flex-col font-extrabold text-2xl justify-center items-center rounded-2xl p-5 gap-5 bg-green-950 text-white w-[15rem] h-[10rem]'>
        <p>{props.name}</p>
        <p>{props.text}</p>
    </div>
  )
}

export default StatCard