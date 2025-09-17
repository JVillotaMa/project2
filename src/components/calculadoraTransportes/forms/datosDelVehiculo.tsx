'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { useTransportesForm } from "@/lib/calculadoraTransportes/TransportesFormContext";
import { useTransportDataContext } from "@/lib/calculadoraTransportes/TransportDataContext";
import React, { useEffect } from "react";

export default function DatosDelVehiculo() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useTransportesForm();
    const { currentBusData } = useTransportDataContext();
    
    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Only mark if not already visited to avoid unnecessary re-renders
        setTimeout(() => {
            markAsVisited('datosVehiculo');
        }, 0);
    }, [markAsVisited]);
    
    // Handle number input changes
    const handleInputChange = (name: string, value: number | undefined) => {
        updateFormData({ [name]: value });
    };
    
    // Get error messages for fields
    const getErrorMessage = (fieldName: string) => {
        // No errors if no validation errors
        if (!validationErrors.datosVehiculo) return undefined;
        
        // Get the field value
        const fieldValue = formData[fieldName as keyof typeof formData];
        
        // Only show error if the field has a value
        if (fieldValue === undefined) return undefined;
        
        // Get error from Zod validation
        const fieldErrors = validationErrors.datosVehiculo.format();
        // This is valid as fieldErrors is a dynamically structured object from Zod
        const fieldError = (fieldErrors as Record<string, { _errors: string[] }>)[fieldName];
        
        return fieldError?._errors?.[0];
    };

    return (
        <div className="flex flex-col gap-5">
            <SectionTitle title="Datos del vehículo" />
            
            <SectionContainer subSectionTitle="Amortización">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-4 sm:p-10 w-full">
                        <FormInput 
                            label="Coste de adquisición (€):" 
                            name="costeDeAdquisicion"
                            value={formData.costeDeAdquisicion}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeDeAdquisicion')}
                            defaultValue={currentBusData && typeof currentBusData['Coste adquisicion vehiculo'] === 'number' 
                                ? currentBusData['Coste adquisicion vehiculo'] 
                                : 0}
                        />
                        <FormInput 
                            label="Vida útil del vehículo (Años):" 
                            name="vidaUtil"
                            value={formData.vidaUtil}
                            onChange={handleInputChange}
                            error={getErrorMessage('vidaUtil')}
                            defaultValue={currentBusData && typeof currentBusData['Vida util del vehiculo'] === 'number' 
                                ? currentBusData['Vida util del vehiculo'] 
                                : 0}
                        />
                    </form>
                </div>
            </SectionContainer>
            
            <SectionContainer subSectionTitle="Financiación">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-4 sm:p-10 w-full">
                        <FormInput 
                            label="Coste de la financiación (TAE):" 
                            name="costeFinanciacionTAE"
                            value={formData.costeFinanciacionTAE}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeFinanciacionTAE')}
                            defaultValue={currentBusData && typeof currentBusData['Coste de la financiacion del vehiculo (TAE %)'] === 'number' 
                                ? currentBusData['Coste de la financiacion del vehiculo (TAE %)'] 
                                : 0}
                        />
                        <FormInput 
                            label="Plazo de financiación (Años):" 
                            name="plazoFinanciacion"
                            value={formData.plazoFinanciacion}
                            onChange={handleInputChange}
                            error={getErrorMessage('plazoFinanciacion')}
                            defaultValue={currentBusData && typeof currentBusData['Plazo financiacion'] === 'number' 
                                ? currentBusData['Plazo financiacion'] 
                                : 0}
                        />
                    </form>
                </div>
            </SectionContainer>
            
            <SectionContainer subSectionTitle="Mantenimiento y seguros">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-4 sm:p-10 w-full">
                        <FormInput 
                            label="Coste anual de mantenimiento del vehículo (€):" 
                            name="mantenimientoAnual"
                            value={formData.mantenimientoAnual}
                            onChange={handleInputChange}
                            error={getErrorMessage('mantenimientoAnual')}
                            defaultValue={currentBusData && typeof currentBusData['Coste anual mantenimiento'] === 'number' 
                                ? currentBusData['Coste anual mantenimiento'] 
                                : 0}
                        />
                        <FormInput 
                            label="Coste anual del seguro del vehículo  (€):" 
                            name="seguroAnual"
                            value={formData.seguroAnual}
                            onChange={handleInputChange}
                            error={getErrorMessage('seguroAnual')}
                            defaultValue={currentBusData && typeof currentBusData['Coste anual seguro'] === 'number' 
                                ? currentBusData['Coste anual seguro'] 
                                : 0}
                        />
                    </form>
                </div>
            </SectionContainer>
        </div>
    );
}