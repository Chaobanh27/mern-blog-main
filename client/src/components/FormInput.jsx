

const FormInput = ({ label, name, register, required, errors, placeholder = '' }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-white">
          {label}
        </label>
      )}

      <input
        {...register(name, { required })}
        placeholder={placeholder}
        className={`w-full dark:text-white
           rounded-md border px-3 py-2 focus:outline-none
          ${errors[name]
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-blue-500'
    }`}
      />

      {errors[name] && (
        <p className="text-sm text-red-500">
          {errors[name].message}
        </p>
      )}
    </div>
  )
}

export default FormInput
