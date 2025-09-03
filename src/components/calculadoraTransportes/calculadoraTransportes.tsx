
import Navbar from "../shared/Navbar";
import ObservatorioAdvise from "../shared/ObservatorioAdvise";
import CalculoCosteTransportes from "./calculoCosteTransporte";
import ImageTitle from "./ImageTitle";
import { TransportesFormProvider } from "@/lib/calculadoraTransportes/TransportesFormContext";

export default function CalculadoraTransportes() {
    return (
        <>
            <Navbar />
            <ImageTitle />
            <div id="main-container">
                <div className="flex flex-col w-full">
                    <div className="w-full flex justify-end">
                        <ObservatorioAdvise/>
                    </div>
                </div>
                <TransportesFormProvider>
                    <CalculoCosteTransportes/>
                </TransportesFormProvider>
            </div>
        </>
    );
}