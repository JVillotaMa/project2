'use client'
import NavigationLeftBar from "../shared/leftbar/navigationLeftBar";
import SeleccionTipoVehiculo from "./forms/seleccionTipoVehiculo";
import { SelectView } from "@/lib/types";
import DatosGenerales from "../calculadoraTransportes/forms/datosGenerales";
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

export default function calculoCosteMercancias() {
    const [viewIndex, setViewIndex] = React.useState(0);

    const selectView:SelectView[] = [
        {name: "Selección tipo de vehículo", component: <SeleccionTipoVehiculo /> },
        {name: "Datos generales", component: <DatosGenerales /> },
        {name: "Amortización y financiación", component: <AmortizacionFinanciacion /> },
        {name: "Impuestos", component: <Impuestos /> },
        {name: "Personal", component: <Personal /> },
        {name: "Seguros", component: <Seguros /> },
        {name: "Otros", component: <Otros /> },
        {name: "Neumáticos y combustible", component: <NeumaticosCombustible /> },
        {name: "Dietas y peajes", component: <DietasPeajes /> },
        {name: "Costes indirectos", component: <CostesIndirectos /> },
        {name: "Resultados", component: <Resultados /> },
    ]

    function RenderForm({index}: {index: number}) {  
        return (
            selectView[index].component
        )
    }

    function handleClick(index:number) {
        console.log("Clicked button for view index:", index);
        setViewIndex(index);
    }

    return (
        <div className="flex flex-row ">
            <div id="left-bar">
                <NavigationLeftBar>
                    <TituloSeccion titulo="Secciones"/>
                    <ButtonsNavigation onClick={()=>handleClick(0)} text="Seleccion del tipo de vehículo" index={0} isSelected={viewIndex==0}/>
                    <ButtonsNavigation onClick={()=>handleClick(1)} text="Datos generales" index={1} isSelected={viewIndex==1}/>
                    <SubtituloSeccion titulo="Costes fijos"/>
                    <ButtonsNavigation onClick={()=>handleClick(2)} text="Amortización y financiación" index={2} isSelected={viewIndex==2}/>
                    <ButtonsNavigation onClick={()=>handleClick(3)} text="Impuestos" index={3} isSelected={viewIndex==3}/>
                    <ButtonsNavigation onClick={()=>handleClick(4)} text="Personal" index={4} isSelected={viewIndex==4}/>
                    <ButtonsNavigation onClick={()=>handleClick(5)} text="Seguros" index={5} isSelected={viewIndex==5}/>
                    <ButtonsNavigation onClick={()=>handleClick(6)} text="Otros" index={6} isSelected={viewIndex==6}/>
                    <SubtituloSeccion titulo="Costes variables"/>
                    <ButtonsNavigation onClick={()=>handleClick(7)} text="Neumáticos y combustible" index={7} isSelected={viewIndex==7}/>
                    <ButtonsNavigation onClick={()=>handleClick(8)} text="Dietas y peajes" index={8} isSelected={viewIndex==8}/>
                    <ButtonsNavigation onClick={()=>handleClick(9)} text="Costes indirectos" index={9} isSelected={viewIndex==9}/>
                    <br></br>
                    <ButtonsNavigation onClick={()=>handleClick(10)} text="Resultados" index={10} isSelected={viewIndex==10}/>
                </NavigationLeftBar>
            </div>
            <div id="form" className="block w-full">
                <RenderForm index={viewIndex}/>
                {/*Render the form you want to display here+*/}
            </div>
        </div>
    )
}