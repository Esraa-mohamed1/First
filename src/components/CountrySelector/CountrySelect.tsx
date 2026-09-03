"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useCountry } from "@/hooks/useCountry";
import { Search, ChevronDown, Check } from "lucide-react";
import { Country } from "@/types/country";
import { twMerge } from "tailwind-merge";

interface CountrySelectProps {
  className?: string;
  // If true, trigger only shows flag and dial code, hiding the country name
  compact?: boolean; 
  allowedCountryCodes?: string[];
}

const DEFAULT_ALLOWED_CODES = ["EG", "SA", "KW"];

export const CountrySelect: React.FC<CountrySelectProps> = ({ 
  className = "", 
  compact = false,
  allowedCountryCodes = DEFAULT_ALLOWED_CODES
}) => {
  const { countries, selectedCountry, setSelectedCountry, isLoading } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries strictly to the 3 allowed countries: 1. Egypt (+20), 2. Saudi Arabia (+966), 3. Kuwait (+965)
  const availableCountries = useMemo(() => {
    const codes = allowedCountryCodes || DEFAULT_ALLOWED_CODES;
    return codes
      .map((code) => countries.find((c) => c.isoCode.toUpperCase() === code.toUpperCase()))
      .filter((c): c is Country => Boolean(c));
  }, [countries, allowedCountryCodes]);

  // Ensure selected country is one of the supported countries
  useEffect(() => {
    if (selectedCountry && availableCountries.length > 0) {
      const isAllowed = availableCountries.some((c) => c.isoCode === selectedCountry.isoCode);
      if (!isAllowed) {
        setSelectedCountry(availableCountries[0]);
      }
    }
  }, [selectedCountry, availableCountries, setSelectedCountry]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return availableCountries;
    return availableCountries.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dialCode.includes(searchQuery)
    );
  }, [availableCountries, searchQuery]);

  if (isLoading || !selectedCountry) {
    return (
      <div className={twMerge("h-full min-h-[40px] w-full animate-pulse bg-zinc-100 rounded-md border border-zinc-200", className)} />
    );
  }

  return (
    <div className="relative w-full h-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "w-full h-full min-h-[42px] flex items-center justify-between px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer",
          // Default styling (can be overridden by passed className)
          "bg-white border border-zinc-300 rounded-md shadow-sm",
          className
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0" dir="ltr">
          <img src={selectedCountry.flagUrl} alt={selectedCountry.name} className="h-4 w-6 object-cover rounded shadow-sm shrink-0" />
          {!compact && (
            <span className="font-medium truncate text-zinc-900 text-left flex-1" dir="auto">{selectedCountry.name}</span>
          )}
          <span className="text-zinc-500 text-sm font-medium shrink-0 whitespace-nowrap">{selectedCountry.dialCode}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0 ml-1" />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-[260px] max-w-[calc(100vw-3rem)] bg-white border border-zinc-200 rounded-xl shadow-xl max-h-80 flex flex-col right-0 origin-top-right">
          {/* Sticky Search Input */}
          <div className="p-2 border-b border-zinc-100 sticky top-0 bg-white rounded-t-lg">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-zinc-50 focus:bg-white placeholder:text-zinc-400 transition-colors"
                placeholder="ابحث عن دولة أو رمز..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                dir="rtl"
              />
            </div>
          </div>

          {/* List Box scrollable area */}
          <div className="flex-1 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <p className="p-4 text-sm text-zinc-500 text-center">لا توجد دول متطابقة.</p>
            ) : (
              <ul className="py-1">
                {filteredCountries.map((country: Country) => (
                  <li key={country.isoCode}>
                    <button
                      type="button"
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none transition-colors ${
                        selectedCountry.isoCode === country.isoCode 
                          ? "bg-blue-50 text-blue-900 font-medium" 
                          : "text-zinc-700 font-normal"
                      }`}
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img src={country.flagUrl} alt={country.name} className="h-4 w-6 object-cover rounded shadow-sm shrink-0" />
                        <span className="truncate text-right flex-1">{country.name}</span>
                        <span className="text-zinc-400 text-xs px-1 shrink-0 whitespace-nowrap" dir="ltr">{country.dialCode}</span>
                      </div>
                      {selectedCountry.isoCode === country.isoCode && (
                        <Check className="h-4 w-4 text-blue-600 shrink-0 mr-2" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
