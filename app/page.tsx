import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/ui/FLoatingNavbar";
import { TextHoverEffect } from "@/components/ui/TextHover";
import { FaHome } from "react-icons/fa";

export default function Home() {
  return (
   <main>
      <div className="flex bg-black sm:px-10 flex-col items-center 
              overflow-hidden mx-auto px-5 relative justify-center">
                <div className="max-w-7xl w-full">
                  <FloatingNav navItems={[
                    {name:'Home',link:'/',icon:<FaHome/>}
                  ]} />
                  <Hero/>
                  <Grid/>
                  <div className="h-[30rem] hidden  md:flex items-center justify-center">
                         <TextHoverEffect text="CodeSphere" />
                 </div>
                </div>
      </div>    
   </main>
  );
}
