import { Button } from "../ui/button";

interface ResultsButtonProps {
    text: string;
    onClick: (index: number) => void;
    index: number;
    isSelected: boolean;
    disabled: boolean;
    isFormValid?: boolean;
}

export default function ResultsButton({ text, onClick, index, isSelected, disabled, isFormValid = false }: ResultsButtonProps) {
    // Base styles
    let buttonStyle = "w-full hover:cursor-pointer font-bold ";
    
    // Selected state
    if (isSelected) {
        buttonStyle += "border-2 border-green-700 ";
    }
    
    // Styling based on form validity
    if (isFormValid) {
        buttonStyle += "bg-green-600 hover:bg-green-700 text-white ";
    } else {
        buttonStyle += "bg-black text-white hover:bg-gray-700 ";
    }
    
    // If disabled, apply disabled styling
    if (disabled) {
        buttonStyle += "opacity-50 cursor-not-allowed ";
    }
    
    return (
        <div className="my-1 mx-5">
            <Button 
                disabled={disabled} 
                className={buttonStyle} 
                variant="outline" 
                onClick={() => onClick(index)}
            >
                {text}
            </Button>
            {disabled && !isFormValid && (
                <p className="text-sm text-red-500 mt-1 text-center">
                    Complete todos los campos antes de ver resultados
                </p>
            )}
        </div>
    );
}