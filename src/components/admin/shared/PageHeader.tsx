'use client'

import { Button } from '@/components/ui/button'
import SectionTitle from '@/components/shared/form/sectionTitle'

interface PageHeaderProps {
  title: string
  onSave: () => void
  isSaving?: boolean
}

export default function PageHeader({ title, onSave, isSaving = false }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <SectionTitle title={title} />
      <Button 
        onClick={onSave}
        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
        disabled={isSaving}
      >
        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </div>
  )
}
