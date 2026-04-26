export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gray-900">
        <div className="absolute inset-0 bg-gray-800" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="h-12 w-64 mx-auto bg-gray-600 rounded-lg animate-pulse mb-6"></div>
            <div className="h-6 w-96 mx-auto bg-gray-600 rounded-lg animate-pulse mb-8"></div>
            
            {/* Search Bar Skeleton */}
            <div className="bg-gray-700 rounded-2xl p-4 sm:p-6">
              <div className="h-12 bg-gray-500 rounded-lg animate-pulse mb-4"></div>
              <div className="h-12 bg-primary-500 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-64 mx-auto bg-gray-300 rounded-lg animate-pulse mb-4"></div>
            <div className="h-5 w-80 mx-auto bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="h-12 w-40 mx-auto bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-64 mx-auto bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="h-5 w-80 mx-auto bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 w-56 mx-auto bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="h-5 w-72 mx-auto bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full animate-pulse mb-4"></div>
                <div className="h-6 w-24 mx-auto bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                <div className="h-4 w-48 mx-auto bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section for Hosts */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-8 w-72 mx-auto bg-primary-500 rounded-lg animate-pulse mb-4"></div>
          <div className="h-5 w-96 mx-auto bg-primary-400 rounded-lg animate-pulse mb-8"></div>
          <div className="h-12 w-40 mx-auto bg-white rounded-lg animate-pulse"></div>
        </div>
      </section>
    </div>
  );
}
