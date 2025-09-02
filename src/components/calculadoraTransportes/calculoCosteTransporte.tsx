'use client'
import NavigationLeftBar from "../shared/leftbar/navigationLeftBar";
import { SelectView } from "@/lib/types";
import React from "react";
import ButtonsNavigation from "../shared/ButtonNavigation";
import TituloSeccion from "../shared/leftbar/TituloSeccion";

import SubtituloSeccion from "../shared/leftbar/subtituloSeccion";
import DatosGenerales from "./forms/datosGenerales";
import DatosDelVehiculo from "./forms/datosDelVehiculo";
import DatosDeCirculación from "./forms/datosDeCirculacion";
import Resultados from "./forms/resultados";

export default function CalculoCosteTransportes() {
    const [viewIndex, setViewIndex] = React.useState(0);

    const selectView: SelectView[] = [
        { name: "Datos generales", component: <DatosGenerales /> },
        { name: "Datos del vehículo", component: <DatosDelVehiculo /> },
        { name: "Datos de circulación", component: <DatosDeCirculación /> },
        { name: "Resultados", component: <Resultados /> },
    ]

    function RenderForm({ index }: { index: number }) {
        return (
            selectView[index].component

        )
    }

    function handleClick(index: number) {
        setViewIndex(index);
    }

    return (
        <div className="flex flex-row ">
            <div id="left-bar">
                <NavigationLeftBar>
                    <TituloSeccion titulo="Secciones" />
                    <ButtonsNavigation onClick={() => handleClick(0)} text="Datos generales" index={0} isSelected={viewIndex == 0} />
                    <ButtonsNavigation onClick={() => handleClick(1)} text="Datos del vehículo" index={1} isSelected={viewIndex == 1} />
                    <ButtonsNavigation onClick={() => handleClick(2)} text="Datos de circulación" index={2} isSelected={viewIndex == 2} />
                    <br />
                    <ButtonsNavigation onClick={() => handleClick(3)} text="Resultados" index={3} isSelected={viewIndex == 3} />

                </NavigationLeftBar>
            </div>
            <div id="form" className="block w-full">
                <RenderForm index={viewIndex} />
                {/*Render the form you want to display here+*/}
            </div>
        </div>
    )
}