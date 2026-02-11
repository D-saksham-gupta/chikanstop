export default function ProductDetailsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 mb-8">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-1 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-1 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>

      {/* Back Button Skeleton */}
      <div className="h-5 w-32 bg-gray-200 rounded mb-8" />

      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-xl p-8 mb-12">
        {/* Image Skeleton */}
        <div>
          <div className="w-full h-96 bg-gray-200 rounded-xl mb-4" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-64 bg-gray-200 rounded mb-4" />

          {/* Rating */}
          <div className="flex gap-3 mb-6">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
          </div>

          {/* Price */}
          <div className="h-10 w-40 bg-gray-200 rounded mb-6" />

          {/* Description */}
          <div className="space-y-3 mb-6">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-4/6 bg-gray-200 rounded" />
          </div>

          {/* Size Skeleton */}
          <div className="mb-6">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-16 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Quantity Skeleton */}
          <div className="h-10 w-48 bg-gray-200 rounded mb-6" />

          {/* Buttons Skeleton */}
          <div className="flex gap-4 mb-8">
            <div className="h-12 flex-1 bg-gray-200 rounded-lg" />
            <div className="h-12 w-12 bg-gray-200 rounded-lg" />
          </div>

          {/* Features Skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-64 bg-gray-200 rounded" />
            <div className="h-4 w-52 bg-gray-200 rounded" />
            <div className="h-4 w-60 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="bg-white rounded-xl p-8">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6" />

        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex gap-4 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-full bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
