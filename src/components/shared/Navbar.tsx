import Image from "next/image"; 

export default function Navbar() {
    return (
        <div className="bg-red h-[50px] sm:h-[70px]">
            <div className="mx-2 sm:mx-6 md:mx-[100px] flex justify-between items-center h-full">
                <Image 
                    src="/logo.png" 
                    alt="logo" 
                    height={68} 
                    width={400}
                    className="h-auto w-[200px] sm:w-[300px] md:w-[400px]" 
                />
            </div>
        </div>
    )
}