'use client'
import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "./BackgroundGradient";
import { GlobeDemo } from "./GridGlobe";
import { useRouter } from 'next/navigation';
// import Lottie from "react-lottie";
import { useState } from "react";
import animationData from "@/data/confetti.json"
import MagicButton from "./MagicButton";
import { IoCopyOutline } from 'react-icons/io5';
import dynamic from "next/dynamic";
// import { TextHoverEffect } from "./TextHover";
// import { animate } from "motion/react";
// import { Globe } from "./Globe";

const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false, // This is the key - disable SSR for this component
});

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  id,
  img,
    imgClassName,
    spareImg,
    titleClassName
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  id:number;
  img?: string;
    imgClassName?: string;
    spareImg?: string;
    titleClassName?: string;
}) => {

    const [copied,setCopied] = useState(false);
    const router = useRouter();


    const handleCopy = () => {
      navigator.clipboard.writeText('eklavyanath1704@gmail.com');

      setCopied(true);
    }

    
  const handleClick = () => {
    if (id === 1) {
      router.push("/dashboard/leetcode");
    }
  };

  return (
    <div
        onClick={() => handleClick()}
      className={cn(
        "row-span-1 hover:cursor-pointer relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
        className,
      )}
      style={
        {
          background: "rgb(4,7,29)",
          backgroundColor:
            "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",}
      }
    >

      <div className={`${id == 6 && 'flex justify-center '} h-full`}>
          <div className="w-full h-full absolute ">
            {
              img && (
                <img src={img} alt={img} className={cn(imgClassName,'object-cover','object-center')} />
              )
            }
          </div>

            <div className={`absolute right-0 -bottom-5 ${id === 5 && 'w-full opacity-80'} `}>
                {
                  spareImg && (
                    <img src={spareImg} alt={spareImg} className={'object-cover object-center w-full h-full'}/>
                  )
                }
            </div>
                
                {
                  id === 6 && (
                    <BackgroundGradientAnimation>
                      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
                    </BackgroundGradientAnimation>
                  )
                }

                <div className={cn(
                  titleClassName,'group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10'
                )}>
                    <div className="text-[#c1c2d3] font-sans z-10 text-sm font-extralight lg:text-base md:text-xs dark:text-neutral-300">
                      {description}
                    </div>


                    <div className="mb-2 font-sans font-bold lg:text-3xl max-w-96 z-20 ">
                       {title}
                    </div>
                  
                {id === 2 && <GlobeDemo/>}

                    {
                      id===3 && (
                        <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
                          <div className="flex flex-col gap-3 lg:gap-8">
                              {['Leetcode','CodeChef','CodeForces','Github'].map((item) => (
                                <span key={item} className="py-2  text-gray-600 lg:py-4 lg:px-3 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#10132E]">
                                  {item}
                                </span>
                              ))}

                              <span className="py-4 px-3 rounded-lg text-center bg-[#10132E]">

                              </span>
                          </div>

                              
                          <div className="flex flex-col gap-3 lg:gap-8">
                              <span className="py-4 px-3 rounded-lg text-center bg-[#10132E]">

                              </span>
                              {['Trees','LinkedList','Stacks','Graphs'].map((item) => (
                                <span key={item} className="py-2 lg:py-4 lg:px-3 px-3 text-xs text-gray-600 lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#10132E]">
                                  {item}
                                </span>
                              ))}

                          </div>
                        </div>    
                      )
                    }

                    {
                      id===6 && (
                        <div className="mt-5 relative justify-center flex">
                            <div className={`absolute -bottom-5 right-0`}>
                                <Lottie options={
                                  {
                                    loop:copied,
                                    autoplay:copied,
                                    animationData,
                                    rendererSettings: {
                                      preserveAspectRatio: "xMidYMid slice",
                                    }
                                     }
                                }/>
                            </div>
                            <MagicButton title={copied? 'Email is copied' : 'Copy my email'} icon={<IoCopyOutline/>} position="left"
                            otherclasses={`!bg-[#161a31]`} handleClick={handleCopy}  />
                        </div>
                      )
                    }
                </div>

    
      </div>  


    </div>
  );
};
