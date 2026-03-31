"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Country, CountryContextState } from "@/types/country";
import { countries as allCountries } from "@/data/countries";

//default country as Saudi Arabia (ISO Code: SA)
const DEFAULT_COUNTRY_ISO = "SA";
const STORAGE_KEY = "selected_country_preference";

export const CountryContext = createContext<CountryContextState | undefined>(undefined);

export const CountryProvider = ({ children }: { children: ReactNode }) => {
  const [countries] = useState<Country[]>(allCountries);
  const [selectedCountry, setSelectedCountryState] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setDefaultCountry = useCallback(() => {
    const defaultCountry = countries.find((c) => c.isoCode === DEFAULT_COUNTRY_ISO) || countries[0];
    setSelectedCountryState(defaultCountry);
  }, [countries]);

  useEffect(() => {
    // Attempt to parse local preference safely to prevent crashes
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedCountry = JSON.parse(storedData) as Country;

        // Verify country still exists in dataset and hydrate with latest updated fields (e.g. Arabic names, flag URLs) to avoid stale cache!
        const exists = countries.find((c) => c.isoCode === parsedCountry.isoCode);
        if (exists) {
          setSelectedCountryState(exists);
        } else {
          setDefaultCountry();
        }
      } else {
        setDefaultCountry();
      }
    } catch (e) {
      console.warn("localStorage payload for country provider was invalid.", e);
      setDefaultCountry();
    } finally {
      setIsLoading(false);
    }
  }, [countries, setDefaultCountry]);

  const handleSetSelectedCountry = (country: Country) => {
    setSelectedCountryState(country);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(country));
    } catch (e) {
      console.error("Failed to persist selected country due to storage constraints", e);
    }
  };

  return (
    <CountryContext.Provider
      value={{
        countries,
        selectedCountry,
        setSelectedCountry: handleSetSelectedCountry,
        isLoading
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};
