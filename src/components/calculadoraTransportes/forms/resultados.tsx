'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTransportesForm } from "@/lib/calculadoraTransportes/TransportesFormContext";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ResultadosPorServicio from "./resultados/resultadosPorServicio/resultadosPorServicio";
import ResultadosUnitarios from "./resultados/resultadosUnitarios/resultadosUnitarios";




export default function Resultados() {
    const { isFormValid, formData } = useTransportesForm();
    const [optionSelected, setOptionSelected] = useState("option-one");
    const [servicioData, setServicioData] = useState({
        kilometrosTrayecto: undefined,
        kilometrosPosicionamiento: undefined,
        horasServicio: undefined
    });
    const [modalOpen, setModalOpen] = useState(false);

    // Handle radio button selection
    const handleOptionChange = (value: string) => {
        setOptionSelected(value);
    };

    // Handle number input changes for servicio
    const handleInputChange = (name: string, value: number | undefined) => {
        setServicioData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    function RenderResultsView() {
        if (optionSelected == "option-one") {
            return <ResultadosUnitarios 
                kilometrosTrayecto={servicioData.kilometrosTrayecto}
                kilometrosPosicionamiento={servicioData.kilometrosPosicionamiento}
                horasServicio={servicioData.horasServicio}
            />
        } else {
            return <ResultadosPorServicio
                kilometrosTrayecto={servicioData.kilometrosTrayecto}
                kilometrosPosicionamiento={servicioData.kilometrosPosicionamiento}
                horasServicio={servicioData.horasServicio}
            />
        }
    }

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
                            <form className="flex flex-col gap-3 p-10 w-full" onSubmit={(e) => e.preventDefault()}>
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


                                <>
                                    <FormInput
                                        label="Kilometros del trayecto (con pasajeros):"
                                        name="kilometrosTrayecto"
                                        value={servicioData.kilometrosTrayecto}
                                        onChange={handleInputChange}
                                        defaultValue={0}
                                    />
                                    <FormInput
                                        label="Km de posicionamiento (vacío):"
                                        name="kilometrosPosicionamiento"
                                        value={servicioData.kilometrosPosicionamiento}
                                        onChange={handleInputChange}
                                        defaultValue={0}
                                    />
                                    <FormInput
                                        label="Horas del servicio:"
                                        name="horasServicio"
                                        value={servicioData.horasServicio}
                                        onChange={handleInputChange}
                                        defaultValue={0}
                                    />
                                </>

                                {/* Mensajes de error para valores negativos o no ingresados */}
                                <div className="mt-2">
                                    {(servicioData.kilometrosTrayecto === undefined || servicioData.kilometrosTrayecto === null) && (
                                        <p className="text-red-500 text-sm">Debe ingresar los kilómetros del trayecto.</p>
                                    )}
                                    {servicioData.kilometrosTrayecto !== undefined && servicioData.kilometrosTrayecto < 0 && (
                                        <p className="text-red-500 text-sm">Los kilómetros del trayecto no pueden ser negativos.</p>
                                    )}
                                    
                                    {(servicioData.kilometrosPosicionamiento === undefined || servicioData.kilometrosPosicionamiento === null) && (
                                        <p className="text-red-500 text-sm">Debe ingresar los kilómetros de posicionamiento.</p>
                                    )}
                                    {servicioData.kilometrosPosicionamiento !== undefined && servicioData.kilometrosPosicionamiento < 0 && (
                                        <p className="text-red-500 text-sm">Los kilómetros de posicionamiento no pueden ser negativos.</p>
                                    )}
                                    
                                    {(servicioData.horasServicio === undefined || servicioData.horasServicio === null) && (
                                        <p className="text-red-500 text-sm">Debe ingresar las horas del servicio.</p>
                                    )}
                                    {servicioData.horasServicio !== undefined && servicioData.horasServicio < 0 && (
                                        <p className="text-red-500 text-sm">Las horas del servicio no pueden ser negativas.</p>
                                    )}
                                </div>

                                {/* Botón calcular */}
                                <div className="flex justify-center mt-6">
                                    
                                    <Button
                                        className="bg-blue-600 hover:cursor-pointer text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevenir el comportamiento predeterminado
                                            setModalOpen(true);
                                            console.log(formData)
                                        }}
                                        disabled={
                                            servicioData.kilometrosTrayecto === undefined || 
                                            servicioData.kilometrosTrayecto === null ||
                                            servicioData.kilometrosTrayecto < 0 ||
                                            servicioData.kilometrosPosicionamiento === undefined || 
                                            servicioData.kilometrosPosicionamiento === null ||
                                            servicioData.kilometrosPosicionamiento < 0 ||
                                            servicioData.horasServicio === undefined ||
                                            servicioData.horasServicio === null ||
                                            servicioData.horasServicio < 0
                                        }
                                        type="button" // Especificar tipo button para evitar submit
                                    >
                                        Calcular
                                    </Button>
                                </div>

                                {/* Modal */}
                                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                                    <DialogContent className="overflow-auto !sm:max-w-none !max-w-none !w-[90vw] md:!w-[75vw] lg:!w-[65vw] !h-auto min-h-[80vh] max-h-[90vh] !rounded-xl">
                                        <DialogTitle className="text-xl sm:text-2xl font-bold mb-1 ">Resultados del cálculo</DialogTitle>
                                        <div className="w-full overflow-auto rounded-lg bg-white p-0 sm:p-2">
                                            <RenderResultsView />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </form>
                        </div>
                    </SectionContainer>
                </>
            )}
        </div>
    );
}