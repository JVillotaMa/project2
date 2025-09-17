'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTransportesForm } from './TransportesFormContext';

interface TransportDataContextType {
  isLoading: boolean;
  error: string | null;
  transportData: any;
  selectedBusType: string;
  setSelectedBusType: (busType: string) => void;
  currentBusData: any;
}

const TransportDataContext = createContext<TransportDataContextType | undefined>(undefined);

export function TransportDataProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transportData, setTransportData] = useState<any>(null);
  const [selectedBusType, setSelectedBusType] = useState<string>('Menos de 22');
  const [currentBusData, setCurrentBusData] = useState<any>(null);
  
  const { updateFormData } = useTransportesForm();
  
  // Fetch transport data on component mount
  useEffect(() => {
    const fetchTransportData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching transport data from API...');
        const response = await fetch('/api/transportes');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch transport data: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }
        
        const result = await response.json();
        console.log('Transport data API response received',result.data);
        
        if (result.success && result.data) {
          console.log('Transport data successfully loaded');
          setTransportData(result.data);
          
          // Set initial bus data based on default selection
          updateBusDataForType(result.data, selectedBusType);
        } else {
          throw new Error(result.error || 'Failed to fetch transport data');
        }
      } catch (err) {
        console.error('Error fetching transport data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransportData();
  }, []);
  
  // Update current bus data when selected bus type changes
  useEffect(() => {
    if (transportData) {
      updateBusDataForType(transportData, selectedBusType);
    }
  }, [selectedBusType, transportData]);
  
  // Update bus data for the selected bus type
  const updateBusDataForType = (data: any, busType: string) => {
    if (!data) return;
    
    // Extract data for the selected bus type
    const busData: { [key: string]: any } = {};
    
    Object.keys(data).forEach((fieldName) => {
      if (data[fieldName] && data[fieldName][busType] !== undefined) {
        busData[fieldName] = data[fieldName][busType];
      }
    });
    
    setCurrentBusData(busData);
  };
  
  // Context value
  const value = {
    isLoading,
    error,
    transportData,
    selectedBusType,
    setSelectedBusType,
    currentBusData
  };
  
  return (
    <TransportDataContext.Provider value={value}>
      {children}
    </TransportDataContext.Provider>
  );
}

// Hook to use the transport data context
export function useTransportDataContext() {
  const context = useContext(TransportDataContext);
  
  if (context === undefined) {
    throw new Error('useTransportDataContext must be used within a TransportDataProvider');
  }
  
  return context;
}
