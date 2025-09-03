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
    let buttonStyle = "w-full hover:cursor-pointer font-bold ";
    let backgroundStyle = "";
    
    // If the button is selected, add a border
    if (isSelected) {
        buttonStyle += "border-2 border-green-700 ";
    }
    
    // Apply different styles based on validation status
    switch (validationStatus) {
        case 'unvisited':
            // Default style, no special styling
            backgroundStyle = "bg-white hover:bg-green-50";
            break;
        case 'incomplete':
            // Gradient from green to white (50%)
            backgroundStyle = "bg-gradient-to-r from-green-500 to-white";
            break;
        case 'invalid':
            // Red background for errors
            backgroundStyle = "bg-red-500 text-white hover:bg-red-600";
            break;
        case 'valid':
            // Green background for valid
            backgroundStyle = "bg-green-500 text-white hover:bg-green-600";
            break;
    }
    
    return (
        <div className="my-1 mx-5">
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