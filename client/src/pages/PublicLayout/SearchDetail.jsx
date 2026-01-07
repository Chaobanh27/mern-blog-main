import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { getCategoriesAPI, getPostsAPI, getTagsAPI } from '~/apis'
import PostPreview from '~/components/PostPreview'

const SearchDetail = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const postsPerPage = 6
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.length > 0 && posts?.slice(indexOfFirstPost, indexOfLastPost)
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
        getPostsAPI(
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
    }

    fetchData()
  }, [currentPage, debouncedSearch, category, tag, sortField, sortOrder])

  return (
    <div className="space-y-6 py-30 ">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">
            Search Results
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
      <section className={currentPosts.length > 0 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'h-40'}>
        {currentPosts.length > 0 ? currentPosts.map((post) => (
          <div key={post._id}>
            <PostPreview post={post}/>
          </div>
        )) :
          <div className='dark:text-white w-full text-center font-bold uppercase'>
            <p>no results found</p>
          </div>
        }
      </section>

      {/* Pagination */}
      <section className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        <button
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
            Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded-lg transition ${
              currentPage === i + 1
                ? 'bg-blue text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
            Next
        </button>
      </section>
    </div>
  )
}

export default SearchDetail
