'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import React, { useEffect } from "react";

export default function Impuestos() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useMercanciasForm();
    
    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Use setTimeout to avoid render loops
        setTimeout(() => {
            markAsVisited('impuestos');
        }, 0);
    }, [markAsVisited]);
    
    // Handle number input changes
    const handleInputChange = (name: string, value: number | undefined) => {
        updateFormData({ [name]: value });
    };
    
    // Get error messages for fields
    const getErrorMessage = (fieldName: string) => {
        // No errors if no validation errors
        if (!validationErrors.impuestos) return undefined;
        
        // Get the field value
        const fieldValue = formData[fieldName as keyof typeof formData];
        
        // Only show error if the field has a value
        if (fieldValue === undefined) return undefined;
        
        // Get error from Zod validation
        const fieldErrors = validationErrors.impuestos.format();
        // @ts-ignore - Zod error format structure
        const fieldError = fieldErrors[fieldName];
        
        return fieldError?._errors?.[0];
    };

    return (
       <div className="flex flex-col gap-5 ">
            <SectionTitle title="Impuestos" />
            <SectionContainer subSectionTitle="Impuestos">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        <FormInput 
                            label="Visado autorización de Tte. (€/año):" 
                            name="visadoAutorizacion"
                            value={formData.visadoAutorizacion}
                            onChange={handleInputChange}
                            error={getErrorMessage('visadoAutorizacion')}
                            defaultValue={35}
                        />
                        <FormInput 
                            label="Impuesto veh. Tracción Mec. (€/año):" 
                            name="impuestoVehiculoTraccion"
                            value={formData.impuestoVehiculoTraccion}
                            onChange={handleInputChange}
                            error={getErrorMessage('impuestoVehiculoTraccion')}
                            defaultValue={430}
                        />
                        <FormInput 
                            label="Coste ITV (€/año):" 
                            name="costeItv"
                            value={formData.costeItv}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeItv')}
                            defaultValue={90}
                        />
                        <FormInput 
                            label="Coste IAE (€/año):" 
                            name="costeIAE"
                            value={formData.costeIAE}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeIAE')}
                            defaultValue={400}
                        />
                        <FormInput 
                            label="Coste revisión Tacógrafo (€/año):" 
                            name="costeTacografo"
                            value={formData.costeTacografo}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeTacografo')}
                            defaultValue={50}
                        />
                        <FormInput 
                            label="Coste ATP (€/año):" 
                            name="costeAtp"
                            value={formData.costeAtp}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeAtp')}
                            defaultValue={150}
                        />
                        <FormInput 
                            label="Coste ADR (€/año):" 
                            name="costeAdr"
                            value={formData.costeAdr}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeAdr')}
                            defaultValue={100}
                        />
                    </form>
                </div>
            </SectionContainer>
        </div>
    )
}