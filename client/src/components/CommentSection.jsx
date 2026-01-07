import { useEffect, useState } from 'react'
import Comment from './Comment'
import { createNewCommentAPI, createNewReplyAPI, getCommentsByPostAPI, toggleActiveById, toggleLikeAPI, updateCommentAPI } from '~/apis'
import CommentInput from './CommentInput'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([])
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const currentUser = useSelector(selectCurrentUser)
  /*
  state này phải nằm trong component cha chứ không được nằm trong component con nếu nằm
  trong component con thì mỗi comment sẽ có activeInput riêng mỗi trạng thái nếu như thế thì
  sẽ không có 1 state chung của tất cả comments
  */
  const [activeInput, setActiveInput] = useState({
    commentId: null,
    type: null
  })

  useEffect(() => {
    const loadData = async () => {
      const res = await getCommentsByPostAPI(postId)
      setComments(res)
    }
    loadData()
  }, [postId])


  const addComment = async (data) => {
    toast.promise(createNewCommentAPI({ ...data, postId: postId }),
      {
        pending: 'Adding your comment...',
        success: 'your comment has been added successfully',
        error: 'Add comment failed'
      }).then(res => {
      if (!res.error) {
        reset()
        setComments( prevState => [res, ...prevState])
      }
    })
  }

  const addReply = async (parentCommentId, replyContent) => {
    const res = await createNewReplyAPI({
      parentCommentId,
      replyContent
    })

    setComments(prev =>
      prev.map(comment => {
        if (comment._id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), res]
          }
        }
        return comment
      })
    )
  }

  const toggleLike = async (targetId, targetType) => {
    const res = await toggleLikeAPI({
      targetId: targetId,
      targetType: targetType
    })

    const liked = res.liked

    setComments(prev => prev.map(c => {
      if (c._id === targetId) {
        return {
          ...c,
          isLiked: liked,
          likesCount: c.likesCount + (liked ? 1 : -1) }
      }

      return {
        ...c,
        replies: c.replies.map(r => r._id === targetId ? {
          ...r,
          isLiked: liked,
          likesCount: r.likesCount + (liked ? 1 : -1) } : r)
      }
    }))
  }

  const handleEdit = async (commentId, data) => {
    await updateCommentAPI(commentId, { ...data, postId: postId })
    setComments(
      prevState => prevState.map(item => item._id === commentId ? { ...item, content: data.content } : item )
    )
  }

  const handleDelete = async (commentId) => {
    await toggleActiveById('comments', commentId)
    const arrCopy = [...comments]
    const commentsFilter = arrCopy.filter(val => val._id !== commentId)
    setComments(commentsFilter)
  }


  return (
    <section className="mt-12">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Comments {comments.length}</h3>

      {/* Comment form */}
      {
        currentUser ? <CommentInput
          register={register}
          handleSubmit={handleSubmit}
          onSubmit = {addComment}
          errors={errors}
        /> :
          <div className='p-5 text-center font-bold uppercase'>
              please log in to comment
          </div>
      }


      {/* Single comment (with replies) */}
      <div className="space-y-6">
        {
          comments.length > 0 && comments.map(comment => (
            <Comment
              key={comment._id}
              commentId = {comment._id}
              comment={comment}
              activeInput={activeInput}
              setActiveInput={setActiveInput}
              onReply={addReply}
              onLike = {toggleLike}
              onEdit = {handleEdit}
              onDelete={handleDelete}
            />
          ))
        }
      </div>

      {/* Load more */}
      <div className="mt-8 mb-8 text-center">
        <button className="px-4 py-2 rounded-md cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
            Load more comments
        </button>
      </div>
    </section>
  )
}

export default CommentSection