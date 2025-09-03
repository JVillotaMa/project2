'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTransportesForm } from "@/lib/calculadoraTransportes/TransportesFormContext";
import React, { useEffect } from "react";
import { z } from "zod";

export default function DatosGenerales() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useTransportesForm();
    
    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Only mark if not already visited to avoid unnecessary re-renders
        setTimeout(() => {
            markAsVisited('datosGenerales');
        }, 0);
    }, [markAsVisited]);
    
    // Handle radio button selection
    const handleTipoAutobusChange = (value: string) => {
        updateFormData({ tipoDeAutobus: value as any });
    };
    
    // Handle number input changes
    const handleInputChange = (name: string, value: number | undefined) => {
        updateFormData({ [name]: value });
    };
    
    // Get error messages for fields
    const getErrorMessage = (fieldName: string) => {
        // No errors if no validation errors
        if (!validationErrors.datosGenerales) return undefined;
        
        // Get the field value
        const fieldValue = formData[fieldName as keyof typeof formData];
        
        // Only show error if the field has a value
        if (fieldValue === undefined) return undefined;
        
        // Get error from Zod validation
        const fieldErrors = validationErrors.datosGenerales.format();
        // @ts-ignore - Zod error format structure
        const fieldError = fieldErrors[fieldName];
        
        return fieldError?._errors?.[0];
    };

    return (
        <div className="flex flex-col gap-5">
            <SectionTitle title="Datos generales" />
            
            <SectionContainer subSectionTitle="Seleccione el tipo de autobús">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10">
                        <RadioGroup
                            value={formData.tipoDeAutobus || ""}
                            onValueChange={handleTipoAutobusChange}

                            className="flex flex-row justify-evenly gap-10"
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Menos de 22 plazas" id="option-one" className="h-4 w-4 border border-gray-300 rounded-full" />
                                    <label htmlFor="option-one">Menos de 22 plazas</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="De 22 a 35 plazas" id="option-two" className="h-4 w-4 border border-gray-300 rounded-full" />
                                    <label htmlFor="option-two">De 22 a 35 plazas</label>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="De 36 a 55 plazas" id="option-three" className="h-4 w-4 border border-gray-300 rounded-full" />
                                    <label htmlFor="option-three">De 36 a 55 plazas</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Mas de 55 plazas" id="option-four" className="h-4 w-4 border border-gray-300 rounded-full" />
                                    <label htmlFor="option-four">Más de 55 plazas</label>
                                </div>
                            </div>
                        </RadioGroup>
                        {getErrorMessage('tipoDeAutobus') && (
                            <p className="text-red-500 text-sm mt-1">{getErrorMessage('tipoDeAutobus')}</p>
                        )}
                    </form>
                </div>
            </SectionContainer>
            
            <SectionContainer subSectionTitle="Datos del conductor">
                <div className="p-10 flex justify-center">
                    <div className="flex justify-center flex-col gap-2 w-full">
                        <FormInput 
                            label="Salario anual del conductor (€):" 
                            name="salarioAnualConductor"
                            value={formData.salarioAnualConductor}
                            onChange={handleInputChange}
                            error={getErrorMessage('salarioAnualConductor')}
                            defaultValue={25000}
                        />
                        <FormInput 
                            label="Horas anuales trabajadas:" 
                            name="horasAnualesTrabajadas"
                            value={formData.horasAnualesTrabajadas}
                            onChange={handleInputChange}
                            error={getErrorMessage('horasAnualesTrabajadas')}
                            defaultValue={1800}
                        />
                    </div>
                </div>
            </SectionContainer>
            
            <SectionContainer subSectionTitle="Costes generales">
                <div className="p-10 flex justify-center">
                    <FormInput 
                        label="Costes generales (% sobre el coste total):" 
                        name="costesGenerales"
                        value={formData.costesGenerales}
                        onChange={handleInputChange}
                        error={getErrorMessage('costesGenerales')}
                        defaultValue={15}
                    />
                </div>
            </SectionContainer>
        </div>
    );
}