'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/Navbar'
import AccessForm from './shared/AccessForm'
import SectionTitle from '@/components/shared/form/sectionTitle'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Verify access code on submit
  const handleVerifyAccess = async (accessCode: string) => {
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <SectionTitle title="Área de Administración" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Datos de Transportes</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Gestión de datos para la calculadora de costes de transportes de pasajeros
            </p>
            <Button 
              onClick={() => router.push('/cambiarDatosObservatorio/transportes')}
              className="w-full sm:w-auto"
            >
              Administrar Datos de Transportes
            </Button>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Datos de Mercancías</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Gestión de datos para la calculadora de costes de transporte de mercancías
            </p>
            <Button 
              onClick={() => router.push('/cambiarDatosObservatorio/mercancias')}
              className="w-full sm:w-auto"
            >
              Administrar Datos de Mercancías
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
