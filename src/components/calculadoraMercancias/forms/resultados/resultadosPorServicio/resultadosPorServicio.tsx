'use client'
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
import { useRef } from 'react';
import { Button } from "@/components/ui/button";


export default function ResultadosPorServicio({ horasServicio, kilometrosServicio }: { horasServicio: number, kilometrosServicio: number }) {
    const { formData } = useMercanciasForm();
    const resultadosRef = useRef<HTMLDivElement>(null);
    
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
        // Verificamos si existe la propiedad costesIndirectos en formData
        // Si no existe, usamos 0 como valor predeterminado
        return formData.costesIndirectos !== undefined ? formData.costesIndirectos : 0;
    }
    
    // Calcular costes para este servicio específico
    function calcularCostesPorServicio() {
        const costesFijos = calcularCostesFijos();
        const costesVariables = calcularCostesVariables();
        const costesIndirectos = calcularCostesIndirectos();
        
        // Obtener horas y kilómetros anuales del vehículo
        const horasAnuales = formData.diasDeActividad ? formData.diasDeActividad * 8 : 1800; // Calculado o por defecto
        const kilometrosAnuales = formData.kilometrajeAnual || 120000; // Valor por defecto si no está definido
        
        // Calcular costes por hora y por kilómetro
        const costeFijoHora = costesFijos.costeFijoTotal / horasAnuales;
        const costeVariableKm = costesVariables.costeVariableTotal / kilometrosAnuales;
        
        // Calcular costes para este servicio específico
        const costeFijoServicio = costeFijoHora * horasServicio;
        const costeVariableServicio = costeVariableKm * kilometrosServicio;
        
        // Calcular coste total directo del servicio
        const costeTotalDirectoServicio = costeFijoServicio + costeVariableServicio;
        
        // Costes indirectos es un valor absoluto, no un porcentaje
        const costeIndirectoServicio = costesIndirectos;
        
        // Calcular coste total del servicio
        const costeTotalServicio = costeTotalDirectoServicio + costeIndirectoServicio;
        
        return {
            costeFijoHora,
            costeVariableKm,
            costeFijoServicio,
            costeVariableServicio,
            costeTotalDirectoServicio,
            costeIndirectoServicio,
            costeTotalServicio,
            desgloseCostes: {
                fijos: {
                    amortizacion: (costesFijos.amortizacionAnual / horasAnuales) * horasServicio,
                    financiacion: (costesFijos.financiacion / horasAnuales) * horasServicio,
                    personal: (costesFijos.costePersonal / horasAnuales) * horasServicio,
                    impuestos: (costesFijos.costeImpuestos / horasAnuales) * horasServicio,
                    seguro: (costesFijos.costeSeguro / horasAnuales) * horasServicio,
                    otrosCostesFijos: (costesFijos.otrosCostesFijos / horasAnuales) * horasServicio,
                    totalFijos: costeFijoServicio
                },
                variables: {
                    combustible: (costesVariables.costeCombustible / kilometrosAnuales) * kilometrosServicio,
                    dietas: (costesVariables.costeDietas / kilometrosAnuales) * kilometrosServicio,
                    neumaticos: (costesVariables.costeNeumaticos / kilometrosAnuales) * kilometrosServicio,
                    mantenimiento: (costesVariables.costeMantenimiento / kilometrosAnuales) * kilometrosServicio,
                    peajes: (costesVariables.costePeajes / kilometrosAnuales) * kilometrosServicio,
                    totalVariables: costeVariableServicio
                }
            }
        };
    }

    // Obtener la información del vehículo desde formData
    const tipoVehiculo = formData.tipoVehiculo! // Usar el nombre guardado o valor por defecto
    
    // Calcular todos los costes para el servicio
    const costesPorServicio = calcularCostesPorServicio();
    const desglose = costesPorServicio.desgloseCostes;

    return (
        <div ref={resultadosRef} className="print-container w-full bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 font-sans">
            {/* Cabecera para impresión */}
            
            {/* Cabecera con gradiente (visible solo en pantalla) */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-400 text-white p-4 shadow-md no-print">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-black">{tipoVehiculo}</h2>
                </div>
            </div>
            
            {/* Título y descripción del servicio */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Datos del servicio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 resultado-card">
                        <div className="text-sm text-gray-500 mb-1">Kilómetros</div>
                        <div className="text-lg font-semibold">{kilometrosServicio} km</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 resultado-card">
                        <div className="text-sm text-gray-500 mb-1">Horas</div>
                        <div className="text-lg font-semibold">{horasServicio} h</div>
                    </div>
                </div>
            </div>
            
            {/* Secciones de costes */}
            <div className="p-6">
                <div className="grid grid-cols-1 gap-8">
                    {/* Costes fijos */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden resultado-card">
                        <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b border-gray-200">
                            <h4 className="font-medium text-gray-800">Costes Fijos</h4>
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Amortización:</span>
                                <span className="font-medium">{desglose.fijos.amortizacion.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Financiación:</span>
                                <span className="font-medium">{desglose.fijos.financiacion.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Personal:</span>
                                <span className="font-medium">{desglose.fijos.personal.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Cargas fiscales:</span>
                                <span className="font-medium">{desglose.fijos.impuestos.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Seguros Vehículo:</span>
                                <span className="font-medium">{desglose.fijos.seguro.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Otros Gastos Fijos:</span>
                                <span className="font-medium">{desglose.fijos.otrosCostesFijos.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center bg-gray-50">
                                <span className="text-gray-800 font-medium">Total Costes Fijos:</span>
                                <span className="font-bold text-lg">{desglose.fijos.totalFijos.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Costes variables */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden resultado-card">
                        <div className="bg-gradient-to-r from-green-50 to-white p-4 border-b border-gray-200">
                            <h4 className="font-medium text-gray-800">Costes Variables</h4>
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Combustible:</span>
                                <span className="font-medium">{desglose.variables.combustible.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Dietas:</span>
                                <span className="font-medium">{desglose.variables.dietas.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Neumáticos:</span>
                                <span className="font-medium">{desglose.variables.neumaticos.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Mantenimiento y Reparaciones:</span>
                                <span className="font-medium">{desglose.variables.mantenimiento.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-600">Peajes:</span>
                                <span className="font-medium">{desglose.variables.peajes.toFixed(2)} €</span>
                            </div>
                            <div className="p-3 flex justify-between items-center bg-gray-50">
                                <span className="text-gray-800 font-medium">Total Costes Variables:</span>
                                <span className="font-bold text-lg">{desglose.variables.totalVariables.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Costes directos e indirectos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden resultado-card">
                            <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-200">
                                <h4 className="font-medium text-gray-800">Costes Directos</h4>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <span className="text-gray-800 font-medium">Total Costes Directos:</span>
                                <span className="font-bold text-lg">{costesPorServicio.costeTotalDirectoServicio.toFixed(2)} €</span>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden resultado-card">
                            <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-gray-200">
                                <h4 className="font-medium text-gray-800">Costes Indirectos</h4>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <span className="text-gray-600">Costes Indirectos:</span>
                                <span className="font-medium">{costesPorServicio.costeIndirectoServicio.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Costes totales */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Costes Totales</h3>
                
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 resultado-card">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-sm text-gray-500 mb-2 sm:mb-0">Coste total del servicio</div>
                        <div className="text-2xl font-bold text-gray-800">{costesPorServicio.costeTotalServicio.toFixed(2)} €</div>
                    </div>
                </div>
            </div>
            
            {/* Botón de imprimir y opciones */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-center items-center gap-4 no-print">
                <Button
                    variant="outline"
                    className="border border-gray-300 bg-gray-100 text-black w-full md:w-auto"
                    onClick={() => window.location.reload()}
                >
                    Nuevo Cálculo
                </Button>
            </div>

        </div>
    );
}
