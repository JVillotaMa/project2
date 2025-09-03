import { ArrowLeftToLine } from "lucide-react";
import React from "react";

interface FormInputProps {
    label: string;
    name: string;
    value: number | undefined;
    onChange: (name: string, value: number) => void;
    error?: string;
    defaultValue?: number;
}

export default function FormInput({ label, name, value, onChange, error, defaultValue }: FormInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        
        // If empty, set as undefined
        if (inputValue === '') {
            onChange(name, undefined as any);
            return;
        }
        
        // Otherwise, parse as float
        const newValue = parseFloat(inputValue);
        if (!isNaN(newValue)) {
            onChange(name, newValue);
        }
    };

    const useDefaultValue = () => {
        if (defaultValue !== undefined) {
            onChange(name, defaultValue);
        }
    };

    // Only show error if the field has a value and there's an error
    const showError = error && value !== undefined;
    
    // Determine border style:
    // - Red for fields with error
    // - Black (default) for fields with valid values or empty fields
    const getBorderStyle = () => {
        if (showError) return 'border-red-500'; // Invalid with error
        if (value !== undefined && !showError) return 'border-green-500'; // Valid with value
        return 'border-black'; // Empty field
    };
    
    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between gap-10 align-middle items-center">
                <span className="font-semibold">{label}</span>
                <div className="flex flex-row gap-4">
                    <input 
                        className={`border-2 ${getBorderStyle()}`}
                        type="number" 
                        value={value === undefined ? '' : value}
                        onChange={handleChange}
                    />
                    <ArrowLeftToLine 
                        className="hover:cursor-pointer hover:border-1 hover:border-gray-300 rounded-md" 
                        onClick={useDefaultValue} 
                    />
                </div>
            </div>
            {showError && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}