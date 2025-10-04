'use client'

interface LoadingProps {
  message?: string
}

export default function Loading({ message = 'Cargando datos...' }: LoadingProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-center items-center min-h-[40vh] sm:min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-6 sm:border-8 border-gray-200 border-t-red-600"></div>
        <p className="text-center sm:text-left sm:ml-4 text-base sm:text-lg font-semibold">{message}</p>
      </div>
    </div>
  )
}
