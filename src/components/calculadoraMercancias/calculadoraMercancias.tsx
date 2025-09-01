import ImageTitle from "../shared/ImageTitle";
import Navbar from "../shared/Navbar";
import ObservatorioAdvise from "../shared/ObservatorioAdvise";
import CalculoCosteMercancias from "./calculoCosteMercancias";

export default function CalculadoraMercancias() {
    return (
        <>
            <Navbar />
            <ImageTitle title="Calculadora de costes de mercancias" imageSrc="/truckBg.png"  />
            <div id="main-container">
                <div className="flex flex-col w-full">
                    <div className="w-full flex justify-end">
                        <ObservatorioAdvise/>
                    </div>
                </div>
                <div>
                    <CalculoCosteMercancias/>
                </div>
            </div>
            
            

        </>

    );
}