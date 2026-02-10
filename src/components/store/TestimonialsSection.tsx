"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Wedding Shopper",
    image: "/banners/2.jpg",
    text: "The saree I ordered from ChikanStop is breathtaking. The embroidery feels alive and incredibly elegant. You can sense the hand-crafted quality the moment you wear it.",
  },
  {
    name: "Aisha Khan",
    role: "Fashion Enthusiast",
    image: "/banners/3.jpg",
    text: "Authentic Lucknowi craftsmanship at its finest. The fabric, detailing, and comfort are unmatched. I receive compliments every single time.",
  },
  {
    name: "Rohit Verma",
    role: "Menswear Customer",
    image: "/banners/1.jpg",
    text: "Bought a kurta for a family wedding and it exceeded expectations. Premium feel, perfect fit, and timeless design.",
  },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-black py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-14">
          <h2 className="text-4xl font-bold text-rose-500 mb-4">
            Loved by Our Customers
          </h2>
          <p className="text-white text-lg max-w-2xl">
            From weddings to everyday elegance, our customers trust ChikanStop
            for authentic craftsmanship and timeless style.
          </p>
        </div>

        {/* Slider */}
        <div className="relative bg-gray-50 rounded-3xl p-10 md:p-14 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row gap-10 items-center"
            >
              {/* Image */}
              <Image
                src={testimonials[index].image}
                alt={testimonials[index].name}
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-rose-500"
              />

              {/* Content */}
              <div>
                <p className="text-gray-700 text-xl italic leading-relaxed mb-6">
                  “{testimonials[index].text}”
                </p>

                <div>
                  <p className="font-semibold text-black text-lg">
                    {testimonials[index].name}
                  </p>
                  <p className="text-rose-500">{testimonials[index].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  index === i ? "w-8 bg-rose-500" : "w-2.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
