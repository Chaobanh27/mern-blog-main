import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createDraftAPI, generateContentAPI, getCategoriesAPI, getPostAPI, getTagsAPI, updatePostAPI, uploadMediaContentAPI } from '~/apis'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { marked } from 'marked'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import DashboardEditor from '~/components/Dashboard/DashboardEditor'

const schema = yup.object({})

const EditBlog = () => {
  const [post, setPost] = useState({})
  const [content, setContent] = useState('')
  const [previewImage, setPreviewImage] = useState(null)
  const [draftId, setDraftId] = useState('')
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const { postId } = useParams()

  const navigate = useNavigate()

  const { register, handleSubmit, setValue, getValues, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const fetchData = async () => {
      const [
        draftId,
        post,
        categories,
        tags
      ] = await Promise.all([
        createDraftAPI(),
        getPostAPI(postId),
        getCategoriesAPI(),
        getTagsAPI()
      ])
      setDraftId(draftId)
      setPost(post)
      setCategories(categories)
      setTags(tags)
    }

    fetchData()
  }, [postId])

  useEffect(() => {
    if (post?.coverImage) {
      setValue('coverImage', post?.coverImage)
    }

    if (post?.title) {
      setValue('title', post?.title)
    }

    if (post?.content) {
      setContent(post?.content)
    }

    if (post?.category && categories.length > 0) {
      const selectedCategory = categories
        .map(c => ({ value: c._id, label: c.name }))
        .find(opt => opt.value === post.category)

      if (selectedCategory) {
        setValue('category', selectedCategory)
      }
    }

    if (post?.tags?.length > 0 && tags.length > 0) {
      let selectedTags = []
      const optionsTags = tags.map(t => ({ value: t._id, label: t.name }))

      for (let j = 0; j < optionsTags.length; j++) {
        for (let i = 0; i < post?.tags.length; i++) {
          if (optionsTags[j].value === post?.tags[i] ) {
            selectedTags.push(optionsTags[j])
          }
        }
      }

      if (selectedTags) {
        setValue('tags', selectedTags)
      }
    }

  }, [post, categories, tags, setValue])


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
    let coverImageUrl = post.coverImage // ảnh cũ mặc định

    // 1️⃣ Nếu user chọn ảnh mới → upload
    if (data.coverImage instanceof File) {
      const formData = new FormData()
      formData.append('file', data.coverImage)

      const res = await uploadMediaContentAPI(formData)
      coverImageUrl = res.url
    }

    // 2️⃣ Build payload update
    const blog = {
      title: data.title,
      categoryId: data.category.value,
      tags: data.tags?.map(t => t.value),
      content: content,
      coverImage: coverImageUrl
    }

    // 3️⃣ Update post
    const res = await toast.promise(
      updatePostAPI(postId, blog),
      {
        pending: 'Updating post...',
        success: 'Post updated successfully 👌',
        error: 'Update failed 🤯'
      }
    )
    if (!res.error) navigate('/dashboard/list-blogs')

  }


  const categoriesToOptions = categories?.length > 0 && categories.map(c => ({
    value: c._id,
    label: c.name
  }))

  const tagsToOptions = tags?.length > 0 && tags.map(c => ({
    value: c._id,
    label: c.name
  }))


  return (
    <div className='p-4'>
      <h1 className="text-gray-900 dark:text-white mt-5 font-bold">Create Posts</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='flex-1 bg-blue-50/50 dark:bg-gray-900 text-gray-600 h-full'>

        <p className='dark:text-white'>Upload thumbnail</p>
        <label htmlFor="image" >
          <img src={previewImage || post?.coverImage} alt="cover image" className='mt-2 h-16 rounded cursor-pointer' />
          <Controller
            name='coverImage'
            control={control}
            render={({ field }) => (
              <input onChange={e => {
                const file = e.target.files[0]
                if (file) {
                  field.onChange(file)
                  setPreviewImage(URL.createObjectURL(file))
                }
              }} type="file" id='image' hidden />
            )}
          />
        </label>

        <label className=' dark:text-white' htmlFor='title'><p>Blog title</p></label>
        <input {...register('title', { required: 'title is required' })} name='title' type="text" placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded dark:text-white'/>
        {errors.title && <span className='text-red-600'>{errors.title?.message}</span>}

        <p className=' dark:text-white'>Blog Content</p>
        <div className='h-screen'>
          <DashboardEditor setContent={setContent} initialValue={post.content} content={content} draftId={draftId}/>
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
              options={categoriesToOptions}
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
              options={tagsToOptions}
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

export default EditBlog