import React from 'react'

const MagicButton = ({title,icon,position,handleClick,otherclasses}:{
    title:string,
    icon?:React.ReactNode,
    position?:string,
    handleClick?:()=>void,
    otherclasses?:string
}) => {
  return (
    <div>
      <button className="relative mt-4 rounded-lg inline-flex h-12 overflow-hidden md:w-60 md:mt-5 p-[1px] focus:outline-none ">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className={`inline-flex gap-2 h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl ${otherclasses}`}>
    {position == 'left' && icon}
    {title}
    {position == 'right' && icon}
  </span>
</button>
    </div>
  )
}

export default MagicButton
