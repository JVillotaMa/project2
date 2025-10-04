'use client'

import SectionContainer from '@/components/shared/form/sectionContainer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FieldData {
  [key: string]: any
}

interface TransportDataEditorProps {
  busType: string
  fieldData: FieldData
  availableFields: string[]
  onFieldChange: (fieldName: string, value: string) => void
}

// Campos que se consideran "cambios regulares"
const regularChangeFields = [
  'Coste anual mantenimiento', 
  'Coste adquisicion vehiculo',  // Nombre correcto basado en el CSV
  'Coste combustible (€/L)'     // Nombre correcto basado en el CSV
];

export default function TransportDataEditor({
  busType,
  fieldData,
  availableFields,
  onFieldChange
}: TransportDataEditorProps) {
  // Filtrar los campos para separar los de cambios regulares del resto
  const regularFields = availableFields.filter(field => regularChangeFields.includes(field));
  const otherFields = availableFields.filter(field => !regularChangeFields.includes(field));

  // Componente para renderizar un campo individual
  const renderField = (fieldName: string) => (
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
  );

  return (
    <SectionContainer subSectionTitle={`Editar Datos para ${busType}`}>
      <div className="p-3 sm:p-4 space-y-6">
        {/* Sección de Cambios Regulares */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Cambios Regulares</CardTitle>
            <p className="text-sm text-gray-500">Campos que se modifican con mayor frecuencia</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regularFields.length > 0 ? (
                regularFields.map(fieldName => (
                  <div key={fieldName} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center border-b pb-4">
                    <label htmlFor={`field-${fieldName}`} className="block text-sm font-medium text-gray-700">
                      {fieldName === 'Coste anual mantenimiento' ? 'Coste anual de mantenimiento (€)' : 
                       fieldName === 'Coste adquisicion vehiculo' ? 'Coste de adquisición del vehículo (€)' : 
                       fieldName === 'Coste combustible (€/L)' ? 'Coste del combustible (€/L)' : 
                       fieldName}:
                    </label>
                    <input
                      type="text"
                      id={`field-${fieldName}`}
                      value={fieldData[fieldName] !== null ? fieldData[fieldName] : ''}
                      onChange={(e) => onFieldChange(fieldName, e.target.value)}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm sm:text-base"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay campos regulares disponibles.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resto de campos */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Otros Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {otherFields.length > 0 ? (
                otherFields.map(renderField)
              ) : (
                <p className="text-gray-500">No hay campos adicionales disponibles.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  )
}
