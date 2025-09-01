import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";



export default function CostesIndirectos() {


    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Costes indirectos" />
                   <SectionContainer subSectionTitle="Costes indirectos">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Gastos anuales generales (instalaciones, equipos, personal no conductor):" />

                            </form>
                        </div>
                   </SectionContainer>
               </div>
    )
}