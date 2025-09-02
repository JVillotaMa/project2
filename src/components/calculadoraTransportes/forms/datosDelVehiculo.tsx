import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";



export default function DatosDelVehiculo() {


    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Datos del vehículo" />
                   <SectionContainer subSectionTitle="Amortización">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Coste de adquisición (€):" />
                                <FormInput label="Vida útil del vehículo (Años):" />
                            </form>
                        </div>
                   </SectionContainer>
                   <SectionContainer subSectionTitle="Financiación">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Coste de la financiación (TAE):" />
                                <FormInput label="Plazo de financiación (Años):" />
                            </form>
                        </div>
                   </SectionContainer>
                   <SectionContainer subSectionTitle="Mantenimiento y seguros">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Coste anual de mantenimiento del vehículo (€):" />
                                <FormInput label="Coste anual del seguro del vehículo  (€):" />
                            </form>
                        </div>
                   </SectionContainer>
               </div>
    )
}