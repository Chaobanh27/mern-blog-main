import AddItemForm from '~/components/Dashboard/AddItemForm'
import { createNewTagAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AddTag = () => {

  const navigate = useNavigate()

  const handleAddTag = async (name) => {
    if (!name) return toast.error('Please enter tag name')
    toast.promise(createNewTagAPI({ name }), {
      pending: 'Adding new tag',
      success: 'Adding new tag successfully',
      error: 'Adding new tag failed'
    }).then(res => {
      if (!res.error) {
        navigate('/dashboard/list-tags')
      }
    })
  }

  return (
    <AddItemForm
      title = 'Create Tags'
      label="Tag name"
      placeholder="Enter tag name"
      onSubmit={handleAddTag}
    />
  )
}

export default AddTag