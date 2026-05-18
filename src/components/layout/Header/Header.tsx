"use client";

import React, { useState, Suspense } from "react";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white transition-shadow ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Navigation - Centered - Desktop */}
          {/* <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <Navigation />
          </div> */}

          {/* User Menu */}
          <div className="flex-shrink-0">
            <Suspense
              fallback={
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
              }
            >
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </div>

    </header>
  );
};
