import { Button } from "../ui/button";

export default function ButtonsNavigation({text,onClick,index, isSelected}: {text: string;onClick: (index:number) => void,index:number,isSelected:boolean}) {
    const style = isSelected ? " border-2 border-green-700" : ""
    return(
        <div className="my-1 mx-5">
            <Button className={"w-full hover:cursor-pointer hover:bg-green-50 font-bold"+style} variant="outline" onClick={()=>onClick(index)}>{text}</Button>
        </div>
        
    )
}