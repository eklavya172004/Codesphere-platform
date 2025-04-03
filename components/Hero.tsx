import React from 'react'
import { Spotlight } from './ui/Spotlight'
import { cn } from "@/lib/utils"
import { TextGenerateEffect } from './ui/TextGenerateEffect'
import MagicButton from './ui/MagicButton'
import { FaLocationArrow } from 'react-icons/fa'

const Hero = () => {
  return (
    <div className='pd-20 pt-36'>
      <div>
        <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='white'/>
        <Spotlight className='top-10 left-full h-[80vh] w-[50vw]' fill='purple'/>
        <Spotlight className='top-28 left-80 h-[80vh] w-[50vw]' fill='blue'/>
      </div>
      
      <div className="absolute top-0 left-0 flex h-screen w-full items-center justify-center bg-white dark:bg-black">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />
        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black">
        </div>
        
        {/* Add your text here inside the grid container */}
      </div>
        <div className='relative my-20 z-10 flex flex-col items-center justify-center'>
          <div className='max-w-[89vw] md:max-w-2xl lg:max-w-60 flex flex-col justify-center'>
            <h1 className='text-xs text-center text-blue-100 max-w-80 uppercase tracking-widest'>
              Track, Compete, and Grow as a Coder
            </h1>

          </div>
            <TextGenerateEffect className='text-center text-[100px] md:text-5xl lg:text-xl md:w-2xl' words='Track your daily coding streaks, monitor progress, and climb the ranks with CodeSphere'/>

            <p className="text-center mt-3 mb-4 text-sm md:text-lg lg:text-xl font-bold relative group">
  <span className="uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse">
    RISE
  </span>{" "}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-500 to-pink-500">
    to the
  </span>{" "}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-rose-600">
    Top
  </span>
  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r  transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
</p>
            <MagicButton title={"Go the next level"} icon={<FaLocationArrow/>} position='right'/>
        </div>
    </div>
  )
}

export default Hero