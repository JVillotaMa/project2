'use client'
import NavigationLeftBar from "../shared/leftbar/navigationLeftBar";
import SeleccionTipoVehiculo from "./forms/seleccionTipoVehiculo";
import { SelectView } from "@/lib/types";
import DatosGenerales from "./forms/datosGenerales";
import React from "react";
import ButtonsNavigation from "../shared/ButtonNavigation";
import TituloSeccion from "../shared/leftbar/TituloSeccion";
import AmortizacionFinanciacion from "./forms/amortizacionFinanciacion";
import Impuestos from "./forms/impuestos";
import Personal from "./forms/personal";
import CostesIndirectos from "./forms/costesIndirectos";
import DietasPeajes from "./forms/dietasPeajes";
import NeumaticosCombustible from "./forms/neumaticosCombustible";
import Otros from "./forms/otros";
import Resultados from "./forms/resultados";
import Seguros from "./forms/seguros";
import SubtituloSeccion from "../shared/leftbar/subtituloSeccion";
import Mantenimiento from "./forms/mantenimiento";
import ResultsButton from "../shared/resultsButton";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import FormStepNavigation from "../shared/FormStepNavigation";

export default function CalculoCosteMercancias() {
    const [viewIndex, setViewIndex] = React.useState(0);
    const { validationStatus, markAsVisited, isFormValid } = useMercanciasForm();

    const selectView: SelectView[] = [
        { name: "Selección tipo de vehículo", component: <SeleccionTipoVehiculo /> },
        { name: "Datos generales", component: <DatosGenerales /> },
        { name: "Amortización y financiación", component: <AmortizacionFinanciacion /> },
        { name: "Personal", component: <Personal /> },
        { name: "Impuestos", component: <Impuestos /> },
        { name: "Seguros", component: <Seguros /> },
        { name: "Otros", component: <Otros /> },
        { name: "Neumáticos y combustible", component: <NeumaticosCombustible /> },
        {name: "Mantenimiento", component: <Mantenimiento /> },
        { name: "Dietas y peajes", component: <DietasPeajes /> },
        { name: "Costes indirectos", component: <CostesIndirectos /> },
        { name: "Resultados", component: <Resultados /> },
    ]

    function RenderForm({ index }: { index: number }) {
        return (
            selectView[index].component
        )
    }

    function handleClick(index: number) {
        setViewIndex(index);
        
        // Mark the section as visited when clicked - using setTimeout to avoid render loops
        setTimeout(() => {
            if (index === 0) markAsVisited('vehiculo');
            else if (index === 1) markAsVisited('datosGenerales');
            else if (index === 2) markAsVisited('amortizacionYFinanciacion');
            else if (index === 3) markAsVisited('personal');
            else if (index === 4) markAsVisited('impuestos');
            else if (index === 5) markAsVisited('seguros');
            else if (index === 6) markAsVisited('otrosCostes');
            else if (index === 7) markAsVisited('neumaticosYCombustible');
            else if (index === 8) markAsVisited('mantenimiento');
            else if (index === 9) markAsVisited('dietasYPeajes');
            else if (index === 10) markAsVisited('costesIndirectos');
        }, 0);
    }

    function handlePrevious() {
        if (viewIndex > 0) {
            handleClick(viewIndex - 1);
        }
    }
    
    function handleNext() {
        if (viewIndex < selectView.length - 1) {
            handleClick(viewIndex + 1);
        }
    }
    
    function isNextDisabled() {
        // Disable next button if current section is invalid or incomplete
        if (viewIndex === 0) return validationStatus.vehiculo !== 'valid';
        if (viewIndex === 1) return validationStatus.datosGenerales !== 'valid';
        if (viewIndex === 2) return validationStatus.amortizacionYFinanciacion !== 'valid';
        if (viewIndex === 3) return validationStatus.personal !== 'valid';
        if (viewIndex === 4) return validationStatus.impuestos !== 'valid';
        if (viewIndex === 5) return validationStatus.seguros !== 'valid';
        if (viewIndex === 6) return validationStatus.otrosCostes !== 'valid';
        if (viewIndex === 7) return validationStatus.neumaticosYCombustible !== 'valid';
        if (viewIndex === 8) return validationStatus.mantenimiento !== 'valid';
        if (viewIndex === 9) return validationStatus.dietasYPeajes !== 'valid';
        if (viewIndex === 10) return validationStatus.costesIndirectos !== 'valid';
        return false;
    }
    
    // Determine if the results button should be disabled
    const isResultsDisabled = !isFormValid;

    return (
        <div className="flex flex-col md:flex-row">
            <div id="left-bar" className="w-full md:w-auto">
                <NavigationLeftBar>
                    <TituloSeccion titulo="Secciones" />
                    <ButtonsNavigation 
                        onClick={() => handleClick(0)} 
                        text="Seleccion del tipo de vehículo" 
                        index={0} 
                        isSelected={viewIndex == 0}
                        validationStatus={validationStatus.vehiculo}
                    />
                    <ButtonsNavigation 
                        onClick={() => handleClick(1)} 
                        text="Datos generales" 
                        index={1} 
                        isSelected={viewIndex == 1}
                        validationStatus={validationStatus.datosGenerales}
                    />
                    <SubtituloSeccion titulo="Costes fijos" />
                    <ButtonsNavigation 
                        onClick={() => handleClick(2)} 
                        text="Amortización y financiación" 
                        index={2} 
                        isSelected={viewIndex == 2}
                        validationStatus={validationStatus.amortizacionYFinanciacion}
                    />
                    <ButtonsNavigation 
                        onClick={() => handleClick(3)} 
                        text="Personal" 
                        index={3} 
                        isSelected={viewIndex == 3}
                        validationStatus={validationStatus.personal}
                    />
                    <ButtonsNavigation 
                        onClick={() => handleClick(4)} 
                        text="Impuestos" 
                        index={4} 
                        isSelected={viewIndex == 4}
                        validationStatus={validationStatus.impuestos}
                    />
                    <ButtonsNavigation 
                        onClick={() => handleClick(5)} 
                        text="Seguros" 
                        index={5} 
                        isSelected={viewIndex == 5}
                        validationStatus={validationStatus.seguros}
                    />
                    <ButtonsNavigation 
                        onClick={() => handleClick(6)} 
                        text="Otros" 
                        index={6} 
                        isSelected={viewIndex == 6}
                        validationStatus={validationStatus.otrosCostes}
                    />
                    <SubtituloSeccion titulo="Costes variables" />
                    <ButtonsNavigation 
                        onClick={() => handleClick(7)} 
                        text="Neumáticos y combustible" 
                        index={7} 
                        isSelected={viewIndex == 7}
                        validationStatus={validationStatus.neumaticosYCombustible}
                    />
                    <ButtonsNavigation 
                        onClick={() => handleClick(8)} 
                        text="Mantenimiento" 
                        index={8} 
                        isSelected={viewIndex == 8}
                        validationStatus={validationStatus.mantenimiento}
                    />
                    <ButtonsNavigation 
                        onClick={() => handleClick(9)} 
                        text="Dietas y peajes" 
                        index={9} 
                        isSelected={viewIndex == 9}
                        validationStatus={validationStatus.dietasYPeajes}
                    />
                    <ButtonsNavigation 
                        onClick={() => handleClick(10)} 
                        text="Costes indirectos" 
                        index={10} 
                        isSelected={viewIndex == 10}
                        validationStatus={validationStatus.costesIndirectos}
                    />
                    <br />
                    <ResultsButton 
                        disabled={isResultsDisabled}
                        onClick={() => handleClick(11)} 
                        text="Resultados" 
                        index={11} 
                        isSelected={viewIndex == 11}
                        isFormValid={isFormValid}
                    />
                </NavigationLeftBar>
            </div>
            <div id="form" className="w-full p-4">
                <RenderForm index={viewIndex} />
                
                {/* Form step navigation buttons */}
                {viewIndex !== 11 && (
                    <FormStepNavigation 
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        isFirstStep={viewIndex === 0}
                        isLastStep={viewIndex === selectView.length - 1}
                        isNextDisabled={isNextDisabled()}
                    />
                )}
            </div>
        </div>
    )
}