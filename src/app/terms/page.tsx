export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Terms of Service</h1>
        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-gray-600 space-y-6">
          <p>Welcome to Pumalo Space. By using our platform, you agree to the following terms:</p>
          <section>
            <h3 className="font-bold text-gray-900">1. User Accounts</h3>
            <p>Users must provide accurate information and are responsible for maintaining the security of their accounts.</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">2. Listings</h3>
            <p>Hosts are responsible for the accuracy of their property descriptions and ensuring the space is safe for guests.</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">3. Payments</h3>
            <p>All transactions are processed via our secure payment gateway. Currency conversion rates may apply.</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">4. Liability</h3>
            <p>Pumalo Space acts as a marketplace and is not liable for damages resulting from the use of properties listed on the platform.</p>
          </section>
        </div>
      </div>
    </div>
  );
}