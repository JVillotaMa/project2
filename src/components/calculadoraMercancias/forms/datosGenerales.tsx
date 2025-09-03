import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import React from "react";
import { Form } from "react-hook-form";



export default function DatosGenerales() {

    return (
        <div className="flex flex-col gap-5 ">
            <SectionTitle title="Datos generales" />
            <SectionContainer subSectionTitle="Datos de explotación">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10">
                        <FormInput label="Nº de servicios diarios por vehículo:" />
                        <FormInput label="Kilometraje anual (Km/año):" />
                        <FormInput label="% Kilometraje anual en vacío:" />
                        <FormInput label="Horas anuales trabajadas:" />
                        <FormInput label="Días de actividad:" />
                    </form>
                </div>
            </SectionContainer >

        </div>

    )
}