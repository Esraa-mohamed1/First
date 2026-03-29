export interface Country {
  name: string;      // The common name of the country (e.g., 'Egypt')
  isoCode: string;   // ISO 3166-1 alpha-2 code (e.g., 'EG')
  dialCode: string;  // International dialing code (e.g., '+20')
  flagEmoji: string; // Emoji flag of the country
  flagUrl: string;   // Image URL for rendering actual flag
}

export interface CountryContextState {
  countries: Country[];
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country) => void;
  isLoading: boolean;
}
