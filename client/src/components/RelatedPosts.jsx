import SliderItem from './SliderItem'

const RelatedPosts = ({ relatedPosts }) => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Bài viết liên quan
      </h2>
      <SliderItem relatedPosts={relatedPosts}/>
    </section>
  )
}

export default RelatedPosts