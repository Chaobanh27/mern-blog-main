import { useForm } from 'react-hook-form'
import FormInput from '../FormInput'

const AddItemForm = ({ title, label, fieldName = 'name', placeholder, onSubmit, loading = false }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const submitHandler = async (data) => {
    await onSubmit(data[fieldName])
    reset()
  }

  return (
    <div className='p-4'>
      <h1 className="text-gray-900 dark:text-white mt-5 font-bold">{title}</h1>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-3"
      >
        <FormInput
          label={label}
          name={fieldName}
          register={register}
          errors={errors}
          placeholder={placeholder}
          required={{
            value: true,
            message: `${label} is required`
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="interceptor-loading rounded-md bg-blue-600 px-4 py-2 text-white
                   hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>

  )
}

export default AddItemForm
