'use client'
import NavigationLeftBar from "../shared/leftbar/navigationLeftBar";
import SeleccionTipoVehiculo from "./forms/seleccionTipoVehiculo";
import { SelectView } from "@/lib/types";
import DatosGenerales from "./forms/datosGenerales";
import React from "react";
import ButtonsNavigation from "../shared/ButtonNavigation";
import TituloSeccion from "../shared/leftbar/TituloSeccion";

export default function calculoCosteMercancias() {
    const [viewIndex, setViewIndex] = React.useState(0);

    const selectView:SelectView[] = [
        {name: "Selección tipo de vehículo", component: <SeleccionTipoVehiculo /> },
        {name: "Datos generales", component: <DatosGenerales /> },
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
                </NavigationLeftBar>
            </div>
            <div id="form" className="block w-full">
                <RenderForm index={viewIndex}/>
                {/*Render the form you want to display here+*/}
            </div>
        </div>
    )
}