'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import { useVehicleDataContext } from "@/lib/calculadoraMercancias/VehicleDataContext";
import React, { useEffect } from "react";

export default function Personal() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useMercanciasForm();
    const { currentVehicleData } = useVehicleDataContext();
    
    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Use setTimeout to avoid render loops
        setTimeout(() => {
            markAsVisited('personal');
        }, 0);
    }, [markAsVisited]);
    
    // Handle number input changes
    const handleInputChange = (name: string, value: number | undefined) => {
        updateFormData({ [name]: value });
    };
    
    // Get error messages for fields
    const getErrorMessage = (fieldName: string) => {
        // No errors if no validation errors
        if (!validationErrors.personal) return undefined;
        
        // Get the field value
        const fieldValue = formData[fieldName as keyof typeof formData];
        
        // Only show error if the field has a value
        if (fieldValue === undefined) return undefined;
        
        // Get error from Zod validation
        const fieldErrors = validationErrors.personal.format();
        const fieldError = fieldErrors[fieldName];
        
        return fieldError?._errors?.[0];
    };

    return (
       <div className="flex flex-col gap-5 ">
            <SectionTitle title="Personal" />
            <SectionContainer subSectionTitle="Personal">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        <FormInput 
                            label="Seguridad social empresa (%):" 
                            name="seguridadSocialPorcentaje"
                            value={formData.seguridadSocialPorcentaje}
                            onChange={handleInputChange}
                            error={getErrorMessage('seguridadSocialPorcentaje')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Seguridad social empresa %'] === 'number' 
                                ? currentVehicleData['Seguridad social empresa %'] 
                                : 0}
                        />
                        <FormInput 
                            label="Retribución ordinaria 1 conductor mecánico (€/año):" 
                            name="salarioBrutoAnual"
                            value={formData.salarioBrutoAnual}
                            onChange={handleInputChange}
                            error={getErrorMessage('salarioBrutoAnual')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Retribucion 1 conductor mecanico'] === 'number' 
                                ? currentVehicleData['Retribucion 1 conductor mecanico'] 
                                : 0}
                        />
                        <FormInput 
                            label="Plus de asistencia (€/año):" 
                            name="plusDeAsistencia"
                            value={formData.plusDeAsistencia}
                            onChange={handleInputChange}
                            error={getErrorMessage('plusDeAsistencia')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Plus de asistencia'] === 'number' 
                                ? currentVehicleData['Plus de asistencia'] 
                                : 0}
                        />
                    </form>
                </div>
            </SectionContainer>
        </div>
    )
}