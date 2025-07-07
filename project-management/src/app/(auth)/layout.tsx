'use client';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
interface Authlayout{
    children:React.ReactNode
}

const Authlayout = ({children}: Authlayout) => {
  const pathname = usePathname();

  return (
    <main className="min-h-screen">
        <div className="mx-auto max-w-screen-2xl  p-4">

          <nav className="flex items-center justify-between">
              {/* <div className="flex items-center gap-2">  */}
                  <Image src="logo.svg" height={50} width={150} alt="logo" /> 
              {/* </div> */}
                  <Button asChild variant="secondary">
                    <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"} className="text-sm">
                    {pathname === "/sign-in" ? "Sign Up" : "Log In"}
                    </Link>
                  </Button>

         </nav>

         <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
      {children}
         </div>
    </div>
    {/* <Image src="logo.svg" height={50} width={100}  /> */}
      </main>
  )
}

export default Authlayout;
