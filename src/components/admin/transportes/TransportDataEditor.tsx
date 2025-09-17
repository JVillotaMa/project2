'use client'

import SectionContainer from '@/components/shared/form/sectionContainer'

interface FieldData {
  [key: string]: any
}

interface TransportDataEditorProps {
  busType: string
  fieldData: FieldData
  availableFields: string[]
  onFieldChange: (fieldName: string, value: string) => void
}

export default function TransportDataEditor({
  busType,
  fieldData,
  availableFields,
  onFieldChange
}: TransportDataEditorProps) {
  return (
    <SectionContainer subSectionTitle={`Editar Datos para ${busType}`}>
      <div className="p-3 sm:p-4">
        {availableFields.length > 0 ? (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {availableFields.map(fieldName => (
              <div key={fieldName} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center border-b pb-4">
                <label htmlFor={`field-${fieldName}`} className="block text-sm font-medium text-gray-700 truncate">
                  {fieldName}:
                </label>
                <input
                  type="text"
                  id={`field-${fieldName}`}
                  value={fieldData[fieldName] !== null ? fieldData[fieldName] : ''}
                  onChange={(e) => onFieldChange(fieldName, e.target.value)}
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
