'use client'
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import FormInput from "@/components/shared/formInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ResultadosUnitarios from "./resultados/resultadosUnitarios/resultadosUnitarios";
import ResultadosPorServicio from "./resultados/resultadosPorServicio/resultadosPorServicio";

export default function Resultados() {
    const { formData, isFormValid } = useMercanciasForm();
    const [optionSelected, setOptionSelected] = React.useState("option-one");
    const [kilometrosServicio, setKilometrosServicio] = React.useState<number | undefined>(undefined);
    const [horasServicio, setHorasServicio] = React.useState<number | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [kilometrosError, setKilometrosError] = useState<string | null>(null);
    const [horasError, setHorasError] = useState<string | null>(null);

    // Handle number input changes for kilometros
    const handleKilometrosChange = (_name: string, value: number | undefined) => {
        if (value !== undefined && value <= 0) {
            setKilometrosError("Los kilometros deben ser mayores que 0");
            setKilometrosServicio(1);
        } else {
            setKilometrosError(null);
            setKilometrosServicio(value);
        }
    };

    // Handle number input changes for horas
    const handleHorasChange = (_name: string, value: number | undefined) => {
        if (value !== undefined && value <= 0) {
            setHorasError("Las horas deben ser mayores que 0");
            setHorasServicio(1);
        } else {
            setHorasError(null);
            setHorasServicio(value);
        }
    };

    // Verificar si hay errores de validación
    const hasValidationErrors = kilometrosError !== null || horasError !== null;

    function RenderResultsView() {
        if (optionSelected === "option-one" && isFormValid) {
            return <ResultadosUnitarios />
        } else if (optionSelected === "option-two" && isFormValid) {
            return <ResultadosPorServicio horasServicio={horasServicio!} kilometrosServicio={kilometrosServicio!}/>
        } else return null;
    }

    return (
        <div className="flex flex-col gap-5 ">
            <SectionTitle title="Resultados" />
            <SectionContainer subSectionTitle="¿Desea calcular el coste de un servicio?">
                <div className="flex justify-center">
                    <form className="flex flex-col gap-3 p-10 w-full">
                        {/* Here the user chooses the calculation option */}
                        <div id="calculation-type" className="flex flex-col ">
                            <RadioGroup defaultValue="option-one">
                                <div className="flex items-center space-x-2 justify-between">
                                    <div className="flex items-center space-x-2 ">
                                        <RadioGroupItem
                                            value="option-one"
                                            id="option-one"
                                            onClick={() => setOptionSelected("option-one")}
                                            disabled={!isFormValid}
                                        />
                                        <label htmlFor="option-one" className={!isFormValid ? "text-gray-400" : ""}>
                                            Calcular costes unitarios (por km/hora) del vehículo
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 ">
                                        <RadioGroupItem
                                            value="option-two"
                                            id="option-two"
                                            onClick={() => setOptionSelected("option-two")}
                                            disabled={!isFormValid}
                                        />
                                        <label htmlFor="option-two" className={!isFormValid ? "text-gray-400" : ""}>
                                            Calcular los costes totales de un servicio
                                        </label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                        {optionSelected === "option-two" && isFormValid && (
                            <>
                                <FormInput
                                    label="Kilometros del servicio:"
                                    name="kilometrosServicio"
                                    value={kilometrosServicio}
                                    onChange={handleKilometrosChange}
                                    defaultValue={100}
                                />
                                {kilometrosError && <div className="text-red-500">{kilometrosError}</div>}
                                <FormInput
                                    label="Horas del servicio:"
                                    name="horasServicio"
                                    value={horasServicio}
                                    onChange={handleHorasChange}
                                    defaultValue={2}
                                />
                                {horasError && <div className="text-red-500">{horasError}</div>}
                            </>
                        )}
                        {!isFormValid && (
                            <div className="text-red-500 mt-4 p-3 bg-red-50 rounded-md">
                                Para ver los resultados, debe completar correctamente todos los campos del formulario.
                            </div>
                        )}

                        {/* Botón calcular */}
                        <div className="flex justify-center mt-6">
                            <button
                                type="button"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition hover:cursor-pointer disabled:cursor-default disabled:opacity-50"
                                onClick={() => { setModalOpen(true); console.log(formData) }}
                                disabled={optionSelected === "option-two" && (!kilometrosServicio || !horasServicio || hasValidationErrors)}
                            >
                                Calcular
                            </button>
                        </div>

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
        </div>
    )
}