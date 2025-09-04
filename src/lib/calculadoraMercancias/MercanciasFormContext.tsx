'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { 
  vehiculoSchema, 
  datosGeneralesSchema, 
  amortizacionYFinanciacionSchema, 
  personalSchema, 
  impuestosSchema,
  segurosSchema,
  otrosCostesSchema,
  neumaticosYCombustibleSchema,
  mantenimientoSchema,
  dietasYPeajesSchema,
  costesIndirectosSchema,
  calculadoraMercanciasSchema 
} from './schema';

// Define the form data type based on the schemas
export type Vehiculo = z.infer<typeof vehiculoSchema>;
export type DatosGenerales = z.infer<typeof datosGeneralesSchema>;
export type AmortizacionYFinanciacion = z.infer<typeof amortizacionYFinanciacionSchema>;
export type Personal = z.infer<typeof personalSchema>;
export type Impuestos = z.infer<typeof impuestosSchema>;
export type Seguros = z.infer<typeof segurosSchema>;
export type OtrosCostes = z.infer<typeof otrosCostesSchema>;
export type NeumaticosYCombustible = z.infer<typeof neumaticosYCombustibleSchema>;
export type Mantenimiento = z.infer<typeof mantenimientoSchema>;
export type DietasYPeajes = z.infer<typeof dietasYPeajesSchema>;
export type CostesIndirectos = z.infer<typeof costesIndirectosSchema>;
export type CalculadoraMercanciasData = z.infer<typeof calculadoraMercanciasSchema>;

// Define the validation status for each section
export type ValidationStatus = 'unvisited' | 'incomplete' | 'invalid' | 'valid';

// Define sections type
export type MercanciasSections = 
  'vehiculo' | 
  'datosGenerales' | 
  'amortizacionYFinanciacion' | 
  'personal' | 
  'impuestos' | 
  'seguros' | 
  'otrosCostes' | 
  'neumaticosYCombustible' | 
  'mantenimiento' | 
  'dietasYPeajes' | 
  'costesIndirectos';

// Define the form context type
interface MercanciasFormContextType {
  // Form data
  formData: Partial<CalculadoraMercanciasData>;
  updateFormData: (newData: Partial<CalculadoraMercanciasData>) => void;
  
  // Validation status
  validationStatus: {
    vehiculo: ValidationStatus;
    datosGenerales: ValidationStatus;
    amortizacionYFinanciacion: ValidationStatus;
    personal: ValidationStatus;
    impuestos: ValidationStatus;
    seguros: ValidationStatus;
    otrosCostes: ValidationStatus;
    neumaticosYCombustible: ValidationStatus;
    mantenimiento: ValidationStatus;
    dietasYPeajes: ValidationStatus;
    costesIndirectos: ValidationStatus;
  };
  
  // Visited status for each section
  visitedSections: {
    vehiculo: boolean;
    datosGenerales: boolean;
    amortizacionYFinanciacion: boolean;
    personal: boolean;
    impuestos: boolean;
    seguros: boolean;
    otrosCostes: boolean;
    neumaticosYCombustible: boolean;
    mantenimiento: boolean;
    dietasYPeajes: boolean;
    costesIndirectos: boolean;
  };
  
  // Mark a section as visited
  markAsVisited: (section: MercanciasSections) => void;
  
  // Validation errors
  validationErrors: {
    vehiculo: z.ZodError | null;
    datosGenerales: z.ZodError | null;
    amortizacionYFinanciacion: z.ZodError | null;
    personal: z.ZodError | null;
    impuestos: z.ZodError | null;
    seguros: z.ZodError | null;
    otrosCostes: z.ZodError | null;
    neumaticosYCombustible: z.ZodError | null;
    mantenimiento: z.ZodError | null;
    dietasYPeajes: z.ZodError | null;
    costesIndirectos: z.ZodError | null;
  };
  
  // Check if all sections are valid
  isFormValid: boolean;
}

// Create the context with a default value
const MercanciasFormContext = createContext<MercanciasFormContextType | undefined>(undefined);

// Create a provider component
export function MercanciasFormProvider({ children }: { children: React.ReactNode }) {
  // Initialize form data
  const [formData, setFormData] = useState<Partial<CalculadoraMercanciasData>>({});
  
  // Initialize validation status
  const [validationStatus, setValidationStatus] = useState({
    vehiculo: 'unvisited' as ValidationStatus,
    datosGenerales: 'unvisited' as ValidationStatus,
    amortizacionYFinanciacion: 'unvisited' as ValidationStatus,
    personal: 'unvisited' as ValidationStatus,
    impuestos: 'unvisited' as ValidationStatus,
    seguros: 'unvisited' as ValidationStatus,
    otrosCostes: 'unvisited' as ValidationStatus,
    neumaticosYCombustible: 'unvisited' as ValidationStatus,
    mantenimiento: 'unvisited' as ValidationStatus,
    dietasYPeajes: 'unvisited' as ValidationStatus,
    costesIndirectos: 'unvisited' as ValidationStatus,
  });
  
  // Initialize visited status
  const [visitedSections, setVisitedSections] = useState({
    vehiculo: false,
    datosGenerales: false,
    amortizacionYFinanciacion: false,
    personal: false,
    impuestos: false,
    seguros: false,
    otrosCostes: false,
    neumaticosYCombustible: false,
    mantenimiento: false,
    dietasYPeajes: false,
    costesIndirectos: false,
  });
  
  // Initialize validation errors
  const [validationErrors, setValidationErrors] = useState({
    vehiculo: null as z.ZodError | null,
    datosGenerales: null as z.ZodError | null,
    amortizacionYFinanciacion: null as z.ZodError | null,
    personal: null as z.ZodError | null,
    impuestos: null as z.ZodError | null,
    seguros: null as z.ZodError | null,
    otrosCostes: null as z.ZodError | null,
    neumaticosYCombustible: null as z.ZodError | null,
    mantenimiento: null as z.ZodError | null,
    dietasYPeajes: null as z.ZodError | null,
    costesIndirectos: null as z.ZodError | null,
  });
  
  // Initialize form validity
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Update form data
  const updateFormData = useCallback((newData: Partial<CalculadoraMercanciasData>) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  }, []);
  
  // Mark a section as visited
  const markAsVisited = useCallback((section: MercanciasSections) => {
    setVisitedSections(prev => {
      // Only update if not already visited to avoid unnecessary renders
      if (prev[section] === true) return prev;
      return { ...prev, [section]: true };
    });
  }, []);
  
  // Validate vehiculo section
  useEffect(() => {
    try {
      if (visitedSections.vehiculo) {
        const vehiculoData = {
          cv: formData.cv,
          mma: formData.mma,
          cargaUtil: formData.cargaUtil,
          ejes: formData.ejes,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          vehiculoData.cv !== undefined && 
          vehiculoData.mma !== undefined && 
          vehiculoData.cargaUtil !== undefined && 
          vehiculoData.ejes !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, vehiculo: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, vehiculo: null }));
          return;
        }
        
        // If all fields have values, validate them
        vehiculoSchema.parse(vehiculoData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, vehiculo: 'valid' }));
        setValidationErrors(prev => ({ ...prev, vehiculo: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, vehiculo: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, vehiculo: error }));
      }
    }
  }, [formData.cv, formData.mma, formData.cargaUtil, formData.ejes, visitedSections.vehiculo]);
  
  // Validate datos generales section
  useEffect(() => {
    try {
      if (visitedSections.datosGenerales) {
        const datosGeneralesData = {
          serviciosDiariosPorVehiculo: formData.serviciosDiariosPorVehiculo,
          kilometrajeAnual: formData.kilometrajeAnual,
          porcentajeKilometrajeVacio: formData.porcentajeKilometrajeVacio,
          horasAnualesTrabajadas: formData.horasAnualesTrabajadas,
          diasDeActividad: formData.diasDeActividad,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          datosGeneralesData.serviciosDiariosPorVehiculo !== undefined && 
          datosGeneralesData.kilometrajeAnual !== undefined && 
          datosGeneralesData.porcentajeKilometrajeVacio !== undefined && 
          datosGeneralesData.horasAnualesTrabajadas !== undefined && 
          datosGeneralesData.diasDeActividad !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, datosGenerales: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, datosGenerales: null }));
          return;
        }
        
        // If all fields have values, validate them
        datosGeneralesSchema.parse(datosGeneralesData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, datosGenerales: 'valid' }));
        setValidationErrors(prev => ({ ...prev, datosGenerales: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, datosGenerales: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, datosGenerales: error }));
      }
    }
  }, [
    formData.serviciosDiariosPorVehiculo, 
    formData.kilometrajeAnual, 
    formData.porcentajeKilometrajeVacio, 
    formData.horasAnualesTrabajadas, 
    formData.diasDeActividad, 
    visitedSections.datosGenerales
  ]);
  
  // Validate amortización y financiación section
  useEffect(() => {
    try {
      if (visitedSections.amortizacionYFinanciacion) {
        const amortizacionData = {
          // Cabeza tractora
          precioVentaSinIvaCabezaTractora: formData.precioVentaSinIvaCabezaTractora,
          descuentoMedioSobreTarifaCabezaTractora: formData.descuentoMedioSobreTarifaCabezaTractora,
          valorResidualPorcentajeCabezaTractora: formData.valorResidualPorcentajeCabezaTractora,
          periodoAmortizacionCabezaTractora: formData.periodoAmortizacionCabezaTractora,
          
          // Remolque
          precioVentaSinIvaRemolque: formData.precioVentaSinIvaRemolque,
          descuentoMedioSobreTarifaRemolque: formData.descuentoMedioSobreTarifaRemolque,
          valorResidualPorcentajeRemolque: formData.valorResidualPorcentajeRemolque,
          periodoAmortizacionRemolque: formData.periodoAmortizacionRemolque,
          
          // Financiación
          cuantiaAFinanciar: formData.cuantiaAFinanciar,
          periodoAFinanciar: formData.periodoAFinanciar,
          tipoInteresAnual: formData.tipoInteresAnual,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          // Cabeza tractora
          amortizacionData.precioVentaSinIvaCabezaTractora !== undefined && 
          amortizacionData.descuentoMedioSobreTarifaCabezaTractora !== undefined && 
          amortizacionData.valorResidualPorcentajeCabezaTractora !== undefined && 
          amortizacionData.periodoAmortizacionCabezaTractora !== undefined && 
          
          // Remolque
          amortizacionData.precioVentaSinIvaRemolque !== undefined && 
          amortizacionData.descuentoMedioSobreTarifaRemolque !== undefined && 
          amortizacionData.valorResidualPorcentajeRemolque !== undefined && 
          amortizacionData.periodoAmortizacionRemolque !== undefined && 
          
          // Financiación
          amortizacionData.cuantiaAFinanciar !== undefined && 
          amortizacionData.periodoAFinanciar !== undefined && 
          amortizacionData.tipoInteresAnual !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, amortizacionYFinanciacion: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, amortizacionYFinanciacion: null }));
          return;
        }
        
        // If all fields have values, validate them
        amortizacionYFinanciacionSchema.parse(amortizacionData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, amortizacionYFinanciacion: 'valid' }));
        setValidationErrors(prev => ({ ...prev, amortizacionYFinanciacion: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, amortizacionYFinanciacion: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, amortizacionYFinanciacion: error }));
      }
    }
  }, [
    // Cabeza tractora
    formData.precioVentaSinIvaCabezaTractora,
    formData.descuentoMedioSobreTarifaCabezaTractora,
    formData.valorResidualPorcentajeCabezaTractora,
    formData.periodoAmortizacionCabezaTractora,
    
    // Remolque
    formData.precioVentaSinIvaRemolque,
    formData.descuentoMedioSobreTarifaRemolque,
    formData.valorResidualPorcentajeRemolque,
    formData.periodoAmortizacionRemolque,
    
    // Financiación
    formData.cuantiaAFinanciar,
    formData.periodoAFinanciar,
    formData.tipoInteresAnual,
    visitedSections.amortizacionYFinanciacion
  ]);
  
  // Validate personal section
  useEffect(() => {
    try {
      if (visitedSections.personal) {
        const personalData = {
          seguridadSocialPorcentaje: formData.seguridadSocialPorcentaje,
          salarioBrutoAnual: formData.salarioBrutoAnual,
          plusDeAsistencia: formData.plusDeAsistencia,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          personalData.seguridadSocialPorcentaje !== undefined && 
          personalData.salarioBrutoAnual !== undefined && 
          personalData.plusDeAsistencia !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, personal: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, personal: null }));
          return;
        }
        
        // If all fields have values, validate them
        personalSchema.parse(personalData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, personal: 'valid' }));
        setValidationErrors(prev => ({ ...prev, personal: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, personal: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, personal: error }));
      }
    }
  }, [
    formData.seguridadSocialPorcentaje, 
    formData.salarioBrutoAnual, 
    formData.plusDeAsistencia, 
    visitedSections.personal
  ]);
  
  // Validate impuestos section
  useEffect(() => {
    try {
      if (visitedSections.impuestos) {
        const impuestosData = {
          visadoAutorizacion: formData.visadoAutorizacion,
          impuestoVehiculoTraccion: formData.impuestoVehiculoTraccion,
          costeItv: formData.costeItv,
          costeIAE: formData.costeIAE,
          costeTacografo: formData.costeTacografo,
          costeAtp: formData.costeAtp,
          costeAdr: formData.costeAdr,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          impuestosData.visadoAutorizacion !== undefined && 
          impuestosData.impuestoVehiculoTraccion !== undefined && 
          impuestosData.costeItv !== undefined && 
          impuestosData.costeIAE !== undefined && 
          impuestosData.costeTacografo !== undefined && 
          impuestosData.costeAtp !== undefined && 
          impuestosData.costeAdr !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, impuestos: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, impuestos: null }));
          return;
        }
        
        // If all fields have values, validate them
        impuestosSchema.parse(impuestosData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, impuestos: 'valid' }));
        setValidationErrors(prev => ({ ...prev, impuestos: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, impuestos: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, impuestos: error }));
      }
    }
  }, [
    formData.visadoAutorizacion,
    formData.impuestoVehiculoTraccion,
    formData.costeItv,
    formData.costeIAE,
    formData.costeTacografo,
    formData.costeAtp,
    formData.costeAdr,
    visitedSections.impuestos
  ]);
  
  // Validate seguros section
  useEffect(() => {
    try {
      if (visitedSections.seguros) {
        const segurosData = {
          tipoSeguro: formData.tipoSeguro,
          costeSeguroAnual: formData.costeSeguroAnual,
          seguroMercancia: formData.seguroMercancia,
          responsabilidadCivil: formData.responsabilidadCivil,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          segurosData.tipoSeguro !== undefined &&
          segurosData.costeSeguroAnual !== undefined && 
          segurosData.seguroMercancia !== undefined && 
          segurosData.responsabilidadCivil !== undefined;
                  
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, seguros: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, seguros: null }));
          return;
        }
        
        // If all fields have values, validate them
        segurosSchema.parse(segurosData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, seguros: 'valid' }));
        setValidationErrors(prev => ({ ...prev, seguros: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, seguros: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, seguros: error }));
      }
    }
  }, [
    formData.tipoSeguro,
    formData.costeSeguroAnual,
    formData.seguroMercancia,
    formData.responsabilidadCivil,
    visitedSections.seguros
  ]);
  
  // Validate otros costes section
  useEffect(() => {
    try {
      if (visitedSections.otrosCostes) {
        const otrosCostesData = {
          otrosCostesFijos: formData.otrosCostesFijos,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = otrosCostesData.otrosCostesFijos !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, otrosCostes: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, otrosCostes: null }));
          return;
        }
        
        // If all fields have values, validate them
        otrosCostesSchema.parse(otrosCostesData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, otrosCostes: 'valid' }));
        setValidationErrors(prev => ({ ...prev, otrosCostes: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, otrosCostes: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, otrosCostes: error }));
      }
    }
  }, [formData.otrosCostesFijos, visitedSections.otrosCostes]);
  
  // Validate neumaticos y combustible section
  useEffect(() => {
    try {
      if (visitedSections.neumaticosYCombustible) {
        const neumaticosData = {
          precioBrutoNeumaticos: formData.precioBrutoNeumaticos,
          descuentoMedioNeumaticos: formData.descuentoMedioNeumaticos,
          duracionMediaNeumaticosKm: formData.duracionMediaNeumaticosKm,
          numeroTotalNeumaticos: formData.numeroTotalNeumaticos,
          precioBrutoGasoleoSinIva: formData.precioBrutoGasoleoSinIva,
          descuentoMedioConbustible: formData.descuentoMedioConbustible,
          consumoMedioVehiculo100km: formData.consumoMedioVehiculo100km,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          neumaticosData.precioBrutoNeumaticos !== undefined && 
          neumaticosData.descuentoMedioNeumaticos !== undefined && 
          neumaticosData.duracionMediaNeumaticosKm !== undefined && 
          neumaticosData.numeroTotalNeumaticos !== undefined && 
          neumaticosData.precioBrutoGasoleoSinIva !== undefined && 
          neumaticosData.descuentoMedioConbustible !== undefined && 
          neumaticosData.consumoMedioVehiculo100km !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, neumaticosYCombustible: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, neumaticosYCombustible: null }));
          return;
        }
        
        // If all fields have values, validate them
        neumaticosYCombustibleSchema.parse(neumaticosData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, neumaticosYCombustible: 'valid' }));
        setValidationErrors(prev => ({ ...prev, neumaticosYCombustible: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, neumaticosYCombustible: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, neumaticosYCombustible: error }));
      }
    }
  }, [
    formData.precioBrutoNeumaticos,
    formData.descuentoMedioNeumaticos,
    formData.duracionMediaNeumaticosKm,
    formData.numeroTotalNeumaticos,
    formData.precioBrutoGasoleoSinIva,
    formData.descuentoMedioConbustible,
    formData.consumoMedioVehiculo100km,
    visitedSections.neumaticosYCombustible
  ]);
  
  // Validate mantenimiento section
  useEffect(() => {
    try {
      if (visitedSections.mantenimiento) {
        const mantenimientoData = {
          costeAnualMantenimiento: formData.costeAnualMantenimiento,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = mantenimientoData.costeAnualMantenimiento !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, mantenimiento: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, mantenimiento: null }));
          return;
        }
        
        // If all fields have values, validate them
        mantenimientoSchema.parse(mantenimientoData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, mantenimiento: 'valid' }));
        setValidationErrors(prev => ({ ...prev, mantenimiento: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, mantenimiento: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, mantenimiento: error }));
      }
    }
  }, [formData.costeAnualMantenimiento, visitedSections.mantenimiento]);
  
  // Validate dietas y peajes section
  useEffect(() => {
    try {
      if (visitedSections.dietasYPeajes) {
        const dietasData = {
          dietaMedia: formData.dietaMedia,
          numeroDias: formData.numeroDias,
          costeMedioPeajesPorServicio: formData.costeMedioPeajesPorServicio,
          porcentajeServiciosConPeaje: formData.porcentajeServiciosConPeaje,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          dietasData.dietaMedia !== undefined && 
          dietasData.numeroDias !== undefined && 
          dietasData.costeMedioPeajesPorServicio !== undefined && 
          dietasData.porcentajeServiciosConPeaje !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, dietasYPeajes: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, dietasYPeajes: null }));
          return;
        }
        
        // If all fields have values, validate them
        dietasYPeajesSchema.parse(dietasData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, dietasYPeajes: 'valid' }));
        setValidationErrors(prev => ({ ...prev, dietasYPeajes: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, dietasYPeajes: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, dietasYPeajes: error }));
      }
    }
  }, [
    formData.dietaMedia,
    formData.numeroDias,
    formData.costeMedioPeajesPorServicio,
    formData.porcentajeServiciosConPeaje,
    visitedSections.dietasYPeajes
  ]);
  
  // Validate costes indirectos section
  useEffect(() => {
    try {
      if (visitedSections.costesIndirectos) {
        const costesIndirectosData = {
          costesIndirectos: formData.costesIndirectos,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = costesIndirectosData.costesIndirectos !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, costesIndirectos: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, costesIndirectos: null }));
          return;
        }
        
        // If all fields have values, validate them
        costesIndirectosSchema.parse(costesIndirectosData);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, costesIndirectos: 'valid' }));
        setValidationErrors(prev => ({ ...prev, costesIndirectos: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, costesIndirectos: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, costesIndirectos: error }));
      }
    }
  }, [formData.costesIndirectos, visitedSections.costesIndirectos]);
  
  // This separate effect checks form validity based on validation status
  useEffect(() => {
    // Check if all sections are valid
    const allValid = 
      validationStatus.vehiculo === 'valid' && 
      validationStatus.datosGenerales === 'valid' && 
      validationStatus.amortizacionYFinanciacion === 'valid' && 
      validationStatus.personal === 'valid' && 
      validationStatus.impuestos === 'valid' && 
      validationStatus.seguros === 'valid' && 
      validationStatus.otrosCostes === 'valid' && 
      validationStatus.neumaticosYCombustible === 'valid' && 
      validationStatus.mantenimiento === 'valid' && 
      validationStatus.dietasYPeajes === 'valid' && 
      validationStatus.costesIndirectos === 'valid';
    
    setIsFormValid(allValid);
  }, [validationStatus]);
  
  return (
    <MercanciasFormContext.Provider
      value={{
        formData,
        updateFormData,
        validationStatus,
        visitedSections,
        markAsVisited,
        validationErrors,
        isFormValid,
      }}
    >
      {children}
    </MercanciasFormContext.Provider>
  );
}

// Create a hook to use the context
export function useMercanciasForm() {
  const context = useContext(MercanciasFormContext);
  if (context === undefined) {
    throw new Error('useMercanciasForm must be used within a MercanciasFormProvider');
  }
  return context;
}
