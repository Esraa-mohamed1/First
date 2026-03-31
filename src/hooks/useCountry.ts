import { useContext } from "react";
import { CountryContext } from "@/providers/CountryProvider";

/**
 * Hook to access the current selected country state and all registered countries.
 * Must be used within a `<CountryProvider>`.
 */
export const useCountry = () => {
  const context = useContext(CountryContext);

  if (context === undefined) {
    throw new Error(
      "useCountry hook was invoked outside of a CountryProvider scope. " +
      "Ensure your component is wrapped by <CountryProvider> in the React tree."
    );
  }

  return context;
};
