'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type OnboardingStep = 'welcome' | 'profile' | 'verification' | 'payout' | 'complete';

export default function HostOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    phone: '',
    bio: '',
    idType: '',
    idNumber: '',
    paymentMethod: '',
    accountDetails: '',
  });

  const steps: OnboardingStep[] = ['welcome', 'profile', 'verification', 'payout', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete onboarding');
      }

      // Success - redirect to listings
      router.push('/host/listings');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStepIndex} of {steps.length - 2}
              </span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Become a Host
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of hosts earning extra income by listing their properties.
                We'll guide you through a simple setup process.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Complete Profile</h3>
                  <p className="text-sm text-gray-600">Add your contact info and bio</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Verify Identity</h3>
                  <p className="text-sm text-gray-600">Confirm your ID for trust & safety</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Setup Payouts</h3>
                  <p className="text-sm text-gray-600">Add your payment details</p>
                </div>
              </div>

              <Button variant="primary" size="lg" onClick={handleNext}>
                Get Started
              </Button>
            </div>
          )}

          {/* Profile Step */}
          {currentStep === 'profile' && (
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
              <p className="text-gray-600 mb-8">
                Help guests get to know you better
              </p>

              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+254 712 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (Tell guests about yourself)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share a little about yourself, your hosting experience, or what makes your property special..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!formData.phone || !formData.bio}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Verification Step */}
          {currentStep === 'verification' && (
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h2>
              <p className="text-gray-600 mb-8">
                This helps build trust with your guests
              </p>

              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Type
                  </label>
                  <select
                    value={formData.idType}
                    onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
                  >
                    <option value="">Select ID type</option>
                    <option value="national_id">National ID</option>
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your ID number"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Your information is secure</p>
                      <p>We use bank-level encryption to protect your personal data.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!formData.idType || !formData.idNumber}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Payout Step */}
          {currentStep === 'payout' && (
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Payouts</h2>
              <p className="text-gray-600 mb-8">
                Add your payment details to receive earnings
              </p>

              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
                  >
                    <option value="">Select payment method</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.paymentMethod === 'mpesa' && 'M-Pesa Phone Number'}
                    {formData.paymentMethod === 'bank' && 'Bank Account Number'}
                    {formData.paymentMethod === 'paypal' && 'PayPal Email'}
                    {!formData.paymentMethod && 'Account Details'}
                  </label>
                  <Input
                    type="text"
                    placeholder={
                      formData.paymentMethod === 'mpesa'
                        ? '+254 712 345 678'
                        : formData.paymentMethod === 'bank'
                        ? 'Account number'
                        : formData.paymentMethod === 'paypal'
                        ? 'email@example.com'
                        : 'Enter your account details'
                    }
                    value={formData.accountDetails}
                    onChange={(e) => setFormData({ ...formData, accountDetails: e.target.value })}
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Payout Schedule</p>
                      <p>Earnings are typically transferred within 3-5 business days after a guest checks out.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!formData.paymentMethod || !formData.accountDetails || isLoading}
                >
                  {isLoading ? 'Completing...' : 'Complete Setup'}
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                You're All Set!
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Congratulations! You're now a host. Start listing your properties and welcoming guests.
              </p>

              <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Create your first property listing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Add high-quality photos and detailed descriptions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Set competitive pricing and availability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Respond promptly to booking requests</span>
                  </li>
                </ul>
              </div>

              <Button variant="primary" size="lg" onClick={handleComplete} disabled={isLoading}>
                {isLoading ? 'Setting up...' : 'Go to My Listings'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
