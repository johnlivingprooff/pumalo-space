export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Cookie Policy</h1>
        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-gray-600 space-y-6">
          <p>Cookies help us provide a better experience for our users</p>
          <section>
            <h3 className="font-bold text-gray-900">What are cookies?</h3>
            <p>Cookies are small text files stored on your device to remember your preferences and keep you signed in.</p>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">Types of Cookies We Use</h3>
            <ul className="list-disc pl-5">
              <li>Essential Cookies: Required for the site to function.</li>
              <li>Analytics Cookies: Help us understand how users interact with the site.</li>
              <li>Preference Cookies: Remember your language and currency settings.</li>
            </ul>
          </section>
          <section>
            <h3 className="font-bold text-gray-900">Managing Your Cookies</h3>
            <p>You can change your cookie settings through the "Cookie Settings" link in our footer.</p>
          </section>
        </div>
      </div>
    </div>
  );
}