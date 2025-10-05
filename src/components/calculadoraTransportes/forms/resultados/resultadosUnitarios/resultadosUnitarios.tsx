'use client'

import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTransportesForm } from '@/lib/calculadoraTransportes/TransportesFormContext'
import { useTransportDataContext } from '@/lib/calculadoraTransportes/TransportDataContext'
import {
    costeCombustibleKm,
    costeMantenimientoKm,
    costeNeumaticosKm,
    costeConductorHora,
    costeSeguroHora,
    costeAmortizacionHora,
    costeFinanciacionHora,
    costesPorServicio
} from '../calculos'

// Definición de tipos para las props
interface ResultadosUnitariosProps {
    kilometrosTrayecto?: number;
    kilometrosPosicionamiento?: number;
    horasServicio?: number;
}

export default function ResultadosUnitarios({
    kilometrosTrayecto = 1,
    kilometrosPosicionamiento = 0,
    horasServicio = 1
}: ResultadosUnitariosProps) {
    const { formData } = useTransportesForm();
    const { currentBusData } = useTransportDataContext();
    const resultadosRef = useRef<HTMLDivElement>(null);
    const graficoRef = useRef<HTMLDivElement>(null);

    // Calcular costes por km
    const calcularCostesPorKm = () => {
        if (!formData || !currentBusData) {
            return { combustible: 0, neumaticos: 0, mantenimiento: 0 };
        }

        const kilometrosAnuales = formData.kilometrosAnuales || 0;
        const costeDelCombustible = formData.costeDelCombustible || 0;
        const costeNeumatico = formData.costeNeumatico || 0;
        const vidaUtilNeumatico = formData.vidaUtilNeumatico || 1;
        const mantenimientoAnual = formData.mantenimientoAnual || 0;
        const numeroNeumaticos = typeof currentBusData['Numero Neumaticos'] === 'number'
            ? currentBusData['Numero Neumaticos']
            : 6;

        const consumo = typeof currentBusData["Consumo medio (L)"] === 'number'
            ? currentBusData["Consumo medio (L)"]
            : 0;

        return {
            combustible: costeCombustibleKm(costeDelCombustible, consumo),
            neumaticos: costeNeumaticosKm(costeNeumatico, numeroNeumaticos, vidaUtilNeumatico),
            mantenimiento: kilometrosAnuales > 0 ? costeMantenimientoKm(mantenimientoAnual, kilometrosAnuales) : 0
        };
    };

    // Calcular costes por hora
    const calcularCostesPorHora = () => {
        if (!formData) {
            return { amortizacion: 0, financiacion: 0, personal: 0, seguros: 0 };
        }

        const costeDeAdquisicion = formData.costeDeAdquisicion || 0;
        const vidaUtil = formData.vidaUtil || 1;
        const costeFinanciacionTAE = formData.costeFinanciacionTAE || 0;
        const plazoFinanciacion = formData.plazoFinanciacion || 1;
        const seguroAnual = formData.seguroAnual || 0;
        const salarioAnualConductor = formData.salarioAnualConductor || 0;
        const horasAnualesTrabajadas = formData.horasAnualesTrabajadas || 1;

        return {
            amortizacion: costeAmortizacionHora(costeDeAdquisicion, vidaUtil, horasAnualesTrabajadas),
            financiacion: costeFinanciacionHora(costeDeAdquisicion, costeFinanciacionTAE, plazoFinanciacion, vidaUtil, horasAnualesTrabajadas),
            personal: costeConductorHora(salarioAnualConductor, horasAnualesTrabajadas),
            seguros: costeSeguroHora(seguroAnual, horasAnualesTrabajadas)
        };
    };

    // Obtener costes unitarios
    const costesPorKm = calcularCostesPorKm();
    const costesPorHora = calcularCostesPorHora();

    // Costes unitarios totales
    const costeKmTotal = costesPorKm.combustible + costesPorKm.mantenimiento + costesPorKm.neumaticos;
    const costeHoraTotal = costesPorHora.amortizacion + costesPorHora.financiacion +
        costesPorHora.personal + costesPorHora.seguros;
    const costesGeneralesPorc = formData?.costesGenerales || 0;

    // Calcular costes totales del servicio
    const totalKilometros = kilometrosTrayecto + kilometrosPosicionamiento;
    const totalCostesKm = costeKmTotal * totalKilometros;
    const totalCostesHora = costeHoraTotal * horasServicio;
    const costesDirectos = totalCostesKm + totalCostesHora;
    const costesGenerales = costesDirectos * (costesGeneralesPorc / 100);
    const costeTotal = costesDirectos + costesGenerales;

    // Calcular porcentajes para el gráfico
    const porcKilometricos = costeTotal > 0 ? (totalCostesKm / costeTotal) * 100 : 0;
    const porcHorarios = costeTotal > 0 ? (totalCostesHora / costeTotal) * 100 : 0;
    const porcGenerales = costeTotal > 0 ? (costesGenerales / costeTotal) * 100 : 0;
    
    // Aseguramos que los ángulos se dibujan correctamente (en la referencia hay una orientación específica)
    // Valores para la visualización SVG (ajustados para coincidir con la imagen de referencia)
    const svgAngleStart = -Math.PI/2; // Comenzamos desde arriba (equivalente a -90 grados)

    // Fecha actual para el encabezado
    const currentYear = new Date().getFullYear();

    // Tipo de vehículo
    const tipoVehiculo = currentBusData ?
        (typeof currentBusData['Tipo'] === 'string' ? currentBusData['Tipo'] : 'menos de 22') :
        'menos de 22';

    // Funciones para copiar al portapapeles
    const copiarTexto = () => {
        if (!resultadosRef.current) return;

        const texto = `
Resultado del cálculo de costes
---------------------------------------
Costes unitarios por vehículo
calculados para un servicio de:
${kilometrosTrayecto} km con pasajeros, ${kilometrosPosicionamiento} km de posicionamiento, y ${horasServicio} horas,
en un vehículo de ${tipoVehiculo} plazas.

Costes por km:       ${costeKmTotal.toFixed(2)} euros
Costes por hora:     ${costeHoraTotal.toFixed(2)} euros
Costes generales:    ${costesGenerales.toFixed(2)} euros

Costes totales del servicio:

Costes/km:           ${costeKmTotal.toFixed(2)} euros x ${totalKilometros} km
Costes/hora:         ${costeHoraTotal.toFixed(2)} euros x ${horasServicio} horas
Costes generales:    ${costesGenerales.toFixed(2)} euros
-------
TOTAL:               ${costeTotal.toFixed(2)} euros
---------------------------------------
        `;

        navigator.clipboard.writeText(texto)
            .then(() => alert('Texto copiado al portapapeles'))
            .catch(err => console.error('Error al copiar: ', err));
    };

    const copiarGrafico = () => {
        if (!graficoRef.current) return;
        alert('Funcionalidad de copiar gráfico no implementada aún');
    };

    const imprimir = () => {
        window.print();
    };

    const nuevoCalculo = () => {
        window.location.reload();
    };

    return (
        <div className="print:shadow-none mx-auto max-w-[1000px] bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
            <div className="bg-gray-100 px-4 py-2 font-semibold border-b border-gray-300">
                Resultados
            </div>
            <div className="flex flex-col md:flex-row">
                {/* Columna izquierda - Resultados de texto */}
                <div
                    ref={resultadosRef}
                    className="w-full md:w-1/2 p-5 md:border-r border-gray-300"
                >
                    <div className="font-semibold mb-3">Resultado del cálculo de costes</div>

                    <div className="text-sm mb-4 border-b border-dashed border-gray-300 pb-2">
                        <p>Costes unitarios por vehículo</p>
                        <p>calculados para un servicio de:</p>
                        <p>{kilometrosTrayecto} km con pasajeros, {kilometrosPosicionamiento} km de posicionamiento, y {horasServicio} horas,</p>
                        <p>en un vehículo de {tipoVehiculo} plazas.</p>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between mb-1">
                            <span>Costes por km:</span>
                            <span>{costeKmTotal.toFixed(2)} euros</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span>Costes por hora:</span>
                            <span>{costeHoraTotal.toFixed(2)} euros</span>
                        </div>
                        <div className="flex justify-between mb-4 border-b border-dashed border-gray-300 pb-2">
                            <span>Costes generales:</span>
                            <span>{costesGenerales.toFixed(2)} euros</span>
                        </div>

                        <div className="font-semibold mb-2">Costes totales del servicio:</div>

                        <div className="flex justify-between mb-1">
                            <span>Costes/km:</span>
                            <span>{costeKmTotal.toFixed(2)} euros x {totalKilometros} km</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span>Costes/hora:</span>
                            <span>{costeHoraTotal.toFixed(2)} euros x {horasServicio} horas</span>
                        </div>
                        <div className="flex justify-between mb-1 border-b border-dashed border-gray-300 pb-2">
                            <span>Costes generales:</span>
                            <span>{costesGenerales.toFixed(2)} euros</span>
                        </div>

                        <div className="flex justify-between font-bold mt-2">
                            <span>TOTAL:</span>
                            <span>{costeTotal.toFixed(2)} euros</span>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-dashed border-gray-300 pt-2"></div>
                </div>

                {/* Columna derecha - Gráfico */}
                <div
                    ref={graficoRef}
                    className="w-full md:w-1/2 p-5 flex flex-col"
                >
                    <div className="text-center text-blue-700 font-semibold mb-4">
                        <a href="#" className="underline hover:text-blue-800">Distribución de costes</a>
                    </div>

                    {/* Gráfico de tipo pie */}
                    <div className="flex-grow flex items-center justify-center">
                        <div className="text-center">
                            {/* Gráfico más simple que coincide exactamente con la imagen de referencia */}
                            <svg viewBox="0 0 200 200" className="w-56 h-56 mx-auto mb-4">
                                {/* Dibujamos un círculo con sectores planos */}
                                <circle cx="100" cy="100" r="80" fill="white" stroke="#ccc" strokeWidth="1" />
                                
                                {/* Sectores del gráfico según porcentajes exactos */}
                                {/* Utilizamos los cálculos de coordenadas polares para dibujar los sectores */}
                                <path 
                                    d={`M 100 100 
                                        L 100 20 
                                        A 80 80 0 ${porcKilometricos > 50 ? 1 : 0} 1 
                                        ${100 + 80 * Math.cos(svgAngleStart + (porcKilometricos / 100) * Math.PI * 2)} 
                                        ${100 + 80 * Math.sin(svgAngleStart + (porcKilometricos / 100) * Math.PI * 2)} 
                                        Z`}
                                    fill="#FF0000" 
                                    stroke="white" 
                                    strokeWidth="1"
                                />
                                <path 
                                    d={`M 100 100 
                                        L ${100 + 80 * Math.cos(svgAngleStart + (porcKilometricos / 100) * Math.PI * 2)} 
                                        ${100 + 80 * Math.sin(svgAngleStart + (porcKilometricos / 100) * Math.PI * 2)} 
                                        A 80 80 0 ${porcHorarios > 50 ? 1 : 0} 1 
                                        ${100 + 80 * Math.cos(svgAngleStart + ((porcKilometricos + porcHorarios) / 100) * Math.PI * 2)} 
                                        ${100 + 80 * Math.sin(svgAngleStart + ((porcKilometricos + porcHorarios) / 100) * Math.PI * 2)} 
                                        Z`}
                                    fill="#00FF00" 
                                    stroke="white" 
                                    strokeWidth="1"
                                />
                                <path 
                                    d={`M 100 100 
                                        L ${100 + 80 * Math.cos(svgAngleStart + ((porcKilometricos + porcHorarios) / 100) * Math.PI * 2)} 
                                        ${100 + 80 * Math.sin(svgAngleStart + ((porcKilometricos + porcHorarios) / 100) * Math.PI * 2)} 
                                        A 80 80 0 ${porcGenerales > 50 ? 1 : 0} 1 
                                        ${100 + 80 * Math.cos(svgAngleStart + ((porcKilometricos + porcHorarios + porcGenerales) / 100) * Math.PI * 2)} 
                                        ${100 + 80 * Math.sin(svgAngleStart + ((porcKilometricos + porcHorarios + porcGenerales) / 100) * Math.PI * 2)} 
                                        Z`}
                                    fill="#0000FF" 
                                    stroke="white" 
                                    strokeWidth="1"
                                />
                            </svg>

                            <div className="text-center text-blue-700 font-semibold mb-2 mt-4">
                                Distribución de costes
                            </div>
                        </div>
                    </div>

                    {/* Leyenda */}
                    <div className="grid grid-cols-1 gap-y-1 text-sm mt-2 px-6">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#FF0000] mr-2"></div>
                            <span>Kilométricos</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#00FF00] mr-2"></div>
                            <span>Horarios</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#0000FF] mr-2"></div>
                            <span>Generales</span>
                        </div>
                    </div>

                    {/* Botones para copiar */}
                    <div className="mt-6 grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            className="border border-gray-300 bg-gray-100 text-black text-sm"
                            onClick={copiarTexto}
                        >
                            Copiar texto al portapapeles
                        </Button>
                        <Button
                            variant="outline"
                            className="border border-gray-300 bg-gray-100 text-black text-sm"
                            onClick={copiarGrafico}
                        >
                            Copiar gráfico al portapapeles
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        className="border border-gray-300 bg-gray-100 text-black mt-3 w-full border-dashed"
                        onClick={imprimir}
                    >
                        Imprimir
                    </Button>

                    <Button
                        variant="outline"
                        className="border border-gray-300 bg-gray-100 text-black font-semibold mt-3 w-full"
                        onClick={nuevoCalculo}
                    >
                        Nuevo Cálculo
                    </Button>
                </div>
            </div>
        </div>
    );
}