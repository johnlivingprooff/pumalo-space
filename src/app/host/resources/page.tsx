export default function HostResourcesPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Host Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { title: 'Pricing Guide', desc: 'How to set the perfect price for your home.' },
            { title: 'Photography Tips', desc: 'Make your property look stunning in photos.' },
            { title: 'Guest Management', desc: 'Best practices for a 5-star guest experience.' },
          ].map((item) => (
            <div key={item.title} className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}