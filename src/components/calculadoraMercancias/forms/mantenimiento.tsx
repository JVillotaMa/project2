import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";

export default function Mantenimiento() {
    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Mantenimiento" />
                   <SectionContainer subSectionTitle="Mantenimiento">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Coste anual de mantenimiento del vehículo (€):" />
                            </form>
                        </div>
                   </SectionContainer>
               </div>
    )
}