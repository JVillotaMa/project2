import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";



export default function NeumaticosCombustible() {


    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Neumáticos y combustible" />
                   <SectionContainer subSectionTitle="Neumáticos">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Precio bruto neumáticos (€/unidad):" />
                                <FormInput label="Dto. medio sobre neumáticos (%)" />
                                <br />
                                <FormInput label="Valor residual (%)" />
                                <FormInput label="Periodo amortización (años)" />
                            </form>
                        </div>
                   </SectionContainer>
                   <SectionContainer subSectionTitle="Combustible">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Precio bruto del gasóleo sin IVA (€/litro):" />
                                <FormInput label="Descuento medio sobre combustible (%):" />
                                <br />
                                <FormInput label="Consumo medio (lit/100km):" />
                            </form>
                        </div>
                   </SectionContainer>
               </div>
    )
}