import {z} from "zod";

// -------------------- Datos generales --------------------
export const datosGeneralesSchema = z.object({
    tipoDeAutobus: z.enum(["Menos de 22 plazas","De 22 a 35 plazas","De 36 a 55 plazas","Mas de 55 plazas"], {message: "El campo Tipo de autobús debe estar relleno"}),
    salarioAnualConductor: z.number().min(1, "El campo Salario anual del conductor debe estar relleno"),
    horasAnualesTrabajadas: z.number().min(1, "El campo Horas anuales trabajadas debe estar relleno"),
    costesGenerales: z.number().min(0, "El campo Costes generales debe estar relleno").max(100,"El campo Costes generales es un porcentaje de 0 a 100"),
})

// -------------------- Datos del vehiculo --------------------

export const datosVehiculoSchema = z.object({
    costeDeAdquisicion: z.number().min(1, "El campo Coste de adquisición debe estar relleno"),
    vidaUtil: z.number().min(1, "El campo Vida útil (años) debe estar relleno"),
    costeFinanciacionTAE: z.number().min(0, "El campo Coste de financiación (TAE %) debe estar relleno").max(100, "El campo Coste de financiación (TAE %) no puede ser mayor de 100"),
    plazoFinanciacion: z.number().min(1, "El campo Plazo de financiación (años) debe estar relleno"),
    mantenimientoAnual: z.number().min(0, "El campo Mantenimiento anual debe estar relleno"),
    seguroAnual: z.number().min(0, "El campo Seguro anual debe estar relleno"),
});

// -------------------- Datos de circulación --------------------
export const datosCirculacionSchema = z.object({
    kilometrosAnuales: z.number().min(1, "El campo Kilómetros recorridos al año debe estar relleno"),
    costeDelCombustible: z.number().min(1, "El campo Coste del combustible (€/litro) debe estar relleno"),
    costeNeumatico: z.number().min(1, "El campo Coste de cada neumático del vehículo (€) debe estar relleno"),
    vidaUtilNeumatico: z.number().min(1, "El campo Vida útil de cada neumático (Km) debe estar relleno"),
});


export const calculadoraMercanciasSchema = datosGeneralesSchema
    .merge(datosVehiculoSchema)
    .merge(datosCirculacionSchema);