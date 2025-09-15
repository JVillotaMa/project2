'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import { useVehicleDataContext } from "@/lib/calculadoraMercancias/VehicleDataContext";
import React, { useEffect } from "react";

export default function DietasPeajes() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useMercanciasForm();
    const { currentVehicleData } = useVehicleDataContext();
    
    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Use setTimeout to avoid render loops
        setTimeout(() => {
            markAsVisited('dietasYPeajes');
        }, 0);
    }, [markAsVisited]);
    
    // Handle number input changes
    const handleInputChange = (name: string, value: number | undefined) => {
        updateFormData({ [name]: value });
    };
    
    // Get error messages for fields
    const getErrorMessage = (fieldName: string) => {
        // No errors if no validation errors
        if (!validationErrors.dietasYPeajes) return undefined;
        
        // Get the field value
        const fieldValue = formData[fieldName as keyof typeof formData];
        
        // Only show error if the field has a value
        if (fieldValue === undefined) return undefined;
        
        // Get error from Zod validation
        const fieldErrors = validationErrors.dietasYPeajes.format();
        const fieldError = fieldErrors[fieldName];
        
        return fieldError?._errors?.[0];
    };

    return (
       <div className="flex flex-col gap-5 ">
            <SectionTitle title="Dietas y peajes" />
            <SectionContainer subSectionTitle="Dietas">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        <FormInput 
                            label="Dieta media (€/dia):" 
                            name="dietaMedia"
                            value={formData.dietaMedia}
                            onChange={handleInputChange}
                            error={getErrorMessage('dietaMedia')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Dieta media'] === 'number' 
                                ? currentVehicleData['Dieta media'] 
                                : 0}
                        />
                        <FormInput 
                            label="Nº días" 
                            name="numeroDias"
                            value={formData.numeroDias}
                            onChange={handleInputChange}
                            error={getErrorMessage('numeroDias')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Num de dias'] === 'number' 
                                ? currentVehicleData['Num de dias'] 
                                : 0}
                        />
                    </form>
                </div>
            </SectionContainer>
            <SectionContainer subSectionTitle="Peajes">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        <FormInput 
                            label="Coste medio del Km en autopista (€/Servicio):" 
                            name="costeMedioPeajesPorServicio"
                            value={formData.costeMedioPeajesPorServicio}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeMedioPeajesPorServicio')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Coste medio Km de autopista'] === 'number' 
                                ? currentVehicleData['Coste medio Km de autopista'] 
                                : 0}
                        />
                        <FormInput 
                            label="Porcentaje de servicios que pagan peaje (%):" 
                            name="porcentajeServiciosConPeaje"
                            value={formData.porcentajeServiciosConPeaje}
                            onChange={handleInputChange}
                            error={getErrorMessage('porcentajeServiciosConPeaje')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['% servicios que pagan peajes'] === 'number' 
                                ? currentVehicleData['% servicios que pagan peajes'] 
                                : 0}
                        />
                    </form>
                </div>
            </SectionContainer>
        </div>
    )
}