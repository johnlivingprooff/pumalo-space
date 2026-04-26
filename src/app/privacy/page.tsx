export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Privacy Policy</h1>
        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-gray-600 space-y-6">
          <p>Your privacy is important to us. This policy explains how we collect and use your data.</p>
          <section>
            <h3 className="font-bold text-gray-900">Information We Collect</h3>
            <p>We collect email addresses, names, and payment information to provide our services.</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">How We Use Your Data</h3>
            <p>Data is used to process bookings, verify identities, and improve user experience.</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">Data Security</h3>
            <p>We use industry-standard encryption to protect your personal information from unauthorized access.</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">Your Rights</h3>
            <p>You can request a copy of your data or ask us to delete your account at any time.</p>
          </section>
        </div>
      </div>
    </div>
  );
}