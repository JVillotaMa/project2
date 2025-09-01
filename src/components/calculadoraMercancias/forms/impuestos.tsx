import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";



export default function Impuestos() {


    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Impuestos" />
                   <SectionContainer subSectionTitle="Impuestos">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Visado autorización de Tte. (€/año):" />
                                <FormInput label="Impuesto veh. Tracción Mec. (€/año):" />
                                <FormInput label="Coste ITV (€/año):" />
                                <FormInput label="Coste IAE (€/año):" />
                                <FormInput label="Coste revisión Tacógrafo (€/año):" />
                                <FormInput label="Coste ATP (€/año):" />
                                <FormInput label="Coste ADR (€/año):" />
                            </form>
                        </div>
                   </SectionContainer>
               </div>
    )
}