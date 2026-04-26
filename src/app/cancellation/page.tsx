export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Cancellation Options</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8 text-center">
          We understand that plans change. Here is how our cancellation policies work.
        </p>
        <div className="space-y-6">
          {[
            { type: 'Flexible', desc: 'Full refund if cancelled 24 hours before check-in.' },
            { type: 'Moderate', desc: 'Full refund if cancelled 5 days before check-in.' },
            { type: 'Strict', desc: 'No refund for cancellations made after 14 days of booking.' },
          ].map((policy) => (
            <div key={policy.type} className="p-6 border border-gray-200 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900">{policy.type}</h3>
              <p className="text-gray-600 mt-2">{policy.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}