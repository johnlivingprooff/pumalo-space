"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DriveImageUpload } from "@/components/ui/DriveImageUpload";
import { useUser } from "@stackframe/stack";
import { useDraft } from "@/hooks/useDraft";

type PropertyType = "RENT" | "BUY" | "LODGE";

interface PropertyFormData {
  title: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  price: number;
  currency: string;
  pricePeriod: string;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  availability: string[];
}

const initialFormData: PropertyFormData = {
  title: "",
  description: "",
  propertyType: "RENT",
  address: "",
  city: "",
  state: "",
  country: "Kenya",
  zipCode: "",
  latitude: 0,
  longitude: 0,
  price: 0,
  currency: "KSH",
  pricePeriod: "night",
  images: [],
  amenities: [],
  bedrooms: 1,
  bathrooms: 1,
  maxGuests: 2,
  availability: [],
};

const commonAmenities = [
  "WiFi",
  "Kitchen",
  "Washer",
  "Dryer",
  "Air conditioning",
  "Heating",
  "TV",
  "Pool",
  "Hot tub",
  "Gym",
  "Parking",
  "Elevator",
  "Balcony",
  "Garden",
  "Pet friendly",
  "Smoking allowed",
  "Wheelchair accessible",
];

export default function CreateListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUser();

  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customAmenity, setCustomAmenity] = useState("");
  const [resumePrompt, setResumePrompt] = useState(false);

  const existingDraftId = searchParams.get("draft");
  const { draftId, autoSave, save, deleteDraft, statusLabel } = useDraft({
    draftId: existingDraftId,
  });

  // Load existing draft on mount
  useEffect(() => {
    if (!existingDraftId) return;
    fetch(`/api/drafts/${existingDraftId}`)
      .then((r) => r.json())
      .then(({ draft }) => {
        if (draft?.data) {
          setFormData(draft.data as PropertyFormData);
          setCurrentStep(draft.step ?? 1);
        }
      })
      .catch(() => {});
  }, [existingDraftId]);

  // Show resume prompt if there's a draft in the URL but no explicit load
  useEffect(() => {
    if (existingDraftId && !resumePrompt) setResumePrompt(true);
  }, [existingDraftId]); // eslint-disable-line

  const handleInputChange = (field: keyof PropertyFormData, value: unknown) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    autoSave(updated, currentStep, updated.title || undefined);
  };

  const handleAmenityToggle = (amenity: string) => {
    handleInputChange(
      "amenities",
      formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    );
  };

  const handleAddCustomAmenity = () => {
    if (
      customAmenity.trim() &&
      !formData.amenities.includes(customAmenity.trim())
    ) {
      handleInputChange("amenities", [
        ...formData.amenities,
        customAmenity.trim(),
      ]);
      setCustomAmenity("");
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return !!(
          formData.title &&
          formData.description &&
          formData.propertyType
        );
      case 2:
        return !!(formData.address && formData.city && formData.country);
      case 3:
        return !!(formData.price > 0 && formData.images.length > 0);
      case 4:
        return !!(
          formData.bedrooms > 0 &&
          formData.bathrooms > 0 &&
          formData.maxGuests > 0
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    const next = currentStep + 1;
    setCurrentStep(next);
    autoSave(formData, next, formData.title || undefined);
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSaveDraft = async () => {
    await save(formData, currentStep, formData.title || undefined);
    router.push("/host/drafts");
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep) || !user) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hostId: user.id,
          availability: formData.availability.map((d) => new Date(d)),
        }),
      });
      if (!res.ok)
        throw new Error((await res.json()).error || "Failed to create listing");
      const property = await res.json();
      // Delete draft after successful publish
      if (draftId) await deleteDraft();
      router.push(`/host/listings/${property.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Create New Listing
              </h1>
              <p className="text-gray-600">
                Fill out the details below to list your property
              </p>
            </div>
            <div className="flex items-center gap-3">
              {statusLabel && (
                <span className="text-sm text-gray-500">{statusLabel}</span>
              )}
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={!formData.title}
              >
                Save Draft
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
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
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Basic Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Cozy 2BR Apartment in Westlands"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) =>
                    handleInputChange(
                      "propertyType",
                      e.target.value as PropertyType,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
                >
                  <option value="RENT">For Rent</option>
                  <option value="BUY">For Sale</option>
                  <option value="LODGE">Lodge/Short-term</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={6}
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Location</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 123 Main Street"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Nairobi"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Nairobi County"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Kenya"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., 00100"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Pricing & Images
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
                  >
                    <option value="KSH">KSH</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Period
                  </label>
                  <select
                    value={formData.pricePeriod}
                    onChange={(e) =>
                      handleInputChange("pricePeriod", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-600"
                  >
                    <option value="night">Per Night</option>
                    <option value="week">Per Week</option>
                    <option value="month">Per Month</option>
                    <option value="total">Total Price</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Images *
                </label>
                <DriveImageUpload
                  value={formData.images}
                  onChange={(urls) => handleInputChange("images", urls)}
                  maxImages={10}
                />
              </div>
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Details & Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      handleInputChange(
                        "bedrooms",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      handleInputChange(
                        "bathrooms",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Guests *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.maxGuests}
                    onChange={(e) =>
                      handleInputChange(
                        "maxGuests",
                        parseInt(e.target.value) || 1,
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {commonAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add custom amenity"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddCustomAmenity()
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomAmenity}
                    disabled={!customAmenity.trim()}
                  >
                    Add
                  </Button>
                </div>
                {formData.amenities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          className="ml-1 text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <div className="flex items-center gap-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              {currentStep < totalSteps ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!validateStep(currentStep) || isLoading}
                >
                  {isLoading ? "Publishing…" : "Publish Listing"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
