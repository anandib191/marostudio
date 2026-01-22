
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { IndiaFlagIcon } from './icons/IndiaFlagIcon';
import { USFlagIcon } from './icons/USFlagIcon';
import { UKFlagIcon } from './icons/UKFlagIcon';

export interface Country {
    code: string;
    name: string;
    icon: React.ReactNode;
}

const countries: Country[] = [
  { code: '+91', name: 'IN', icon: <IndiaFlagIcon className="w-5 h-5"/> },
  { code: '+1', name: 'US', icon: <USFlagIcon className="w-5 h-5"/> },
  { code: '+44', name: 'UK', icon: <UKFlagIcon className="w-5 h-5"/> },
];

interface PhoneInputProps {
    selectedCountry: Country;
    onCountryChange: (country: Country) => void;
    phoneNumber: string;
    onPhoneNumberChange: (value: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
    selectedCountry,
    onCountryChange,
    phoneNumber,
    onPhoneNumberChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center">
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-l-lg hover:bg-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-none h-full"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={`Selected country code ${selectedCountry.code}`}
          >
            {selectedCountry.icon}
            <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-20 animate-pop-in">
              <ul className="py-1" role="listbox">
                {countries.map(country => (
                  <li key={country.name} role="option" aria-selected={selectedCountry.code === country.code}>
                    <button
                      type="button"
                      onClick={() => {
                        onCountryChange(country);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
                    >
                      <div className="w-5 h-5 mr-3">{country.icon}</div>
                      <span>{country.name} ({country.code})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none">{selectedCountry.code}</span>
            <input
                type="tel"
                name="phoneNumber"
                placeholder="Mobile Number"
                value={phoneNumber}
                onChange={(e) => onPhoneNumberChange(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-l-0 border-neutral-700 rounded-r-lg py-3 px-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500 pl-12"
                pattern="[0-9\s]{7,15}"
                title="Please enter a valid phone number."
            />
        </div>
    </div>
  );
};
