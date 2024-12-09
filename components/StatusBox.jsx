export default function StatusBox({ message, color="gray-500" }){
  return(
    <div className={`p-6 rounded-lg shadow-lg text-center w-full max-w-lg flex items-center space-x-4 transition-all border-l-4 bg-white border-${color}`}>
      <div className="flex-grow">
        <h2 className={`text-xl font-semibold text-${color} mb-2`}>{message}</h2>
      </div>
    </div>
  )
}