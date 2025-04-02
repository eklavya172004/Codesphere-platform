import Hero from "@/components/Hero";

export default function Home() {
  return (
   <main>
      <div className="flex bg-black sm:px-10 flex-col items-center 
              overflow-hidden mx-auto px-5 relative justify-center">
                <div className="max-w-7xl w-full">
                  <Hero/>
                </div>
      </div>    
   </main>
  );
}
