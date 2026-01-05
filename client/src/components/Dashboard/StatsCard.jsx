import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const StatsCard = ({ label, value, icon: Icon, trend = null }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {label}
        </p>

        {Icon && (
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mt-3 text-gray-900 dark:text-white">
        {value}
      </h2>

      {trend !== null && (
        <div className="flex items-center gap-1 mt-2">
          {trend >= 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}

          <span
            className={`text-sm font-medium ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend}%
          </span>
          <span className="text-gray-400 text-sm">so với tuần trước</span>
        </div>
      )}
    </div>
  )
}

export default StatsCard
