import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import React, { useEffect } from "react";

export default function AmortizacionFinanciacion() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useMercanciasForm();
    
    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Use setTimeout to avoid render loops
        setTimeout(() => {
            markAsVisited('amortizacionYFinanciacion');
         }, 0);
    }, [markAsVisited]);
    
    // Handle number input changes
    const handleInputChange = (name: string, value: number | undefined) => {
        updateFormData({ [name]: value });
    };
    
    // Get error messages for fields
    const getErrorMessage = (fieldName: string) => {
        // No errors if no validation errors
        if (!validationErrors.amortizacionYFinanciacion) return undefined;
        
        // Get the field value
        const fieldValue = formData[fieldName as keyof typeof formData];
        
        // Only show error if the field has a value
        if (fieldValue === undefined) return undefined;
        
        // Get error from Zod validation
        const fieldErrors = validationErrors.amortizacionYFinanciacion.format();
        // @ts-ignore - Zod error format structure
        const fieldError = fieldErrors[fieldName];
        
        return fieldError?._errors?.[0];
    };

    return (
       <div className="flex flex-col gap-2 w-full">
           <SectionTitle title="Amortización y financiación" />
           <SectionContainer subSectionTitle="Amortización">
                <div className="flex justify-center">
                    <div className="w-full p-6">
                        {/* Tabla de amortización con estilo más limpio */}
                        <div className="w-full">
                            {/* Encabezados */}
                            <div className="flex border-b-2 border-gray-300 mb-4">
                                <div className="w-1/3 p-3 font-semibold text-gray-700">Campo</div>
                                <div className="w-1/3 p-3 font-semibold text-gray-700 text-center">Cabeza Tractora</div>
                                <div className="w-1/3 p-3 font-semibold text-gray-700 text-center">Remolque</div>
                            </div>
                            
                            {/* Fila 1: Precio venta sin IVA */}
                            <div className="flex mb-4">
                                <div className="w-1/3 p-3 font-medium">Precio venta sin IVA (€)</div>
                                <div className="w-1/3 p-2">
                                    <FormInput 
                                        label=""
                                        name="precioVentaSinIvaCabezaTractora"
                                        value={formData.precioVentaSinIvaCabezaTractora}
                                        onChange={handleInputChange}
                                        error={getErrorMessage('precioVentaSinIvaCabezaTractora')}
                                        defaultValue={120000}
                                    />
                                </div>
                                <div className="w-1/3 p-2">
                                    <FormInput 
                                        label=""
                                        name="precioVentaSinIvaRemolque"
                                        value={formData.precioVentaSinIvaRemolque}
                                        onChange={handleInputChange}
                                        error={getErrorMessage('precioVentaSinIvaRemolque')}
                                        defaultValue={30000}
                                    />
                                </div>
                            </div>
                            
                            {/* Fila 2: Descuento medio sobre tarifa */}
                            <div className="flex mb-4">
                                <div className="w-1/3 p-3 font-medium">Descuento medio sobre tarifa (%)</div>
                                <div className="w-1/3 p-2">
                                    <FormInput 
                                        label=""
                                        name="descuentoMedioSobreTarifaCabezaTractora"
                                        value={formData.descuentoMedioSobreTarifaCabezaTractora}
                                        onChange={handleInputChange}
                                        error={getErrorMessage('descuentoMedioSobreTarifaCabezaTractora')}
                                        defaultValue={10}
                                    />
                                </div>
                                <div className="w-1/3 p-2">
                                    <FormInput 
                                        label=""
                                        name="descuentoMedioSobreTarifaRemolque"
                                        value={formData.descuentoMedioSobreTarifaRemolque}
                                        onChange={handleInputChange}
                                        error={getErrorMessage('descuentoMedioSobreTarifaRemolque')}
                                        defaultValue={10}
                                    />
                                </div>
                            </div>
                            
                            {/* Fila 3: Valor residual */}
                            <div className="flex mb-4">
                                <div className="w-1/3 p-3 font-medium">Valor residual (%)</div>
                                <div className="w-1/3 p-2">
                                    <FormInput 
                                        label=""
                                        name="valorResidualPorcentajeCabezaTractora"
                                        value={formData.valorResidualPorcentajeCabezaTractora}
                                        onChange={handleInputChange}
                                        error={getErrorMessage('valorResidualPorcentajeCabezaTractora')}
                                        defaultValue={20}
                                    />
                                </div>
                                <div className="w-1/3 p-2">
                                    <FormInput 
                                        label=""
                                        name="valorResidualPorcentajeRemolque"
                                        value={formData.valorResidualPorcentajeRemolque}
                                        onChange={handleInputChange}
                                        error={getErrorMessage('valorResidualPorcentajeRemolque')}
                                        defaultValue={20}
                                    />
                                </div>
                            </div>
                            
                            {/* Fila 4: Periodo amortización */}
                            <div className="flex">
                                <div className="w-1/3 p-3 font-medium">Periodo amortización (años)</div>
                                <div className="w-1/3 p-2">
                                    <FormInput 
                                        label=""
                                        name="periodoAmortizacionCabezaTractora"
                                        value={formData.periodoAmortizacionCabezaTractora}
                                        onChange={handleInputChange}
                                        error={getErrorMessage('periodoAmortizacionCabezaTractora')}
                                        defaultValue={6}
                                    />
                                </div>
                                <div className="w-1/3 p-2">
                                    <FormInput 
                                        label=""
                                        name="periodoAmortizacionRemolque"
                                        value={formData.periodoAmortizacionRemolque}
                                        onChange={handleInputChange}
                                        error={getErrorMessage('periodoAmortizacionRemolque')}
                                        defaultValue={6}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           </SectionContainer>
           <SectionContainer subSectionTitle="Financiación">
                <div className="flex justify-center">
                    <div className="w-full p-6">
                        <form className="flex flex-col gap-4 w-full">
                            <FormInput 
                                label="Cuantía a financiar (€):" 
                                name="cuantiaAFinanciar"
                                value={formData.cuantiaAFinanciar}
                                onChange={handleInputChange}
                                error={getErrorMessage('cuantiaAFinanciar')}
                                defaultValue={100000}
                            />
                            <FormInput 
                                label="Periodo a financiar (años):" 
                                name="periodoAFinanciar"
                                value={formData.periodoAFinanciar}
                                onChange={handleInputChange}
                                error={getErrorMessage('periodoAFinanciar')}
                                defaultValue={5}
                            />
                            <FormInput 
                                label="Tipo interés anual (TAE %):" 
                                name="tipoInteresAnual"
                                value={formData.tipoInteresAnual}
                                onChange={handleInputChange}
                                error={getErrorMessage('tipoInteresAnual')}
                                defaultValue={4.5}
                            />
                        </form>
                    </div>
                </div>
           </SectionContainer>
       </div>
    )
}