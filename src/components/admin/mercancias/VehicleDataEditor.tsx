'use client'

import SectionContainer from '@/components/shared/form/sectionContainer'

interface VehicleData {
  [key: string]: string | number | null;
}

interface VehicleDataEditorProps {
  vehicleType: string
  vehicleData: VehicleData
  onFieldChange: (key: string, value: string) => void
}

export default function VehicleDataEditor({
  vehicleType,
  vehicleData,
  onFieldChange
}: VehicleDataEditorProps) {
  return (
    <SectionContainer subSectionTitle={`Editar Datos para ${vehicleType}`}>
      <div className="p-3 sm:p-4">
        {Object.keys(vehicleData).length > 0 ? (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {Object.entries(vehicleData).map(([key, value]) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center border-b pb-4">
                <label htmlFor={`field-${key}`} className="block text-sm font-medium text-gray-700 truncate">
                  {key}:
                </label>
                <input
                  type="text"
                  id={`field-${key}`}
                  value={value !== null ? value : ''}
                  onChange={(e) => onFieldChange(key, e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm sm:text-base"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay campos disponibles para editar.</p>
        )}
      </div>
    </SectionContainer>
  )
}
