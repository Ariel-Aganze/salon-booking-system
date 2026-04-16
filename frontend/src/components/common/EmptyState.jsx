
const EmptyState = ({ message = "No data available", icon = "📭" }) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  )
}

export default EmptyState