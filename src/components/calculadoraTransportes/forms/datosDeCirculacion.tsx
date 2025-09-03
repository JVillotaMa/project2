import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";



export default function DatosDeCirculación() {


    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Datos de circulación" />
                   <SectionContainer subSectionTitle="Datos de circulación">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Kilómetros recorridos al año por el vehículo:" />
                                <FormInput label="Coste del combustible (€/litro):" />
                                <FormInput label="Coste de cada neumático del vehículo (€):" />
                                <FormInput label="Vida útil de cada neumático (Km):" />
                            </form>
                        </div>
                   </SectionContainer>
               </div>
    )
}