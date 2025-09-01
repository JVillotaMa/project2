import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";



export default function AmortizacionFinanciacion() {


    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Amortización y financiación" />
                   <SectionContainer subSectionTitle="Amortización">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Precio venta sin Iva(€):" />
                                <FormInput label="Dto. medio sobre tarifa (%)" />
                                <FormInput label="Precio neto (€)" />
                                <FormInput label="Valor residual (%)" />
                                <FormInput label="Periodo amortización (años)" />
                            </form>
                        </div>
                   </SectionContainer>
                   <SectionContainer subSectionTitle="Financiación">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10">
                                <FormInput label="Vehículo cuantía a financiar (%):" />
                                <FormInput label="Periodo a financiar (años):" />
                                <FormInput label="Tipo interés anual (TAE):" />
                            </form>
                        </div>
                   </SectionContainer>
               </div>
    )
}