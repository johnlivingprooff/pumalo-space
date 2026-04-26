export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Pumalo Space Blog</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-12 text-center">
          Tips for hosts, travel inspiration, and the latest trends in African real estate.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">How to optimize your property for more bookings</h3>
                <p className="text-gray-600 mb-4">Discover the best practices to make your listing stand out and attract more guests...</p>
                <button className="text-primary-600 font-medium hover:underline">Read Article</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}