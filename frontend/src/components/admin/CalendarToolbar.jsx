const CalendarToolbar = ({ currentDate, view, onViewChange, onNavigate, onToday }) => {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const views = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onToday}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Current Date Display */}
        <div className="text-lg font-semibold text-luxury-plum">
          {formatDate(currentDate)}
        </div>

        {/* View Selector */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {views.map((viewOption) => (
            <button
              key={viewOption.id}
              onClick={() => onViewChange(viewOption.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                view === viewOption.id
                  ? 'bg-white text-luxury-plum shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {viewOption.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarToolbar