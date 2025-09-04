'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import React, { useEffect } from "react";

export default function Seguros() {
    const { formData, updateFormData, validationErrors, markAsVisited, validationStatus } = useMercanciasForm();
    
    // Inicializar optionSelected con el valor de formData.tipoSeguro o "TodoRiesgo" (todo riesgo) por defecto
    const [optionSelected, setOptionSelected] = React.useState(formData.tipoSeguro || "Obligatorios");

    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Use setTimeout to avoid render loops
        setTimeout(() => {
            markAsVisited('seguros');
        }, 0);
    }, [formData, markAsVisited, updateFormData]);

    // Manejar cambios en la selección de radio button
    const handleOptionChange = (value: "Obligatorios" | "ObligatoriosTerceros" | "TodoRiesgo") => {
        setOptionSelected(value);
        
        // Actualizar el tipo de seguro en el formData
        updateFormData({ tipoSeguro: value });
        
        //Limpiar el input anterior
        updateFormData({ costeSeguroAnual: undefined });

    };

    
    // Handle number input changes
    const handleInputChange = (name: string, value: number | undefined) => {
        updateFormData({ [name]: value });
    };
    
    // Get error messages for fields
    const getErrorMessage = (fieldName: string) => {
        // No errors if no validation errors
        if (!validationErrors.seguros) return undefined;
        
        // Get the field value
        const fieldValue = formData[fieldName as keyof typeof formData];
        
        // Only show error if the field has a value
        if (fieldValue === undefined) return undefined;
        
        // Get error from Zod validation
        const fieldErrors = validationErrors.seguros.format();
        // @ts-ignore - Zod error format structure
        const fieldError = fieldErrors[fieldName];
        
        return fieldError?._errors?.[0];
    };

    return (
        <div className="flex flex-col gap-5">
            <SectionTitle title="Seguros" />
            <SectionContainer subSectionTitle="Seguros">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        {/* Here the user chooses the assurance he wants, but the input for the form is the same */}
                        <div id="assurance-type" className="flex flex-col">
                            <RadioGroup 
                                value={optionSelected} 
                                onValueChange={handleOptionChange}
                                defaultValue="Obligatorios"
                            >
                                <div className="flex flex-row justify-between">
                                    <div className="flex items-center space-x-2 w-[50%]">
                                        <RadioGroupItem 
                                            value="Obligatorios" 
                                            id="Obligatorios"
                                        />
                                        <label htmlFor="Obligatorios">Solo obligatorios</label>
                                    </div>
                                    
                                    {optionSelected === "Obligatorios" && 
                                        <FormInput 
                                            label="" 
                                            name="costeSeguroAnual"
                                            value={formData.costeSeguroAnual}
                                            onChange={handleInputChange}
                                            error={getErrorMessage('costeSeguroAnual')}
                                            defaultValue={7000}
                                        />
                                    }
                                    
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem 
                                            value="ObligatoriosTerceros" 
                                            id="ObligatoriosTerceros"
                                        />
                                        <label htmlFor="ObligatoriosTerceros">Obligatorios + Terceros (€/año)</label>
                                    </div>

                                    {optionSelected === "ObligatoriosTerceros" && 
                                        <FormInput 
                                            label="" 
                                            name="costeSeguroAnual"
                                            value={formData.costeSeguroAnual}
                                            onChange={handleInputChange}
                                            error={getErrorMessage('costeSeguroAnual')}
                                            defaultValue={9000}
                                        />
                                    }
                                </div>
                                <div className="flex items-center space-x-2 justify-between">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem 
                                            value="TodoRiesgo" 
                                            id="TodoRiesgo"
                                        />
                                        <label htmlFor="TodoRiesgo">Todo riesgo (€/año)</label>
                                    </div>

                                    {optionSelected === "TodoRiesgo" && 
                                        <FormInput 
                                            label="" 
                                            name="costeSeguroAnual"
                                            value={formData.costeSeguroAnual}
                                            onChange={handleInputChange}
                                            error={getErrorMessage('costeSeguroAnual')}
                                            defaultValue={12000}
                                        />
                                    }
                                </div>
                            </RadioGroup>
                        </div>
                        <FormInput 
                            label="Seguro mercancía (€/año):" 
                            name="seguroMercancia"
                            value={formData.seguroMercancia}
                            onChange={handleInputChange}
                            error={getErrorMessage('seguroMercancia')}
                            defaultValue={1000}
                        />
                        <FormInput 
                            label="Responsabilidad Civil (€/año):" 
                            name="responsabilidadCivil"
                            value={formData.responsabilidadCivil}
                            onChange={handleInputChange}
                            error={getErrorMessage('responsabilidadCivil')}
                            defaultValue={2000}
                        />
                    </form>
                </div>
            </SectionContainer>
        </div>
    )
}