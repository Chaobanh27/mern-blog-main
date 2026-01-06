import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createNewBookmarkAPI, getPostAPI, getRelatedPostsAPI, toggleLikeAPI } from '../../apis'
// import CommentSection from '~/components/CommentSection'
import CommentSection from '../../components/CommentSection'
import DOMpurify from 'dompurify'
import { Bookmark, Heart } from 'lucide-react'
import { toast } from 'react-toastify'
// import RelatedPosts from '~/components/RelatedPosts'
import RelatedPosts from '../../components/RelatedPosts'
import { useSelector } from 'react-redux'
// import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCurrentUser } from '../../redux/user/userSlice'

const BlogDetail = () => {
  const [post, setPost] = useState({})
  const [relatedPosts, setRelatedPosts] = useState([])
  const { postId } = useParams()
  const currentUser = useSelector(selectCurrentUser)


  useEffect(() => {
    const fetchData = async () => {
      const post = await getPostAPI(postId)

      const related = await getRelatedPostsAPI({
        currentPostId: postId,
        categoryId: post?.category,
        tagIds: post?.tags
      })
      setPost(post)
      setRelatedPosts(related)

    }

    fetchData()
  }, [postId])

  const toggleLike = async (targetId, targetType) => {
    const res = await toggleLikeAPI({
      targetId: targetId,
      targetType: targetType
    })

    const { liked } = res

    setPost(p => ({
      ...p,
      isLiked: liked,
      likesCount: p.likesCount + (liked ? 1 : -1) })
    )
  }

  const handleBookmark = async () => {
    const res = await toast.promise(
      createNewBookmarkAPI(postId),
      {
        pending: 'Saving...',
        success: 'Post has been saved 👌',
        error: 'Post saving fail  🤯'
      }
    )
    const { isBookmarked } = res

    setPost(p => ({
      ...p,
      isBookmarked: isBookmarked
    })
    )
  }

  return (
    <>
      <main className="py-30 ">
        {/* Post header */}
        <article className="prose lg:prose-xl dark:prose-invert">
          <header className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  {post.title}
                </h1>
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-300 flex items-center gap-3">
                  <Link to='/author-detail'><span>By <strong className="text-gray-700 dark:text-gray-100">{post.author?.username}</strong></span></Link>
                  <span>•</span>
                  <time dateTime="2025-09-01">{new Date(post.createdAt).toLocaleDateString()}</time>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>

              {
                currentUser && <div className="flex items-center gap-3">
                  {/* Like button */}
                  <button
                    onClick={async () => await toggleLike(post._id, 'post')}
                    type="button"
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:scale-105 transition transform"
                    aria-label="Like article"
                  >
                    <Heart className={post.isLiked && 'fill-red-600'}/>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{post.likesCount}</span>
                  </button>

                  {/* Bookmark button */}
                  <button
                    type="button"
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:scale-105 transition transform"
                    aria-label="Bookmark article"
                    onClick={handleBookmark}
                  >
                    <Bookmark className={post.isBookmarked && 'fill-blue'}/>
                    <span className="text-sm text-gray-700 dark:text-gray-200">Save</span>
                  </button>
                </div>
              }

            </div>

            {/* Featured image */}
            <div className="mt-6 w-full h-60 sm:h-80 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={post.coverImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          {/* Post content */}
          <section className="mt-6 space-y-6 text-gray-700 dark:text-gray-200"
            dangerouslySetInnerHTML={{
              __html: DOMpurify.sanitize(post.content)
            }}>
          </section>
        </article>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

        {/* Interaction bar for mobile (sticky bottom) - purely UI example */}
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-lg">
            <button className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.35-9-7.5C-1.5 8.5 4 4 7 6.5 9.5 8.6 12 11 12 11s2.5-2.4 5-4.5C20 4 26.5 8.5 21 13.5 19 16.65 12 21 12 21z"/></svg>
              <span className="text-sm font-medium">1.2k</span>
            </button>
            <button className="px-3 py-1 rounded-md bg-blue text-white">Comment</button>
            <button className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2a2 2 0 00-2 2v16l8-4 8 4V4a2 2 0 00-2-2H6z" /></svg>
            </button>
          </div>
        </div>

        {/* Comments section */}
        <CommentSection postId={postId}/>

        {/* Related Posts */}
        <RelatedPosts relatedPosts={relatedPosts}/>
      </main>

    </>
  )
}

export default BlogDetail

// <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
//   {`// Example: memoizing a component
//   const MemoizedComp = React.memo(function Comp({ count }) {
//     return <div>{count}</div>;
//   });`}
// </pre>