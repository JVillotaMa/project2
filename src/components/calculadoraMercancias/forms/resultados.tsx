'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import React, { useEffect } from "react";

export default function Resultados() {
    const { formData, updateFormData, isFormValid } = useMercanciasForm();
    
    const [optionSelected, setOptionSelected] = React.useState("option-one");
    const [kilometrosServicio, setKilometrosServicio] = React.useState<number | undefined>(undefined);
    const [horasServicio, setHorasServicio] = React.useState<number | undefined>(undefined);
    
    // Handle number input changes for kilometros
    const handleKilometrosChange = (_name: string, value: number | undefined) => {
        setKilometrosServicio(value);
    };
    
    // Handle number input changes for horas
    const handleHorasChange = (_name: string, value: number | undefined) => {
        setHorasServicio(value);
    };

    return (
        <div className="flex flex-col gap-5 ">
            <SectionTitle title="Resultados" />
            <SectionContainer subSectionTitle="¿Desea calcular el coste de un servicio?">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        {/* Here the user chooses the calculation option */}
                        <div id="calculation-type" className="flex flex-col ">
                            <RadioGroup defaultValue="option-one">
                                <div className="flex items-center space-x-2 justify-between">
                                    <div className="flex items-center space-x-2 ">
                                        <RadioGroupItem 
                                            value="option-one" 
                                            id="option-one" 
                                            onClick={() => setOptionSelected("option-one")} 
                                            disabled={!isFormValid}
                                        />
                                        <label htmlFor="option-one" className={!isFormValid ? "text-gray-400" : ""}>
                                            Calcular costes unitarios (por km/hora) del vehículo
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 ">
                                        <RadioGroupItem 
                                            value="option-two" 
                                            id="option-two" 
                                            onClick={() => setOptionSelected("option-two")} 
                                            disabled={!isFormValid}
                                        />
                                        <label htmlFor="option-two" className={!isFormValid ? "text-gray-400" : ""}>
                                            Calcular los costes totales de un servicio
                                        </label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                        {optionSelected === "option-two" && isFormValid && (
                            <>
                                <FormInput 
                                    label="Kilometros del servicio:" 
                                    name="kilometrosServicio"
                                    value={kilometrosServicio}
                                    onChange={handleKilometrosChange}
                                    defaultValue={100}
                                />
                                <FormInput 
                                    label="Horas del servicio:" 
                                    name="horasServicio"
                                    value={horasServicio}
                                    onChange={handleHorasChange}
                                    defaultValue={2}
                                />
                            </>
                        )}
                        
                        {!isFormValid && (
                            <div className="text-red-500 mt-4 p-3 bg-red-50 rounded-md">
                                Para ver los resultados, debe completar correctamente todos los campos del formulario.
                            </div>
                        )}
                    </form>
                </div>
            </SectionContainer>
        </div>
    )
}