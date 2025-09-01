import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";

export default function DatosGenerales() {
    return (
       <div className="flex flex-col gap-5 ">
                   <SectionTitle title="Datos generales" />
                   <SectionContainer subSectionTitle="Características de explotación">
                          Datos generales   
                   </SectionContainer>
               </div>
    )
}