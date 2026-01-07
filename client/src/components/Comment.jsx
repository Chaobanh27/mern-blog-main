import { MessageCircle, Pencil, ThumbsUp, Trash } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import ModalAlert from './ModalAlert'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

const Comment = ({ comment, commentId, onReply, onLike, onEdit, onDelete, activeInput, setActiveInput }) => {
  const [openModal, setOpenModal] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const user = useSelector(selectCurrentUser)
  const { replies } = comment

  dayjs.extend(relativeTime)

  const openReply = () => {
    setActiveInput({ commentId, type: 'reply' })
  }
  const openEdit = () => {
    setActiveInput({ commentId, type: 'edit' })
  }

  const closeInput = () => {
    setActiveInput({ commentId: null, type: null })
  }

  const handleReplySubmit = async (data) => {
    await onReply(commentId, data.replyContent)
    closeInput()
  }

  const handleEdit = async (data) => {
    await onEdit(commentId, data)
    closeInput()
  }

  const handleDelete = async (commentId) => {
    await onDelete(commentId)
    setOpenModal(false)
  }

  const openDelete = async () => {
    setOpenModal(true)
  }

  const isReplyOpen = activeInput.commentId === comment._id && activeInput.type === 'reply'
  const isEditOpen = activeInput.commentId === comment._id && activeInput.type === 'edit'

  return (
    <>
      <ModalAlert
        open={openModal}
        onClose={() => setOpenModal(false)}
        onDelete = {() => handleDelete(comment._id)}
        title="Confirm Delete"
      >
        <p>Do you want to delete this comment ?</p>
      </ModalAlert>
      <div className="flex gap-4">
        <img src={comment?.userId?.avatar} alt="" className='w-12 h-12 rounded-full object-cover' />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{comment.userId.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{dayjs(comment.createdAt).fromNow()}</p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">·</div>
          </div>
          {
            isEditOpen ? (
              <form onSubmit={handleSubmit(handleEdit)}>
                <textarea
                  {...register('content', { required: 'comment is required' })}
                  defaultValue={comment.content}
                  placeholder="Viết bình luận của bạn..."
                  className="w-full mt-2 min-h-[80px] p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue"
                />
                <div className='flex justify-end gap-2 text-xs'>
                  <button
                    type='submit'
                    className='hover:text-blue cursor-pointer'
                  >
                Save
                  </button>
                  <button
                    className='hover:text-blue cursor-pointer'
                    onClick={closeInput}
                  >
                Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mt-2 text-gray-700 dark:text-gray-200">
                  {comment.content}
                </div>

                <div className="mt-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>{comment.likesCount}</span>
                  {
                    user ?
                      <button onClick={async () => await onLike(commentId, 'comment')} className='hover:text-blue cursor-pointer' >
                        <ThumbsUp size={19} className={comment.isLiked && 'fill-blue'}/>
                      </button>
                      :
                      <button disabled className='hover:text-blue cursor-pointer' >
                        <ThumbsUp size={19}/>
                      </button>
                  }
                  {user ? <button className="hover:text-blue cursor-pointer" onClick={openReply}><MessageCircle size={19} className={isReplyOpen && 'fill-blue'} /></button> : <button disabled className="hover:text-blue cursor-pointer"><MessageCircle className={isReplyOpen && 'fill-blue'} /></button>}
                  {user?._id === comment?.userId?._id ?
                    <>
                      <button onClick={openEdit} className="hover:text-blue cursor-pointer"><Pencil size={19} /></button>
                      <button onClick={openDelete} className="hover:text-blue cursor-pointer"><Trash size={19} /></button>
                    </> : null}
                </div>
              </>
            )
          }


          {
            isReplyOpen && (
              <form onSubmit={handleSubmit(handleReplySubmit)} className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-4 mt-3">
                <div className="sm:col-span-10 space-y-2">
                  <textarea
                    {...register('replyContent', { required: 'reply is required' })}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full min-h-[80px] p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue"
                  />
                  {errors.replyContent && <span className='text-red-600'>{errors.replyContent?.message}</span>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <button type="button" onClick={() => setActiveInput({
                        commentId: null,
                        type: null
                      })}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer">Cancel</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="submit" className="px-4 py-2 rounded-md bg-blue text-white cursor-pointer">Post comment</button>
                    </div>
                  </div>
                </div>
              </form>
            )
          }

          {
            replies?.length > 0 && replies?.map(r => (
              <div key={r._id} className="mt-4 ml-14 space-y-4">
                <div className="flex gap-3">
                  <img src={r.userId.avatar} alt="" className='w-12 h-12 rounded-full object-cover' />
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{r.userId.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{dayjs(r.createdAt).fromNow()}</div>
                    <div className="mt-1 text-gray-700 dark:text-gray-200">
                      {r.content}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>{r.likesCount}</span>
                      {user ?
                        <>
                          <button onClick={async () => await onLike(r._id, 'comment')} className='hover:text-blue cursor-pointer' >
                            <ThumbsUp size={19} className={r.isLiked && 'fill-blue'}/>
                          </button>
                        </>
                        :
                        <button disabled className='hover:text-blue cursor-pointer' >
                          <ThumbsUp size={19}/>
                        </button>
                      }
                      {user ? <button className="hover:text-blue cursor-pointer"><Trash size={19} /></button> : null }
                    </div>
                  </div>
                </div>

              </div>
            ))

          }

        </div>
      </div>
    </>

  )
}

export default Comment