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

export default function SeleccionTipoVehiculo() {
    const [indexVehiculo, setIndexVehiculo] = React.useState<number | null>(null)
    function onSelectVehiculo(index: number) {
        // Lógica para manejar la selección del vehículo
        setIndexVehiculo(index)
    }
    return (
        <div className="flex flex-col gap-5 ">
            <SectionTitle title="Seleccion tipo vehículo" />
            <SectionContainer subSectionTitle="Datos iniciales">
                <div className="flex flex-col gap-10 px-15 py-10 justify-center">
                    <div className="flex flex-row gap-3 w-full align-center items-center">
                        <h3>Tipo de vehículo:</h3>
                        <SeleccionVehiculo onSelectVehiculo={onSelectVehiculo} />
                    </div>
                    <div id="showVehicleData" className="flex flex-col gap-3 justify-center items-center pb-10">
                        <ShowInformation index={indexVehiculo} title="Potencia aproximada(CV):" value={indexVehiculo !== null ? vehiculos[indexVehiculo].informacion.CV : null} />
                        <ShowInformation index={indexVehiculo} title="Masa máxima autorizada (MMA-Tons)" value={indexVehiculo !== null ? vehiculos[indexVehiculo].informacion.MMA : null} />
                        <ShowInformation index={indexVehiculo} title="Carga útil (Kg):" value={indexVehiculo !== null ? vehiculos[indexVehiculo].informacion.CargaUtil : null} />
                        <ShowInformation index={indexVehiculo} title="Número de ejes:" value={indexVehiculo !== null ? vehiculos[indexVehiculo].informacion.ejes : null} />

                    </div>
                </div>

            </SectionContainer>
        </div>
    )
}



function SeleccionVehiculo({ onSelectVehiculo }: { onSelectVehiculo: (index: number) => void }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {value
                        ? vehiculos[parseInt(value)].nombreVehiculo
                        : "Selecciona un vehículo..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {vehiculos.map((vehiculo, index) => (
                                <CommandItem
                                    key={index}
                                    value={index.toString()}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                        onSelectVehiculo(index)
                                    }}
                                >
                                    {vehiculo.nombreVehiculo}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
