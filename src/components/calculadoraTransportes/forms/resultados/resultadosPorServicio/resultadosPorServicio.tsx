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

    // Calcular porcentajes para el gráfico y mostrar en resultados
    const total = costesServicio.costeTotalServicio;

    // Porcentajes por categoría principal
    const porcKilometricos = total > 0 ? (totalKilometricos / total) * 100 : 0;
    const porcHorarios = total > 0 ? (totalHorarios / total) * 100 : 0;
    const porcGenerales = total > 0 ? (totalGenerales / total) * 100 : 0;

    // Porcentajes por subcategoría
    const porcMantenimiento = total > 0 ? (costesServicio.costeTotalMantenimiento / total) * 100 : 0;
    const porcCombustible = total > 0 ? (costesServicio.costeTotalCombustible / total) * 100 : 0;
    const porcNeumaticos = total > 0 ? (costesServicio.costeTotalNeumaticos / total) * 100 : 0;
    const porcFinancieros = total > 0 ? (costesServicio.costeTotalFinanciacion / total) * 100 : 0;
    const porcSeguros = total > 0 ? (costesServicio.costeTotalSeguro / total) * 100 : 0;
    const porcAmortizacion = total > 0 ? (costesServicio.costeTotalAmortizacion / total) * 100 : 0;
    const porcConductor = total > 0 ? (costesServicio.costeTotalConductor / total) * 100 : 0;

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
Costes calculados para un servicio de:
${kilometrosTrayecto} km con pasajeros, ${kilometrosPosicionamiento} km de posicionamiento, y ${horasServicio} horas,
en un vehículo de ${tipoVehiculo} plazas.

Coste total del trayecto: ${costesServicio.costeTotalServicio.toFixed(2)} euros (100%)

Costes por Km (${porcKilometricos.toFixed(1)}%)
-----------------
Coste de mantenimiento: ${costesServicio.costeTotalMantenimiento.toFixed(2)} euros
Coste del combustible: ${costesServicio.costeTotalCombustible.toFixed(2)} euros
Coste de neumáticos: ${costesServicio.costeTotalNeumaticos.toFixed(2)} euros

Costes por Hora (${porcHorarios.toFixed(1)}%)
-----------------
Costes financieros: ${costesServicio.costeTotalFinanciacion.toFixed(2)} euros
Coste de seguros: ${costesServicio.costeTotalSeguro.toFixed(2)} euros
Coste de amortización: ${costesServicio.costeTotalAmortizacion.toFixed(2)} euros
Coste del conductor: ${costesServicio.costeTotalConductor.toFixed(2)} euros

Costes generales: (${porcGenerales.toFixed(1)}%) ${totalGenerales.toFixed(2)} euros
---------------------------------------
        `;

        navigator.clipboard.writeText(texto)
            .then(() => alert('Texto copiado al portapapeles'))
            .catch(err => console.error('Error al copiar: ', err));
    };

    const copiarGrafico = () => {
        try {
            // Obtenemos la referencia al contenedor
            if (!graficoRef.current) return;
            
            // Crear un nuevo SVG personalizado que no dependa de variables CSS
            const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            newSvg.setAttribute('width', '600');  // Más grande para mejor calidad
            newSvg.setAttribute('height', '600');
            newSvg.setAttribute('viewBox', '0 0 200 200');
            
            // Crear un grupo principal para el gráfico
            const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            mainGroup.setAttribute('transform', 'translate(100, 100) rotate(15)');
            newSvg.appendChild(mainGroup);
            
            // Definir los sectores con colores explícitos
            const sectores = [
                { nombre: "Mantenimiento", porcentaje: porcMantenimiento, color: '#CC0000' },
                { nombre: "Combustible", porcentaje: porcCombustible, color: '#00CC00' },
                { nombre: "Neumáticos", porcentaje: porcNeumaticos, color: '#0000CC' },
                { nombre: "Financieros", porcentaje: porcFinancieros, color: '#888888' },
                { nombre: "Seguros", porcentaje: porcSeguros, color: '#FF00FF' },
                { nombre: "Amortización", porcentaje: porcAmortizacion, color: '#00FFFF' },
                { nombre: "Conductor", porcentaje: porcConductor, color: '#333333' },
                { nombre: "Generales", porcentaje: porcGenerales, color: '#880000' }
            ];
            
            // Función para crear un sector del gráfico
            const createSectorPath = (percentage: number, color: string, startAngle: number): SVGPathElement => {
                const r = 70; // radio
                
                // Convertimos porcentaje a ángulo (en radianes)
                const angle = (percentage / 100) * 2 * Math.PI;
                const endAngle = startAngle + angle;

                // Calculamos puntos iniciales y finales
                const x1 = r * Math.cos(startAngle);
                const y1 = r * Math.sin(startAngle);
                const x2 = r * Math.cos(endAngle);
                const y2 = r * Math.sin(endAngle);
                
                // Determinamos si el arco es mayor a 180 grados
                const largeArcFlag = percentage > 50 ? 1 : 0;
                
                // Creamos el path
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`);
                path.setAttribute('fill', color);
                path.setAttribute('stroke', '#FFFFFF');
                path.setAttribute('stroke-width', '1');
                
                return path;
            };
            
            // Añadir todos los sectores
            let currentAngle = 0;
            sectores.forEach(sector => {
                if (sector.porcentaje > 0) {
                    const sectorPath = createSectorPath(sector.porcentaje, sector.color, currentAngle);
                    mainGroup.appendChild(sectorPath);
                    currentAngle += (sector.porcentaje / 100) * 2 * Math.PI;
                }
            });
            
            // Eliminado el título para copiar solo el gráfico sin texto
            
            // Convertir el SVG a una cadena
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(newSvg);
            
            // Crear un blob con el SVG
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            
            // Crear un canvas y dibujar el SVG en él
            const img = new Image();
            const url = URL.createObjectURL(blob);
            
            img.onload = function() {
                // Crear un canvas
                const canvas = document.createElement('canvas');
                canvas.width = 600;
                canvas.height = 600;
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    console.error('No se pudo obtener el contexto del canvas');
                    alert('Error al copiar el gráfico');
                    return;
                }
                
                // Dibujar fondo blanco
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Dibujar la imagen SVG
                ctx.drawImage(img, 0, 0);
                
                // Convertir el canvas a un blob para copiar al portapapeles
                canvas.toBlob((imgBlob) => {
                    if (!imgBlob) {
                        console.error('Error al convertir canvas a blob');
                        alert('Error al copiar el gráfico');
                        return;
                    }
                    
                    // Intentar copiar al portapapeles
                    try {
                        const clipboardItem = new ClipboardItem({ 'image/png': imgBlob });
                        navigator.clipboard.write([clipboardItem])
                            .then(() => {
                                alert('Gráfico copiado al portapapeles');
                            })
                            .catch((err) => {
                                console.error('Error al copiar al portapapeles:', err);
                                
                                // Fallback: descargar la imagen
                                const imgUrl = URL.createObjectURL(imgBlob);
                                const link = document.createElement('a');
                                link.href = imgUrl;
                                link.download = 'grafico-costes-servicio.png';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                
                                alert('No se pudo copiar directamente. Se ha descargado el gráfico como imagen.');
                            });
                    } catch (err) {
                        console.error('Error al usar ClipboardItem:', err);
                        
                        // Fallback para navegadores que no soportan clipboard API
                        const imgUrl = URL.createObjectURL(imgBlob);
                        const link = document.createElement('a');
                        link.href = imgUrl;
                        link.download = 'grafico-costes-servicio.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        alert('No se pudo copiar directamente. Se ha descargado el gráfico como imagen.');
                    }
                }, 'image/png', 1.0);
                
                // Liberar recursos
                URL.revokeObjectURL(url);
            };
            
            img.src = url;
        } catch (error) {
            console.error('Error al capturar el gráfico:', error);
            alert('Error al copiar el gráfico');
        }
    };

    const imprimir = () => {
        // Añadir clases temporales para impresión
        const container = document.querySelector('.mx-auto.max-w-\\[1000px\\]');
        const buttons = document.querySelectorAll('button');
        
        if (container) {
            container.classList.add('print-container');
            
            // Guardar el estado original del flex-direction
            const flexContainers = document.querySelectorAll('.flex.flex-col.md\\:flex-row');
            flexContainers.forEach(el => {
                el.classList.add('print-flex-row');
            });
            
            // Ocultar todos los botones durante la impresión
            buttons.forEach(btn => {
                btn.classList.add('no-print');
            });
            
            // Configurar altura máxima para componentes gráficos
            const chartContainers = document.querySelectorAll('[data-highcharts-chart]');
            chartContainers.forEach(chart => {
                const parent = chart.parentElement;
                if (parent) {
                    parent.style.maxHeight = '300px';
                    parent.classList.add('chart-container');
                }
            });
            
            // Disparar la impresión
            window.print();
            
            // Restaurar clases después de imprimir
            setTimeout(() => {
                container.classList.remove('print-container');
                flexContainers.forEach(el => {
                    el.classList.remove('print-flex-row');
                });
                buttons.forEach(btn => {
                    btn.classList.remove('no-print');
                });
                chartContainers.forEach(chart => {
                    const parent = chart.parentElement;
                    if (parent) {
                        parent.style.maxHeight = '';
                    }
                });
            }, 1000);
        } else {
            // Fallback
            window.print();
        }
    };

    const nuevoCalculo = () => {
        // Aquí iría la lógica para reiniciar el cálculo
        window.location.reload();
    };

    return (
        <div className="print:shadow-none print-container mx-auto max-w-[1000px] bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
            <div className="bg-gray-100 px-4 py-2 font-semibold border-b border-gray-300">
                Resultados
            </div>
            <div className="flex flex-col md:flex-row print-flex-row">
                {/* Columna izquierda - Resultados de texto */}
                <div
                    ref={resultadosRef}
                    className="w-full md:w-1/2 print-width-half p-5 md:border-r border-gray-300"
                >
                    <div className="font-semibold mb-3">Resultado del cálculo de costes</div>

                    <div className="text-sm mb-4 border-b border-dashed border-gray-300 pb-2">
                        <p>Costes calculados para un servicio de:</p>
                        <p>{kilometrosTrayecto} km con pasajeros, {kilometrosPosicionamiento} km de posicionamiento, y {horasServicio} horas,</p>
                        <p>en un vehículo de {tipoVehiculo} plazas.</p>
                    </div>

                    <div className="flex justify-between font-semibold mb-2">
                        <span>Coste total del trayecto:</span>
                        <span>{costesServicio.costeTotalServicio.toFixed(2)} euros</span>
                        <span>(100%)</span>
                    </div>

                    <div className="mb-4">
                        <div className="border-b border-dashed border-gray-300 pb-1 mb-2">
                            <div className="flex justify-between">
                                <span>Costes por Km ({porcKilometricos.toFixed(1)}%)</span>
                            </div>
                        </div>

                        <div className="ml-2 text-sm mb-3">
                            <div className="flex justify-between">
                                <span>Coste de mantenimiento:</span>
                                <span>{costesServicio.costeTotalMantenimiento.toFixed(2)} euros</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Coste del combustible:</span>
                                <span>{costesServicio.costeTotalCombustible.toFixed(2)} euros</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Coste de neumáticos:</span>
                                <span>{costesServicio.costeTotalNeumaticos.toFixed(2)} euros</span>
                            </div>
                        </div>

                        <div className="border-b border-dashed border-gray-300 pb-1 mb-2">
                            <div className="flex justify-between">
                                <span>Costes por Hora ({porcHorarios.toFixed(1)}%)</span>
                            </div>
                        </div>

                        <div className="ml-2 text-sm mb-3">
                            <div className="flex justify-between">
                                <span>Costes financieros:</span>
                                <span>{costesServicio.costeTotalFinanciacion.toFixed(2)} euros</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Coste de seguros:</span>
                                <span>{costesServicio.costeTotalSeguro.toFixed(2)} euros</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Coste de amortización:</span>
                                <span>{costesServicio.costeTotalAmortizacion.toFixed(2)} euros</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Coste del conductor:</span>
                                <span>{costesServicio.costeTotalConductor.toFixed(2)} euros</span>
                            </div>
                        </div>

                        <div className="border-b border-dashed border-gray-300 pb-1 mb-2">
                            <div className="flex justify-between">
                                <span>Costes generales: ({porcGenerales.toFixed(1)}%)</span>
                                <span>{totalGenerales.toFixed(2)} euros</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-dashed border-gray-300 pt-2"></div>
                </div>

                {/* Columna derecha - Gráfico */}
                <div
                    ref={graficoRef}
                    className="w-full md:w-1/2 print-width-half p-5 flex flex-col bg-white"
                >
                    <div className="text-center text-blue-700 font-semibold mb-4">
                        <a href="#" className="underline hover:text-blue-800">Distribución de costes</a>
                    </div>

                    {/* Gráfico de tipo pie */}
                    <div className="flex-grow flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-center text-blue-700 font-semibold mb-4">
                                Distribución de costes
                            </div>

                            <svg viewBox="0 0 200 200" className="w-56 h-56 mx-auto mb-4">
                                {/* Gráfico circular con porcentajes dinámicos */}
                                <g transform="translate(100, 100) rotate(15)">
                                    {/* Usamos los porcentajes reales calculados para definir los sectores */}
                                    {/* Cada sector se define usando coordenadas polares convertidas a cartesianas */}

                                    {/* Variables para controlar el tamaño y posición */}
                                    {(() => {
                                        // Calculamos los ángulos acumulados para cada sector
                                        const r = 70; // radio
                                        let startAngle = 0;

                                        // Definir tipos para un sector
                                        type SectorProps = {
                                            nombre: string;
                                            porcentaje: number;
                                            color: string;
                                        };
                                        
                                        // Función para crear un sector del gráfico
                                        const createSector = (percentage: number, color: string, startAngle: number): React.ReactNode => {
                                            // Convertimos porcentaje a ángulo (en radianes)
                                            const angle = (percentage / 100) * 2 * Math.PI;
                                            const endAngle = startAngle + angle;

                                            // Calculamos puntos iniciales y finales
                                            const x1 = r * Math.cos(startAngle);
                                            const y1 = r * Math.sin(startAngle);
                                            const x2 = r * Math.cos(endAngle);
                                            const y2 = r * Math.sin(endAngle);

                                            // Determinamos si el arco es mayor a 180 grados
                                            const largeArcFlag = percentage > 50 ? 1 : 0;

                                            // Creamos el path
                                            return (
                                                <path
                                                    key={`sector-${color}-${percentage}`}
                                                    d={`M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                                    fill={color}
                                                />
                                            );
                                        };

                                        // Creamos un array de sectores
                                        const sectors: React.ReactNode[] = [];

                                        // Array de todos los sectores con sus datos
                                        const sectoresData: SectorProps[] = [
                                            { nombre: "Mantenimiento", porcentaje: porcMantenimiento, color: '#CC0000' },
                                            { nombre: "Combustible", porcentaje: porcCombustible, color: '#00CC00' },
                                            { nombre: "Neumáticos", porcentaje: porcNeumaticos, color: '#0000CC' },
                                            { nombre: "Financieros", porcentaje: porcFinancieros, color: '#888888' },
                                            { nombre: "Seguros", porcentaje: porcSeguros, color: '#FF00FF' },
                                            { nombre: "Amortización", porcentaje: porcAmortizacion, color: '#00FFFF' },
                                            { nombre: "Conductor", porcentaje: porcConductor, color: '#333333' },
                                            { nombre: "Generales", porcentaje: porcGenerales, color: '#880000' }
                                        ];

                                        // Filtramos los sectores con valor > 0 y los ordenamos de mayor a menor
                                        // Esto nos asegura que todos los sectores con valor aparezcan en el gráfico
                                        const sectoresFiltrados = sectoresData
                                            .filter(sector => sector.porcentaje > 0)
                                            .sort((a, b) => b.porcentaje - a.porcentaje);

                                        // Agregamos cada sector en orden
                                        sectoresFiltrados.forEach((sector, index) => {
                                            sectors.push(createSector(sector.porcentaje, sector.color, startAngle));
                                            // Actualizamos el ángulo inicial para el siguiente sector
                                            startAngle += (sector.porcentaje / 100) * 2 * Math.PI;
                                        });

                                        return sectors;
                                    })()}
                                </g>
                            </svg>

                            <div className="text-center text-blue-700 font-semibold mb-2 mt-4">
                                Distribución de costes
                            </div>
                        </div>
                    </div>

                    {/* Leyenda */}
                    <div className="grid grid-cols-2 gap-y-1 text-sm mt-2 px-6">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#CC0000] mr-2"></div>
                            <span>Mantenimiento</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#00CC00] mr-2"></div>
                            <span>Combustible</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#0000CC] mr-2"></div>
                            <span>Neumáticos</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#888888] mr-2"></div>
                            <span>Financieros</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#FF00FF] mr-2"></div>
                            <span>Seguros</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#00FFFF] mr-2"></div>
                            <span>Amortización</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#333333] mr-2"></div>
                            <span>Conductor</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-[#880000] mr-2"></div>
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