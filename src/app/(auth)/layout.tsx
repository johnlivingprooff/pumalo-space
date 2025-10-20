export const metadata = {
  title: "Account | Pumalo Space",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 grid gap-10 lg:grid-cols-2 items-center">
        <div className="hidden lg:block">
          <h1 className="text-4xl font-bold text-blue-900">Welcome to Pumalo Space</h1>
          <p className="mt-4 text-blue-900/70 leading-relaxed">
            Find the perfect place to stay across Kenya. Sign in to manage bookings, save favorites, and list your properties.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow-sm border border-blue-100">
              <div className="text-blue-600 font-semibold">Secure</div>
              <div className="text-sm text-blue-900/70 mt-1">Your account is protected with industry-grade security.</div>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow-sm border border-blue-100">
              <div className="text-blue-600 font-semibold">Fast</div>
              <div className="text-sm text-blue-900/70 mt-1">Sign in quickly with email or social providers.</div>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow-sm border border-blue-100">
              <div className="text-blue-600 font-semibold">Seamless</div>
              <div className="text-sm text-blue-900/70 mt-1">One account works across all your devices.</div>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur p-6 shadow-sm border border-blue-100">
              <div className="text-blue-600 font-semibold">Private</div>
              <div className="text-sm text-blue-900/70 mt-1">We respect your privacy and never share your data.</div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl bg-white shadow-lg border border-blue-100 p-6 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4Z"/>
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 21a7 7 0 1 0-14 0"/>
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-blue-900">Continue to your account</h2>
              <p className="mt-1 text-sm text-blue-900/70">Welcome back! Please sign in to continue.</p>
            </div>
            {children}
            <p className="mt-6 text-center text-xs text-blue-900/60">
              By continuing, you agree to our <a href="#" className="underline decoration-blue-300 hover:text-blue-700">Terms</a> and <a href="#" className="underline decoration-blue-300 hover:text-blue-700">Privacy Policy</a>.
            </p>
          </div>
          <p className="mt-6 text-center text-sm text-blue-900/70">
            Trouble signing in? <a className="text-blue-700 hover:underline" href="/handler/support">Get help</a>
          </p>
        </div>
      </div>
    </div>
  );
}
