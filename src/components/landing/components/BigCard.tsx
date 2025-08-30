'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { redirect } from 'next/navigation'


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
    return(
        <div className="w-3xl mx-3 my-6 bg-white rounded-lg">  
            <div id="container" className="flex flex-col justify-center items-center px-10 border-1 border-gray-300 rounded-4xl">
                <h1 id="calcType" className="text-[1.8rem] font-bold my-5">{title}</h1>
                <Image 
                    src={imageSrc} 
                    alt={imageAlt} 
                    width={imageWidth} 
                    height={imageHeight}
                    className="rounded-4xl"
                    />
                <div className="flex flex-col justify-center text-center text-[0.9rem] my-5 font-medium">
                    <p className="">
                        {firstParagraph}
                    </p>
                    <br></br>
                    <p>
                        {secondParagraph}
                    </p>
                </div>
                <div className="my-8">
                    <Button className="bg-red text-white w-2xl rounded-4xl" onClick={()=>redirect(toRedirect)}>{buttonText}</Button>
                </div>
                
            </div>
        </div>
    )
}