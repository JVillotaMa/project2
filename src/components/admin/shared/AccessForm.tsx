'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AccessFormProps {
  onSubmit: (accessCode: string) => Promise<void>
  isVerifying: boolean
  error: string
}

export default function AccessForm({ onSubmit, isVerifying, error }: AccessFormProps) {
  const [accessCode, setAccessCode] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(accessCode)
  }

  return (
    <div className="container mx-auto max-w-md mt-8 sm:mt-20 p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Área Restringida</h1>
      <p className="mb-4 sm:mb-6 text-gray-600 text-center text-sm sm:text-base">
        Esta página requiere autorización. Ingrese el código de acceso para continuar.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
  )
}
