import {
  HeroSection,
  CategoriesSection,
  FeaturedProducts,
  FeaturesSection,
  NewsletterSection,
  FaqSection,
  TestimonialsSection,
} from "@/components/store";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <FeaturesSection />
      <FaqSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
