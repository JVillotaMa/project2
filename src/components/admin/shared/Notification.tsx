'use client'

interface NotificationProps {
  type: 'success' | 'error'
  message: string
}

export default function Notification({ type, message }: NotificationProps) {
  if (!message) return null

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100'
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400'
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700'

  return (
    <div className={`${bgColor} border ${borderColor} ${textColor} px-3 sm:px-4 py-2 sm:py-3 rounded relative mb-4 text-sm sm:text-base`}>
      {message}
    </div>
  )
}
