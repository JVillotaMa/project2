import React from "react";

export interface TipoVehiculo {
    nombreVehiculo: string;
    informacion: {
        CV: number | null; // Potencia en caballos de vapor
        MMA: number | null; // Masa Máxima Autorizada en toneladas
        CargaUtil: number | null; // Carga útil en kg
        ejes: number; // Número de ejes
        neumaticos: number; // Número de neumáticos
    };
}

export interface SelectView {
    name: string;
    component: React.ReactNode;
}

