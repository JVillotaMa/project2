import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React from "react";


export default function Resultados() {

    const [optionSelected, setOptionSelected] = React.useState("option-one");

    return (
        <div className="flex flex-col gap-5 ">
            <SectionTitle title="Resultados" />
            <SectionContainer subSectionTitle="¿Desea calcular el coste de un servicio?">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10">
                        {/* Here the user chooses the assurance he wants, but the input for the form is the same */}
                        <div id="assurance-type" className="flex flex-col ">
                            <RadioGroup defaultValue="option-one">
                                <div className="flex items-center space-x-2 justify-between">
                                    <div className="flex items-center space-x-2 ">
                                        <RadioGroupItem value="option-one" id="option-one" onClick={() => setOptionSelected("option-one")} />
                                        <label htmlFor="option-one">Calcular costes unitarios (por km/hora) del vehículo</label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 ">
                                        <RadioGroupItem value="option-two" id="option-two" onClick={() => setOptionSelected("option-two")} />
                                        <label htmlFor="option-two">Calcular los costes totales de un servicio</label>
                                    </div>

                                </div>
                            </RadioGroup>
                        </div>
                        {optionSelected=="option-two" && <FormInput label="Kilometros del servicio:" />}
                        {optionSelected=="option-two" && <FormInput label="Horas del servicio:" />}
                    </form>
                </div>
            </SectionContainer>
        </div>
    )
}