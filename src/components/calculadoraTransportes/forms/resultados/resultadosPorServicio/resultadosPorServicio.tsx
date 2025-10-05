'use client'

import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import SectionContainer from '@/components/shared/form/sectionContainer'
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
interface ResultadosPorServicioProps {
    kilometrosTrayecto?: number;
    kilometrosPosicionamiento?: number;
    horasServicio?: number;
}

export default function ResultadosPorServicio({
    kilometrosTrayecto = 1,
    kilometrosPosicionamiento = 0,
    horasServicio = 1
}: ResultadosPorServicioProps) {
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
    
    // Calcular costes del servicio
    const costesServicio = costesPorServicio(
        costesPorKm.combustible,
        costesPorKm.mantenimiento,
        costesPorKm.neumaticos,
        costesPorHora.personal,
        costesPorHora.seguros,
        costesPorHora.amortizacion,
        costesPorHora.financiacion,
        kilometrosTrayecto,
        kilometrosPosicionamiento,
        horasServicio,
        costesGeneralesPorc
    );

    // Totales por categoría (para el gráfico)
    const totalKilometricos = costesServicio.costeTotalCombustible + 
                              costesServicio.costeTotalMantenimiento + 
                              costesServicio.costeTotalNeumaticos;
    
    const totalHorarios = costesServicio.costeTotalAmortizacion + 
                          costesServicio.costeTotalFinanciacion + 
                          costesServicio.costeTotalConductor + 
                          costesServicio.costeTotalSeguro;
    
    const totalGenerales = costesServicio.costeTotalServicio - 
                           (totalKilometricos + totalHorarios);

    // Calcular porcentajes para el gráfico
    const total = costesServicio.costeTotalServicio;
    const porcKilometricos = total > 0 ? (totalKilometricos / total) * 100 : 0;
    const porcHorarios = total > 0 ? (totalHorarios / total) * 100 : 0;
    const porcGenerales = total > 0 ? (totalGenerales / total) * 100 : 0;

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
COVIMAD ${currentYear}
Resultado del cálculo de costes
---------------------------------------
Costes unitarios por vehículo
calculados para un servicio de:
${kilometrosTrayecto} km con pasajeros, ${kilometrosPosicionamiento} km de posicionamiento, y ${horasServicio} horas,
en un vehículo de ${tipoVehiculo} plazas.

Costes por km:      ${costeKmTotal.toFixed(2)} euros
Costes por hora:    ${costeHoraTotal.toFixed(2)} euros
Costes generales:   ${costesGeneralesPorc.toFixed(2)} euros

Costes totales del servicio:
Costes/km:          ${costeKmTotal.toFixed(2)} euros x ${kilometrosTrayecto} km
Costes/hora:        ${costeHoraTotal.toFixed(2)} euros x ${horasServicio} horas
Costes generales:   ${totalGenerales.toFixed(2)} euros

TOTAL:              ${costesServicio.costeTotalServicio.toFixed(2)} euros
---------------------------------------
        `;
        
        navigator.clipboard.writeText(texto)
            .then(() => alert('Texto copiado al portapapeles'))
            .catch(err => console.error('Error al copiar: ', err));
    };
    
    const copiarGrafico = () => {
        if (!graficoRef.current) return;
        
        // Aquí deberías usar una librería como html2canvas para capturar el gráfico
        // Pero para simplificar, solo mostraremos un mensaje
        alert('Funcionalidad de copiar gráfico no implementada aún');
    };
    
    const imprimir = () => {
        window.print();
    };
    
    const nuevoCalculo = () => {
        // Aquí iría la lógica para reiniciar el cálculo
        window.location.reload();
    };
    
    return (
        <div className="print:shadow-none mx-auto max-w-[1000px] bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
            <div className="flex flex-col md:flex-row">
                {/* Columna izquierda - Resultados de texto */}
                <div 
                    ref={resultadosRef} 
                    className="w-full md:w-1/2 p-5 md:border-r border-gray-300"
                >
                    <div className="font-semibold mb-2">COVIMAD {currentYear}</div>
                    <div className="font-semibold mb-3">Resultado del cálculo de costes</div>
                    
                    <div className="text-sm mb-4 border-b border-dashed border-gray-300 pb-2">
                        <p>Costes unitarios por vehículo</p>
                        <p>calculados para un servicio de:</p>
                        <p>{kilometrosTrayecto} km con pasajeros, {kilometrosPosicionamiento} km de posicionamiento, y {horasServicio} horas,</p>
                        <p>en un vehículo de {tipoVehiculo} plazas.</p>
                    </div>
                    
                    <div className="mb-4">
                        <div className="flex justify-between">
                            <span>Costes por km:</span>
                            <span>{costeKmTotal.toFixed(2)} euros</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Costes por hora:</span>
                            <span>{costeHoraTotal.toFixed(2)} euros</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Costes generales:</span>
                            <span>{costesGeneralesPorc.toFixed(2)} euros</span>
                        </div>
                    </div>
                    
                    <div className="mb-4 text-sm">
                        <div className="font-semibold mb-1">Costes totales del servicio:</div>
                        <div className="flex justify-between">
                            <span>Costes/km:</span>
                            <span>{costeKmTotal.toFixed(2)} euros x {kilometrosTrayecto} km</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Costes/hora:</span>
                            <span>{costeHoraTotal.toFixed(2)} euros x {horasServicio} horas</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Costes generales:</span>
                            <span>{totalGenerales.toFixed(2)} euros</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between font-semibold border-t border-dashed border-gray-300 pt-2">
                        <span>TOTAL:</span>
                        <span>{costesServicio.costeTotalServicio.toFixed(2)} euros</span>
                    </div>
                    
                    <div className="mt-4 border-t border-dashed border-gray-300 pt-2"></div>
                </div>
                
                {/* Columna derecha - Gráfico */}
                <div 
                    ref={graficoRef} 
                    className="w-full md:w-1/2 p-5 flex flex-col"
                >
                    <div className="text-center text-blue-700 font-semibold mb-4">
                        Distribución de costes
                    </div>
                    
                    {/* Gráfico de tipo pie */}
                    <div className="flex-grow flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-48 h-48">
                            {/* Círculo base verde (costes horarios) */}
                            <circle cx="50" cy="50" r="40" fill="#34A853" />

                            {/* Sector para costes kilométricos (rojo) */}
                            <path 
                                d={`M 50 50 
                                   L ${50 + 40 * Math.cos((- 90 + porcHorarios * 3.6) * Math.PI / 180)} 
                                     ${50 + 40 * Math.sin((- 90 + porcHorarios * 3.6) * Math.PI / 180)} 
                                   A 40 40 0 ${porcKilometricos > 50 ? 1 : 0} 1 
                                     ${50 + 40 * Math.cos((- 90 + (porcHorarios + porcKilometricos) * 3.6) * Math.PI / 180)} 
                                     ${50 + 40 * Math.sin((- 90 + (porcHorarios + porcKilometricos) * 3.6) * Math.PI / 180)} 
                                   Z`}
                                fill="#EA4335"
                            />

                            {/* Sector para costes generales (azul) */}
                            <path 
                                d={`M 50 50 
                                   L ${50 + 40 * Math.cos((- 90 + (porcHorarios + porcKilometricos) * 3.6) * Math.PI / 180)} 
                                     ${50 + 40 * Math.sin((- 90 + (porcHorarios + porcKilometricos) * 3.6) * Math.PI / 180)} 
                                   A 40 40 0 ${porcGenerales > 50 ? 1 : 0} 1 
                                     ${50 + 40 * Math.cos((-90) * Math.PI / 180)} 
                                     ${50 + 40 * Math.sin((-90) * Math.PI / 180)} 
                                   Z`}
                                fill="#4285F4"
                            />
                        </svg>
                    </div>
                    
                    {/* Leyenda */}
                    <div className="mt-4 flex flex-col items-start">
                        <div className="flex items-center mb-1">
                            <div className="w-4 h-4 bg-[#EA4335] mr-2"></div>
                            <span>Kilométricos</span>
                        </div>
                        <div className="flex items-center mb-1">
                            <div className="w-4 h-4 bg-[#34A853] mr-2"></div>
                            <span>Horarios</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#4285F4] mr-2"></div>
                            <span>Generales</span>
                        </div>
                    </div>
                    
                    {/* Botones para copiar */}
                    <div className="mt-6 grid grid-cols-1 gap-2">
                        <Button 
                            variant="outline"
                            className="border border-gray-300 bg-gray-100 text-black" 
                            onClick={copiarTexto}
                        >
                            Copiar texto al portapapeles
                        </Button>
                        <Button 
                            variant="outline"
                            className="border border-gray-300 bg-gray-100 text-black" 
                            onClick={copiarGrafico}
                        >
                            Copiar gráfico al portapapeles
                        </Button>
                        <Button 
                            variant="outline"
                            className="border border-gray-300 bg-gray-100 text-black mt-4" 
                            onClick={imprimir}
                        >
                            Imprimir
                        </Button>
                        <Button 
                            variant="outline"
                            className="border border-gray-300 bg-gray-100 text-black font-semibold mt-2" 
                            onClick={nuevoCalculo}
                        >
                            Nuevo Cálculo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}