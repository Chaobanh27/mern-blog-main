import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import Select from 'react-select'
import { fetchAuthorDetailAPI, getCategoriesAPI, getTagsAPI } from '~/apis'
import Pagination from '~/components/Pagination'
import PostPreview from '~/components/PostPreview'
import { selectCurrentTheme } from '~/redux/theme/themeSlice'

const Author = () => {
  const { userId } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()
  const [author, setAuthor] = useState({})
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const currentPage = parseInt(searchParams.get('page')) || 1
  const [totalPages, setTotalPages] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)

  const { register, watch, control } = useForm({
    defaultValues: {
      search: '',
      category: '',
      tag: [],
      sortField: 'createdAt',
      sortOrder: 'desc'
    }
  })

  const currentTheme = useSelector(selectCurrentTheme)

  const limit = 10

  const search = watch('search')
  const category = watch('category')
  const tag = watch('tag')
  const sortField = watch('sortField')
  const sortOrder = watch('sortOrder')

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    const fetchStaticData = async () => {
      const [categories, tags] = await Promise.all([
        getCategoriesAPI(),
        getTagsAPI()
      ])
      setCategories(categories.data)
      setTags(tags.data)
    }

    fetchStaticData()
  }, [])


  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetchAuthorDetailAPI(userId, {
        search: debouncedSearch,
        currentPage,
        limit,
        category: category?.value,
        tag,
        sortBy: sortField,
        order: sortOrder
      })
      setAuthor(res.author)
      setPosts(res.data.posts)
      setTotalPages(res.data.totalPages)
      setTotalPosts(res.data.totalPosts)
    }

    fetchPosts()
  }, [
    userId,
    currentPage,
    debouncedSearch,
    category,
    tag,
    sortField,
    sortOrder
  ])

  const changePage = (page) => {
    setSearchParams({ page })
  }


  return (
    <div className="space-y-8 py-30">
      {/* Author Info */}
      <section className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl shadow-md bg-white dark:bg-gray-800">
        <img
          src={author.avatar}
          alt={author.username}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold ">{author.username}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">this is author Bio</p>
        </div>
      </section>

      {/* Sort / Filter */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <div className=''>
          <input
            {
              ...register('search')
            }
            type="text"
            placeholder="Search...."
            className="border p-2 rounded w-full dark:border-white dark:text-white"
            value={search}
          />
        </div>

        <div className=''>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Category"
                options={categories?.map(c => ({
                  value: c._id,
                  label: c.name
                }))}
                onChange={val => field.onChange(val)}
                styles={{
                  singleValue: base => ({
                    ...base,
                    color: currentTheme == 'dark' ? 'white' : 'black'
                  }),
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: currentTheme == 'dark' ? '#364153' : 'white',
                    borderColor: state.isFocused ? '#3b82f6' : 'black',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#3b82f6'
                    }
                  }),
                  menu: base => ({
                    ...base,
                    zIndex: 50
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? '#e5e7eb'
                      : state.isSelected
                        ? '#3b82f6'
                        : 'white',
                    color: state.isSelected ? 'white' : '#111827',
                    cursor: 'pointer'
                  })
                }}
              />
            )}
          />
        </div>


        <div className=''>
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
                styles={{
                  singleValue: base => ({
                    ...base,
                    color: currentTheme == 'dark' ? 'white' : 'black'
                  }),
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: currentTheme == 'dark' ? '#364153' : 'white',
                    borderColor: state.isFocused ? '#3b82f6' : 'black',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#3b82f6'
                    }
                  }),
                  menu: base => ({
                    ...base,
                    zIndex: 50,
                    backgroundColor:'#364153'
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? '#e5e7eb'
                      : state.isSelected
                        ? '#3b82f6'
                        : 'white',
                    color: state.isSelected ? 'white' : '#111827',
                    cursor: 'pointer'
                  })
                }}
              />
            )}
          />
        </div>

        <div className=''>
          <select
            className="px-3 py-2 border rounded-lg w-full dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="newest">Newest → Oldest</option>
            <option value="oldest">Oldest → Newest</option>
            <option value="likesAsc">Likes: Low → High</option>
            <option value="likesDesc">Likes: High → Low</option>
          </select>
        </div>

      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? posts.map((post) => (
          <div key={post._id}>
            <PostPreview post={post}/>
          </div>
        )) :
          <div className='dark:text-white w-full text-center font-bold uppercase'>
            <p>no results found</p>
          </div>
        }
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage}/>


    </div>
  )
}

export default Author
