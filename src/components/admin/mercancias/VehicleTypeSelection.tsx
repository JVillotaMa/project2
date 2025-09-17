'use client'

import { useState } from 'react'
import SectionContainer from '@/components/shared/form/sectionContainer'

interface VehicleTypeSelectionProps {
  vehicleTypes: string[]
  selectedType: string
  onTypeChange: (type: string) => void
}

export default function VehicleTypeSelection({ 
  vehicleTypes, 
  selectedType, 
  onTypeChange 
}: VehicleTypeSelectionProps) {
  return (
    <SectionContainer subSectionTitle="Seleccionar Tipo de Vehículo">
      <div className="p-3 sm:p-4">
        <div className="flex flex-col space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {vehicleTypes.map(vehicleType => (
            <div key={vehicleType} className="flex items-center py-1.5 hover:bg-gray-50 rounded px-2">
              <input
                type="radio"
                id={`vehicle-${vehicleType}`}
                name="vehicleType"
                value={vehicleType}
                checked={selectedType === vehicleType}
                onChange={() => onTypeChange(vehicleType)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`vehicle-${vehicleType}`} className="ml-2 block text-sm font-medium text-gray-700 truncate">
                {vehicleType}
              </label>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}
