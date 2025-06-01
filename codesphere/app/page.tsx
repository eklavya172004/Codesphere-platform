import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { FloatingNav } from "@/components/ui/Navbar";
// import { FloatingNav } from "@/components/ui/FLoatingNavbar";
import { TextHoverEffect } from "@/components/ui/TextHover";
import { navItems } from "@/data";
// import { FaHome } from "react-icons/fa";
// import Hero from "@/components/Hero";

export default function Home() {
  const code = `"use client";
import React from "react";

const Hero = () => {
  return (
    <section className="w-full h-[80vh] flex flex-col items-center justify-center text-white text-center">
      <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome to CodeSphere</h1>
      <p className="text-lg md:text-2xl max-w-xl">
        Build. Deploy. Scale. All in one place for developers.
      </p>
      <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold">
        Get Started
      </button>
    </section>
  );
};

export default Hero;`

  return (
   <main>
      <div className="flex bg-black sm:px-10 flex-col items-center 
              overflow-hidden mx-auto px-5 relative justify-center">
                <div className="max-w-7xl w-full">
                  <FloatingNav navItems={navItems} />
                  <Hero/>
                  <Grid/>
                  <div className="h-[30rem] hidden  md:flex items-center justify-center">
                         <TextHoverEffect text="CodeSphere" />
                 </div>
                 <CodeBlock language="tsx" filename='/components/Hero' code={code} />

                  <RecentProjects/>
                </div>
      </div>    
   </main>
  );
}
