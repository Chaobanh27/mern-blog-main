import AddItemForm from '~/components/Dashboard/AddItemForm'
import { createNewCategoryAPI } from '~/apis'

const AddCategory = () => {

  const handleAddCategory = async (name) => {
    await createNewCategoryAPI({ name })
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
