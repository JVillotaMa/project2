import {
    costeAnualAmortizacion,
    precioNeto,
    costeAnualFinanciacion,
    costeFijoPersonal,
    costeFijoImpuestos,
    costeFijoSeguro,
    costeVariableCombustible,
    costeVariableDietas,
    costeVariableNeumaticos,
    costeVariableMantenimiento,
    costeVariablePeajes
} from '../calculos'
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import ResultadosUnitariosDetallados from "./resultadosUnitariosDetallados";

export default function ResultadosUnitarios(){
    const { formData } = useMercanciasForm();
    const resultadosRef = useRef<HTMLDivElement>(null);
    const [vistaDetallada, setVistaDetallada] = useState(false);
    
    // Calcular costes fijos anuales
    function calcularCostesFijos() {
        const precioNetoCabezaTractora = precioNeto(formData.precioVentaSinIvaCabezaTractora!, formData.descuentoMedioSobreTarifaCabezaTractora!)
        const precioNetoSemiRemolque = precioNeto(formData.precioVentaSinIvaRemolque!, formData.descuentoMedioSobreTarifaRemolque!)
        const precioTotal = precioNetoCabezaTractora + precioNetoSemiRemolque
        const amortizacionAnual = costeAnualAmortizacion(
            precioNetoCabezaTractora,
            formData.valorResidualPorcentajeCabezaTractora!,
            formData.periodoAmortizacionCabezaTractora!,
            precioNetoSemiRemolque,
            formData.valorResidualPorcentajeRemolque!,
            formData.periodoAmortizacionRemolque!
        )
        const financiacion = costeAnualFinanciacion(formData.cuantiaAFinanciar!/100 * precioTotal, formData.tipoInteresAnual!, formData.periodoAFinanciar!)
        const costePersonal = costeFijoPersonal(formData.salarioBrutoAnual!, formData.seguridadSocialPorcentaje!, formData.plusDeAsistencia!)
        const costeImpuestos = costeFijoImpuestos(formData.visadoAutorizacion!, formData.impuestoVehiculoTraccion!, formData.costeItv!, formData.costeIAE!, formData.costeTacografo!,formData.costeAtp!, formData.costeAdr!)
        const costeSeguro = costeFijoSeguro(formData.responsabilidadCivil!, formData.seguroMercancia!, formData.costeSeguroAnual!)
        const otrosCostesFijos = formData.otrosCostesFijos || 0

        return {
            amortizacionAnual,
            financiacion,
            costePersonal,
            costeImpuestos,
            costeSeguro,
            otrosCostesFijos,
            costeFijoTotal: amortizacionAnual + financiacion + costePersonal + costeImpuestos + costeSeguro + otrosCostesFijos
        }
    }

    // Calcular costes variables anuales
    function calcularCostesVariables() {
        const costeCombustible = costeVariableCombustible(formData.kilometrajeAnual!, formData.consumoMedioVehiculo100km!, formData.precioBrutoGasoleoSinIva!, formData.descuentoMedioConbustible!)
        const costeDietas = costeVariableDietas(formData.dietaMedia!, formData.numeroDias!)
        const costeNeumaticos = costeVariableNeumaticos(formData.kilometrajeAnual!, formData.numeroTotalNeumaticos!, formData.precioBrutoNeumaticos!, formData.descuentoMedioNeumaticos!, formData.duracionMediaNeumaticosKm!)
        const costeMantenimiento = costeVariableMantenimiento(formData.kilometrajeAnual!, formData.costeAnualMantenimiento!)
        const serviciosAnuales = formData.serviciosDiariosPorVehiculo! * formData.diasDeActividad!
        const costePeajes = costeVariablePeajes(serviciosAnuales, formData.costeMedioPeajesPorServicio!, formData.porcentajeServiciosConPeaje!)
        return {
            costeCombustible,
            costeDietas,
            costeNeumaticos,
            costeMantenimiento,
            costePeajes,
            costeVariableTotal: costeCombustible + costeDietas + costeNeumaticos + costeMantenimiento + costePeajes
        }
    }

    // Calcular costes indirectos
    function calcularCostesIndirectos() {
        return formData.costesIndirectos!;
    }

    // Calcular costes unitarios
    function calcularCostesUnitarios() {
        const costesFijos = calcularCostesFijos();
        const costesVariables = calcularCostesVariables();
        const costesIndirectos = calcularCostesIndirectos();
        
        // Obtener datos generales
        const kilometrosAnuales = formData.kilometrajeAnual!;
        const serviciosAnuales = formData.serviciosDiariosPorVehiculo! * formData.diasDeActividad!;
        const horasAnuales = formData.horasAnualesTrabajadas!;
        const diasActividad = formData.diasDeActividad!;
        
        // Costes por kilómetro
        const costesFijosPorKm = costesFijos.costeFijoTotal / kilometrosAnuales;
        const costesVariablesPorKm = costesVariables.costeVariableTotal / kilometrosAnuales;
        const costesDirectosPorKm = costesFijosPorKm + costesVariablesPorKm;
        const costesIndirectosPorKm = costesIndirectos / kilometrosAnuales;
        
        // Costes por servicio
        const kmPorServicio = kilometrosAnuales / serviciosAnuales;
        const costesFijosPorServicio = costesFijosPorKm * kmPorServicio;
        const costesVariablesPorServicio = costesVariablesPorKm * kmPorServicio;
        const costesDirectosPorServicio = costesDirectosPorKm * kmPorServicio;
        const costesIndirectosPorServicio = costesIndirectosPorKm * kmPorServicio;
        
        // Costes por tiempo
        const costesFijosPorDia = costesFijos.costeFijoTotal / diasActividad;
        const costesFijosPorHora = costesFijos.costeFijoTotal / horasAnuales;
        
        return {
            kilometrosAnuales,
            serviciosAnuales,
            horasAnuales,
            diasActividad,
            costesKm: {
                fijosPorKm: costesFijosPorKm,
                variablesPorKm: costesVariablesPorKm,
                directosPorKm: costesDirectosPorKm,
                indirectosPorKm: costesIndirectosPorKm
            },
            costesServicio: {
                fijosPorServicio: costesFijosPorServicio,
                variablesPorServicio: costesVariablesPorServicio,
                directosPorServicio: costesDirectosPorServicio,
                indirectosPorServicio: costesIndirectosPorServicio
            },
            costesTiempo: {
                fijosPorDia: costesFijosPorDia,
                fijosPorHora: costesFijosPorHora
            }
        };
    }

    // Obtener la información del vehículo
    const tipoVehiculo = formData.tipoVehiculo!;
    
    // Calcular todos los costes unitarios
    const costesUnitarios = calcularCostesUnitarios();
    
    // Datos principales para mostrar en tarjetas
    const datosPrincipales = [
        { 
            titulo: "Costes por Km", 
            valor: costesUnitarios.costesKm.directosPorKm.toFixed(4) + " €/km",
            descripcion: "Costes directos por kilómetro" 
        },
        { 
            titulo: "Costes por Servicio", 
            valor: costesUnitarios.costesServicio.directosPorServicio.toFixed(2) + " €/serv",
            descripcion: "Costes directos por servicio" 
        },
        { 
            titulo: "Costes por Día", 
            valor: costesUnitarios.costesTiempo.fijosPorDia.toFixed(2) + " €/día",
            descripcion: "Costes fijos por día de actividad" 
        }
    ];

    return (
        <>
            {vistaDetallada ? (
                <div className="flex flex-col">
                    <ResultadosUnitariosDetallados />
                    <div className="p-4 flex justify-center gap-4 no-print">
                        <Button
                            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md transition-all"
                            onClick={() => setVistaDetallada(false)}
                        >
                            Resumen de resultados
                        </Button>
                    </div>
                </div>
            ) : (
                <div ref={resultadosRef} className="print-container bg-white rounded-lg overflow-hidden font-sans w-full">
                    
                    {/* Cabecera con gradiente (visible solo en pantalla) */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-400 text-white p-4 shadow-md no-print">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-black">{tipoVehiculo}</h2>
                        </div>
                    </div>
            
                    {/* Datos generales en tarjetas */}
                    <div className="p-6 bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Datos generales</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Kilómetros anuales:</span>
                                    <span className="font-medium">{costesUnitarios.kilometrosAnuales.toLocaleString()} km</span>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Servicios anuales:</span>
                                    <span className="font-medium">{costesUnitarios.serviciosAnuales.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Tarjetas de datos principales */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {datosPrincipales.map((dato, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden resultado-card">
                                    <div className="bg-gradient-to-r from-primary-50 to-white p-3 border-b border-gray-200">
                                        <h4 className="font-medium text-primary-800">{dato.titulo}</h4>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-2xl font-bold text-gray-800">{dato.valor}</div>
                                        <div className="text-sm text-gray-500 mt-1">{dato.descripcion}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            
                    {/* Sección de costes detallados */}
                    <div className="p-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Costes detallados</h3>
                        
                        {/* Costes por kilómetro */}
                        <div className="mb-6 resultado-card">
                            <div className="bg-gray-50 p-3 rounded-t-lg border border-gray-200 mb-1">
                                <h4 className="font-medium text-gray-700">Costes por kilómetro</h4>
                            </div>
                            <div className="bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200">
                                <div className="divide-y divide-gray-200">
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">Costes Fijos por Km:</span>
                                        <span className="font-medium">{costesUnitarios.costesKm.fijosPorKm.toFixed(4)} €/Km</span>
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">Costes Variables por Km:</span>
                                        <span className="font-medium">{costesUnitarios.costesKm.variablesPorKm.toFixed(4)} €/Km</span>
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">Costes Directos Anuales por Km:</span>
                                        <span className="font-medium">{costesUnitarios.costesKm.directosPorKm.toFixed(4)} €/Km</span>
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">Costes Indirectos Anuales por Km:</span>
                                        <span className="font-medium">{costesUnitarios.costesKm.indirectosPorKm.toFixed(4)} €/Km</span>
                                    </div>
                                </div>
                            </div>
                        </div>
            
                        {/* Costes por servicio */}
                        <div className="mb-6 resultado-card">
                            <div className="bg-gray-50 p-3 rounded-t-lg border border-gray-200 mb-1">
                                <h4 className="font-medium text-gray-700">Costes por servicio</h4>
                            </div>
                            <div className="bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200">
                                <div className="divide-y divide-gray-200">
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">Costes Fijos por Servicio:</span>
                                        <span className="font-medium">{costesUnitarios.costesServicio.fijosPorServicio.toFixed(2)} €/Serv</span>
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">Costes Variables por Servicio:</span>
                                        <span className="font-medium">{costesUnitarios.costesServicio.variablesPorServicio.toFixed(2)} €/Serv</span>
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">Costes Directos por Servicio:</span>
                                        <span className="font-medium">{costesUnitarios.costesServicio.directosPorServicio.toFixed(2)} €/Serv</span>
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">Costes Indirectos por Servicio:</span>
                                        <span className="font-medium">{costesUnitarios.costesServicio.indirectosPorServicio.toFixed(2)} €/Serv</span>
                                    </div>
                                </div>
                            </div>
                        </div>
            
                        {/* Costes por tiempo */}
                        <div className="resultado-card">
                            <div className="bg-gray-50 p-3 rounded-t-lg border border-gray-200 mb-1">
                                <h4 className="font-medium text-gray-700">Costes por tiempo</h4>
                            </div>
                            <div className="bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200">
                                <div className="divide-y divide-gray-200">
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">Costes Fijos Por Días:</span>
                                        <span className="font-medium">{costesUnitarios.costesTiempo.fijosPorDia.toFixed(2)} €/Día</span>
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">Costes Fijos Por Horas:</span>
                                        <span className="font-medium">{costesUnitarios.costesTiempo.fijosPorHora.toFixed(2)} €/Hora</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    {/* Botones para acciones */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-center items-center gap-4 no-print">
                        <Button
                            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md transition-all w-full md:w-auto"
                            onClick={() => setVistaDetallada(true)}
                        >
                            Cálculo Detallado
                        </Button>
                    </div>

                </div>
            )}
        </>
    );
}