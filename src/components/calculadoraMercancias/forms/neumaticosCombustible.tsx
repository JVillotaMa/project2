'use client'
import CalculationField from "@/components/shared/calculationField";
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import { useVehicleDataContext } from "@/lib/calculadoraMercancias/VehicleDataContext";
import React, { useEffect } from "react";

export default function NeumaticosCombustible() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useMercanciasForm();
    const { currentVehicleData } = useVehicleDataContext();
    
    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Use setTimeout to avoid render loops
        setTimeout(() => {
            markAsVisited('neumaticosYCombustible');
        }, 0);
    }, [markAsVisited]);
    
    // Handle number input changes
    const handleInputChange = (name: string, value: number | undefined) => {
        updateFormData({ [name]: value });
    };
    
    // Get error messages for fields
    const getErrorMessage = (fieldName: string) => {
        // No errors if no validation errors
        if (!validationErrors.neumaticosYCombustible) return undefined;
        
        // Get the field value
        const fieldValue = formData[fieldName as keyof typeof formData];
        
        // Only show error if the field has a value
        if (fieldValue === undefined) return undefined;
        
        // Get error from Zod validation
        const fieldErrors = validationErrors.neumaticosYCombustible.format();
        const fieldError = fieldErrors[fieldName];
        
        return fieldError?._errors?.[0];
    };

    return (
       <div className="flex flex-col gap-5 ">
            <SectionTitle title="Neumáticos y combustible" />
            <SectionContainer subSectionTitle="Neumáticos">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        <FormInput 
                            label="Precio bruto neumáticos (€/unidad):" 
                            name="precioBrutoNeumaticos"
                            value={formData.precioBrutoNeumaticos}
                            onChange={handleInputChange}
                            error={getErrorMessage('precioBrutoNeumaticos')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Precio bruto neumaticos'] === 'number' 
                                ? currentVehicleData['Precio bruto neumaticos'] 
                                : 0}
                        />
                        <FormInput 
                            label="Dto. medio sobre neumáticos (%)" 
                            name="descuentoMedioNeumaticos"
                            value={formData.descuentoMedioNeumaticos}
                            onChange={handleInputChange}
                            error={getErrorMessage('descuentoMedioNeumaticos')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Descuento medio neumaticos (%)'] === 'number' 
                                ? currentVehicleData['Descuento medio neumaticos (%)'] 
                                : 0}
                        />
                        <CalculationField 
                            label="Precio medio neumático (€/unidad)" 
                            value={(formData.precioBrutoNeumaticos ? formData.precioBrutoNeumaticos : 0) * ( 1 -
                                    (formData.descuentoMedioNeumaticos ? formData.descuentoMedioNeumaticos : 0) /100 )}/>
                        <FormInput 
                            label="Duración media neumáticos (km)" 
                            name="duracionMediaNeumaticosKm"
                            value={formData.duracionMediaNeumaticosKm}
                            onChange={handleInputChange}
                            error={getErrorMessage('duracionMediaNeumaticosKm')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Duracion media neumaticos'] === 'number' 
                                ? currentVehicleData['Duracion media neumaticos'] 
                                : 0}
                        />
                        <FormInput 
                            label="Número total de neumáticos" 
                            name="numeroTotalNeumaticos"
                            value={formData.numeroTotalNeumaticos}
                            onChange={handleInputChange}
                            error={getErrorMessage('numeroTotalNeumaticos')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Num total de neumaticos'] === 'number' 
                                ? currentVehicleData['Num total de neumaticos'] 
                                : 0}
                        />
                    </form>
                </div>
            </SectionContainer>
            <SectionContainer subSectionTitle="Combustible">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        <FormInput 
                            label="Precio bruto del gasóleo sin IVA (€/litro):" 
                            name="precioBrutoGasoleoSinIva"
                            value={formData.precioBrutoGasoleoSinIva}
                            onChange={handleInputChange}
                            error={getErrorMessage('precioBrutoGasoleoSinIva')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Precio bruto gasoleo'] === 'number' 
                                ? currentVehicleData['Precio bruto gasoleo'] 
                                : 0}
                        />
                        <FormInput 
                            label="Descuento medio sobre combustible (%):" 
                            name="descuentoMedioConbustible"
                            value={formData.descuentoMedioConbustible}
                            onChange={handleInputChange}
                            error={getErrorMessage('descuentoMedioConbustible')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Descuento medio sobre combustible'] === 'number' 
                                ? currentVehicleData['Descuento medio sobre combustible'] 
                                : 0}
                        />
                        <CalculationField 
                            label="Precio del gasóleo (€/litro)" 
                            value={(formData.precioBrutoGasoleoSinIva ? formData.precioBrutoGasoleoSinIva : 0) * (1-
                                    (formData.descuentoMedioConbustible ? formData.descuentoMedioConbustible : 0) / 100 )}/>
                        <FormInput 
                            label="Consumo medio (lit/100km):" 
                            name="consumoMedioVehiculo100km"
                            value={formData.consumoMedioVehiculo100km}
                            onChange={handleInputChange}
                            error={getErrorMessage('consumoMedioVehiculo100km')}
                            defaultValue={currentVehicleData && typeof currentVehicleData['Consumo medio'] === 'number' 
                                ? currentVehicleData['Consumo medio'] 
                                : 0}
                        />
                    </form>
                </div>
            </SectionContainer>
        </div>
    )
}