import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
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
} from '../calculos';
import { Button } from '@/components/ui/button';

export default function ResultadosUnitariosDetallados() {
    const { formData } = useMercanciasForm();

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
        const costeImpuestos = costeFijoImpuestos(formData.visadoAutorizacion!, formData.impuestoVehiculoTraccion!, formData.costeItv!, formData.costeIAE!, formData.costeTacografo!, formData.costeAtp!, formData.costeAdr!)
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

    // Calcular costes unitarios
    function calcularCostesUnitarios() {
        const costesFijos = calcularCostesFijos();
        const costesVariables = calcularCostesVariables();
        const costesIndirectos = formData.costesIndirectos!;
        
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

    const costesFijos = calcularCostesFijos();
    const costesVariables = calcularCostesVariables();
    const costesIndirectos = formData.costesIndirectos!;
    const costesTotales = costesFijos.costeFijoTotal + costesVariables.costeVariableTotal + costesIndirectos;
    const costesUnitarios = calcularCostesUnitarios();
    const costesDirectos = costesFijos.costeFijoTotal + costesVariables.costeVariableTotal;

    // Obtener la información del vehículo
    const tipoVehiculo = formData.tipoVehiculo!;

    return(
        <div className="mx-auto max-w-[800px] bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 font-mono text-sm">
            {/* Cabecera */}
            <div className="text-center p-2 border-b border-gray-400">
                <div className="text-lg font-bold">{tipoVehiculo}</div>
                <div className="border-b border-dashed border-gray-500 mx-auto w-3/4 my-1"></div>
            </div>
            
            {/* Datos generales */}
            <div className="p-2">
                <div className="flex flex-col">
                    <div className="border-b border-dashed border-gray-500 text-center">
                        {"=".repeat(70)}
                    </div>
                    <div className="flex justify-between">
                        <span>Kilómetros anuales:</span>
                        <span>{costesUnitarios.kilometrosAnuales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Servicios anuales:</span>
                        <span>{costesUnitarios.serviciosAnuales.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            {/* Costes Fijos */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{"*".repeat(24)} COSTES FIJOS {"*".repeat(24)}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between">
                    <span>Coste Anual Amortización:</span>
                    <span>{costesFijos.amortizacionAnual.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual de Financiación:</span>
                    <span>{costesFijos.financiacion.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Fijo Personal:</span>
                    <span>{costesFijos.costePersonal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual de Cargas Fiscales:</span>
                    <span>{costesFijos.costeImpuestos.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual Seguros Veh.:</span>
                    <span>{costesFijos.costeSeguro.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Otros Costes Fijos:</span>
                    <span>{costesFijos.otrosCostesFijos.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Costes Fijos Anuales:</span>
                    <span>{costesFijos.costeFijoTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Fijos por Km:</span>
                    <span>{costesUnitarios.costesKm.fijosPorKm.toFixed(4)} €/Km</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Fijos por Servicio (€/Serv):</span>
                    <span>{costesUnitarios.costesServicio.fijosPorServicio.toFixed(2)} €/Serv</span>
                </div>
            </div>
            
            {/* Costes Variables */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{"*".repeat(24)} COSTES VARIABLES {"*".repeat(24)}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between">
                    <span>Coste Anual Combustible:</span>
                    <span>{costesVariables.costeCombustible.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual Dietas:</span>
                    <span>{costesVariables.costeDietas.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual Neumáticos:</span>
                    <span>{costesVariables.costeNeumaticos.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual Mantenimiento y Rep:</span>
                    <span>{costesVariables.costeMantenimiento.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Coste Anual Peajes:</span>
                    <span>{costesVariables.costePeajes.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Costes Variables Anuales:</span>
                    <span>{costesVariables.costeVariableTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Variables por Km:</span>
                    <span>{costesUnitarios.costesKm.variablesPorKm.toFixed(4)} €/Km</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Variables por Servicio:</span>
                    <span>{costesUnitarios.costesServicio.variablesPorServicio.toFixed(2)} €/Serv</span>
                </div>
            </div>
            
            {/* Costes Directos */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{"*".repeat(24)} COSTES DIRECTOS {"*".repeat(24)}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between font-bold">
                    <span>Costes Directos Anuales:</span>
                    <span>{costesDirectos.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Directos por Km:</span>
                    <span>{costesUnitarios.costesKm.directosPorKm.toFixed(4)} €/Km</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Directos por Servicios:</span>
                    <span>{costesUnitarios.costesServicio.directosPorServicio.toFixed(2)} €/Serv</span>
                </div>
            </div>
            
            {/* Costes Indirectos */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{"*".repeat(24)} COSTES INDIRECTOS {"*".repeat(24)}</span>
            </div>
            
            <div className="px-4 py-2">
                <div className="flex justify-between font-bold">
                    <span>Costes Indirectos Anuales:</span>
                    <span>{costesIndirectos.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Indirectos por Km:</span>
                    <span>{costesUnitarios.costesKm.indirectosPorKm.toFixed(4)} €/Km</span>
                </div>
                <div className="flex justify-between">
                    <span>Costes Indirectos por Servicios:</span>
                    <span>{costesUnitarios.costesServicio.indirectosPorServicio.toFixed(2)} €/Serv</span>
                </div>
            </div>
            
            {/* Costes por tiempo */}
            <div className="border-t border-b border-dashed border-gray-500 px-4 py-1 text-center">
                <span>{"*".repeat(24)} COSTES POR TIEMPO {"*".repeat(24)}</span>
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
        </div>
    );
}