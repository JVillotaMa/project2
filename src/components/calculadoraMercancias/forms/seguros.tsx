import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React from "react";


export default function Seguros() {

    const [optionSelected, setOptionSelected] = React.useState("option-one");

    return (
        <div className="flex flex-col gap-5 ">
            <SectionTitle title="Seguros" />
            <SectionContainer subSectionTitle="Seguros">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10">
                        {/* Here the user chooses the assurance he wants, but the input for the form is the same */}
                        <div id="assurance-type" className="flex flex-col ">
                            <RadioGroup defaultValue="option-one">
                                <div className="flex items-center space-x-2 justify-between">
                                    <div className="flex items-center space-x-2 ">
                                        <RadioGroupItem value="option-one" id="option-one" onClick={() => setOptionSelected("option-one")} />
                                        <label htmlFor="option-one">Solo obligatorios</label>
                                    </div>
                                    {optionSelected === "option-one" && <FormInput label="" />}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 ">
                                        <RadioGroupItem value="option-two" id="option-two" onClick={() => setOptionSelected("option-two")} />
                                        <label htmlFor="option-two">Obligatorios + Terceros (€/año)</label>
                                    </div>

                                    {optionSelected === "option-two" && <FormInput label="" />}
                                </div>
                                <div className="flex items-center space-x-2 justify-between">
                                    <div className="flex items-center space-x-2 ">
                                        <RadioGroupItem value="option-three" id="option-three" onClick={() => setOptionSelected("option-three")} />
                                        <label htmlFor="option-three">Todo riesgo (€/año)</label>
                                    </div>

                                    {optionSelected === "option-three" && <FormInput label="" />}
                                </div>
                            </RadioGroup>
                        </div>
                        <FormInput label="Seguro mercancía (€/año):" />
                        <FormInput label="Responsabilidad Civil (€/año):" />
                    </form>
                </div>
            </SectionContainer>
        </div>
    )
}