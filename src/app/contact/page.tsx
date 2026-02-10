export default function ContactPage() {
  return (
    <main className="bg-white text-black">
      {/* HERO – BLACK */}
      <section className="bg-black text-white py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-rose-500 font-semibold tracking-widest mb-5">
            CONTACT US
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
            Let’s Talk Craft, <br /> Style & Stories
          </h1>

          <p className="text-lg text-gray-300 max-w-3xl">
            Have a question about our collections, craftsmanship, or orders?
            We’re here to help — thoughtfully and personally.
          </p>
        </div>
      </section>

      {/* CONTENT – WHITE */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
          {/* LEFT – INFO */}
          <div>
            <h2 className="text-4xl font-bold mb-10">Get in Touch</h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-10">
              At ChikanStop, we believe in meaningful conversations. Whether
              you’re reaching out for support, collaborations, or custom
              requirements — we’d love to hear from you.
            </p>

            <div className="space-y-6 text-lg">
              <p>
                <span className="font-semibold text-black">Location</span>
                <br />
                <span className="text-gray-600">Mauritius</span>
              </p>

              <p>
                <span className="font-semibold text-black">Email</span>
                <br />
                <span className="text-gray-600">support@chikanstop.com</span>
              </p>

              <p>
                <span className="font-semibold text-black">Phone</span>
                <br />
                <span className="text-gray-600">+230 XXXXXXXX</span>
              </p>

              <p className="text-gray-500 text-sm max-w-md">
                We usually respond within 24–48 hours. During festive seasons,
                responses may take slightly longer.
              </p>
            </div>
          </div>

          {/* RIGHT – FORM */}
          <div className="bg-gray-50 rounded-3xl p-10 md:p-12 shadow-sm">
            <h3 className="text-2xl font-semibold mb-8">Send Us a Message</h3>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help you"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-rose-500 hover:text-black transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE – BLACK */}
      <section className="bg-rose-500 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-bold text-gray-100">
            Every ChikanStop piece begins with a conversation — between
            heritage, hands, and heart.
          </p>
        </div>
      </section>
    </main>
  );
}
