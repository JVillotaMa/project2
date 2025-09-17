'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button"
import {useRouter } from 'next/navigation'

interface Props {
    title:string;
    imageSrc: string;
    imageAlt: string;
    imageWidth: number;
    imageHeight: number;
    firstParagraph:string;
    secondParagraph:string;
    toRedirect: string;
    buttonText: string;
}


export default function BigCard({title,imageSrc, imageAlt, imageWidth, imageHeight,firstParagraph,secondParagraph,toRedirect,buttonText}: Props) {
    const router = useRouter();
    return(
        <div className="w-full md:max-w-xl h-full mx-auto md:mx-2 my-6 bg-white rounded-4xl hover:scale-101 transition-all duration-300 shadow-lg hover:shadow-2xl hover:cursor-pointer flex flex-col" onClick={()=>router.push(toRedirect)}>  
            <div id="container" className="flex flex-col justify-between items-center px-4 sm:px-6 md:px-10 border-1 border-gray-300 rounded-4xl h-full">
                <h1 id="calcType" className="text-xl sm:text-2xl md:text-[1.8rem] font-bold my-5 md:my-10 text-center">{title}</h1>
                <Image 
                    src={imageSrc} 
                    alt={imageAlt} 
                    width={imageWidth} 
                    height={imageHeight}
                    className="rounded-4xl w-full"
                    />
                <div className="flex flex-col justify-center text-center text-sm md:text-[0.95rem] text-[0.65rem] my-4 md:my-5 font-medium h-[150px] md:h-[250px]  ">
                    <p className="">
                        {firstParagraph}
                    </p>
                    <br></br>
                    <p>
                        {secondParagraph}
                    </p>
                </div>
                <div className="my-5 md:my-8 w-full flex justify-center">
                    <Button className="bg-red text-white w-full sm:w-auto max-w-[300px] rounded-4xl px-4 py-2" onClick={()=>router.push(toRedirect)}>{buttonText}</Button>
                </div>
                
            </div>
        </div>
    )
}