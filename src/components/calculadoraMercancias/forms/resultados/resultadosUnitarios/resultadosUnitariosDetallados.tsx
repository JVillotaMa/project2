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

import { Button } from "@/components/ui/button";

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

    // Estructurar los datos para las tarjetas
    const secciones = [
        {
            titulo: "Costes Fijos",
            colorClass: "from-blue-50 to-white",
            items: [
                { nombre: "Coste Anual Amortización", valor: costesFijos.amortizacionAnual.toFixed(2) + " €" },
                { nombre: "Coste Anual de Financiación", valor: costesFijos.financiacion.toFixed(2) + " €" },
                { nombre: "Coste Fijo Personal", valor: costesFijos.costePersonal.toFixed(2) + " €" },
                { nombre: "Coste Anual de Cargas Fiscales", valor: costesFijos.costeImpuestos.toFixed(2) + " €" },
                { nombre: "Coste Anual Seguros Veh.", valor: costesFijos.costeSeguro.toFixed(2) + " €" },
                { nombre: "Otros Costes Fijos", valor: costesFijos.otrosCostesFijos.toFixed(2) + " €" },
            ],
            total: { nombre: "Costes Fijos Anuales", valor: costesFijos.costeFijoTotal.toFixed(2) + " €" },
            unitarios: [
                { nombre: "Costes Fijos por Km", valor: costesUnitarios.costesKm.fijosPorKm.toFixed(4) + " €/Km" },
                { nombre: "Costes Fijos por Servicio", valor: costesUnitarios.costesServicio.fijosPorServicio.toFixed(2) + " €/Serv" }
            ]
        },
        {
            titulo: "Costes Variables",
            colorClass: "from-green-50 to-white",
            items: [
                { nombre: "Coste Anual Combustible", valor: costesVariables.costeCombustible.toFixed(2) + " €" },
                { nombre: "Coste Anual Dietas", valor: costesVariables.costeDietas.toFixed(2) + " €" },
                { nombre: "Coste Anual Neumáticos", valor: costesVariables.costeNeumaticos.toFixed(2) + " €" },
                { nombre: "Coste Anual Mantenimiento y Rep", valor: costesVariables.costeMantenimiento.toFixed(2) + " €" },
                { nombre: "Coste Anual Peajes", valor: costesVariables.costePeajes.toFixed(2) + " €" }
            ],
            total: { nombre: "Costes Variables Anuales", valor: costesVariables.costeVariableTotal.toFixed(2) + " €" },
            unitarios: [
                { nombre: "Costes Variables por Km", valor: costesUnitarios.costesKm.variablesPorKm.toFixed(4) + " €/Km" },
                { nombre: "Costes Variables por Servicio", valor: costesUnitarios.costesServicio.variablesPorServicio.toFixed(2) + " €/Serv" }
            ]
        },
        {
            titulo: "Costes Directos",
            colorClass: "from-gray-50 to-white",
            total: { nombre: "Costes Directos Anuales", valor: costesDirectos.toFixed(2) + " €" },
            unitarios: [
                { nombre: "Costes Directos por Km", valor: costesUnitarios.costesKm.directosPorKm.toFixed(4) + " €/Km" },
                { nombre: "Costes Directos por Servicios", valor: costesUnitarios.costesServicio.directosPorServicio.toFixed(2) + " €/Serv" }
            ]
        },
        {
            titulo: "Costes Indirectos",
            colorClass: "from-purple-50 to-white",
            total: { nombre: "Costes Indirectos Anuales", valor: costesIndirectos.toFixed(2) + " €" },
            unitarios: [
                { nombre: "Costes Indirectos por Km", valor: costesUnitarios.costesKm.indirectosPorKm.toFixed(4) + " €/Km" },
                { nombre: "Costes Indirectos por Servicios", valor: costesUnitarios.costesServicio.indirectosPorServicio.toFixed(2) + " €/Serv" }
            ]
        },
        {
            titulo: "Costes por Tiempo",
            colorClass: "from-amber-50 to-white",
            unitarios: [
                { nombre: "Costes Fijos Por Días", valor: costesUnitarios.costesTiempo.fijosPorDia.toFixed(2) + " €/Día" },
                { nombre: "Costes Fijos Por Horas", valor: costesUnitarios.costesTiempo.fijosPorHora.toFixed(2) + " €/Hora" }
            ]
        }
    ];

    return(
        <div className="print-container w-full bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 font-sans">
            
            {/* Cabecera con gradiente (solo visible en pantalla) */}
            <div className="bg-gradient-to-r from-primary-700 to-primary-500 text-white p-5 shadow-md no-print">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-black">{tipoVehiculo}</h2>
                    <p className="text-sm opacity-90">Cálculo detallado de costes operativos</p>
                </div>
            </div>
            
            {/* Resumen de datos generales */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Datos operativos
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 resultado-card">
                        <div className="text-sm text-gray-500 mb-1">Kilómetros anuales</div>
                        <div className="text-lg font-semibold">{costesUnitarios.kilometrosAnuales.toLocaleString()} km</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 resultado-card">
                        <div className="text-sm text-gray-500 mb-1">Servicios anuales</div>
                        <div className="text-lg font-semibold">{costesUnitarios.serviciosAnuales.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 resultado-card">
                        <div className="text-sm text-gray-500 mb-1">Días de actividad</div>
                        <div className="text-lg font-semibold">{costesUnitarios.diasActividad.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 resultado-card">
                        <div className="text-sm text-gray-500 mb-1">Horas anuales</div>
                        <div className="text-lg font-semibold">{costesUnitarios.horasAnuales.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Secciones de costes */}
            <div className="p-6">
                <div className="grid grid-cols-1 gap-8">
                    {secciones.map((seccion, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden resultado-card">
                            {/* Cabecera de la sección */}
                            <div className={`bg-gradient-to-r ${seccion.colorClass} p-4 border-b border-gray-200`}>
                                <h4 className="font-medium text-gray-800">{seccion.titulo}</h4>
                            </div>
                            
                            {/* Detalles */}
                            <div className="divide-y divide-gray-100">
                                {/* Elementos individuales */}
                                {seccion.items && seccion.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="p-3 flex justify-between items-center hover:bg-gray-50">
                                        <span className="text-gray-600">{item.nombre}:</span>
                                        <span className="font-medium">{item.valor}</span>
                                    </div>
                                ))}
                                
                                {/* Total */}
                                {seccion.total && (
                                    <div className="p-3 flex justify-between items-center bg-gray-50">
                                        <span className="text-gray-800 font-medium">{seccion.total.nombre}:</span>
                                        <span className="font-bold text-lg">{seccion.total.valor}</span>
                                    </div>
                                )}
                                
                                {/* Costes unitarios */}
                                {seccion.unitarios && seccion.unitarios.map((unitario, unitIndex) => (
                                    <div key={unitIndex} className="p-3 flex justify-between items-center">
                                        <span className="text-gray-600">{unitario.nombre}:</span>
                                        <span className="font-medium">{unitario.valor}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Resumen de costes totales */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Costes totales
                </h3>
                
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 resultado-card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Costes totales anuales</div>
                            <div className="text-2xl font-bold text-gray-800">{costesTotales.toFixed(2)} €</div>
                        </div>
                        <div className="border-l border-gray-200 pl-4 hidden sm:block">
                            <div className="text-sm text-gray-500 mb-1">Costes directos</div>
                            <div className="font-semibold">{costesDirectos.toFixed(2)} € <span className="text-sm text-gray-500">({((costesDirectos/costesTotales)*100).toFixed(1)}%)</span></div>
                        </div>
                        <div className="border-l border-gray-200 pl-4 hidden sm:block">
                            <div className="text-sm text-gray-500 mb-1">Costes indirectos</div>
                            <div className="font-semibold">{costesIndirectos.toFixed(2)} € <span className="text-sm text-gray-500">({((costesIndirectos/costesTotales)*100).toFixed(1)}%)</span></div>
                        </div>
                    </div>
                </div>
            </div>
            
            
        </div>
    );
}