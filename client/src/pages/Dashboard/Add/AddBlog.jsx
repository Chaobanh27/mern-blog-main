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
  const [preview, setPreview] = useState(null)

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
      setCategories(categories.data)
      setTags(tags.data)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!image) return

    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)

    //Giải phóng bộ nhớ RAM xoá URL tạm vừa tạo chỉ chạy khi image thay đổi
    return () => URL.revokeObjectURL(objectUrl)
  }, [image])

  useEffect(() => setContent(initialValue ?? ''), [initialValue])

  const generateContent = async () => {
    const title = getValues('title')
    if (!title) return toast.error('Please enter a title')
    toast.promise(generateContentAPI({ prompt: title }), {
      pending: 'Loading AI content...',
      success: 'AI content generated successfully',
      error: 'AI content generated failed'
    }).then(res => {
      if (!res.error) {
        const AIContent = marked(res)
        setContent(AIContent)
      }
    })
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
          {!preview ? (
            <Upload />
          ) : (
            <img src={preview} className="mt-2 h-16 rounded cursor-pointer" />
          )}
          <input
            type="file"
            id="image"
            hidden
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImage(e.target.files[0])
              }
            }}
          />
        </label>

        <input {...register('title', { required: 'title is required' })} name='title' type="text" placeholder='Enter your title' required className='w-full mt-3 max-w-lg p-2 border border-gray-300 outline-none rounded dark:text-white'/>
        {errors.title && <span className='text-red-600'>{errors.title?.message}</span>}

        <div className='h-screen mt-3'>
          <DashboardEditor setContent={setContent} initialValue={initialValue} content={content} draftId={draftId}/>
        </div>

        <div>
          <button className='interceptor-loading bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded cursor-pointer mt-3'
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
              className='mt-3'
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
              className='mt-3'
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


        <button className="interceptor-loading bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer mt-3">
          Submit
        </button>

      </form>
    </div>
  )
}

export default AddBlog