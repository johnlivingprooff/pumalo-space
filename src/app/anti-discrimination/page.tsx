export default function AntiDiscriminationPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Anti-Discrimination Policy</h1>
        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center">
          <p className="text-xl text-gray-700 leading-relaxed italic">
            "Pumalo Space believes that everyone deserves a place to feel at home. We have zero tolerance for discrimination of any kind."
          </p>
          <div className="mt-8 text-left space-y-4 text-gray-600">
            <p>We prohibit discrimination based on race, religion, sexual orientation, gender identity, disability, or nationality.</p>
            <p>If you experience or witness discrimination on our platform, please report it immediately via our Help Center.</p>
          </div>
        </div>
      </div>
    </div>
  );
}