import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { fetchAllRolesAPI, fetchAllUsersAPI } from '~/apis'
import TableItem from '~/components/Dashboard/TableItem'
import LoadingSpinner from '~/components/LoadingSpinner'

const ListUsers = () => {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { register, watch, control } = useForm({
    defaultValues: {
      search: '',
      role: '',
      status: '',
      sortField: 'createdAt',
      sortOrder: 'desc'
    }
  })

  const search = watch('search')
  const role = watch('role')
  const status = watch('status')
  const sortField = watch('sortField')
  const sortOrder = watch('sortOrder')
  // const indexOfLastPost = currentPage * 10
  // const indexOfFirstPost = indexOfLastPost - 10
  // const currentUsers = users.slice(indexOfFirstPost, indexOfLastPost)

  const debouncedSearch = useDebounce(search, 500)


  useEffect(() => {
    const fetchData = async () => {
      const [roles, data] = await Promise.all([
        fetchAllRolesAPI(),
        fetchAllUsersAPI({
          search: debouncedSearch,
          currentPage,
          limit: 10,
          role: role.value,
          status: status.value,
          sortBy: sortField,
          order: sortOrder
        })
      ])

      setRoles(roles)
      setUsers(data.users)
      setTotalPages(data.totalPages)
    }

    fetchData()
  }, [currentPage, debouncedSearch, role, status, sortField, sortOrder])

  const statusArr = [
    { value: 'all', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'Inactive' }
  ]

  return (
    <>
      <div className="p-4">
        <h1 className="text-gray-900 dark:text-white mt-5 font-bold">All Users</h1>
        {/* SEARCH + FILTER */}
        <div className="flex justify-between mb-4 mt-4">
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
              name='role'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder='Roles'
                  closeMenuOnSelect={false}
                  options={roles.map(r => ({
                    value: r._id,
                    label: r.name
                  }))}
                  onChange={val => field.onChange(val)}
                />
              )}
            />

            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder='Status'
                  closeMenuOnSelect={false}
                  options={statusArr.map(r => ({
                    value: r.value,
                    label: r.label
                  }))}
                  onChange={val => field.onChange(val)}
                />
              )}
            />
          </div>
        </div>

        {users.length > 0 ? <TableItem data={users} sortField={sortField} sortOrder={sortOrder} setData={setUsers}/> : <LoadingSpinner/>}

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

export default ListUsers