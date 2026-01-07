import EmojiPicker from 'emoji-picker-react'
import { Fullscreen, SmilePlus } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const CommentInput = ({ register, handleSubmit, onSubmit, watch, errors, setShowEmoji, showEmoji, onEmoji, theme }) => {
  const user = useSelector(selectCurrentUser)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-4">
      <div className="sm:col-span-2 flex items-start justify-center">
        {user ? <img src={user?.avatar} className='w-20 h-20 rounded-full object-cover' alt="" /> : null}
      </div>
      <div className="sm:col-span-10 space-y-2">
        <textarea
          {...register('content', {
            required: 'comment is required',
            minLength: {
              value: 1,
              message: 'Minium 1 characters long'
            },
            maxLength: {
              value: 200,
              message: 'Maximum 200 characters long'
            }
          })}
          placeholder="write your comment..."
          className="w-full min-h-[80px] p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue"
        />
        <div className='flex items-center justify-between'>
          <p>{watch('content')?.length || 0} / 200</p>
          <button
            type="button"
            onClick={() => setShowEmoji((prev) => !prev)}
            className="px-4 py-1 rounded-md bg-blue text-white"
          >
            <SmilePlus/>
          </button>
        </div>

        {
          showEmoji && (
            <div className=''>
              <EmojiPicker
                onEmojiClick={onEmoji}
                width={Fullscreen}
                theme={theme}
              />
            </div>
          )
        }

        {errors.content && <span className='text-red-600'>{errors.content?.message}</span>}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
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