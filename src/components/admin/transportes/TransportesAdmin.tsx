'use client'

import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import AccessForm from '../shared/AccessForm'
import Loading from '../shared/Loading'
import PageHeader from '../shared/PageHeader'
import Notification from '../shared/Notification'
import BusTypeSelection from './BusTypeSelection'
import TransportDataEditor from './TransportDataEditor'

// Define types
interface TransportData {
  [key: string]: {
    [busType: string]: number | string | null;
  };
}

export default function TransportesAdmin() {
  const [accessCode, setAccessCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Transport data states
  const [transportData, setTransportData] = useState<TransportData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBusType, setSelectedBusType] = useState('Menos de 22')
  const [currentData, setCurrentData] = useState<{[key: string]: any}>({})
  const [availableBusTypes, setAvailableBusTypes] = useState<string[]>([])
  const [availableFields, setAvailableFields] = useState<string[]>([])

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
        fetchData()
      } else {
        setError(data.message || 'Código de acceso no válido')
      }
    } catch (err) {
      setError('Error al verificar el código. Inténtelo de nuevo.')
      console.error('Error verifying access code:', err)
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
          title="Modificar Datos de Transportes" 
          onSave={saveChanges}
        />
        
        {error && <Notification type="error" message={error} />}
        {successMessage && <Notification type="success" message={successMessage} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {/* Left column: Select bus type */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <BusTypeSelection 
              busTypes={availableBusTypes}
              selectedType={selectedBusType}
              onTypeChange={handleBusTypeChange}
            />
          </div>
          
          {/* Right column: Edit fields */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <TransportDataEditor 
              busType={selectedBusType}
              fieldData={currentData}
              availableFields={availableFields}
              onFieldChange={handleFieldChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}
