"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  image: {
    url: string;
    publicId: string;
  };
  link?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
}

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(timer);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners?active=true");
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Fallback/Default Hero if no banners
  if (!loading && banners.length === 0) {
    return (
      <section className="relative bg-linear-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  New Collection 2026
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Discover Your
                <span className="block text-primary-500">Perfect Style</span>
              </h1>

              <p className="text-lg text-gray-300 max-w-lg">
                Explore our curated collection of premium fashion pieces
                designed to elevate your wardrobe. From casual elegance to bold
                statements.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link href="/category/new-arrivals">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-3 border-2 border-white text-white hover:bg-gray-800"
                  >
                    New Arrivals
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-700">
                <div>
                  <p className="text-3xl font-bold text-primary-500">200+</p>
                  <p className="text-sm text-gray-400">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-500">50k+</p>
                  <p className="text-sm text-gray-400">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-500">4.9</p>
                  <p className="text-sm text-gray-400">Rating</p>
                </div>
              </div>
            </div>

            {/* Right Image Grid */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-2xl h-64 overflow-hidden">
                  {/* <div className="w-full h-full bg-linear-to-br from-primary-400 to-primary-600"></div> */}
                  {/* <img src={Banner1} alt="Banner1" className="w-full h-full"/> */}
                  <Image
                    src="/banners/banner1.jpg"
                    alt="Banner1"
                    width={1920}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-gray-700 rounded-2xl h-40 overflow-hidden">
                  {/* <div className="w-full h-full bg-linear-to-br from-gray-600 to-gray-800"></div> */}
                  <Image
                    src="/banners/banner5.jpg"
                    alt="Banner2"
                    width={1920}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-gray-700 rounded-2xl h-40 overflow-hidden">
                  {/* <div className="w-full h-full bg-linear-to-br from-gray-600 to-gray-800"></div> */}
                  <Image
                    src="/banners/banner4.jpg"
                    alt="Banner1"
                    width={1920}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-gray-700 rounded-2xl h-64 overflow-hidden">
                  {/* <div className="w-full h-full bg-linear-to-br from-primary-400 to-primary-600"></div> */}
                  <Image
                    src="/banners/banner3.jpg"
                    alt="Banner1"
                    width={1920}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="relative bg-gray-100 h-96 md:h-125 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      {/* Slides */}
      <div className="relative h-96 md:h-125 lg:h-150">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={banner.image.url}
                alt={banner.title || "Banner"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-white space-y-6">
                  {banner.title && (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {banner.title}
                    </h1>
                  )}
                  {banner.subtitle && (
                    <p className="text-lg md:text-xl opacity-90">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link && banner.buttonText && (
                    <div>
                      <Link href={banner.link}>
                        <Button size="lg" variant="primary">
                          {banner.buttonText}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              } h-2 rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
