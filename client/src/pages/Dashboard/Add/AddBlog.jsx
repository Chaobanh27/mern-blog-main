import { Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import DashboardEditor from '~/components/Dashboard/DashboardEditor'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import Select from 'react-select'
import { createDraftAPI, createNewPostAPI, generateContentAPI, getCategoriesAPI, getTagsAPI, uploadMediaContentAPI } from '~/apis'
import { toast } from 'react-toastify'
import { marked } from 'marked'

const schema = yup.object({})

const AddBlog = () => {
  const initialValue= 'Welcome to TinyMCE!'
  const [content, setContent] = useState(initialValue ?? '')
  const [image, setImage] = useState(null)
  const [draftId, setDraftId] = useState('')
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  const { register, handleSubmit, getValues, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const fetchData = async () => {
      const [
        draftId,
        categories,
        tags
      ] = await Promise.all([
        createDraftAPI(),
        getCategoriesAPI(),
        getTagsAPI()
      ])

      setDraftId(draftId)
      setCategories(categories)
      setTags(tags)
    }

    fetchData()
  }, [])


  useEffect(() => setContent(initialValue ?? ''), [initialValue])

  const generateContent = async () => {
    const title = getValues('title')
    if (!title) return toast.error('Please enter a title')
    const res = await generateContentAPI({ prompt: title })
    if (res) {
      const AIContent = marked(res)
      setContent(AIContent)
    }
    return
  }


  const onSubmit = async (data) => {
    if (!image) return

    const formData = new FormData()
    formData.append('file', image)

    const res = await uploadMediaContentAPI(formData)

    if (res) {
      const blog = {
        ...data,
        coverImage: res.url,
        content: content
      }

      toast.promise(
        createNewPostAPI(blog),
        {
          pending: 'Creating new post...',
          success: 'Promise resolved 👌',
          error: 'Promise rejected 🤯'
        }
      )
    }
  }

  return (
    <div className='p-4'>
      <h1 className="text-gray-900 dark:text-white mt-5 font-bold">Create Posts</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='flex-1 bg-blue-50/50 dark:bg-gray-900 text-gray-600 h-full'>

        <p className='dark:text-white'>Upload thumbnail</p>
        <label htmlFor="image" >
          {!image ? <Upload /> : <img src={URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer' /> }
          <input onChange={e => setImage(e.target.files[0])} type="file" id='image' hidden />
        </label>

        <label className=' dark:text-white' htmlFor='title'><p>Blog title</p></label>
        <input {...register('title', { required: 'title is required' })} name='title' type="text" placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded dark:text-white'/>
        {errors.title && <span className='text-red-600'>{errors.title?.message}</span>}

        <p className=' dark:text-white'>Blog Content</p>
        <div className='h-screen'>
          <DashboardEditor setContent={setContent} initialValue={initialValue} content={content} draftId={draftId}/>
        </div>

        <div>
          <button className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded cursor-pointer'
            onClick={generateContent}>
            Generate Content With AI
          </button>
        </div>

        <Controller
          name='category'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder='category'
              closeMenuOnSelect={false}
              options={categories.map(c => ({
                value: c._id,
                label: c.name
              }))}
              onChange={val => field.onChange(val)}
            />
          )}
        />

        <Controller
          name='tags'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder='tags'
              closeMenuOnSelect={false}
              isMulti
              options={tags.map(c => ({
                value: c._id,
                label: c.name
              }))}
              onChange={val => field.onChange(val)}
            />
          )}
        />


        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer">
          Submit
        </button>

      </form>
    </div>
  )
}

export default AddBlog