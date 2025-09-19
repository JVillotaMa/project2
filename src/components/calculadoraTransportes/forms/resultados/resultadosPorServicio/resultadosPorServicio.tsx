'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

// Colores para los gráficos - Paleta moderna y atractiva
const colores = [
    '#4285F4', '#EA4335', '#FBBC05', '#34A853',
    '#8AB4F8', '#F6AEA9', '#FDE293', '#A8DAB5',
    '#7986CB', '#F06292', '#FFD54F', '#81C784'
]

// Definición de tipos para las props
interface ResultadosPorServicioProps {
    kilometrosTrayecto?: number;
    kilometrosPosicionamiento?: number;
    horasServicio?: number;
}

export default function ResultadosPorServicio({
    kilometrosTrayecto = 100,
    kilometrosPosicionamiento = 20,
    horasServicio = 8
}: ResultadosPorServicioProps) {
    const { formData } = useTransportesForm();
    const { currentBusData } = useTransportDataContext();

    // Usar los datos del servicio recibidos por props
    const servicioData = {
        kilometrosTrayecto,
        kilometrosPosicionamiento,
        horasServicio
    };

    // Cálculo de costes unitarios por km y hora (similar a ResultadosUnitarios)
    const calcularCostesPorKm = () => {
        if (!formData) {
            return { combustible: 0, neumaticos: 0, mantenimiento: 0 };
        }

        const kilometrosAnuales = formData.kilometrosAnuales || 0;
        const costeDelCombustible = formData.costeDelCombustible || 0;
        const costeNeumatico = formData.costeNeumatico || 0;
        const vidaUtilNeumatico = formData.vidaUtilNeumatico || 1;
        const mantenimientoAnual = formData.mantenimientoAnual || 0;
        const numeroNeumaticos = currentBusData && typeof currentBusData['Numero Neumaticos'] === 'number'
            ? currentBusData['Numero Neumaticos']
            : 6;
        
        const consumo = currentBusData["Consumo medio (L)"]
        
        return {
            combustible: costeCombustibleKm(costeDelCombustible, consumo),
            neumaticos: costeNeumaticosKm(costeNeumatico, numeroNeumaticos, vidaUtilNeumatico),
            mantenimiento: kilometrosAnuales > 0 ? costeMantenimientoKm(mantenimientoAnual, kilometrosAnuales) : 0
        };
    };

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

    // Calcular costes por km y hora
    const costesPorKm = calcularCostesPorKm();
    const costesPorHora = calcularCostesPorHora();
    
    // Calcular costes del servicio
    const costesServicio = costesPorServicio(
        costesPorKm.combustible,
        costesPorKm.mantenimiento,
        costesPorKm.neumaticos,
        costesPorHora.personal,
        costesPorHora.seguros,
        costesPorHora.amortizacion,
        costesPorHora.financiacion,
        servicioData.kilometrosTrayecto,
        servicioData.kilometrosPosicionamiento,
        servicioData.horasServicio,
        formData?.costesGenerales || 0
    );

    // Preparar datos para el gráfico
    const totalKilometros = servicioData.kilometrosTrayecto + servicioData.kilometrosPosicionamiento;
    
    // Estructurar datos para el gráfico circular
    const datosGrafico = [
        { nombre: 'Combustible', valor: costesServicio.costeTotalCombustible, color: colores[0] },
        { nombre: 'Mantenimiento', valor: costesServicio.costeTotalMantenimiento, color: colores[1] },
        { nombre: 'Neumáticos', valor: costesServicio.costeTotalNeumaticos, color: colores[2] },
        { nombre: 'Personal', valor: costesServicio.costeTotalConductor, color: colores[3] },
        { nombre: 'Seguros', valor: costesServicio.costeTotalSeguro, color: colores[4] },
        { nombre: 'Amortización', valor: costesServicio.costeTotalAmortizacion, color: colores[5] },
        { nombre: 'Financiación', valor: costesServicio.costeTotalFinanciacion, color: colores[6] }
    ];

    // Calcular el coste total sin costes generales
    const costeTotalSinGenerales = datosGrafico.reduce((total, item) => total + item.valor, 0);

    // Calcular porcentajes
    const datosConPorcentajes = datosGrafico.map(item => ({
        ...item,
        porcentaje: costeTotalSinGenerales > 0 ? Math.round((item.valor / costeTotalSinGenerales) * 100) : 0
    }));

    // Componente para el gráfico circular
    const GraficoCircular = ({ data }: { data: typeof datosConPorcentajes }) => (
        <div className="relative w-full aspect-square max-w-[220px] sm:max-w-[240px] md:max-w-[280px] mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                {data.reduce<React.ReactNode[]>((acc, item, i) => {
                    // Calcular el acumulado anterior
                    let prevTotal = 0;
                    if (i > 0) {
                        prevTotal = data.slice(0, i).reduce((sum, prevItem) => sum + prevItem.porcentaje, 0);
                    }
                    
                    const accumulatedPercentage = prevTotal + item.porcentaje;
                    
                    // Calcular ángulos para el slice
                    const startAngle = (prevTotal / 100) * 360;
                    const endAngle = (accumulatedPercentage / 100) * 360;
                    
                    // Convertir ángulos a coordenadas
                    const startX = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
                    const startY = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
                    const endX = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
                    const endY = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));
                    
                    // Bandera para determinar si el arco es mayor a 180 grados
                    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                    
                    // Crear el path para el slice
                    const path = `
                        M 50 50
                        L ${startX} ${startY}
                        A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}
                        Z
                    `;
                    
                    return [...acc, 
                        <path 
                            key={i} 
                            d={path} 
                            fill={item.color} 
                            stroke="#fff" 
                            strokeWidth="0.7"
                            className="hover:opacity-90 transition-opacity"
                            data-tip={`${item.nombre}: ${item.porcentaje}%`}
                        />
                    ];
                }, [])}
            </svg>
        </div>
    );

    return (
        <div className="space-y-3 sm:space-y-6 mx-auto max-w-full">
            <SectionContainer subSectionTitle="Costes del Servicio">
                <div className="p-1 sm:p-2 md:p-4">
                    <div className="text-center mb-3 text-sm sm:text-base">
                        <p><span className="font-semibold">Servicio: </span>{totalKilometros} km totales ({servicioData.kilometrosTrayecto} km con pasajeros + {servicioData.kilometrosPosicionamiento} km de posicionamiento) durante {servicioData.horasServicio} horas</p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-0 pt-2 sm:pb-1 sm:pt-3">
                                <CardTitle className="text-sm sm:text-base md:text-lg font-medium text-center">
                                    Desglose de Costes del Servicio
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-1 pb-2 px-2 sm:pt-2 sm:pb-3 sm:px-4">
                                <div className="space-y-1 sm:space-y-2">
                                    {datosConPorcentajes.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-0.5 sm:py-1">
                                            <div className="flex items-center">
                                                <span 
                                                    className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1 sm:mr-2 rounded-sm" 
                                                    style={{ backgroundColor: item.color }}
                                                ></span>
                                                <span className="capitalize text-xs sm:text-sm md:text-base">{item.nombre}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 sm:space-x-2">
                                                <span className="font-medium text-xs sm:text-sm md:text-base">{item.valor.toFixed(2)}€</span>
                                                <span className="text-gray-500 text-xs sm:text-sm">({item.porcentaje}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Total final */}
                                    <div className="border-t border-gray-200 mt-1 sm:mt-3 pt-1 sm:pt-3">
                                        <div className="flex items-center justify-between font-bold">
                                            <span className="text-xs sm:text-sm md:text-base">SUBTOTAL</span>
                                            <span className="text-xs sm:text-sm md:text-base">{costeTotalSinGenerales.toFixed(2)}€</span>
                                        </div>
                                    </div>
                                    
                                    {/* Costes generales */}
                                    <div className="flex items-center justify-between text-gray-700">
                                        <span className="text-xs sm:text-sm md:text-base">Costes generales ({formData?.costesGenerales || 0}%)</span>
                                        <span className="text-xs sm:text-sm md:text-base">{(costesServicio.costeTotalServicio - costeTotalSinGenerales).toFixed(2)}€</span>
                                    </div>
                                    
                                    {/* Total con costes generales */}
                                    <div className="border-t border-gray-200 mt-1 sm:mt-3 pt-1 sm:pt-3">
                                        <div className="flex items-center justify-between font-bold text-blue-800">
                                            <span className="text-xs sm:text-sm md:text-base">TOTAL SERVICIO</span>
                                            <span className="text-xs sm:text-sm md:text-base">{costesServicio.costeTotalServicio.toFixed(2)}€</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-0 pt-2 sm:pb-1 sm:pt-3">
                                <CardTitle className="text-sm sm:text-base md:text-lg font-medium text-center">
                                    Distribución de Costes del Servicio
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-1 pb-2 px-2 sm:pt-2 sm:pb-3 sm:px-4">
                                <GraficoCircular data={datosConPorcentajes} />
                                <div className="text-center mt-1 sm:mt-3 text-xs sm:text-sm text-gray-500">
                                    Los porcentajes se calculan sobre los costes directos del servicio
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* Información adicional */}
                    <div className="mt-3 sm:mt-6 p-2 sm:p-4 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-700">
                        <p className="font-semibold mb-1">Información adicional:</p>
                        <p>El coste por kilómetro con pasajeros es: <span className="font-medium">{(costesServicio.costeTotalServicio / servicioData.kilometrosTrayecto).toFixed(2)}€/km</span></p>
                        <p>El coste por hora de servicio es: <span className="font-medium">{(costesServicio.costeTotalServicio / servicioData.horasServicio).toFixed(2)}€/hora</span></p>
                    </div>
                </div>
            </SectionContainer>
        </div>
    );
}