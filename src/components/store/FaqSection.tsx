"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const faqs = [
  {
    question: "Is ChikanStop’s embroidery authentic Lucknowi Chikankari?",
    answer:
      "Absolutely. Every ChikanStop garment is hand-embroidered by skilled artisans in Lucknow using traditional Chikankari techniques passed down through generations.",
  },
  {
    question: "Where is ChikanStop based?",
    answer:
      "We are proudly based in Mauritius, while all sourcing, embroidery, and craftsmanship happens in Lucknow, India.",
  },
  {
    question: "Are the garments handmade or machine-produced?",
    answer:
      "All our garments are premium handcrafted pieces. Minor variations are natural and reflect the authenticity of hand embroidery.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship internationally to selected countries. Shipping timelines and charges are displayed during checkout.",
  },
  {
    question: "How should I care for my Chikankari clothing?",
    answer:
      "We recommend gentle hand wash or dry clean only to preserve the embroidery and fabric quality over time.",
  },
];

export default function FaqSection() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT: FAQ */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-black mb-6"
          >
            Frequently Asked Questions
          </motion.h2>

          <p className="text-gray-600 mb-10 text-lg">
            Everything you need to know about our craftsmanship, sourcing, and
            quality standards.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActive(active === index ? null : index)}
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="font-semibold text-black">
                    {faq.question}
                  </span>
                  <span className="text-rose-500 text-xl">
                    {active === index ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence>
                  {active === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="px-5 pb-5 text-gray-600"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative h-130 rounded-3xl overflow-hidden shadow-lg"
        >
          <Image
            src="/banners/faq.jpg"
            alt="Lucknow Chikankari Artisan"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
