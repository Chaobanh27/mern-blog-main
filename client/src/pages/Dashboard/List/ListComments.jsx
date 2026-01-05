import { useState, useEffect } from 'react'
import TableItem from '~/components/Dashboard/TableItem'
import LoadingSpinner from '~/components/LoadingSpinner'
import { useForm } from 'react-hook-form'
import { useDebounce } from '@uidotdev/usehooks'
import { getCommentsAPI } from '~/apis'
import { useSearchParams } from 'react-router-dom'

const ListComments = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [comments, setComments] = useState([])
  const currentPage = parseInt(searchParams.get('page')) || 1
  const [totalPages, setTotalPages] = useState(1)


  const limit = 10

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

  const debouncedSearch = useDebounce(search, 500)


  useEffect(() => {
    const fetchData = async () => {
      const res = await getCommentsAPI(currentPage, limit)
      setComments(res.data)
      setTotalPages(res.totalPages)
    }

    fetchData()
  }, [currentPage, debouncedSearch, sortField, sortOrder])

  const changePage = (page) => {
    setSearchParams({ page })
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-gray-900 dark:text-white mt-5 font-bold">All Comments</h1>
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
        </div>

        {comments.length > 0 ? <TableItem data={comments} sortField={sortField} sortOrder={sortOrder} setData={setComments}/> : <LoadingSpinner/>}

        {/* PAGINATION */}
        <section className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
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
              onClick={() => changePage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            Next
          </button>
        </section>
      </div>
    </>
  )
}

export default ListComments