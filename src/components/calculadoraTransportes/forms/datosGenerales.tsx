import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React from "react";



export default function DatosGenerales() {

    const [optionSelected, setOptionSelected] = React.useState("option-one");

    return (
        <div className="flex flex-col gap-5 ">
            <SectionTitle title="Datos generales" />
            <SectionContainer subSectionTitle="Seleccione el tipo de autobús">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10">
                        <RadioGroup
                            defaultValue="option-one"
                            className="flex flex-row justify-evenly gap-10"
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option-one" id="option-one" className="h-4 w-4 border border-gray-300 rounded-full" />
                                    <label htmlFor="option-one">Menos de 22 plazas</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option-two" id="option-two" className="h-4 w-4 border border-gray-300 rounded-full" />
                                    <label htmlFor="option-two">De 22 a 35 plazas</label>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option-three" id="option-three" className="h-4 w-4 border border-gray-300 rounded-full" />
                                    <label htmlFor="option-three">De 36 a 55 plazas</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option-four" id="option-four" className="h-4 w-4 border border-gray-300 rounded-full" />
                                    <label htmlFor="option-four">Más de 55 plazas</label>
                                </div>
                            </div>
                        </RadioGroup>

                    </form>
                </div>
            </SectionContainer >
            <SectionContainer subSectionTitle="Datos del conductor">
                <div className="p-10 flex justify-center">
                    <div className="flex justify-center flex-col gap-2">
                        <FormInput label="Salario anual del conductor (€):" />
                        <FormInput label="Horas de trabajo del conductor" />
                    </div>
                </div>


            </SectionContainer>
            <SectionContainer subSectionTitle="Costes generales">
                <div className="p-10 flex justify-center">
                    <FormInput label="Costes generales (% sobre el coste total):" />
                </div>
            </SectionContainer>

        </div>

    )
}