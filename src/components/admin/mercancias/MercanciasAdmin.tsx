'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/shared/Navbar'
import AccessForm from '../shared/AccessForm'
import Loading from '../shared/Loading'
import PageHeader from '../shared/PageHeader'
import Notification from '../shared/Notification'
import VehicleTypeSelection from './VehicleTypeSelection'
import VehicleDataEditor from './VehicleDataEditor'

// Define types
interface VehicleData {
  [key: string]: string | number | null;
}

interface AllVehicleData {
  [vehicleType: string]: VehicleData;
}

export default function MercanciasAdmin() {
  const [accessCode, setAccessCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Vehicle data states
  const [allVehicleData, setAllVehicleData] = useState<AllVehicleData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVehicleType, setSelectedVehicleType] = useState('')
  const [currentVehicleData, setCurrentVehicleData] = useState<VehicleData>({})
  const [availableVehicleTypes, setAvailableVehicleTypes] = useState<string[]>([])

  // Verify access code on submit
  const handleVerifyAccess = async (code: string) => {
    setIsVerifying(true)
    setError('')
    setAccessCode(code)

    try {
      const response = await fetch('/api/verify-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode: code }),
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
        <AccessForm 
          onSubmit={handleVerifyAccess}
          isVerifying={isVerifying}
          error={error}
        />
      </>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    )
  }

  // Content for authorized users
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <PageHeader 
          title="Modificar Datos de Mercancías" 
          onSave={saveChanges}
        />
        
        {error && <Notification type="error" message={error} />}
        {successMessage && <Notification type="success" message={successMessage} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {/* Left column: Select vehicle type */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <VehicleTypeSelection 
              vehicleTypes={availableVehicleTypes}
              selectedType={selectedVehicleType}
              onTypeChange={handleVehicleTypeChange}
            />
          </div>
          
          {/* Right column: Edit fields */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <VehicleDataEditor 
              vehicleType={selectedVehicleType}
              vehicleData={currentVehicleData}
              onFieldChange={handleFieldChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}
