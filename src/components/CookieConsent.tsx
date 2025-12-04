'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

type CookiePreference = 'all' | 'essential' | 'analytics' | 'marketing';

interface CookieSettings {
  essential: boolean; // Always true, required for site function
  analytics: boolean;
  marketing: boolean;
}

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  // Check if user has already made a choice
  useEffect(() => {
    const savedSettings = localStorage.getItem('cookie-preferences');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setIsVisible(false);
    } else {
      // Show banner if no preference saved
      setIsVisible(true);
    }

    // Listen for settings button click from footer
    const handleOpenSettings = () => {
      setShowSettings(true);
    };
    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('open-cookie-settings', handleOpenSettings);
    };
  }, []);

  const saveCookiePreference = (newSettings: CookieSettings) => {
    // Save to localStorage
    localStorage.setItem('cookie-preferences', JSON.stringify(newSettings));
    setSettings(newSettings);
    setIsVisible(false);
    setShowSettings(false);

    // Apply cookie consent to analytics and marketing services
    applyCookieConsent(newSettings);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookieSettings = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    saveCookiePreference(allAccepted);
  };

  const handleRejectAll = () => {
    const minimal: CookieSettings = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    saveCookiePreference(minimal);
  };

  const handleCustomSettings = () => {
    saveCookiePreference(settings);
  };

  const toggleSetting = (key: 'analytics' | 'marketing') => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const applyCookieConsent = (prefs: CookieSettings) => {
    // Example: Disable Google Analytics if analytics not allowed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      if (!prefs.analytics) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'denied',
        });
      } else {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'granted',
        });
      }
    }

    // Dispatch custom event for other services to listen to
    window.dispatchEvent(
      new CustomEvent('cookie-consent-updated', {
        detail: prefs,
      })
    );
  };

  if (!isVisible && !showSettings) {
    return null;
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      {isVisible && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 sm:p-6 shadow-lg z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Cookie Preferences</h3>
                <p className="text-sm text-gray-300">
                  We use cookies to enhance your browsing experience, serve personalized ads, and analyze our traffic. 
                  You can customize your preferences or accept all cookies to continue.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm font-medium text-white border border-gray-400 rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  Customize
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium text-white border border-gray-400 rounded hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSettings(false)}
          />

          {/* Modal */}
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
            <div className="max-w-2xl mx-auto p-6 sm:p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cookie Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8">
                Cookies help us deliver and improve our services. Choose which cookies you'd like to accept.
              </p>

              {/* Cookie Categories */}
              <div className="space-y-6 mb-8">
                {/* Essential Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Essential Cookies
                      </h3>
                      <p className="text-sm text-gray-600">
                        Required for the website to function properly. These cookies manage user sessions, 
                        security, and basic functionality. Always enabled.
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="w-5 h-5 text-blue-600 rounded cursor-not-allowed"
                        />
                        <span className="ml-2 text-sm text-gray-500">Always On</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Analytics Cookies
                      </h3>
                      <p className="text-sm text-gray-600">
                        Help us understand how visitors use our site. We use this information to improve 
                        performance, user experience, and content. No personal data is collected.
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.analytics}
                          onChange={() => toggleSetting('analytics')}
                          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {settings.analytics ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Marketing Cookies
                      </h3>
                      <p className="text-sm text-gray-600">
                        Used to deliver personalized advertisements and track campaign effectiveness. 
                        These cookies may be shared with advertising partners.
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.marketing}
                          onChange={() => toggleSetting('marketing')}
                          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {settings.marketing ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-900">
                  <strong>Privacy Notice:</strong> You can change your cookie preferences at any time 
                  by visiting the cookie settings in the footer of our website. For more information, 
                  please read our{' '}
                  <a href="/privacy" className="underline hover:no-underline text-blue-600">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={handleCustomSettings}
                  className="px-6 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-900 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
