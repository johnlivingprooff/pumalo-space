'use client';

import React, { useEffect, useState } from 'react';

interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

/**
 * Cookie Consent Provider Hook
 * Use this to check if analytics/marketing cookies are allowed
 */
export function useCookieConsent() {
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('cookie-preferences');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Listen for updates
    const handleUpdate = (event: CustomEvent) => {
      setSettings(event.detail);
    };

    window.addEventListener('cookie-consent-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('cookie-consent-updated', handleUpdate as EventListener);
    };
  }, []);

  return {
    acceptedAnalytics: settings.analytics,
    acceptedMarketing: settings.marketing,
    acceptedEssential: settings.essential,
    settings,
  };
}

/**
 * Load Google Analytics conditionally based on cookie consent
 * Add this component to your root layout
 */
export function GoogleAnalyticsLoader() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    // Check current settings
    const saved = localStorage.getItem('cookie-preferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setAnalyticsAllowed(prefs.analytics);
    }

    // Listen for updates
    const handleUpdate = (event: CustomEvent) => {
      setAnalyticsAllowed(event.detail.analytics);
    };

    window.addEventListener('cookie-consent-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('cookie-consent-updated', handleUpdate as EventListener);
    };
  }, []);

  if (!analyticsAllowed) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script - Only loaded if consent given */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `,
        }}
      />
    </>
  );
}

/**
 * Footer Cookie Settings Link
 * Add this to your footer for easy access to cookie preferences
 */
export function CookieSettingsLink() {
  const handleClick = () => {
    // Trigger cookie settings modal
    const event = new CustomEvent('open-cookie-settings');
    window.dispatchEvent(event);
  };

  return (
    <button
      onClick={handleClick}
      className="text-gray-600 hover:text-gray-900 text-sm underline"
    >
      Cookie Settings
    </button>
  );
}
