'use client'

import SectionContainer from '@/components/shared/form/sectionContainer'

interface BusTypeSelectionProps {
  busTypes: string[]
  selectedType: string
  onTypeChange: (type: string) => void
}

export default function BusTypeSelection({ 
  busTypes, 
  selectedType, 
  onTypeChange 
}: BusTypeSelectionProps) {
  return (
    <SectionContainer subSectionTitle="Seleccionar Tipo de Autobús">
      <div className="p-3 sm:p-4">
        <div className="flex flex-col space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {busTypes.map(busType => (
            <div key={busType} className="flex items-center py-1.5 hover:bg-gray-50 rounded px-2">
              <input
                type="radio"
                id={`bus-${busType}`}
                name="busType"
                value={busType}
                checked={selectedType === busType}
                onChange={() => onTypeChange(busType)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`bus-${busType}`} className="ml-2 block text-sm font-medium text-gray-700 truncate">
                {busType}
              </label>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}
