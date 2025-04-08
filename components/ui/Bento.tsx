import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "./BackgroundGradient";
import { GlobeDemo } from "./GridGlobe";
// import { Globe } from "./Globe";
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
  return (
    <div
      className={cn(
        "group/bento shadow-input  row-span-1 flex flex-col justify-between space-y-4 rounded-3xl relative border  bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
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


                    <div className="mt-2 mb-2 font-sans font-bold lg:text-3xl max-w-96 z-10 ">
                       {title}
                    </div>

                {id === 2 && <GlobeDemo/>}

                </div>
      </div>  


    </div>
  );
};
