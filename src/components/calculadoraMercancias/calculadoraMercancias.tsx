import ImageTitle from "./ImageTitle";
import Navbar from "../shared/Navbar";
import ObservatorioAdvise from "../shared/ObservatorioAdvise";
import CalculoCosteMercancias from "./calculoCosteMercancias";
import { MercanciasFormProvider } from "@/lib/calculadoraMercancias/MercanciasFormContext";

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
                        <CalculoCosteMercancias/>
                    </MercanciasFormProvider>
                </div>
            </div>
        </>
    );
}