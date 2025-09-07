import type { InputHTMLAttributes, ReactNode } from 'react';

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onBlur'> {
  label: string;
  icon: ReactNode;
  isLoading?: boolean;
  error?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const Field = ({
  id,
  name,
  label,
  icon,
  isLoading = false,
  error,
  onBlur,
  ...props
}: FieldProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        {error && (
          <span className="text-sm text-red-400">{error}</span>
        )}
      </div>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          className={`
            w-full px-10 py-2 rounded-lg bg-gray-800 text-white
            border ${error ? 'border-red-500' : 'border-gray-700'} 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500
            transition-all duration-200
            ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
          `}
          onBlur={onBlur}
          {...props}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};