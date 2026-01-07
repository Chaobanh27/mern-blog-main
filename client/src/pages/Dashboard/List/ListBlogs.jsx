import { useState, useEffect } from 'react'
import TableItem from '~/components/Dashboard/TableItem'
import { Controller, useForm } from 'react-hook-form'
import { useDebounce } from '@uidotdev/usehooks'
import Select from 'react-select'
import { getCategoriesAPI, getPostsAPI, getTagsAPI } from '~/apis'

const ListBlogs = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { register, watch, control } = useForm({
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
      setCategories(categories)
      setTags(tags)
      setTotalPages(posts.totalPages)
    }

    fetchData()
  }, [currentPage, debouncedSearch, category, tag, sortField, sortOrder])

  return (
    <>
      <div className="p-4">
        <h1 className="text-gray-900 dark:text-white mt-5 font-bold">All Posts</h1>
        {/* SEARCH + FILTER */}
        <div className="flex justify-between mb-4 mt-4 ">
          <input
            {
              ...register('search')
            }
            type="text"
            placeholder="Search...."
            className="border p-2 rounded w-1/3 dark:border-white dark:text-white"
            value={search}
          />

          <div className="flex gap-2">
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
        </div>

        {posts.length > 0 ? <TableItem data={posts} sortField={sortField} sortOrder={sortOrder} setData={setPosts}/> :
          <div className='dark:text-white w-full text-center font-bold uppercase'>
            <p>no results found</p>
          </div>
        }

        {/* PAGINATION */}
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
    </>
  )
}

export default ListBlogs