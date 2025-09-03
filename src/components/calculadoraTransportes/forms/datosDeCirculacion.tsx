'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { useTransportesForm } from "@/lib/calculadoraTransportes/TransportesFormContext";
import React, { useEffect } from "react";

export default function DatosDeCirculación() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useTransportesForm();
    
    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Only mark if not already visited to avoid unnecessary re-renders
        setTimeout(() => {
            markAsVisited('datosCirculacion');
        }, 0);
    }, [markAsVisited]);
    
    // Handle number input changes
    const handleInputChange = (name: string, value: number | undefined) => {
        updateFormData({ [name]: value });
    };
    
    // Get error messages for fields
    const getErrorMessage = (fieldName: string) => {
        // No errors if no validation errors
        if (!validationErrors.datosCirculacion) return undefined;
        
        // Get the field value
        const fieldValue = formData[fieldName as keyof typeof formData];
        
        // Only show error if the field has a value
        if (fieldValue === undefined) return undefined;
        
        // Get error from Zod validation
        const fieldErrors = validationErrors.datosCirculacion.format();
        // @ts-ignore - Zod error format structure
        const fieldError = fieldErrors[fieldName];
        
        return fieldError?._errors?.[0];
    };

    return (
        <div className="flex flex-col gap-5">
            <SectionTitle title="Datos de circulación" />
            
            <SectionContainer subSectionTitle="Datos de circulación">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        <FormInput 
                            label="Kilómetros recorridos al año por el vehículo:" 
                            name="kilometrosAnuales"
                            value={formData.kilometrosAnuales}
                            onChange={handleInputChange}
                            error={getErrorMessage('kilometrosAnuales')}
                            defaultValue={60000}
                        />
                        <FormInput 
                            label="Coste del combustible (€/litro):" 
                            name="costeDelCombustible"
                            value={formData.costeDelCombustible}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeDelCombustible')}
                            defaultValue={1.4}
                        />
                        <FormInput 
                            label="Coste de cada neumático del vehículo (€):" 
                            name="costeNeumatico"
                            value={formData.costeNeumatico}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeNeumatico')}
                            defaultValue={300}
                        />
                        <FormInput 
                            label="Vida útil de cada neumático (Km):" 
                            name="vidaUtilNeumatico"
                            value={formData.vidaUtilNeumatico}
                            onChange={handleInputChange}
                            error={getErrorMessage('vidaUtilNeumatico')}
                            defaultValue={50000}
                        />
                    </form>
                </div>
            </SectionContainer>
        </div>
    );
}