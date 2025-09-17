'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import { Button } from '@/components/ui/button'
import SectionTitle from '@/components/shared/form/sectionTitle'
import SectionContainer from '@/components/shared/form/sectionContainer'

// Define types
interface VehicleData {
  [key: string]: string | number | null;
}

interface AllVehicleData {
  [vehicleType: string]: VehicleData;
}

export default function MercanciasPage() {
  const [accessCode, setAccessCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  
  // Vehicle data states
  const [allVehicleData, setAllVehicleData] = useState<AllVehicleData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVehicleType, setSelectedVehicleType] = useState('')
  const [currentVehicleData, setCurrentVehicleData] = useState<VehicleData>({})
  const [availableVehicleTypes, setAvailableVehicleTypes] = useState<string[]>([])

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
        fetchVehicleData()
      } else {
        setError(data.message || 'Código de acceso no válido')
      }
    } catch (err) {
      setError('Error al verificar el código. Inténtelo de nuevo.')
    } finally {
      setIsVerifying(false)
    }
  }

  // Fetch all vehicle data
  const fetchVehicleData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/mercancias/all')
      if (!response.ok) {
        throw new Error('Error al cargar datos de vehículos')
      }
      
      const result = await response.json()
      
      if (result.success && result.data) {
        setAllVehicleData(result.data)
        
        const vehicleTypes = Object.keys(result.data)
        setAvailableVehicleTypes(vehicleTypes)
        
        if (vehicleTypes.length > 0) {
          setSelectedVehicleType(vehicleTypes[0])
          setCurrentVehicleData(result.data[vehicleTypes[0]])
        }
      } else {
        throw new Error(result.error || 'Error al cargar datos de vehículos')
      }
    } catch (error) {
      setError(`Error al cargar los datos: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle vehicle type selection change
  const handleVehicleTypeChange = (vehicleType: string) => {
    if (allVehicleData && allVehicleData[vehicleType]) {
      setSelectedVehicleType(vehicleType)
      setCurrentVehicleData(allVehicleData[vehicleType])
    }
  }
  
  // Handle field value change
  const handleFieldChange = (key: string, value: string) => {
    setCurrentVehicleData(prev => {
      const newData = { ...prev }
      
      // Convert to number if possible
      if (value !== '' && !isNaN(Number(value))) {
        newData[key] = Number(value)
      } else {
        newData[key] = value === '' ? null : value
      }
      
      return newData
    })
  }
  
  // Save changes to the selected vehicle type
  const saveChanges = async () => {
    if (!currentVehicleData || !selectedVehicleType) return
    
    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    
    try {
      // Send update to API
      const response = await fetch('/api/mercancias/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          data: currentVehicleData,
          vehicleType: selectedVehicleType,
          accessCode // Send access code for additional verification
        }),
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        setSuccessMessage(`Datos actualizados correctamente para ${selectedVehicleType}`)
        
        // Update local data
        if (allVehicleData) {
          const updatedData = { ...allVehicleData }
          updatedData[selectedVehicleType] = currentVehicleData
          setAllVehicleData(updatedData)
        }
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
          <SectionTitle title="Modificar Datos de Mercancías" />
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
          {/* Left column: Select vehicle type */}
          <div className="lg:col-span-1">
            <SectionContainer subSectionTitle="Seleccionar Tipo de Vehículo">
              <div className="p-4">
                <div className="flex flex-col space-y-2">
                  {availableVehicleTypes.map(vehicleType => (
                    <div key={vehicleType} className="flex items-center">
                      <input
                        type="radio"
                        id={`vehicle-${vehicleType}`}
                        name="vehicleType"
                        value={vehicleType}
                        checked={selectedVehicleType === vehicleType}
                        onChange={() => handleVehicleTypeChange(vehicleType)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`vehicle-${vehicleType}`} className="ml-2 block text-sm font-medium text-gray-700">
                        {vehicleType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </SectionContainer>
          </div>
          
          {/* Right column: Edit fields */}
          <div className="lg:col-span-2">
            <SectionContainer subSectionTitle={`Editar Datos para ${selectedVehicleType}`}>
              <div className="p-4">
                {Object.keys(currentVehicleData).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(currentVehicleData).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center border-b pb-4">
                        <label htmlFor={`field-${key}`} className="block text-sm font-medium text-gray-700">
                          {key}:
                        </label>
                        <input
                          type="text"
                          id={`field-${key}`}
                          value={value !== null ? value : ''}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
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
