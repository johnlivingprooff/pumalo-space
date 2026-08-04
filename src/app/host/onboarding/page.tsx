"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type OnboardingStep =
  | "welcome"
  | "profile"
  | "property"
  | "verification"
  | "complete";

export default function HostOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    phone: "",
    bio: "",
    ownershipType: "",
    propertyName: "",
    propertyType: "",
    propertyCity: "",
    idType: "",
    idNumber: "",
    agentNumber: "",
    isAgent: false,
  });

  const steps: OnboardingStep[] = [
    "welcome",
    "profile",
    "property",
    "verification",
    "complete",
  ];
  const contentSteps: OnboardingStep[] = [
    "profile",
    "property",
    "verification",
  ];
  const currentStepIndex = steps.indexOf(currentStep);
  const currentContentIndex = contentSteps.indexOf(currentStep);
  const progress = ((currentContentIndex + 1) / contentSteps.length) * 100;

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
      const response = await fetch("/api/user/complete-onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete onboarding");
      }

      // Success - redirect to listings
      router.push("/host/listings");
    } catch (err) {
      console.error("Error completing onboarding:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        {currentStep !== "welcome" && currentStep !== "complete" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStepIndex} of {steps.length - 2}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progress)}%
              </span>
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
          {currentStep === "welcome" && (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Become a Host
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of hosts earning extra income by listing their
                properties. We'll guide you through a simple setup process.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Complete Profile
                  </h3>
                  <p className="text-sm text-gray-600">
                    Add your contact info and bio
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Add Property Details
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tell us about your first listing
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Verify Identity
                  </h3>
                  <p className="text-sm text-gray-600">
                    Confirm your ID for trust & safety
                  </p>
                </div>
              </div>

              <Button variant="primary" size="lg" onClick={handleNext}>
                Get Started
              </Button>
            </div>
          )}

          {/* Profile Step */}
          {currentStep === "profile" && (
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Profile
              </h2>
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
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (Optional - tell guests about yourself)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share a little about yourself, your hosting experience, or what makes your property special..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
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
                  disabled={!formData.phone}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Property Step */}
          {currentStep === "property" && (
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Add Property Details
              </h2>
              <p className="text-gray-600 mb-8">
                Tell us about the property you'd like to list
              </p>

              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you own this property or manage it for others?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {(
                      [
                        {
                          value: "own",
                          label: "I Own It",
                          description: "This is my property",
                        },
                        {
                          value: "manage",
                          label: "I Manage It",
                          description: "I manage it for the owner",
                        },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            ownershipType: option.value,
                          })
                        }
                        className={`p-4 rounded-xl border-2 text-left transition ${
                          formData.ownershipType === option.value
                            ? "border-primary-600 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <span
                          className={`block font-semibold mb-1 ${
                            formData.ownershipType === option.value
                              ? "text-primary-700"
                              : "text-gray-900"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="text-sm text-gray-600">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Cozy 2BR Apartment in Westlands"
                    value={formData.propertyName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        propertyName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Listing Type
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyType: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
                    >
                      <option value="">Select type</option>
                      <option value="RENT">For Rent</option>
                      <option value="BUY">For Sale</option>
                      <option value="LODGE">Lodge/Short-term</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Nairobi"
                      value={formData.propertyCity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyCity: e.target.value,
                        })
                      }
                    />
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
                  disabled={
                    !formData.ownershipType ||
                    !formData.propertyName ||
                    !formData.propertyType ||
                    !formData.propertyCity
                  }
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Verification Step */}
          {currentStep === "verification" && (
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Identity
              </h2>
              <p className="text-gray-600 mb-8">
                This helps build trust with your guests
              </p>

              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Type
                    <span className="relative inline-flex ml-1 align-middle group">
                      <svg
                        className="w-4 h-4 text-gray-400 cursor-help"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                        You'll need to upload a government-issued ID (National
                        ID, passport, or driver's license) for proper
                        verification. You can add your details now and upload
                        the document later.
                      </span>
                    </span>
                  </label>
                  <select
                    value={formData.idType}
                    onChange={(e) =>
                      setFormData({ ...formData, idType: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, idNumber: e.target.value })
                    }
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Upload your ID later</p>
                      <p>
                        We'll ask you to upload a government-issued ID (National
                        ID, passport, or driver's license) for proper
                        verification. You can enter your details now and upload
                        the document later from your host dashboard.
                      </p>
                    </div>
                  </div>
                </div>

                {(formData.ownershipType === "manage" ||
                  (formData.ownershipType === "own" && formData.isAgent)) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Real Estate Agent Number
                      {formData.ownershipType === "manage" && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., RA-0001234"
                      value={formData.agentNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agentNumber: e.target.value,
                        })
                      }
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.ownershipType === "manage"
                        ? "Required — you're listing property on behalf of an owner."
                        : "Optional — only if you are a licensed agent."}
                    </p>
                  </div>
                )}

                {formData.ownershipType === "own" && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAgent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAgent: e.target.checked,
                          agentNumber: e.target.checked
                            ? formData.agentNumber
                            : "",
                        })
                      }
                      className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      I am also a licensed real estate agent
                    </span>
                  </label>
                )}
              </div>

              <div className="flex items-center gap-4 mt-8">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={
                    !formData.idType ||
                    !formData.idNumber ||
                    (formData.ownershipType === "manage" &&
                      !formData.agentNumber.trim()) ||
                    (formData.ownershipType === "own" &&
                      formData.isAgent &&
                      !formData.agentNumber.trim())
                  }
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === "complete" && (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                You're All Set!
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Congratulations! You're now a host. Start listing your
                properties and welcoming guests.
              </p>

              <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="font-semibold text-gray-900 mb-4">
                  What's Next?
                </h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Create your first property listing
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Add high-quality photos and detailed descriptions
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Set competitive pricing and availability
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      Respond promptly to booking requests
                    </span>
                  </li>
                </ul>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleComplete}
                disabled={isLoading}
              >
                {isLoading ? "Setting up..." : "Go to My Listings"}
              </Button>

              {error && (
                <div className="mt-6 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
