'use client'

import SectionContainer from '@/components/shared/form/sectionContainer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface VehicleData {
  [key: string]: string | number | null;
}

interface VehicleDataEditorProps {
  vehicleType: string
  vehicleData: VehicleData
  onFieldChange: (key: string, value: string) => void
}

// Campos que se consideran "cambios regulares"
const regularChangeFields = [
  'Dto. Medio sobre tarifa (Cabeza tractora)',
  'Dto. Medio sobre tarifa (Semirremolque)',
  'Valor residual % (Cabeza tractora)',
  'Valor residual % (Semirremolque)',
  'Precio venta sin IVA (Cabeza tractora)',
  'Precio venta sin IVA (Semirremolque)',
  'Mantenimiento y reparacion',
  'Precio bruto gasoleo'
];

export default function VehicleDataEditor({
  vehicleType,
  vehicleData,
  onFieldChange
}: VehicleDataEditorProps) {
  // Filtrar los campos para separar los de cambios regulares del resto
  const regularFields = Object.keys(vehicleData).filter(key => regularChangeFields.includes(key));
  const otherFields = Object.keys(vehicleData).filter(key => !regularChangeFields.includes(key));

  // Función para obtener etiquetas mejoradas para los campos
  const getImprovedLabel = (key: string) => {
    switch (key) {
      case 'Dto. Medio sobre tarifa (Cabeza tractora)':
        return 'Descuento medio sobre tarifa (Cabeza tractora) (%)';
      case 'Dto. Medio sobre tarifa (Semirremolque)':
        return 'Descuento medio sobre tarifa (Semirremolque) (%)';
      case 'Valor residual % (Cabeza tractora)':
        return 'Valor residual (Cabeza tractora) (%)';
      case 'Valor residual % (Semirremolque)':
        return 'Valor residual (Semirremolque) (%)';
      case 'Precio venta sin IVA (Cabeza tractora)':
        return 'Precio de venta sin IVA (Cabeza tractora) (€)';
      case 'Precio venta sin IVA (Semirremolque)':
        return 'Precio de venta sin IVA (Semirremolque) (€)';
      case 'Mantenimiento y reparacion':
        return 'Coste de mantenimiento y reparación (€)';
      case 'Precio bruto gasoleo':
        return 'Precio bruto del gasóleo (€/L)';
      default:
        return key;
    }
  };

  // Renderizar un campo individual
  const renderField = (key: string) => (
    <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-center border-b pb-4">
      <label htmlFor={`field-${key}`} className="block text-sm font-medium text-gray-700 truncate">
        {getImprovedLabel(key)}:
      </label>
      <input
        type="text"
        id={`field-${key}`}
        value={vehicleData[key] !== null ? vehicleData[key] : ''}
        onChange={(e) => onFieldChange(key, e.target.value)}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm sm:text-base"
      />
    </div>
  );

  return (
    <SectionContainer subSectionTitle={`Editar Datos para ${vehicleType}`}>
      <div className="p-3 sm:p-4 space-y-6">
        {Object.keys(vehicleData).length > 0 ? (
          <>
            {/* Sección de Cambios Regulares */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Cambios Regulares</CardTitle>
                <p className="text-sm text-gray-500">Campos que se modifican con mayor frecuencia</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regularFields.length > 0 ? (
                    regularFields.map(renderField)
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
          </>
        ) : (
          <p className="text-gray-500">No hay campos disponibles para editar.</p>
        )}
      </div>
    </SectionContainer>
  )
}
