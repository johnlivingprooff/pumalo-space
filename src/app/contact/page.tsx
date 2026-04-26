export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-12">Have questions or need support? We're here to help!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-6 border border-gray-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">General Inquiries</h3>
            <p className="text-gray-600">Email: hello@pumalo.space</p>
            <p className="text-gray-600">Phone: +254 700 000 000</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Support Team</h3>
            <p className="text-gray-600">Email: support@pumalo.space</p>
            <p className="text-gray-600">Available: 24/7</p>
          </div>
        </div>
        <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">Our average response time is less than 2 hours.</p>
        </div>
      </div>
    </div>
  );
}