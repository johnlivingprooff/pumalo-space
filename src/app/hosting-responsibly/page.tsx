export default function HostingResponsiblyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Hosting Responsibly</h1>
        <div className="space-y-8 mt-12">
          <div className="p-6 bg-green-50 rounded-xl border border-green-100">
            <h3 className="text-xl font-semibold text-green-900 mb-2">Sustainable Tourism</h3>
            <p className="text-green-800">We encourage hosts to adopt eco-friendly practices to protect the local environment and support regional communities.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Best Practices</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Reduce plastic waste in your property.</li>
              <li>Encourage guests to respect local customs.</li>
              <li>Support local businesses and artisans.</li>
              <li>Implement energy-efficient lighting and appliances.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}