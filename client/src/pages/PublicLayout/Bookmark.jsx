import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import Select from 'react-select'
import { getBookmarksAPI, getCategoriesAPI, getTagsAPI } from '~/apis'
import Pagination from '~/components/Pagination'
import PostPreview from '~/components/PostPreview'

const Bookmark = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const currentPage = parseInt(searchParams.get('page')) || 1
  const [totalPages, setTotalPages] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)

  const { register, control, watch } = useForm({
    defaultValues: {
      search: '',
      category: '',
      tag: [],
      sortField: 'createdAt',
      sortOrder: 'desc'
    }
  })

  const search = watch('search')
  const category = watch('category')
  const tag = watch('tag')
  const sortField = watch('sortField')
  const sortOrder = watch('sortOrder')


  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    const fetchData = async () => {
      const [
        categories,
        tags,
        posts
      ] = await Promise.all([
        getCategoriesAPI(),
        getTagsAPI(),
        getBookmarksAPI(
          {
            search: debouncedSearch,
            currentPage,
            limit: 10,
            category: category.value,
            tag: tag,
            sortBy: sortField,
            order: sortOrder
          }
        )
      ])
      setPosts(posts.posts)
      setCategories(categories.data)
      setTags(tags.data)
      setTotalPages(posts.totalPages)
      setTotalPosts(posts.totalPosts)
    }

    fetchData()
  }, [currentPage, debouncedSearch, category, tag, sortField, sortOrder])


  const changePage = (page) => {
    setSearchParams({ page })
  }

  return (
    <div className="space-y-6 py-30 ">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">
            Bookmarks
        </h1>
      </header>

      {/* Search & Filters */}
      <section className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between rounded-xl shadow">
        <input
          {
            ...register('search')
          }
          type="text"
          placeholder="Search posts..."
          value={search}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue dark:bg-gray-700 dark:text-gray-100"
        />

        <div className="flex flex-wrap gap-3 text-black">
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder='category'
                closeMenuOnSelect={true}
                options={categories?.map(c => ({
                  value: c._id,
                  label: c.name
                }))}
                onChange={val => field.onChange(val)}
              />
            )}
          />

          <Controller
            name='tag'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder='tag'
                closeMenuOnSelect={true}
                isMulti
                options={tags?.map(c => ({
                  value: c._id,
                  label: c.name
                }))}
                onChange={val => field.onChange(val)}
              />
            )}
          />
        </div>
      </section>

      {/* Search Results Grid */}
      <section className={posts.length > 0 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'h-40'}>
        {posts.length > 0 ? posts.map(post => (
          <div key={post._id}>
            <PostPreview post={post}/>
          </div>
        )) :
          <div className='dark:text-white w-full text-center font-bold uppercase'>
            <p>no bookmarks found</p>
          </div>
        }
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage}/>

    </div>
  )
}

export default Bookmark
