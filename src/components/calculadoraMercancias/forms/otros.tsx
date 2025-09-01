import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";



export default function Otros() {


    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Otros costes fijos" />
                   <SectionContainer subSectionTitle="Otros costes fijos">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Otros costes fijos (€/año):" />
                            </form>
                        </div>
                   </SectionContainer>
               </div>
    )
}