import ImageTitle from "./ImageTitle";
import Navbar from "../shared/Navbar";
import ObservatorioAdvise from "../shared/ObservatorioAdvise";
import CalculoCosteMercancias from "./calculoCosteMercancias";
import { MercanciasFormProvider } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import { VehicleDataProvider } from "@/lib/calculadoraMercancias/VehicleDataContext";

export default function CalculadoraMercancias() {
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
                <div>
                    <MercanciasFormProvider>
                        <VehicleDataProvider>
                            <CalculoCosteMercancias/>
                        </VehicleDataProvider>
                    </MercanciasFormProvider>
                </div>
            </div>
        </>
    );
}