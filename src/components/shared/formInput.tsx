import { ArrowLeftToLine } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

export default function FormInput({label}: { label: string}) {
    return (
        <div className="flex justify-between gap-10 align-middle items-center">
            <span className="font-semibold">{label}</span>
            <div className="flex flex-row gap-4">
                <input className="border-2 border-black  " type="number" />
                <ArrowLeftToLine className="hover:cursor-pointer hover:border-1 hover:border-gray-300 rounded-md " onClick={()=>console.log("Add data from observer")} />
            </div>
            
        </div>
    )
}