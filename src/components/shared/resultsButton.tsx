import { Button } from "../ui/button";

export default function ResultsButton({text,onClick,index, isSelected, disabled}: {text: string;onClick: (index:number) => void,index:number,isSelected:boolean,disabled:boolean}) {
    const style = isSelected ? " border-2 border-green-700" : ""
    
    return(
        <div className="my-1 mx-5">
            <Button disabled={disabled} className={"bg-black text-white hover:text-white w-full hover:cursor-pointer hover:bg-gray-700 font-bold"+style} variant="outline" onClick={()=>onClick(index)}>{text}</Button>
        </div>
        
    )
}