'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import { useVehicleDataContext } from "@/lib/calculadoraMercancias/VehicleDataContext";
import React, { useEffect } from "react";

export default function Impuestos() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useMercanciasForm();
    const { currentVehicleData } = useVehicleDataContext();
    
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
                            defaultValue={currentVehicleData && typeof currentVehicleData['Visado autorizacion de Tte'] === 'number' 
                                ? currentVehicleData['Visado autorizacion de Tte'] 
                                : 0}
                        />
                        <FormInput 
                            label="Impuesto veh. Tracción Mec. (€/año):" 
                            name="impuestoVehiculoTraccion"
                            value={formData.impuestoVehiculoTraccion}
                            onChange={handleInputChange}
                            error={getErrorMessage('impuestoVehiculoTraccion')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Impuesto Veh. Traccion Mec'] === 'number' 
                                ? currentVehicleData['Impuesto Veh. Traccion Mec'] 
                                : 0}
                        />
                        <FormInput 
                            label="Coste ITV (€/año):" 
                            name="costeItv"
                            value={formData.costeItv}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeItv')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Coste ITV'] === 'number' 
                                ? currentVehicleData['Coste ITV'] 
                                : 0}
                        />
                        <FormInput 
                            label="Coste IAE (€/año):" 
                            name="costeIAE"
                            value={formData.costeIAE}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeIAE')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Coste IAE'] === 'number' 
                                ? currentVehicleData['Coste IAE'] 
                                : 0}
                        />
                        <FormInput 
                            label="Coste revisión tacógrafo (€/año):" 
                            name="costeTacografo"
                            value={formData.costeTacografo}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeTacografo')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Coste revision tacografo'] === 'number' 
                                ? currentVehicleData['Coste revision tacografo'] 
                                : 0}
                        />
                        <FormInput 
                            label="Coste ATP (€/año):" 
                            name="costeAtp"
                            value={formData.costeAtp}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeAtp')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Coste ATP'] === 'number' 
                                ? currentVehicleData['Coste ATP'] 
                                : 0}
                        />
                        <FormInput 
                            label="Coste ADR (€/año):" 
                            name="costeAdr"
                            value={formData.costeAdr}
                            onChange={handleInputChange}
                            error={getErrorMessage('costeAdr')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Coste ADR'] === 'number' 
                                ? currentVehicleData['Coste ADR'] 
                                : 0}
                        />
                    </form>
                </div>
            </SectionContainer>
        </div>
    )
}