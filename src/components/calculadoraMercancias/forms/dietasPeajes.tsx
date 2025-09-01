import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";



export default function DietasPeajes() {


    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Dietas y peajes" />
                   <SectionContainer subSectionTitle="Dietas">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Dieta media (€/dia):" />
                                <FormInput label="Nº días" />
                            </form>
                        </div>
                   </SectionContainer>
                   <SectionContainer subSectionTitle="Peajes">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Coste medio del Km en autopista (€/Servicio):" />
                                <FormInput label="Porcentaje de servicios que pagan peaje (%):" />
                            </form>
                        </div>
                   </SectionContainer>
               </div>
    )
}