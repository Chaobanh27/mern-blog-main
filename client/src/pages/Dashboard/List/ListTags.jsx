import { useState, useEffect } from 'react'
import TableItem from '~/components/Dashboard/TableItem'
import { useForm } from 'react-hook-form'
import { useDebounce } from '@uidotdev/usehooks'
import { getTagsAPI } from '~/apis'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Pagination from '~/components/Pagination'

const ListTags = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tags, setTags] = useState([])
  const currentPage = parseInt(searchParams.get('page')) || 1
  const [totalPages, setTotalPages] = useState(0)
  const [totalTags, setTotalTags] = useState(0)

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

  const limit = 10

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTagsAPI(currentPage, limit)
      setTags(res.data)
      setTotalPages(res.totalPages)
      setTotalTags(res.totalTags)
    }

    fetchData()
  }, [currentPage, debouncedSearch, sortField, sortOrder])

  const changePage = (page) => {
    setSearchParams({ page })
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-gray-900 dark:text-white mt-5 font-bold">All Tags <span className='text-blue'>{totalTags}</span></h1>
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

        {
          tags.length > 0 ? <TableItem data={tags} sortField={sortField} sortOrder={sortOrder} setData={setTags}/> :
            <div className='dark:text-white w-full text-center font-bold uppercase'>
              <p>no results found</p>
            </div>
        }

        {/* PAGINATION */}
        <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage}/>
      </div>
    </>
  )
}

export default ListTags