import { useState, useEffect } from 'react'
import TableItem from '~/components/Dashboard/TableItem'
import { useForm } from 'react-hook-form'
import { useDebounce } from '@uidotdev/usehooks'
import { getTagsAPI } from '~/apis'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

const ListTags = () => {
  const [tags, setTags] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { register, watch } = useForm({
    defaultValues: {
      search: '',
      sortField: 'createdAt',
      sortOrder: 'desc'
    }
  })

  const search = watch('search')
  const sortField = watch('sortField')
  const sortOrder = watch('sortOrder')
  // const indexOfLastPost = currentPage * 10
  // const indexOfFirstPost = indexOfLastPost - 10
  // const currentUsers = users.slice(indexOfFirstPost, indexOfLastPost)

  const debouncedSearch = useDebounce(search, 500)


  useEffect(() => {
    const fetchData = async () => {
      const [
        tags
      ] = await Promise.all([
        getTagsAPI()
      ])
      setTags(tags)
      // setTotalPages(posts.totalPages)
    }

    fetchData()
  }, [currentPage, debouncedSearch, sortField, sortOrder])

  return (
    <>
      <div className="p-4">
        <h1 className="text-gray-900 dark:text-white mt-5 font-bold">All Tags</h1>
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
          <Link to='/dashboard/add-tag' className='rounded p-2 bg-blue text-white'><Plus/></Link>
        </div>

        {tags.length > 0 ? <TableItem data={tags} sortField={sortField} sortOrder={sortOrder} setData={setTags}/> :
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

export default ListTags