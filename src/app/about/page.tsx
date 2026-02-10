import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-white text-black">
      {/* HERO – BLACK */}
      <section className="bg-black text-white py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-rose-500 font-semibold tracking-widest mb-5">
            ABOUT CHIKANSTOP
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
            Where Lucknow’s Craft <br /> Meets Modern Elegance
          </h1>

          <p className="text-lg text-gray-300 max-w-3xl">
            ChikanStop is a Mauritius-based ethnic fashion brand dedicated to
            bringing authentic Lucknowi Chikankari to the global stage —
            handcrafted, premium, and timeless.
          </p>
        </div>
      </section>

      {/* STORY – WHITE */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              ChikanStop was born from a deep appreciation for the centuries-old
              art of Chikankari embroidery — a craft that originates from the
              heart of Lucknow, India.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              While we operate from Mauritius, every garment begins its journey
              in Lucknow, where skilled artisans hand-embroider each piece with
              patience, precision, and pride.
            </p>
          </div>

          <div className="relative h-105 rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/banners/faq.jpg"
              alt="Lucknow Chikankari Artisan"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* VALUES – BLACK */}
      <section className="bg-black text-white py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16">What Defines Us</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-rose-500 mb-4">
                Authentic Craft
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Every ChikanStop piece is hand-embroidered in Lucknow using
                traditional Chikankari techniques — no mass production, no
                shortcuts.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-rose-500 mb-4">
                Premium Quality
              </h3>
              <p className="text-gray-300 leading-relaxed">
                From fabric selection to final finishing, each garment is
                carefully inspected to meet high standards of quality and
                comfort.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-rose-500 mb-4">
                Ethical Sourcing
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We work directly with artisans, ensuring fair practices, respect
                for craftsmanship, and sustainable livelihoods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER – WHITE */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-rose-500 font-semibold tracking-widest mb-4">
            FOUNDER
          </p>

          <h2 className="text-4xl font-bold mb-8">Vision Led by Purpose</h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Founded by{" "}
            <span className="font-semibold text-black">Sumedha Gupta</span>,
            ChikanStop is guided by a commitment to authenticity and excellence.
            She personally oversees sourcing, craftsmanship, and quality —
            ensuring every garment reflects the heritage it represents.
          </p>
        </div>
      </section>

      {/* CLOSING – BLACK */}
      <section className="bg-black text-white py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">More Than Fashion</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            ChikanStop is not just clothing — it is a celebration of heritage,
            handwork, and timeless style. When you wear ChikanStop, you wear a
            story crafted by hands and carried by culture.
          </p>
        </div>
      </section>
    </main>
  );
}
