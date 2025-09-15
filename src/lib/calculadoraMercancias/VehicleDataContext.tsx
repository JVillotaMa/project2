"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CsvVehicleData } from '@/utils/csvParser';
import { useMercanciasForm } from './MercanciasFormContext';

// Define the context type
interface VehicleDataContextType {
  // Current selected vehicle data
  currentVehicleData: CsvVehicleData | null;
  // Function to set new vehicle data
  setCurrentVehicleData: (data: CsvVehicleData | null) => void;
  // Selected vehicle name
  selectedVehicleName: string | null;
  // Function to set selected vehicle name
  setSelectedVehicleName: (name: string | null) => void;
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  // Error state
  error: string | null;
  setError: (error: string | null) => void;
  // Function to fetch vehicle data
  fetchVehicleData: (vehicleName: string) => Promise<void>;
}

// Create the context
const VehicleDataContext = createContext<VehicleDataContextType | undefined>(undefined);

// Provider component
export function VehicleDataProvider({ children }: { children: ReactNode }) {
  const { updateFormData, markAsVisited } = useMercanciasForm();
  const [currentVehicleData, setCurrentVehicleData] = useState<CsvVehicleData | null>(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch vehicle data
  const fetchVehicleData = async (vehicleName: string) => {
    if (!vehicleName) {
      setCurrentVehicleData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/mercancias?vehicleName=${encodeURIComponent(vehicleName)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching vehicle data');
      }

      const data = await response.json();
      const vehicleData = data.data;
      setCurrentVehicleData(vehicleData);
      setSelectedVehicleName(vehicleName);
      console.log('Vehicle data loaded:', vehicleData);
      
      // Extract values with proper type checking and default values
      const cvValue = typeof vehicleData['CV'] === 'number' ? vehicleData['CV'] : null;
      const mmaValue = typeof vehicleData['MMA'] === 'number' ? vehicleData['MMA'] : null;
      const cargaUtilValue = typeof vehicleData['Carga util'] === 'number' ? vehicleData['Carga util'] : null;
      const ejesValue = typeof vehicleData['Num ejes'] === 'number' ? vehicleData['Num ejes'] : 2;
      
      console.log('Extracted vehicle values:', {
        cv: cvValue,
        mma: mmaValue,
        cargaUtil: cargaUtilValue,
        ejes: ejesValue
      });
      
      // Update form data with extracted values
      updateFormData({
        cv: cvValue,
        mma: mmaValue,
        cargaUtil: cargaUtilValue,
        ejes: ejesValue
      });
      
      // Mark the vehicle section as visited to trigger validation
      markAsVisited('vehiculo');
      
    } catch (err) {
      console.error('Error fetching vehicle data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setCurrentVehicleData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VehicleDataContext.Provider value={{
      currentVehicleData,
      setCurrentVehicleData,
      selectedVehicleName,
      setSelectedVehicleName,
      isLoading,
      setIsLoading,
      error,
      setError,
      fetchVehicleData
    }}>
      {children}
    </VehicleDataContext.Provider>
  );
}

// Custom hook to use the vehicle data context
export function useVehicleDataContext() {
  const context = useContext(VehicleDataContext);
  if (context === undefined) {
    throw new Error('useVehicleDataContext must be used within a VehicleDataProvider');
  }
  return context;
}
