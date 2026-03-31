"use client";

import React, { InputHTMLAttributes } from "react";
import { useCountry } from "@/hooks/useCountry";
import { CountrySelect } from "./CountrySelect";
import { twMerge } from "tailwind-merge";

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  containerClassName?: string;
  label?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, containerClassName = "", label = "رقم الجوال", ...props }, ref) => {
    return (
      <div className={twMerge("flex flex-col gap-1.5 w-full", containerClassName)} dir="rtl">
        {label && (
          <label htmlFor="phone-input" className="text-sm font-bold text-[#4a4a4a] text-right block w-full" dir="rtl">
            {label}
          </label>
        )}

        <div className="flex relative items-stretch gap-2">
          <div className="w-[105px] sm:w-[125px] flex-shrink-0 relative">
            {/* Override CountrySelect internally if needed, or rely on its own transparent styling */}
            <CountrySelect className="h-full rounded-xl bg-[#f8faff] border-[#e2e8f0] shadow-sm hover:bg-[#f1f5f9] transition-all" compact={true} />
          </div>

          <div className="relative flex-1 min-w-0">
            <input
              ref={ref}
              type="tel"
              id="phone-input"
              className={twMerge(
                "block w-full h-[42px] rounded-md border-zinc-300 border px-3 text-sm shadow-sm",
                "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors",
                "placeholder:text-zinc-400 bg-white placeholder-shown:truncate",
                className
              )}
              placeholder="555 000 0000"
              dir="ltr"
              {...props}
            />
          </div>
        </div>
        <span className="text-xs text-zinc-500">
          رمز الهاتف يعتمد على الدولة المحددة.
        </span>
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
