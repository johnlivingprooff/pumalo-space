export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="mt-2 h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
          
          {/* Grid Skeleton */}
          <main className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
