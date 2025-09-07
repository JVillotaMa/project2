'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTransportesForm } from "@/lib/calculadoraTransportes/TransportesFormContext";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";




export default function Resultados() {
    const { isFormValid } = useTransportesForm();
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

                                {/* Botón calcular */}
                                <div className="flex justify-center mt-6">
                                    <Button
                                        className="bg-blue-600 hover:cursor-pointer text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevenir el comportamiento predeterminado
                                            setModalOpen(true);
                                        }}
                                        disabled={optionSelected === "option-two" && (!servicioData.kilometrosTrayecto || !servicioData.horasServicio)}
                                        type="button" // Especificar tipo button para evitar submit
                                    >
                                        Calcular
                                    </Button>
                                </div>

                                {/* Modal */}
                                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                                    <DialogContent>
                                        <DialogTitle>Información</DialogTitle>
                                        <div className="py-4 text-center">Todavía no está implementado el cálculo.</div>
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