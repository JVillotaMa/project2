'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import { Button } from '@/components/ui/button'
import SectionTitle from '@/components/shared/form/sectionTitle'
import SectionContainer from '@/components/shared/form/sectionContainer'

// Define types
interface TransportData {
  [key: string]: {
    [busType: string]: number | string | null;
  };
}

export default function TransportesPage() {
  const [accessCode, setAccessCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  
  // Transport data states
  const [transportData, setTransportData] = useState<TransportData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBusType, setSelectedBusType] = useState('Menos de 22')
  const [currentData, setCurrentData] = useState<{[key: string]: any}>({})
  const [availableBusTypes, setAvailableBusTypes] = useState<string[]>([])
  const [availableFields, setAvailableFields] = useState<string[]>([])

  // Verify access code on submit
  const handleVerifyAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/verify-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode }),
      })

      const data = await response.json()

      if (response.ok && data.authorized) {
        setIsAuthorized(true)
        // Fetch data after authorization
        fetchData()
      } else {
        setError(data.message || 'Código de acceso no válido')
      }
    } catch (err) {
      setError('Error al verificar el código. Inténtelo de nuevo.')
    } finally {
      setIsVerifying(false)
    }
  }

  // Fetch transport data
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch transport data
      const transportRes = await fetch('/api/transportes')
      if (!transportRes.ok) {
        throw new Error('Error al cargar datos de transporte')
      }
      
      const transportResult = await transportRes.json()
      
      if (transportResult.success && transportResult.data) {
        setTransportData(transportResult.data)
        
        // Extract all available bus types and fields
        const firstField = Object.keys(transportResult.data)[0]
        if (firstField) {
          const busTypes = Object.keys(transportResult.data[firstField])
          setAvailableBusTypes(busTypes)
          setAvailableFields(Object.keys(transportResult.data))
          
          // Set default selected bus type
          if (busTypes.includes('Menos de 22')) {
            setSelectedBusType('Menos de 22')
            updateCurrentData(transportResult.data, 'Menos de 22')
          } else if (busTypes.length > 0) {
            setSelectedBusType(busTypes[0])
            updateCurrentData(transportResult.data, busTypes[0])
          }
        }
      }
    } catch (error) {
      setError(`Error al cargar los datos: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Update current data based on selected bus type
  const updateCurrentData = (data: TransportData, busType: string) => {
    const currentValues: {[key: string]: any} = {}
    
    Object.keys(data).forEach(fieldName => {
      if (data[fieldName] && data[fieldName][busType] !== undefined) {
        currentValues[fieldName] = data[fieldName][busType]
      }
    })
    
    setCurrentData(currentValues)
  }
  
  // Handle bus type selection change
  const handleBusTypeChange = (busType: string) => {
    setSelectedBusType(busType)
    if (transportData) {
      updateCurrentData(transportData, busType)
    }
  }
  
  // Handle field value change
  const handleFieldChange = (fieldName: string, value: string) => {
    setCurrentData(prev => {
      const newData = { ...prev }
      
      // Convert to number if possible
      if (value !== '' && !isNaN(Number(value))) {
        newData[fieldName] = Number(value)
      } else {
        newData[fieldName] = value === '' ? null : value
      }
      
      return newData
    })
  }
  
  // Save changes to the selected bus type
  const saveChanges = async () => {
    if (!transportData || !selectedBusType) return
    
    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    
    try {
      // Create updated data object
      const updatedData = { ...transportData }
      
      // Update values for the selected bus type
      Object.keys(currentData).forEach(fieldName => {
        if (updatedData[fieldName]) {
          updatedData[fieldName][selectedBusType] = currentData[fieldName]
        }
      })
      
      // Send update to API
      const response = await fetch('/api/transportes/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          data: updatedData,
          accessCode // Send access code for additional verification
        }),
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        setSuccessMessage(`Datos actualizados correctamente para ${selectedBusType}`)
        // Update local data
        setTransportData(updatedData)
      } else {
        throw new Error(result.error || 'Error al guardar los cambios')
      }
    } catch (error) {
      setError(`Error al guardar los cambios: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // If not authorized, show access form
  if (!isAuthorized) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto max-w-md mt-20 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Área Restringida</h1>
          <p className="mb-6 text-gray-600 text-center">
            Esta página requiere autorización. Ingrese el código de acceso para continuar.
          </p>
          
          <form onSubmit={handleVerifyAccess} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="accessCode" className="block text-sm font-medium">
                Código de Acceso
              </label>
              <input
                id="accessCode"
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isVerifying}
            >
              {isVerifying ? 'Verificando...' : 'Acceder'}
            </Button>
          </form>
        </div>
      </>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-8 border-gray-200 border-t-red-600"></div>
            <p className="ml-4 text-lg font-semibold">Cargando datos...</p>
          </div>
        </div>
      </>
    )
  }

  // Content for authorized users
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <SectionTitle title="Modificar Datos de Transportes" />
          <Button 
            onClick={saveChanges}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Guardar Cambios
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Select bus type */}
          <div className="lg:col-span-1">
            <SectionContainer subSectionTitle="Seleccionar Tipo de Autobús">
              <div className="p-4">
                <div className="flex flex-col space-y-2">
                  {availableBusTypes.map(busType => (
                    <div key={busType} className="flex items-center">
                      <input
                        type="radio"
                        id={`bus-${busType}`}
                        name="busType"
                        value={busType}
                        checked={selectedBusType === busType}
                        onChange={() => handleBusTypeChange(busType)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`bus-${busType}`} className="ml-2 block text-sm font-medium text-gray-700">
                        {busType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </SectionContainer>
          </div>
          
          {/* Right column: Edit fields */}
          <div className="lg:col-span-2">
            <SectionContainer subSectionTitle={`Editar Datos para ${selectedBusType}`}>
              <div className="p-4">
                {availableFields.length > 0 ? (
                  <div className="space-y-4">
                    {availableFields.map(fieldName => (
                      <div key={fieldName} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center border-b pb-4">
                        <label htmlFor={`field-${fieldName}`} className="block text-sm font-medium text-gray-700">
                          {fieldName}:
                        </label>
                        <input
                          type="text"
                          id={`field-${fieldName}`}
                          value={currentData[fieldName] !== null ? currentData[fieldName] : ''}
                          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>
                    ))}
                    
                    
                  </div>
                ) : (
                  <p className="text-gray-500">No hay campos disponibles para editar.</p>
                )}
              </div>
            </SectionContainer>
          </div>
        </div>
      </div>
    </>
  )
}
