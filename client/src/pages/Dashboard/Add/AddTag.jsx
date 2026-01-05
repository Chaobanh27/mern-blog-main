import AddItemForm from '~/components/Dashboard/AddItemForm'
import { createNewTagAPI } from '~/apis'

const AddTag = () => {

  const handleAddTag = async (name) => {
    await createNewTagAPI({ name })
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