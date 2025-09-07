import { Button } from "../ui/button";
import { ValidationStatus } from "@/lib/calculadoraTransportes/TransportesFormContext";

interface ButtonsNavigationProps {
    text: string;
    onClick: (index: number) => void;
    index: number;
    isSelected: boolean;
    validationStatus: ValidationStatus;
}

export default function ButtonsNavigation({ text, onClick, index, isSelected, validationStatus }: ButtonsNavigationProps) {
    // Styling based on validation status
    let buttonStyle = "w-full hover:cursor-pointer font-bold text-sm sm:text-sm md:text-sm lg:text-sm py-2 ";
    let backgroundStyle = "";
    
    // If the button is selected, add a border
    if (isSelected) {
        buttonStyle += "border-2 border-[#8BC79E] ";
    }
    
    // Apply different styles based on validation status
    switch (validationStatus) {
        case 'unvisited':
            // Default style, no special styling
            backgroundStyle = "bg-white hover:bg-[#E8F5EB]";
            break;
        case 'incomplete':
            // Gradient from green to white (50%)
            backgroundStyle = "bg-gradient-to-r from-[#B2E0BC] to-white";
            break;
        case 'invalid':
            // Red background for errors
            backgroundStyle = "bg-red-500 text-white hover:bg-red-600";
            break;
        case 'valid':
            // Green background for valid
            backgroundStyle = "bg-[#B2E0BC] text-gray-800 hover:bg-[#A2D4AD]";
            break;
    }
    
    return (
        <div className="my-1 mx-2 ">
            <Button 
                className={buttonStyle + backgroundStyle} 
                variant="outline" 
                onClick={() => onClick(index)}
            >
                {text}
            </Button>
        </div>
    );
}