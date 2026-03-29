// Force a trigger for HMR with this explicit comment
import rawCountries from "./countries-dataset.json";
import { Country } from "@/types/country";

// Next.js ESM JSON module import polyfill handler just in case it exports as { default: [...] }
const dataset = Array.isArray(rawCountries) ? rawCountries : (rawCountries as any).default || Object.values(rawCountries);

// Map the dataset meticulously with robust fallbacks
export const countries: Country[] = (dataset as any[])
  .filter((country) => country?.idd && country?.idd?.root) 
  .map((country) => {
    const root = country.idd.root || "";
    const suffix = country.idd.suffixes && country.idd.suffixes.length > 0 ? country.idd.suffixes[0] : "";
    const dialCode = `${root}${suffix}`;
    
    // Safety check for cca2 since it's fundamentally needed for flags
    const isoCode = country.cca2 || "";
    
    return {
      // Prioritize explicit arabic mappings via mledoze definitions
      name: country.translations?.ara?.common || country.translations?.ara?.official || country.name?.nativeName?.ara?.common || country.name?.common || "Unknown",
      isoCode: isoCode,
      dialCode: dialCode,
      flagEmoji: country.flag || "",
      // High-compatibility FlagCDN rendering (standard PNG bypasses SVG CORS/mimetype issues in older webkit)
      flagUrl: isoCode ? `https://flagcdn.com/w40/${isoCode.toLowerCase()}.png` : "",
    };
  })
  .filter((country, index, self) => 
    index === self.findIndex((c) => c.isoCode === country.isoCode)
  )
  .sort((a, b) => a.name.localeCompare(b.name, 'ar')); // Use Arabic locale explicit sort

