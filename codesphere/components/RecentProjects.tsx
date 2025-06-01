import { projects } from '@/data'
import React from 'react'
import { PinContainer } from './ui/3Dpin'
// import { icons } from '@tabler/icons-react'
import { FaLocationArrow } from 'react-icons/fa'
// import { PinContainer } from './ui/3Dpin'

const RecentProjects = () => {
  return (
    <div className='py-20'>
       <h1 className="text-4xl sm:text-5xl md:text-6xl mb-40 sm:mb-0 font-extrabold text-center leading-tight tracking-tight">
  A small section of{' '}
  <span className="text-purple-300">Recent Projects</span>
</h1>

                                                                                    {/*  */}
            <div className='flex flex-wrap items-center  justify-center p-4  gap-96 sm:gap-16 mt-20'>
                    {projects.map(({id,title,des,img,iconLists,link}) => (
                        <div key={id} className='lg:min-h-[32.5rem] h-25 flex  items-center justify-center sm:w-[570px] w-[80vw]'>
                            {/* {title}  */}
                            {/* <PinContainer> */}
                            <PinContainer title={title} href={link}>
                        {/* {title} */}
                            <div className='relative flex items-center justify-center sm:w-[570px] w-[80vw] sm:h-[40vh] overflow-hidden h-[30vh]  mb-10'> 
                                <div className='relative w-full h-full overflow-hidden lg:rounded-3xl bg-[#13162d]'>
                                    <img src="/bg.png" alt="bg-img" />
                                </div>
                                    <img 
                                    src={img} 
                                    alt={title} 
                                    className='z-10 absolute bottom-0' />
                                </div>

                            <h1 className='font-bold lg:text-2xl md:text-xl text-base line-clamp-1'>
                                {title}
                            </h1>
                        
                            <p      className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                                style={{
                                        color: "#BEC1DD",
                                        margin: "1vh 0",
                                        }}>
                                {des}
                            </p>

                            <div className='flex items-center justify-center mt-7 mb-3'>
                                  <div className='flex items-center'>
                                     {iconLists.map((icon,index) => (
                                        <div key={index} className='border border-white/[0.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center'  style={{transform:`translateX(-${5*index + 2}px)`}}>
                                                <img src={icon} alt={icon} className='p-2' />
                                        </div>
                                     ))
                                     }
                                  </div>

                                  <div className='flex justify-center items-center'>
                                     <p className='flex lg:text-xl md:text-xs text-sm  text-purple-100'>Check Live Site </p>
                                     <FaLocationArrow className='ms-3' color='#cbacf9'/>
                                            </div>
                                        </div>
                                     </PinContainer>
                            {/* </PinContainer> */}
                        </div>
                    ))}
            </div>
    </div>
  )
}

export default RecentProjects