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
       <div className="flex flex-col gap-5 ">
           <SectionTitle title="Amortización y financiación" />
           <SectionContainer subSectionTitle="Amortización">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        <FormInput 
                            label="Precio venta sin IVA cabeza tractora (€):" 
                            name="precioVentaSinIvaCabezaTractora"
                            value={formData.precioVentaSinIvaCabezaTractora}
                            onChange={handleInputChange}
                            error={getErrorMessage('precioVentaSinIvaCabezaTractora')}
                            defaultValue={120000}
                        />
                        <FormInput 
                            label="Precio venta sin IVA remolque (€):" 
                            name="precioVentaSinIvaRemolque"
                            value={formData.precioVentaSinIvaRemolque}
                            onChange={handleInputChange}
                            error={getErrorMessage('precioVentaSinIvaRemolque')}
                            defaultValue={30000}
                        />
                        <FormInput 
                            label="Descuento medio sobre tarifa (%):" 
                            name="descuentoMedioSobreTarifa"
                            value={formData.descuentoMedioSobreTarifa}
                            onChange={handleInputChange}
                            error={getErrorMessage('descuentoMedioSobreTarifa')}
                            defaultValue={10}
                        />
                        <FormInput 
                            label="Valor residual (%):" 
                            name="valorResidualPorcentaje"
                            value={formData.valorResidualPorcentaje}
                            onChange={handleInputChange}
                            error={getErrorMessage('valorResidualPorcentaje')}
                            defaultValue={20}
                        />
                        <FormInput 
                            label="Periodo amortización (años):" 
                            name="periodoAmortizacion"
                            value={formData.periodoAmortizacion}
                            onChange={handleInputChange}
                            error={getErrorMessage('periodoAmortizacion')}
                            defaultValue={6}
                        />
                    </form>
                </div>
           </SectionContainer>
           <SectionContainer subSectionTitle="Financiación">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
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
           </SectionContainer>
       </div>
    )
}