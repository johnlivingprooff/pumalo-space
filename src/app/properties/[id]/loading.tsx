export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gallery Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="md:col-span-2 md:row-span-2">
            <div className="w-full h-[400px] md:h-[600px] bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="hidden md:block h-[290px] bg-gray-200 rounded-xl animate-pulse" />
          <div className="hidden md:block h-[290px] bg-gray-200 rounded-xl animate-pulse" />
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
            
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
          
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="h-12 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="h-20 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
