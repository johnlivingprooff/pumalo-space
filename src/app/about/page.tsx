export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Pumalo Space</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Pumalo Space is a premier property marketplace dedicated to connecting people with unique spaces to rent, buy, or lodge across Africa. Our mission is to make property discovery seamless, transparent, and accessible for everyone.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Our Vision</h3>
            <p className="text-sm text-gray-600">To be the most trusted platform for African real estate and hospitality.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600">Empowering hosts and travelers through a secure and innovative marketplace.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Our Values</h3>
            <p className="text-sm text-gray-600">Integrity, Community, and Innovation in every listing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}