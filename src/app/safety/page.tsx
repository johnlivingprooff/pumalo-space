export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Safety Information</h1>
        <div className="space-y-8 mt-12">
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Our Commitment to Safety</h3>
            <p className="text-blue-800">At Pumalo Space, your safety and security are our top priorities. We use advanced verification systems to ensure a secure environment for both hosts and guests.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Safety Tips for Guests</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Always communicate through our platform.</li>
              <li>Verify the host's identity before check-in.</li>
              <li>Read reviews from other guests carefully.</li>
            </ul>
            <h3 className="text-2xl font-bold text-gray-900 pt-4">Safety Tips for Hosts</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Keep your property secure and well-maintained.</li>
              <li>Verify your guests through the platform.</li>
              <li>Have a clear set of house rules.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}