'use client';

import { usePathname } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignUp = pathname?.includes('/sign-up');
  
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1760801986203-2d755aaf7857?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative mx-auto max-w-6xl px-4 py-12 grid gap-10 lg:grid-cols-2 items-center min-h-screen">
        <div className="hidden lg:block text-white">
          <h1 className="text-4xl font-bold">
            {isSignUp ? 'Join Pumalo Space' : 'Welcome Back to Pumalo Space'}
          </h1>
          <p className="mt-4 text-white/90 leading-relaxed text-lg">
            {isSignUp 
              ? 'Start your journey to finding the perfect space. Create an account to browse properties, make bookings, and list your own spaces.'
              : 'Continue where you left off. Sign in to manage your bookings, view saved properties, and access your listings.'
            }
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 shadow-lg border border-white/20">
              <div className="text-white font-semibold">Secure</div>
              <div className="text-sm text-white/80 mt-1">Your account is protected with industry-grade security.</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 shadow-lg border border-white/20">
              <div className="text-white font-semibold">Fast</div>
              <div className="text-sm text-white/80 mt-1">
                {isSignUp ? 'Quick sign up with email or social providers.' : 'Sign in quickly with email or social providers.'}
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 shadow-lg border border-white/20">
              <div className="text-white font-semibold">Seamless</div>
              <div className="text-sm text-white/80 mt-1">One account works across all your devices.</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 shadow-lg border border-white/20">
              <div className="text-white font-semibold">Private</div>
              <div className="text-sm text-white/80 mt-1">We respect your privacy and never share your data.</div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl bg-white shadow-2xl border border-gray-100 p-6 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4Z"/>
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 21a7 7 0 1 0-14 0"/>
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                {isSignUp ? 'Create an account' : 'Continue to your account'}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {isSignUp 
                  ? 'Get started with Pumalo Space today' 
                  : 'Welcome back! Please sign in to continue.'
                }
              </p>
            </div>
            {children}
            <p className="mt-6 text-center text-xs text-gray-600">
              By continuing, you agree to our <a href="#" className="underline decoration-primary-300 hover:text-primary-700">Terms</a> and <a href="#" className="underline decoration-primary-300 hover:text-primary-700">Privacy Policy</a>.
            </p>
          </div>
          <p className="mt-6 text-center text-sm text-white drop-shadow-lg">
            Trouble {isSignUp ? 'signing up' : 'signing in'}? <a className="text-white font-semibold hover:underline" href="/handler/support">Get help</a>
          </p>
        </div>
      </div>
    </div>
  );
}
