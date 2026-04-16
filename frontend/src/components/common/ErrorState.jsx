
const ErrorState = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">⚠️</div>
      <p className="text-red-600 text-lg mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-luxury-plum text-white rounded-lg hover:bg-black transition"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorState