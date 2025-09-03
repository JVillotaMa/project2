'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTransportesForm } from "@/lib/calculadoraTransportes/TransportesFormContext";
import React, { useState, useEffect } from "react";

// Define types for results
type CostesUnitarios = {
    costosPorKm: {
        amortizacion: number;
        financiacion: number;
        personal: number;
        combustible: number;
        neumaticos: number;
        mantenimiento: number;
        seguro: number;
    };
    costosTotalesPorKm: number;
    costesGenerales: number;
    costoFinalPorKm: number;
    costosPorHora: number;
};

type CostesServicio = {
    costePorKilometros: number;
    costePorHoras: number;
    costeTotal: number;
};

export default function Resultados() {
    const { formData, isFormValid } = useTransportesForm();
    const [optionSelected, setOptionSelected] = useState("option-one");
    const [servicioData, setServicioData] = useState({
        kilometrosTrayecto: 0,
        kilometrosPosicionamiento: 0,
        horasServicio: 0
    });

    // Handle radio button selection
    const handleOptionChange = (value: string) => {
        setOptionSelected(value);
    };

    // Handle number input changes for servicio
    const handleInputChange = (name: string, value: number) => {
        setServicioData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Calculate cost results
    const calcularCostesUnitarios = (): CostesUnitarios | null => {
        if (!isFormValid) return null;
        
        // Check if all required values are present
        if (
            formData.costeDeAdquisicion === undefined ||
            formData.vidaUtil === undefined ||
            formData.kilometrosAnuales === undefined ||
            formData.costeFinanciacionTAE === undefined ||
            formData.plazoFinanciacion === undefined ||
            formData.salarioAnualConductor === undefined ||
            formData.costeDelCombustible === undefined ||
            formData.costeNeumatico === undefined ||
            formData.vidaUtilNeumatico === undefined ||
            formData.mantenimientoAnual === undefined ||
            formData.seguroAnual === undefined ||
            formData.costesGenerales === undefined ||
            formData.horasAnualesTrabajadas === undefined
        ) {
            return null;
        }
        
        // Avoid division by zero
        if (
            formData.vidaUtil === 0 || 
            formData.kilometrosAnuales === 0 || 
            formData.plazoFinanciacion === 0 || 
            formData.vidaUtilNeumatico === 0 ||
            formData.horasAnualesTrabajadas === 0
        ) {
            return null;
        }
        
        // Simple calculations (these should be more complex in a real app)
        const costosPorKm = {
            amortizacion: formData.costeDeAdquisicion / (formData.vidaUtil * formData.kilometrosAnuales),
            financiacion: (formData.costeDeAdquisicion * (formData.costeFinanciacionTAE / 100)) / (formData.plazoFinanciacion * formData.kilometrosAnuales),
            personal: formData.salarioAnualConductor / formData.kilometrosAnuales,
            combustible: (formData.costeDelCombustible * 25) / 100, // Assuming 25L/100km consumption
            neumaticos: (formData.costeNeumatico * 6) / formData.vidaUtilNeumatico, // Assuming 6 tires
            mantenimiento: formData.mantenimientoAnual / formData.kilometrosAnuales,
            seguro: formData.seguroAnual / formData.kilometrosAnuales,
        };
        
        const costosTotalesPorKm = Object.values(costosPorKm).reduce((sum, cost) => sum + cost, 0);
        const costesGenerales = costosTotalesPorKm * (formData.costesGenerales / 100);
        const costoFinalPorKm = costosTotalesPorKm + costesGenerales;
        
        // Calculate hourly cost
        const costosPorHora = costoFinalPorKm * (formData.kilometrosAnuales / formData.horasAnualesTrabajadas);
        
        return {
            costosPorKm,
            costosTotalesPorKm,
            costesGenerales,
            costoFinalPorKm,
            costosPorHora
        };
    };

    // Calculate service costs
    const calcularCostesServicio = (): CostesServicio | null => {
        if (!isFormValid) return null;
        
        const costesUnitarios = calcularCostesUnitarios();
        if (!costesUnitarios) return null;
        
        const kilometrosTotales = servicioData.kilometrosTrayecto + servicioData.kilometrosPosicionamiento;
        const costePorKilometros = costesUnitarios.costoFinalPorKm * kilometrosTotales;
        const costePorHoras = costesUnitarios.costosPorHora * servicioData.horasServicio;
        
        // Take the higher cost (km or hours)
        const costeTotal = Math.max(costePorKilometros, costePorHoras);
        
        return {
            costePorKilometros,
            costePorHoras,
            costeTotal
        };
    };

    // Get calculation results with proper type handling
    const resultadosUnitarios = optionSelected === "option-one" ? calcularCostesUnitarios() : null;
    const resultadosServicio = optionSelected === "option-two" ? calcularCostesServicio() : null;

    return (
        <div className="flex flex-col gap-5">
            <SectionTitle title="Resultados" />
            
            {!isFormValid ? (
                <div className="p-5 bg-red-100 border border-red-300 rounded text-center">
                    <p className="text-red-600 font-semibold">Para ver los resultados, debe completar correctamente todos los campos en las secciones anteriores.</p>
                </div>
            ) : (
                <>
                    <SectionContainer subSectionTitle="¿Desea calcular el coste de un servicio?">
                        <div className="flex justify-center">
                            <form className="flex flex-col gap-3 p-10 w-full">
                                <div id="calculation-type" className="flex flex-col">
                                    <RadioGroup 
                                        value={optionSelected} 
                                        onValueChange={handleOptionChange}
                                    >
                                        <div className="flex items-center space-x-2 justify-between">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="option-one" id="option-one" />
                                                <label htmlFor="option-one">Calcular costes unitarios (por km/hora) del vehículo</label>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="option-two" id="option-two" />
                                                <label htmlFor="option-two">Calcular los costes totales de un servicio</label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                                
                                {optionSelected === "option-two" && (
                                    <>
                                        <FormInput 
                                            label="Kilometros del trayecto (con pasajeros):" 
                                            name="kilometrosTrayecto"
                                            value={servicioData.kilometrosTrayecto}
                                            onChange={handleInputChange}
                                            defaultValue={100}
                                        />
                                        <FormInput 
                                            label="Km de posicionamiento (vacío):" 
                                            name="kilometrosPosicionamiento"
                                            value={servicioData.kilometrosPosicionamiento}
                                            onChange={handleInputChange}
                                            defaultValue={20}
                                        />
                                        <FormInput 
                                            label="Horas del servicio:" 
                                            name="horasServicio"
                                            value={servicioData.horasServicio}
                                            onChange={handleInputChange}
                                            defaultValue={8}
                                        />
                                    </>
                                )}
                            </form>
                        </div>
                    </SectionContainer>
                    
                    {/* Show results based on the selected option */}
                    {optionSelected === "option-one" && resultadosUnitarios && (
                        <SectionContainer subSectionTitle="Resultados de cálculo">
                            <div className="p-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 bg-green-100 p-4 rounded-md text-center">
                                        <h3 className="font-bold text-lg">Coste por kilómetro: {resultadosUnitarios.costoFinalPorKm.toFixed(2)} €/km</h3>
                                        <h3 className="font-bold text-lg">Coste por hora: {resultadosUnitarios.costosPorHora.toFixed(2)} €/hora</h3>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Desglose por kilómetro:</h4>
                                        <ul className="mt-2 space-y-1">
                                            <li>Amortización: {resultadosUnitarios.costosPorKm.amortizacion.toFixed(2)} €/km</li>
                                            <li>Financiación: {resultadosUnitarios.costosPorKm.financiacion.toFixed(2)} €/km</li>
                                            <li>Personal: {resultadosUnitarios.costosPorKm.personal.toFixed(2)} €/km</li>
                                            <li>Combustible: {resultadosUnitarios.costosPorKm.combustible.toFixed(2)} €/km</li>
                                            <li>Neumáticos: {resultadosUnitarios.costosPorKm.neumaticos.toFixed(2)} €/km</li>
                                            <li>Mantenimiento: {resultadosUnitarios.costosPorKm.mantenimiento.toFixed(2)} €/km</li>
                                            <li>Seguros: {resultadosUnitarios.costosPorKm.seguro.toFixed(2)} €/km</li>
                                            <li>Costes generales: {resultadosUnitarios.costesGenerales.toFixed(2)} €/km</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Información del vehículo:</h4>
                                        <ul className="mt-2 space-y-1">
                                            <li>Tipo de autobús: {formData.tipoDeAutobus}</li>
                                            <li>Kilómetros anuales: {formData.kilometrosAnuales} km</li>
                                            <li>Coste de adquisición: {formData.costeDeAdquisicion} €</li>
                                            <li>Vida útil: {formData.vidaUtil} años</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SectionContainer>
                    )}
                    
                    {optionSelected === "option-two" && resultadosServicio && (
                        <SectionContainer subSectionTitle="Resultados de cálculo">
                            <div className="p-5">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-green-100 p-4 rounded-md text-center">
                                        <h3 className="font-bold text-lg">Coste total del servicio: {resultadosServicio.costeTotal.toFixed(2)} €</h3>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Desglose:</h4>
                                        <ul className="mt-2 space-y-1">
                                            <li>Coste por kilómetros ({servicioData.kilometrosTrayecto + servicioData.kilometrosPosicionamiento} km): {resultadosServicio.costePorKilometros.toFixed(2)} €</li>
                                            <li>Coste por horas ({servicioData.horasServicio} horas): {resultadosServicio.costePorHoras.toFixed(2)} €</li>
                                            <li className="font-semibold">Se aplica el coste mayor entre kilómetros y horas</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </SectionContainer>
                    )}
                </>
            )}
        </div>
    );
}