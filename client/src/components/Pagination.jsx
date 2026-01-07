const Pagination = ({ currentPage, totalPages, changePage }) => {
  return (
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
  )
}

export default Pagination