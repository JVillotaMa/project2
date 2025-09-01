import Image from "next/image"; 

export default function Navbar() {
    return (
        <div className="bg-red h-[70px]  ">
            <div className="mx-[100px] flex justify-between">
                <Image src="/logo.png" alt="logo" height={68} width={400} />
            </div>
        </div>
    )
}