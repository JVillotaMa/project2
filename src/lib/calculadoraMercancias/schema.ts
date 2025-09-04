import { z } from "zod";

// -------------------- Vehículo --------------------
export const vehiculoSchema = z.object({
  cv: z.number().min(1, "El campo CV debe estar relleno").nullable(),
  mma: z.number().min(1, "El campo MMA debe estar relleno").nullable(),
  cargaUtil: z.number().min(1, "El campo Carga útil debe estar relleno").nullable(),
  ejes: z.number().min(1, "El campo Ejes debe estar relleno"),
});

// -------------------- Datos generales --------------------
export const datosGeneralesSchema = z.object({
  serviciosDiariosPorVehiculo: z.number().min(1, "El campo Servicios diarios por vehículo debe estar relleno"),
  kilometrajeAnual: z.number().min(1, "El campo Kilometraje anual debe estar relleno"),
  porcentajeKilometrajeVacio: z.number().min(0, "El campo Porcentaje de kilometraje en vacío debe estar relleno").max(100, "El campo Porcentaje de kilometraje en vacío no puede ser mayor de 100"),
  horasAnualesTrabajadas: z.number().min(1, "El campo Horas anuales trabajadas debe estar relleno"),
  diasDeActividad: z.number().min(1, "El campo Días de actividad debe estar relleno"),
});

// -------------------- Amortización y financiación --------------------
export const amortizacionYFinanciacionSchema = z.object({
  // Cabeza tractora
  precioVentaSinIvaCabezaTractora: z.number().min(1, "El campo Precio de venta sin IVA de la cabeza tractora debe estar relleno"),
  descuentoMedioSobreTarifaCabezaTractora: z.number().min(0, "El campo Descuento medio sobre tarifa de la cabeza tractora debe estar relleno").max(100, "El campo Descuento medio sobre tarifa de la cabeza tractora no puede ser mayor de 100"),
  valorResidualPorcentajeCabezaTractora: z.number().min(0, "El campo Valor residual de la cabeza tractora (%) debe estar relleno").max(100, "El campo Valor residual de la cabeza tractora (%) no puede ser mayor de 100"),
  periodoAmortizacionCabezaTractora: z.number().min(1, "El campo Periodo de amortización de la cabeza tractora (años) debe estar relleno"),
  
  // Remolque
  precioVentaSinIvaRemolque: z.number().min(0, "El campo Precio de venta sin IVA del remolque debe estar relleno"),
  descuentoMedioSobreTarifaRemolque: z.number().min(0, "El campo Descuento medio sobre tarifa del remolque debe estar relleno").max(100, "El campo Descuento medio sobre tarifa del remolque no puede ser mayor de 100"),
  valorResidualPorcentajeRemolque: z.number().min(0, "El campo Valor residual del remolque (%) debe estar relleno").max(100, "El campo Valor residual del remolque (%) no puede ser mayor de 100"),
  periodoAmortizacionRemolque: z.number().min(1, "El campo Periodo de amortización del remolque (años) debe estar relleno"),
  
  // Financiación
  cuantiaAFinanciar: z.number().min(0, "El campo Cuantía a financiar debe estar relleno"),
  periodoAFinanciar: z.number().min(1, "El campo Periodo a financiar (años) debe estar relleno"),
  tipoInteresAnual: z.number().min(0, "El campo Tipo de interés anual (%) debe estar relleno").max(100, "El campo Tipo de interés anual (%) no puede ser mayor de 100"),
});

// -------------------- Personal --------------------
export const personalSchema = z.object({
  seguridadSocialPorcentaje: z.number().min(0, "El campo Seguridad social (%) debe estar relleno").max(100, "El campo Seguridad social (%) no puede ser mayor de 100"),
  salarioBrutoAnual: z.number().min(1, "El campo Salario bruto anual debe estar relleno"),
  plusDeAsistencia: z.number().min(0, "El campo Plus de asistencia debe estar relleno"),
});

// -------------------- Impuestos --------------------
export const impuestosSchema = z.object({
  visadoAutorizacion: z.number().min(0, "El campo Visado y autorización debe estar relleno"),
  impuestoVehiculoTraccion: z.number().min(0, "El campo Impuesto de vehículo de tracción debe estar relleno"),
  costeItv: z.number().min(0, "El campo Coste ITV debe estar relleno"),
  costeIAE: z.number().min(0, "El campo Coste IAE debe estar relleno"),
  costeTacografo: z.number().min(0, "El campo Coste tacógrafo digital debe estar relleno"),
  costeAtp: z.number().min(0, "El campo Coste ATP debe estar relleno"),
  costeAdr: z.number().min(0, "El campo Coste ADR debe estar relleno"),
});

export const segurosSchema = z.object({
  tipoSeguro: z.enum(["Obligatorios", "ObligatoriosTerceros", "TodoRiesgo"], {
    message: "Debe seleccionar un tipo de seguro"
  }),
  costeSeguroAnual: z.number().min(0, "El campo Coste del seguro anual debe estar relleno"),
  seguroMercancia: z.number().min(0, "El campo Seguro de mercancía debe estar relleno"),
  responsabilidadCivil: z.number().min(0, "El campo Responsabilidad civil debe estar relleno"),
});

// ---------------------Otros costes--------------------
export const otrosCostesSchema = z.object({
  otrosCostesFijos: z.number().min(0, "El campo Otros costes fijos debe estar relleno"),
});


// -------------------- Neumáticos y combustible --------------------
export const neumaticosYCombustibleSchema = z.object({
  precioBrutoNeumaticos: z.number().min(1, "El campo Precio bruto de los neumáticos debe estar relleno"),
  descuentoMedioNeumaticos: z.number().min(0, "El campo Descuento medio de los neumáticos debe estar relleno").max(100, "El campo Descuento medio de los neumáticos no puede ser mayor de 100"),
  duracionMediaNeumaticosKm: z.number().min(1, "El campo Duración media de los neumáticos (km) debe estar relleno"),
  numeroTotalNeumaticos: z.number().min(1, "El campo Número total de neumáticos debe estar relleno"),
  precioBrutoGasoleoSinIva: z.number().min(1, "El campo Precio bruto del gasóleo sin IVA debe estar relleno"),
  descuentoMedioConbustible: z.number().min(0, "El campo Descuento medio combustible debe estar relleno").max(100, "El campo Descuento medio combustible no puede ser mayor de 100"),
  consumoMedioVehiculo100km: z.number().min(1, "El campo Consumo medio del vehículo (l/100km) debe estar relleno"),
});

// -------------------- Dietas y pejas --------------------
export const dietasYPeajesSchema = z.object({
  dietaMedia: z.number().min(0, "El campo Dieta media debe estar relleno"),
  numeroDias: z.number().min(0, "El campo Número de dietas al mes debe estar relleno"),
  costeMedioPeajesPorServicio: z.number().min(0, "El campo Coste medio de peajes por servicio debe estar relleno"),
  porcentajeServiciosConPeaje: z.number().min(0, "El campo Porcentaje de servicios con peaje debe estar relleno").max(100, "El campo Porcentaje de servicios con peaje no puede ser mayor de 100"),
});

// -------------------- Mantenimiento --------------------
export const mantenimientoSchema = z.object({
  costeAnualMantenimiento: z.number().min(0, "El campo Coste anual de mantenimiento debe estar relleno"),
});

// -------------------- Costes indirectos --------------------
export const costesIndirectosSchema = z.object({
  costesIndirectos: z.number().min(0, "El campo Costes indirectos debe estar relleno"),
});

// -------------------- Esquema final combinando todos --------------------
export const calculadoraMercanciasSchema = vehiculoSchema
  .merge(datosGeneralesSchema)
  .merge(amortizacionYFinanciacionSchema)
  .merge(personalSchema)
  .merge(impuestosSchema)
  .merge(segurosSchema)
  .merge(otrosCostesSchema)
  .merge(neumaticosYCombustibleSchema)
  .merge(dietasYPeajesSchema)
  .merge(costesIndirectosSchema).merge(mantenimientoSchema);
