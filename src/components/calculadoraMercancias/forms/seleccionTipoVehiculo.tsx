"use client"
import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import SectionContainer from "@/components/shared/form/sectionContainer";
import SectionTitle from "@/components/shared/form/sectionTitle";
import { vehiculos } from "../data/tiposVehiculos";
import ShowInformation from "./selecctionTipoVehiculo/showInformation"
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext";
import { useEffect } from "react";

export default function SeleccionTipoVehiculo() {
    const { formData, updateFormData, validationErrors, markAsVisited } = useMercanciasForm();
    const [indexVehiculo, setIndexVehiculo] = React.useState<number | null>(null);

    // Mark this section as visited when the component mounts
    useEffect(() => {
        // Use setTimeout to avoid render loops
        setTimeout(() => {
            markAsVisited('vehiculo');
        }, 0);
    }, [markAsVisited]);

    // Initialize indexVehiculo from formData if available
    useEffect(() => {
        // Check if formData has vehicle info that matches any vehicle in our list
        if (formData.cv !== undefined && formData.mma !== undefined &&
            formData.cargaUtil !== undefined && formData.ejes !== undefined) {

            // Try to find matching vehicle by comparing properties
            const matchingVehicleIndex = vehiculos.findIndex(vehicle =>
                vehicle.informacion.CV === formData.cv &&
                vehicle.informacion.MMA === formData.mma &&
                vehicle.informacion.CargaUtil === formData.cargaUtil &&
                vehicle.informacion.ejes === formData.ejes
            );

            if (matchingVehicleIndex !== -1) {
                console.log("Found matching vehicle at index:", matchingVehicleIndex);
                setIndexVehiculo(matchingVehicleIndex);
            }
        }
    }, [formData]);

    // Ensure the vehicle data display is updated when form data changes
    useEffect(() => {
        // Log current form data to help with debugging
        console.log("Form data updated:", {
            cv: formData.cv,
            mma: formData.mma,
            cargaUtil: formData.cargaUtil,
            ejes: formData.ejes
        });

        // If we don't have a selected vehicle but have vehicle data in the form,
        // try to find a matching vehicle
        if (indexVehiculo === null && formData.cv !== undefined) {
            const matchingVehicleIndex = vehiculos.findIndex(vehicle =>
                vehicle.informacion.CV === formData.cv &&
                vehicle.informacion.MMA === formData.mma &&
                vehicle.informacion.CargaUtil === formData.cargaUtil &&
                vehicle.informacion.ejes === formData.ejes
            );

            if (matchingVehicleIndex !== -1) {
                console.log("Auto-selecting vehicle at index:", matchingVehicleIndex);
                setIndexVehiculo(matchingVehicleIndex);
            }
        }
    }, [formData, indexVehiculo]);

    function onSelectVehiculo(index: number) {
        console.log("Índice de vehículo seleccionado:", index);

        // Establecer el índice del vehículo seleccionado
        setIndexVehiculo(index);

        // Actualizar los datos del formulario con la información del vehículo
        try {
            if (index >= 0 && index < vehiculos.length) {
                const vehicleData = vehiculos[index].informacion;
                console.log("Datos del vehículo:", vehicleData);

                // Crear objeto con todos los campos necesarios
                const updateData = {
                    cv: vehicleData.CV,
                    mma: vehicleData.MMA,
                    cargaUtil: vehicleData.CargaUtil,
                    ejes: vehicleData.ejes
                };

                console.log("Actualizando datos del formulario:", updateData);

                // Actualizar el contexto del formulario
                updateFormData(updateData);
            } else {
                console.error("Índice de vehículo fuera de rango:", index);
            }
        } catch (error) {
            console.error("Error al seleccionar vehículo:", error);
        }
    }

    // Get error messages for fields
    const getErrorMessage = (fieldName: string) => {
        // No errors if no validation errors
        if (!validationErrors.vehiculo) return undefined;

        // Get the field value
        const fieldValue = formData[fieldName as keyof typeof formData];

        // Only show error if the field has a value
        if (fieldValue === undefined) return undefined;

        // Get error from Zod validation
        const fieldErrors = validationErrors.vehiculo.format();
        const fieldError = fieldErrors[fieldName];

        return fieldError?._errors?.[0];
    };

    // Safe access to vehicle information to prevent runtime errors
    const getSafeVehicleData = (field: 'CV' | 'MMA' | 'CargaUtil' | 'ejes') => {
        if (indexVehiculo === null || indexVehiculo < 0 || indexVehiculo >= vehiculos.length) {
            return null;
        }
        return vehiculos[indexVehiculo].informacion[field];
    };

    return (
        <div className="flex flex-col gap-5 ">
            <SectionTitle title="Seleccion tipo vehículo" />
            <SectionContainer subSectionTitle="Datos iniciales">
                <div className="flex flex-col gap-10 py-10 justify-center items center">
                    <div className="flex flex-row gap-3 w-full align-center items-center justify-center">
                        <h3 className="text-lg font-semibold min-w-[160px]">Tipo de vehículo:</h3>
                        <SeleccionVehiculo onSelectVehiculo={onSelectVehiculo} />
                    </div>
                    <div className="w-full flex justify-center">
                    <div id="showVehicleData" className="flex flex-col justify-center gap-4 max-w-lg w-full p-4 rounded-md ">
                        <h3 className="text-md font-semibold border-b pb-2 mb-2">
                            {indexVehiculo !== null
                                ? <span className="">Datos del vehículo: {vehiculos[indexVehiculo].nombreVehiculo}</span>
                                : "Datos del vehículo seleccionado:"}
                        </h3>
                        
                            {indexVehiculo === null ? (
                                <div className="text-center text-gray-500 py-4">
                                    Por favor, seleccione un tipo de vehículo para ver sus datos
                                    {(formData.cv !== undefined || formData.mma !== undefined) && (
                                        <div className="text-xs  mt-2">
                                            Datos encontrados en el formulario pero sin vehículo asociado
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3   pl-4">
                                    <ShowInformation
                                        index={indexVehiculo}
                                        title="Potencia aproximada (CV):"
                                        value={formData.cv !== undefined ? formData.cv : getSafeVehicleData('CV')}
                                        error={getErrorMessage('cv')}
                                    />
                                    <ShowInformation
                                        index={indexVehiculo}
                                        title="Masa máxima autorizada (MMA-Tons):"
                                        value={formData.mma !== undefined ? formData.mma : getSafeVehicleData('MMA')}
                                        error={getErrorMessage('mma')}
                                    />
                                    <ShowInformation
                                        index={indexVehiculo}
                                        title="Carga útil (Kg):"
                                        value={formData.cargaUtil !== undefined ? formData.cargaUtil : getSafeVehicleData('CargaUtil')}
                                        error={getErrorMessage('cargaUtil')}
                                    />
                                    <ShowInformation
                                        index={indexVehiculo}
                                        title="Número de ejes:"
                                        value={formData.ejes !== undefined ? formData.ejes : getSafeVehicleData('ejes')}
                                        error={getErrorMessage('ejes')}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </div>
    )
}




function SeleccionVehiculo({ onSelectVehiculo }: { onSelectVehiculo: (index: number) => void }) {
    const [open, setOpen] = React.useState(false);
    const [selectedVehicle, setSelectedVehicle] = React.useState<number | null>(null);
    const { formData } = useMercanciasForm();

    // Initialize selection from formData if available
    React.useEffect(() => {
        if (formData.cv !== undefined && formData.mma !== undefined &&
            formData.cargaUtil !== undefined && formData.ejes !== undefined) {

            // Try to find matching vehicle
            const matchingVehicleIndex = vehiculos.findIndex(vehicle =>
                vehicle.informacion.CV === formData.cv &&
                vehicle.informacion.MMA === formData.mma &&
                vehicle.informacion.CargaUtil === formData.cargaUtil &&
                vehicle.informacion.ejes === formData.ejes
            );

            if (matchingVehicleIndex !== -1 && selectedVehicle !== matchingVehicleIndex) {
                console.log("SeleccionVehiculo: Setting vehicle to", matchingVehicleIndex);
                setSelectedVehicle(matchingVehicleIndex);
            }
        }
    }, [formData, selectedVehicle]);

    // Handle selection of a vehicle
    const handleSelect = (currentValue: string) => {
        console.log("Seleccionando vehículo:", currentValue);
        const index = parseInt(currentValue);

        // Actualizar estado local
        setSelectedVehicle(index);
        setOpen(false);

        // Notificar al componente padre
        onSelectVehiculo(index);
    };

    return (
        <div className="w-full max-w-sm">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between min-w-[300px] bg-white hover:bg-gray-100"
                    >
                        {selectedVehicle !== null
                            ? <span className="font-medium ">{vehiculos[selectedVehicle].nombreVehiculo}</span>
                            : "Selecciona un vehículo..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandList className="max-h-[300px] overflow-y-auto">
                            <CommandGroup>
                                {vehiculos.map((vehiculo, index) => (
                                    <CommandItem
                                        key={index}
                                        value={index.toString()}
                                        onSelect={handleSelect}
                                        className={`cursor-pointer hover:bg-blue-50 ${selectedVehicle === index ? 'bg-blue-100 font-medium' : ''}`}
                                    >
                                        {vehiculo.nombreVehiculo}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
