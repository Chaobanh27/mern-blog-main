import AddItemForm from '~/components/Dashboard/AddItemForm'
import { createNewCategoryAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AddCategory = () => {

  const navigate = useNavigate()

  const handleAddCategory = async (name) => {
    if (!name) return toast.error('Please enter category name')
    toast.promise(createNewCategoryAPI({ name }), {
      pending: 'Adding new category',
      success: 'Adding new category successfully',
      error: 'Adding new category failed'
    }).then(res => {
      if (!res.error) {
        navigate('/dashboard/list-categories')
      }
    })
  }

  return (
    <AddItemForm
      title = 'Create Categories'
      label="Category name"
      placeholder="Enter category name"
      onSubmit={handleAddCategory}
    />
  )
}

export default AddCategory
