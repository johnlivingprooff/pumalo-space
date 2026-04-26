export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Help Center</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {[
            { title: 'Getting Started', desc: 'New to Pumalo Space? Start here.' },
            { title: 'Booking & Payments', desc: 'How to pay and manage your bookings.' },
            { title: 'Host Support', desc: 'Resources for managing your listings.' },
            { title: 'Account & Security', desc: 'Keep your account safe and updated.' },
          ].map((item) => (
            <div key={item.title} className="p-6 border border-gray-200 rounded-xl hover:border-primary-500 cursor-pointer transition-colors">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}