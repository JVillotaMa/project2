'use client'

import { useState } from 'react'
import SectionContainer from '@/components/shared/form/sectionContainer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTransportesForm } from '@/lib/calculadoraTransportes/TransportesFormContext'
import { 
  costeCombustibleKm, 
  costeMantenimientoKm, 
  costeNeumaticosKm,
  costeConductorHora,
  costeSeguroHora,
  costeAmortizacionHora,
  costeFinanciacionHora
} from '../calculos'
import { useTransportDataContext } from '@/lib/calculadoraTransportes/TransportDataContext'

// Colores para los gráficos - Paleta más moderna y atractiva
const colores = [
  '#4285F4', '#EA4335', '#FBBC05', '#34A853',
  '#8AB4F8', '#F6AEA9', '#FDE293', '#A8DAB5',
  '#7986CB', '#F06292', '#FFD54F', '#81C784'
]

export default function ResultadosUnitarios() {
  const { formData } = useTransportesForm();
  const [activeTab, setActiveTab] = useState('km');
  const { currentBusData } = useTransportDataContext();

  // Función para calcular costes por kilómetro
  const calcularCostesPorKm = () => {
    if (!formData) {
      return {
        costes: { combustible: 0, neumaticos: 0, mantenimiento: 0 },
        total: 0
      };
    }

    // Datos de entrada
    const kilometrosAnuales = formData.kilometrosAnuales || 0;
    const costeDelCombustible = formData.costeDelCombustible || 0;
    const costeNeumatico = formData.costeNeumatico || 0;
    const vidaUtilNeumatico = formData.vidaUtilNeumatico || 1;
    const mantenimientoAnual = formData.mantenimientoAnual || 0;
    const numeroNeumaticos = currentBusData && typeof currentBusData['Numero Neumaticos'] === 'number'
      ? currentBusData['Numero Neumaticos']
      : 6; // Valor por defecto si no está disponible
    
    // Estimación de consumo de combustible basado en tipo de autobús (l/100km)
    const consumo = currentBusData["Consumo medio (L)"]
    // Cálculos usando las funciones importadas
    const costeCombustible = costeCombustibleKm(costeDelCombustible, consumo);
    const costeNeumaticosPorKm = costeNeumaticosKm(costeNeumatico, numeroNeumaticos, vidaUtilNeumatico);
    const costeMantenimientoPorKm = kilometrosAnuales > 0 ? costeMantenimientoKm(mantenimientoAnual, kilometrosAnuales) : 0;
    
    // Total de los costes por km
    const total = costeCombustible + costeNeumaticosPorKm + costeMantenimientoPorKm;
    
    return {
      costes: {
        combustible: costeCombustible,
        neumaticos: costeNeumaticosPorKm,
        mantenimiento: costeMantenimientoPorKm,
      },
      total: total
    };
  };

  // Función para calcular costes por hora
  const calcularCostesPorHora = () => {
    if (!formData) {
      return {
        costes: { amortizacion: 0, financiacion: 0, personal: 0, seguros: 0 },
        total: 0
      };
    }

    // Datos de entrada
    const costeDeAdquisicion = formData.costeDeAdquisicion || 0;
    const vidaUtil = formData.vidaUtil || 1;
    const costeFinanciacionTAE = formData.costeFinanciacionTAE || 0;
    const plazoFinanciacion = formData.plazoFinanciacion || 1;
    const seguroAnual = formData.seguroAnual || 0;
    const salarioAnualConductor = formData.salarioAnualConductor || 0;
    const horasAnualesTrabajadas = formData.horasAnualesTrabajadas || 1;
    
    // Cálculos usando las funciones importadas
    const amortizacionPorHora = costeAmortizacionHora(costeDeAdquisicion, vidaUtil, horasAnualesTrabajadas);
    const financiacionPorHora = costeFinanciacionHora(costeDeAdquisicion, costeFinanciacionTAE, plazoFinanciacion, vidaUtil, horasAnualesTrabajadas);
    const personalPorHora = costeConductorHora(salarioAnualConductor, horasAnualesTrabajadas);
    const segurosPorHora = costeSeguroHora(seguroAnual, horasAnualesTrabajadas);
    
    // Total 
    const total = amortizacionPorHora + financiacionPorHora + personalPorHora + segurosPorHora;
    
    return {
      costes: {
        amortizacion: amortizacionPorHora,
        financiacion: financiacionPorHora,
        personal: personalPorHora,
        seguros: segurosPorHora,
      },
      total: total
    };
  };

  // Obtener los datos calculados en tiempo real
  const datosCostePorKm = calcularCostesPorKm();
  const datosCostePorHora = calcularCostesPorHora();

  // Cálculo de porcentajes para los gráficos
  const porcentajesPorKm = Object.entries(datosCostePorKm.costes).map(([nombre, valor], index) => ({
    nombre,
    valor,
    porcentaje: datosCostePorKm.total > 0 ? Math.round((valor / datosCostePorKm.total) * 100) : 0,
    color: colores[index % colores.length]
  }));

  const porcentajesPorHora = Object.entries(datosCostePorHora.costes).map(([nombre, valor], index) => ({
    nombre,
    valor,
    porcentaje: datosCostePorHora.total > 0 ? Math.round((valor / datosCostePorHora.total) * 100) : 0,
    color: colores[index % colores.length]
  }));

  // Definición del tipo para los datos del gráfico
  type DatoGrafico = {
    nombre: string;
    valor: number;
    porcentaje: number;
    color: string;
  }

  // Componente para el gráfico circular
  const GraficoCircular = ({ data }: { data: DatoGrafico[] }) => (
    <div className="relative w-full aspect-square max-w-[220px] sm:max-w-[240px] md:max-w-[280px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        {data.reduce<React.ReactNode[]>((acc, item, i) => {
          // Calcular el acumulado anterior
          let prevTotal = 0;
          if (i > 0) {
            // Calculamos el acumulado basado en los porcentajes anteriores
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
  )

  return (
    <div className="space-y-3 sm:space-y-6 mx-auto max-w-full">
      <SectionContainer subSectionTitle="Costes Unitarios">
        <div className="p-1 sm:p-2 md:p-4">
          <Tabs defaultValue="km" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-2 sm:mb-4 md:mb-6">
              <TabsTrigger value="km" className="text-sm sm:text-base">Coste por Kilómetro</TabsTrigger>
              <TabsTrigger value="hora" className="text-sm sm:text-base">Coste por Hora</TabsTrigger>
            </TabsList>
            
            <TabsContent value="km" className="space-y-2 sm:space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-0 pt-2 sm:pb-1 sm:pt-3">
                    <CardTitle className="text-sm sm:text-base md:text-lg font-medium text-center">
                      Desglose de Costes por Kilómetro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1 pb-2 px-2 sm:pt-2 sm:pb-3 sm:px-4">
                    <div className="space-y-1 sm:space-y-2">
                      {porcentajesPorKm.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-0.5 sm:py-1">
                          <div className="flex items-center">
                            <span 
                              className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1 sm:mr-2 rounded-sm" 
                              style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="capitalize text-xs sm:text-sm md:text-base">{item.nombre}</span>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="font-medium text-xs sm:text-sm md:text-base">{item.valor.toFixed(3)}€</span>
                            <span className="text-gray-500 text-xs sm:text-sm">({item.porcentaje}%)</span>
                          </div>
                        </div>
                      ))}
                      
                      {/* Total final */}
                      <div className="border-t border-gray-200 mt-1 sm:mt-3 pt-1 sm:pt-3">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-xs sm:text-sm md:text-base">TOTAL POR KM</span>
                          <span className="text-xs sm:text-sm md:text-base">{datosCostePorKm.total.toFixed(3)}€</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-0 pt-2 sm:pb-1 sm:pt-3">
                    <CardTitle className="text-sm sm:text-base md:text-lg font-medium text-center">
                      Distribución de Costes por Kilómetro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1 pb-2 px-2 sm:pt-2 sm:pb-3 sm:px-4">
                    <GraficoCircular data={porcentajesPorKm} />
                    <div className="text-center mt-1 sm:mt-3 text-xs sm:text-sm text-gray-500">
                      Los porcentajes se calculan sobre el coste total por kilómetro
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="hora" className="space-y-2 sm:space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-0 pt-2 sm:pb-1 sm:pt-3">
                    <CardTitle className="text-sm sm:text-base md:text-lg font-medium text-center">
                      Desglose de Costes por Hora
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1 pb-2 px-2 sm:pt-2 sm:pb-3 sm:px-4">
                    <div className="space-y-1 sm:space-y-2">
                      {porcentajesPorHora.map((item, index) => (
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
                          <span className="text-xs sm:text-sm md:text-base">TOTAL POR HORA</span>
                          <span className="text-xs sm:text-sm md:text-base">{datosCostePorHora.total.toFixed(2)}€</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-1 sm:pb-2">
                    <CardTitle className="text-base sm:text-lg font-medium text-center">
                      Distribución de Costes por Hora
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GraficoCircular data={porcentajesPorHora} />
                    <div className="text-center mt-3 text-xs sm:text-sm text-gray-500">
                      Los porcentajes se calculan sobre el coste total por hora
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SectionContainer>
    </div>
  )
}