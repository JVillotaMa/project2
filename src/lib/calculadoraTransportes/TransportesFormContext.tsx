'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { datosGeneralesSchema, datosVehiculoSchema, datosCirculacionSchema, calculadoraMercanciasSchema } from './schema';

// Define the form data type based on the schemas
export type DatosGenerales = z.infer<typeof datosGeneralesSchema>;
export type DatosVehiculo = z.infer<typeof datosVehiculoSchema>;
export type DatosCirculacion = z.infer<typeof datosCirculacionSchema>;
export type CalculadoraTransportesData = z.infer<typeof calculadoraMercanciasSchema>;

// Define the validation status for each section
export type ValidationStatus = 'unvisited' | 'incomplete' | 'invalid' | 'valid';

// Define the form context type
interface TransportesFormContextType {
  // Form data
  formData: Partial<CalculadoraTransportesData>;
  updateFormData: (newData: Partial<CalculadoraTransportesData>) => void;
  
  // Validation status
  validationStatus: {
    datosGenerales: ValidationStatus;
    datosVehiculo: ValidationStatus;
    datosCirculacion: ValidationStatus;
  };
  
  // Visited status for each section
  visitedSections: {
    datosGenerales: boolean;
    datosVehiculo: boolean;
    datosCirculacion: boolean;
  };
  
  // Mark a section as visited
  markAsVisited: (section: 'datosGenerales' | 'datosVehiculo' | 'datosCirculacion') => void;
  
  // Validation errors
  validationErrors: {
    datosGenerales: z.ZodError | null;
    datosVehiculo: z.ZodError | null;
    datosCirculacion: z.ZodError | null;
  };
  
  // Check if all sections are valid
  isFormValid: boolean;
}

// Create the context with a default value
const TransportesFormContext = createContext<TransportesFormContextType | undefined>(undefined);

// Create a provider component
export function TransportesFormProvider({ children }: { children: React.ReactNode }) {
  // Initialize form data
  const [formData, setFormData] = useState<Partial<CalculadoraTransportesData>>({});
  
  // Initialize validation status
  const [validationStatus, setValidationStatus] = useState({
    datosGenerales: 'unvisited' as ValidationStatus,
    datosVehiculo: 'unvisited' as ValidationStatus,
    datosCirculacion: 'unvisited' as ValidationStatus,
  });
  
  // Initialize visited status
  const [visitedSections, setVisitedSections] = useState({
    datosGenerales: false,
    datosVehiculo: false,
    datosCirculacion: false,
  });
  
  // Initialize validation errors
  const [validationErrors, setValidationErrors] = useState({
    datosGenerales: null as z.ZodError | null,
    datosVehiculo: null as z.ZodError | null,
    datosCirculacion: null as z.ZodError | null,
  });
  
  // Initialize form validity
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Update form data
  const updateFormData = useCallback((newData: Partial<CalculadoraTransportesData>) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  }, []);
  
  // Mark a section as visited
  const markAsVisited = useCallback((section: keyof typeof validationStatus) => {
    setVisitedSections(prev => {
      // Only update if not already visited to avoid unnecessary renders
      if (prev[section] === true) return prev;
      return { ...prev, [section]: true };
    });
  }, []);
  
  // Validate datos generales
  useEffect(() => {
    try {
      if (visitedSections.datosGenerales) {
        const datosGenerales = {
          tipoDeAutobus: formData.tipoDeAutobus,
          salarioAnualConductor: formData.salarioAnualConductor,
          horasAnualesTrabajadas: formData.horasAnualesTrabajadas,
          costesGenerales: formData.costesGenerales,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          datosGenerales.tipoDeAutobus !== undefined && 
          datosGenerales.salarioAnualConductor !== undefined && 
          datosGenerales.horasAnualesTrabajadas !== undefined && 
          datosGenerales.costesGenerales !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, datosGenerales: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, datosGenerales: null }));
          return;
        }
        
        // If all fields have values, validate them
        datosGeneralesSchema.parse(datosGenerales);
        
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
  }, [formData.tipoDeAutobus, formData.salarioAnualConductor, formData.horasAnualesTrabajadas, formData.costesGenerales, visitedSections.datosGenerales]);
  
  // Validate datos vehiculo
  useEffect(() => {
    try {
      if (visitedSections.datosVehiculo) {
        const datosVehiculo = {
          costeDeAdquisicion: formData.costeDeAdquisicion,
          vidaUtil: formData.vidaUtil,
          costeFinanciacionTAE: formData.costeFinanciacionTAE,
          plazoFinanciacion: formData.plazoFinanciacion,
          mantenimientoAnual: formData.mantenimientoAnual,
          seguroAnual: formData.seguroAnual,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          datosVehiculo.costeDeAdquisicion !== undefined && 
          datosVehiculo.vidaUtil !== undefined && 
          datosVehiculo.costeFinanciacionTAE !== undefined && 
          datosVehiculo.plazoFinanciacion !== undefined && 
          datosVehiculo.mantenimientoAnual !== undefined && 
          datosVehiculo.seguroAnual !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, datosVehiculo: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, datosVehiculo: null }));
          return;
        }
        
        // If all fields have values, validate them
        datosVehiculoSchema.parse(datosVehiculo);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, datosVehiculo: 'valid' }));
        setValidationErrors(prev => ({ ...prev, datosVehiculo: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, datosVehiculo: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, datosVehiculo: error }));
      }
    }
  }, [formData.costeDeAdquisicion, formData.vidaUtil, formData.costeFinanciacionTAE, 
      formData.plazoFinanciacion, formData.mantenimientoAnual, formData.seguroAnual, 
      visitedSections.datosVehiculo]);
  
  // Validate datos circulacion
  useEffect(() => {
    try {
      if (visitedSections.datosCirculacion) {
        const datosCirculacion = {
          kilometrosAnuales: formData.kilometrosAnuales,
          costeDelCombustible: formData.costeDelCombustible,
          costeNeumatico: formData.costeNeumatico,
          vidaUtilNeumatico: formData.vidaUtilNeumatico,
        };
        
        // Check if all fields have been filled by the user
        const hasAllFields = 
          datosCirculacion.kilometrosAnuales !== undefined && 
          datosCirculacion.costeDelCombustible !== undefined && 
          datosCirculacion.costeNeumatico !== undefined && 
          datosCirculacion.vidaUtilNeumatico !== undefined;
        
        if (!hasAllFields) {
          // If not all fields have values, mark as incomplete
          setValidationStatus(prev => ({ ...prev, datosCirculacion: 'incomplete' }));
          setValidationErrors(prev => ({ ...prev, datosCirculacion: null }));
          return;
        }
        
        // If all fields have values, validate them
        datosCirculacionSchema.parse(datosCirculacion);
        
        // If validation passes, mark as valid
        setValidationStatus(prev => ({ ...prev, datosCirculacion: 'valid' }));
        setValidationErrors(prev => ({ ...prev, datosCirculacion: null }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Only mark as invalid if validation fails
        setValidationStatus(prev => ({ ...prev, datosCirculacion: 'invalid' }));
        setValidationErrors(prev => ({ ...prev, datosCirculacion: error }));
      }
    }
  }, [formData.kilometrosAnuales, formData.costeDelCombustible, formData.costeNeumatico, 
      formData.vidaUtilNeumatico, visitedSections.datosCirculacion]);

  // This separate effect checks form validity based on validation status
  useEffect(() => {
    // Check if all sections are valid
    const allValid = 
      validationStatus.datosGenerales === 'valid' && 
      validationStatus.datosVehiculo === 'valid' && 
      validationStatus.datosCirculacion === 'valid';
    
    setIsFormValid(allValid);
  }, [validationStatus]);
  
  return (
    <TransportesFormContext.Provider
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
    </TransportesFormContext.Provider>
  );
}

// Create a hook to use the context
export function useTransportesForm() {
  const context = useContext(TransportesFormContext);
  if (context === undefined) {
    throw new Error('useTransportesForm must be used within a TransportesFormProvider');
  }
  return context;
}
