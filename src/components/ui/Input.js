import { forwardRef } from 'react'

export const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = "", 
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            transition-colors duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'