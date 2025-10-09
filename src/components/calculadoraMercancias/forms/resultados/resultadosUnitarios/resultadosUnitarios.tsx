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
import { useVehicleDataContext } from "@/lib/calculadoraMercancias/VehicleDataContext";
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
    
    // Función para imprimir
    const imprimir = () => {
        window.print();
    };

    return (
        <>
            {vistaDetallada ? (
                <div className="flex flex-col">
                    <ResultadosUnitariosDetallados />
                    <div className="p-4 flex justify-center gap-4 print:hidden">
                        <Button
                            onClick={imprimir}
                            className="bg-gray-200 text-black border border-gray-300 hover:bg-gray-300"
                        >
                            Imprimir
                        </Button>
                        <Button
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={() => setVistaDetallada(false)}
                        >
                            Resumen de resultados
                        </Button>
                    </div>
                </div>
            ) : (
                <div ref={resultadosRef} className="print:shadow-none mx-auto max-w-[800px] bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 font-mono text-sm">
                    {/* Cabecera */}
                    <div className="text-center p-2 border-b border-gray-400">
                        <div className="text-lg font-bold">{tipoVehiculo}</div>
                        <div className="border-b border-dashed border-gray-500 mx-auto w-3/4 my-1"></div>
                    </div>
            
            {/* Datos generales */}
            <div className="p-4">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span>Kilometros anuales:</span>
                        <span>{costesUnitarios.kilometrosAnuales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Servicios anuales:</span>
                        <span>{costesUnitarios.serviciosAnuales.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            {/* Costes por kilómetro */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{Array(24).fill('*').join('')} COSTES TOTALES POR KILOMETRO {Array(24).fill('*').join('')}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between">
                    <span>Costes Fijos por Km:</span>
                    <span>{costesUnitarios.costesKm.fijosPorKm.toFixed(4)} €/Km</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Variables por Km:</span>
                    <span>{costesUnitarios.costesKm.variablesPorKm.toFixed(4)} €/Km</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Directos Anuales por Km:</span>
                    <span>{costesUnitarios.costesKm.directosPorKm.toFixed(4)} €/Km</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Indirectos Anuales por Km:</span>
                    <span>{costesUnitarios.costesKm.indirectosPorKm.toFixed(4)} €/Km</span>
                </div>
            </div>
            
            {/* Costes por servicio */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{Array(24).fill('*').join('')} COSTES TOTALES POR SERVICIO {Array(24).fill('*').join('')}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between">
                    <span>Costes Fijos por Servicio:</span>
                    <span>{costesUnitarios.costesServicio.fijosPorServicio.toFixed(2)} €/Serv</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Variables por Servicio:</span>
                    <span>{costesUnitarios.costesServicio.variablesPorServicio.toFixed(2)} €/Serv</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Directos Anuales por Servicio:</span>
                    <span>{costesUnitarios.costesServicio.directosPorServicio.toFixed(2)} €/Serv</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Indirectos Anuales por Servicio:</span>
                    <span>{costesUnitarios.costesServicio.indirectosPorServicio.toFixed(2)} €/Serv</span>
                </div>
            </div>
            
            {/* Costes por tiempo */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{Array(24).fill('*').join('')} COSTES POR TIEMPO {Array(24).fill('*').join('')}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between">
                    <span>Costes Fijos Por Días:</span>
                    <span>{costesUnitarios.costesTiempo.fijosPorDia.toFixed(2)} €/Día</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Fijos Por Horas:</span>
                    <span>{costesUnitarios.costesTiempo.fijosPorHora.toFixed(2)} €/Hora</span>
                </div>
            </div>
            
            {/* Botones para acciones */}
            <div className="p-4 flex justify-center gap-4 print:hidden">
                <Button
                    onClick={imprimir}
                    className="bg-gray-200 text-black border border-gray-300 hover:bg-gray-300"
                >
                    Imprimir
                </Button>
                <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => setVistaDetallada(true)}
                >
                    Cálculo Detallado
                </Button>
                <Button
                    className="bg-green-500 text-white hover:bg-green-600"
                >
                    Resumen de resultados
                </Button>
            </div>
        </div>
            )}
        </>
    );
}