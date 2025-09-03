import { ArrowLeftToLine } from "lucide-react";
import React, { useState, useEffect } from "react";

interface FormInputProps {
    label: string;
    name: string;
    value: number | undefined;
    onChange: (name: string, value: number | undefined) => void;
    error?: string;
    defaultValue?: number;
}

export default function FormInput({ label, name, value, onChange, error, defaultValue }: FormInputProps) {
    // Local state for the input value
    const [inputValue, setInputValue] = useState<string>(value === undefined ? '' : value.toString());
    
    // Update local state when value prop changes (e.g. from context)
    useEffect(() => {
        setInputValue(value === undefined ? '' : value.toString());
    }, [value]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Just update the local state, don't update the form context yet
        e.preventDefault()
        setInputValue(e.target.value);
    };
    
    const handleBlur = () => {
        // On blur, parse the value and update the context
        if (inputValue === '') {
            onChange(name, undefined);
            return;
        }
        
        const newValue = parseFloat(inputValue);
        if (!isNaN(newValue)) {
            onChange(name, newValue);
        } else {
            // If not a valid number, reset to the previous value
            setInputValue(value === undefined ? '' : value.toString());
        }
    };

    const useDefaultValue = () => {
        if (defaultValue !== undefined) {
            setInputValue(defaultValue.toString());
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
                        value={inputValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
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