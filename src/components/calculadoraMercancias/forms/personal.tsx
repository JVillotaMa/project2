import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";



export default function Personal() {


    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Personal" />
                   <SectionContainer subSectionTitle="Personal">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Seguridad social empresa (%):" />
                                <FormInput label="Retribución ordinaria 1 conductor mecánico (€/año):" />
                                <FormInput label="Plus de asistencia (€/año):" />
                            </form>
                        </div>
                   </SectionContainer>
               </div>
    )
}