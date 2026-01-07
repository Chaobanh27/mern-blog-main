import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const CommentInput = ({ register, handleSubmit, onSubmit, errors }) => {
  const user = useSelector(selectCurrentUser)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-4">
      <div className="sm:col-span-2 flex items-start justify-center">
        {user ? <img src={user?.avatar} className='w-20 h-20 rounded-full object-cover' alt="" /> : null}
      </div>
      <div className="sm:col-span-10 space-y-2">
        <textarea
          {...register('content', { required: 'comment is required' })}
          placeholder="Viết bình luận của bạn..."
          className="w-full min-h-[80px] p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue"
        />
        {errors.content && <span className='text-red-600'>{errors.content?.message}</span>}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button type="button" className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">Attach</button>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 rounded-md bg-blue text-white">Post comment</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CommentInput