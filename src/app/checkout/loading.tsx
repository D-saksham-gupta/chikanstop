export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Skeleton */}
            <div className="bg-white rounded-xl p-6 space-y-6">
              <div className="h-6 w-48 bg-gray-200 rounded" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Payment Method Skeleton */}
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              <div className="h-16 bg-gray-200 rounded-lg" />
              <div className="h-16 bg-gray-200 rounded-lg" />
            </div>
          </div>

          {/* Right Side - Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 space-y-6 sticky top-20">
              <div className="h-6 w-40 bg-gray-200 rounded" />

              {/* Items */}
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <div className="h-5 w-20 bg-gray-200 rounded" />
                  <div className="h-6 w-24 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Button */}
              <div className="h-12 bg-gray-200 rounded-lg" />

              {/* Terms */}
              <div className="h-3 w-48 bg-gray-200 rounded mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
