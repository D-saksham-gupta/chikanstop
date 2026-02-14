export default function AdminOrderDetailsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Skeleton */}
          <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
            <div className="h-6 w-40 bg-gray-200 rounded" />

            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-40 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Customer Info Skeleton */}
          <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>

          {/* Shipping Address Skeleton */}
          <div className="bg-white rounded-xl p-6 space-y-3 shadow-sm">
            <div className="h-6 w-44 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-60 bg-gray-200 rounded" />
            <div className="h-4 w-52 bg-gray-200 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl p-6 space-y-3 shadow-sm">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-8 w-full bg-gray-200 rounded" />
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 space-y-3 shadow-sm">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <div className="h-5 w-20 bg-gray-200 rounded" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
