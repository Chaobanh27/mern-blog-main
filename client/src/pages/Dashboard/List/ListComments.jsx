import { useState, useEffect } from 'react'
import TableItem from '~/components/Dashboard/TableItem'
import { useForm } from 'react-hook-form'
import { useDebounce } from '@uidotdev/usehooks'
import { getCommentsAPI } from '~/apis'
import { useSearchParams } from 'react-router-dom'
import Pagination from '~/components/Pagination'

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

        {comments.length > 0 ? <TableItem data={comments} sortField={sortField} sortOrder={sortOrder} setData={setComments}/> :
          <div className='dark:text-white w-full text-center font-bold uppercase'>
            <p>no results found</p>
          </div>}

        {/* PAGINATION */}
        <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage}/>
      </div>
    </>
  )
}

export default ListComments