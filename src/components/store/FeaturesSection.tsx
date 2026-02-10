import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders above ₹999",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% protected payments",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer service",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="bg-primary-100 p-4 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
