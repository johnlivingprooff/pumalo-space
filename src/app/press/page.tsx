export default function PressPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Press & Media</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8 text-center">
          Stay up to date with the latest news, announcements, and press releases from Pumalo Space.
        </p>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-sm text-gray-400">October {i}, 2024</span>
              <h3 className="text-xl font-semibold text-gray-900 mt-1">Pumalo Space expands to new markets across West Africa</h3>
              <p className="text-gray-600 mt-2">Detailed press release regarding our recent growth and expansion plans...</p>
              <button className="mt-4 text-primary-600 font-medium hover:underline">Read more</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}