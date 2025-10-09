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
import { useRef } from 'react';


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
    
    // Función para imprimir
    const imprimir = () => {
        window.print();
    };

    return (
        <div ref={resultadosRef} className="print:shadow-none mx-auto max-w-[800px] bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 font-mono text-sm">
            {/* Cabecera */}
            <div className="text-center p-2 border-b border-gray-400">
                <div className="text-lg font-bold">{tipoVehiculo}</div>
                <div className="border-b border-dashed border-gray-500 mx-auto w-3/4 my-1"></div>
            </div>
            
            {/* Título y descripción del servicio */}
            <div className="p-4">
                <div className="font-bold">Resultado del cálculo de costes</div>
                <div className="mt-2">
                    Costes calculados para un servicio de<br />
                    {kilometrosServicio} kilómetros y {horasServicio} horas
                </div>
            </div>
            
            {/* Costes fijos */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{Array(24).fill('*').join('')} COSTES FIJOS {Array(24).fill('*').join('')}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between">
                    <span>Amortización:</span>
                    <span>{desglose.fijos.amortizacion.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Financiación:</span>
                    <span>{desglose.fijos.financiacion.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Personal:</span>
                    <span>{desglose.fijos.personal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Cargas fiscales:</span>
                    <span>{desglose.fijos.impuestos.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Seguros Vehículo:</span>
                    <span>{desglose.fijos.seguro.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Otros Gastos Fijos:</span>
                    <span>{desglose.fijos.otrosCostesFijos.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total Costes Fijos:</span>
                    <span>{desglose.fijos.totalFijos.toFixed(2)} €</span>
                </div>
            </div>
            
            {/* Costes variables */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{Array(24).fill('*').join('')} COSTES VARIABLES {Array(24).fill('*').join('')}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between">
                    <span>Coste Anual Combustible:</span>
                    <span>{desglose.variables.combustible.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual Dietas:</span>
                    <span>{desglose.variables.dietas.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual Neumáticos:</span>
                    <span>{desglose.variables.neumaticos.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual Mantenimiento y Rep:</span>
                    <span>{desglose.variables.mantenimiento.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual Peajes:</span>
                    <span>{desglose.variables.peajes.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total Costes Variables:</span>
                    <span>{desglose.variables.totalVariables.toFixed(2)} €</span>
                </div>
            </div>
            
            {/* Costes directos */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{Array(24).fill('*').join('')} COSTES DIRECTOS {Array(24).fill('*').join('')}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between font-bold">
                    <span>Total Costes Directos del Servicio:</span>
                    <span>{costesPorServicio.costeTotalDirectoServicio.toFixed(2)} €</span>
                </div>
            </div>
            
            {/* Costes indirectos */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{Array(24).fill('*').join('')} COSTES INDIRECTOS {Array(24).fill('*').join('')}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between">
                    <span>Costes Indirectos:</span>
                    <span>{costesPorServicio.costeIndirectoServicio.toFixed(2)} €</span>
                </div>
            </div>
            
            {/* Costes totales */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{Array(24).fill('*').join('')} COSTES TOTALES {Array(24).fill('*').join('')}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between font-bold">
                    <span>Costes Totales:</span>
                    <span>{costesPorServicio.costeTotalServicio.toFixed(2)} €</span>
                </div>
            </div>
            
            {/* Botón de imprimir */}
            <div className="p-4 flex justify-center print:hidden">
                <Button
                    onClick={imprimir}
                    className="bg-gray-200 text-black border border-gray-300 hover:bg-gray-300"
                >
                    Imprimir
                </Button>
            </div>
        </div>
    );
}