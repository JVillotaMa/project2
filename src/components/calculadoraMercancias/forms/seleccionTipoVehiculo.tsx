"use client"
import * as React from "react"
import { ChevronsUpDown, Loader2 } from "lucide-react"
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
import { useVehicleDataContext } from "@/lib/calculadoraMercancias/VehicleDataContext";
import { useMercanciasForm } from "@/lib/calculadoraMercancias/MercanciasFormContext"

export default function SeleccionTipoVehiculo() {
    const [indexVehiculo, setIndexVehiculo] = React.useState<number | null>(null)
    const { formData } = useMercanciasForm()
    // Use the vehicle data context instead of the hook
    const { 
        isLoading, 
        error, 
        fetchVehicleData 
    } = useVehicleDataContext();

    function onSelectVehiculo(index: number) {
        console.log('Selected vehicle at index:', index, 'with name:', vehiculos[index].nombreVehiculo);
        setIndexVehiculo(index);
        // Fetch vehicle data from the context
        fetchVehicleData(vehiculos[index].nombreVehiculo);
    }



    return (
        <div className="flex flex-col gap-5">
            <SectionTitle title="Selección tipo vehículo" />
            <SectionContainer subSectionTitle="Datos iniciales">
                <div className="flex flex-col gap-10 px-15 py-10 justify-center">
                    <div className="flex flex-row gap-3 w-full align-center items-center">
                        <h3>Tipo de vehículo:</h3>
                        <SeleccionVehiculo onSelectVehiculo={onSelectVehiculo} />
                    </div>
                    {isLoading && (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2">Cargando datos del vehículo...</span>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    {!isLoading && !error && (
                        <div id="showVehicleData" className="flex flex-col gap-3 justify-center items-center pb-10">
                            <ShowInformation 
                                index={indexVehiculo} 
                                title="Potencia aproximada(CV):" 
                                value={formData.cv !== undefined ? Number(formData.cv) : null} 
                            />
                            <ShowInformation 
                                index={indexVehiculo} 
                                title="Masa máxima autorizada (MMA-Tons)" 
                                value={formData.mma !== undefined ? Number(formData.mma) : null} 
                            />
                            <ShowInformation 
                                index={indexVehiculo} 
                                title="Carga útil (Kg):" 
                                value={formData.cargaUtil !== undefined ? Number(formData.cargaUtil) : null} 
                            />
                            <ShowInformation 
                                index={indexVehiculo} 
                                title="Número de ejes:" 
                                value={formData.ejes !== undefined ? Number(formData.ejes) : null} 
                            />
                        </div>
                    )}
                </div>
            </SectionContainer>
        </div>
    )
}



function SeleccionVehiculo({ onSelectVehiculo }: { onSelectVehiculo: (index: number) => void }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const { selectedVehicleName } = useVehicleDataContext();
    
    // Effect to sync the value with selectedVehicleName from context
    React.useEffect(() => {
        if (selectedVehicleName) {
            // Find the index of the vehicle by name
            const index = vehiculos.findIndex(v => v.nombreVehiculo === selectedVehicleName);
            if (index !== -1) {
                setValue(index.toString());
            }
        }
    }, [selectedVehicleName]);
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full md:w-auto"
                >
                    <span className="truncate">
                        {value
                            ? vehiculos[parseInt(value)].nombreVehiculo
                            : "Selecciona un vehículo..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px] md:w-[400px] max-h-[300px]">
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