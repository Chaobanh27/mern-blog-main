import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const COLORS = ['#4f46e5', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

const PieChartFrame = ({ data }) => {
  return (
    <div className="w-full h-72 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
        Top Tags được sử dụng nhiều nhất
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="postCount"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChartFrame
