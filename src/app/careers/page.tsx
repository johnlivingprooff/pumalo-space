export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Careers at Pumalo Space</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-12">
          Join our team of innovators and dreamers. We are looking for passionate individuals to help us redefine the property marketplace in Africa.
        </p>
        <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">We have no open positions at the moment, but we're always looking for talent!</p>
          <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Send Spontaneous Application
          </button>
        </div>
      </div>
    </div>
  );
}