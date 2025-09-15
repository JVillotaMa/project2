'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import { useVehicleDataContext } from "@/lib/calculadoraMercancias/VehicleDataContext";
import React, { useEffect } from "react";

export default function DatosGenerales() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useMercanciasForm();
    const { currentVehicleData } = useVehicleDataContext();
    
    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Use setTimeout to avoid render loops
        setTimeout(() => {
            markAsVisited('datosGenerales');
        }, 0);
    }, [markAsVisited]);
    
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
        const fieldError = fieldErrors[fieldName];
        
        return fieldError?._errors?.[0];
    };

    return (
        <div className="flex flex-col gap-5 ">
            <SectionTitle title="Datos generales" />
            <SectionContainer subSectionTitle="Datos de explotación">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        <FormInput 
                            label="Nº de servicios diarios por vehículo:" 
                            name="serviciosDiariosPorVehiculo"
                            value={formData.serviciosDiariosPorVehiculo}
                            onChange={handleInputChange}
                            error={getErrorMessage('serviciosDiariosPorVehiculo')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Num servicios por veh'] === 'number' 
                                ? currentVehicleData['Num servicios por veh'] 
                                : 0}
                        />
                        <FormInput 
                            label="Kilometraje anual (Km/año):" 
                            name="kilometrajeAnual"
                            value={formData.kilometrajeAnual}
                            onChange={handleInputChange}
                            error={getErrorMessage('kilometrajeAnual')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Kilometraje anual'] === 'number' 
                                ? currentVehicleData['Kilometraje anual'] 
                                : 0}
                        />
                        <FormInput 
                            label="% Kilometraje anual en vacío:" 
                            name="porcentajeKilometrajeVacio"
                            value={formData.porcentajeKilometrajeVacio}
                            onChange={handleInputChange}
                            error={getErrorMessage('porcentajeKilometrajeVacio')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['% Kilometraje anual vacio'] === 'number' 
                                ? currentVehicleData['% Kilometraje anual vacio'] 
                                : 0}
                        />
                        <FormInput 
                            label="Horas anuales trabajadas:" 
                            name="horasAnualesTrabajadas"
                            value={formData.horasAnualesTrabajadas}
                            onChange={handleInputChange}
                            error={getErrorMessage('horasAnualesTrabajadas')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Horas anuales trabajadas'] === 'number' 
                                ? currentVehicleData['Horas anuales trabajadas'] 
                                : 0}
                        />
                        <FormInput 
                            label="Días de actividad:" 
                            name="diasDeActividad"
                            value={formData.diasDeActividad}
                            onChange={handleInputChange}
                            error={getErrorMessage('diasDeActividad')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Dias de actividad'] === 'number' 
                                ? currentVehicleData['Dias de actividad'] 
                                : 0}
                        />
                    </form>
                </div>
            </SectionContainer >
        </div>
    )
}
