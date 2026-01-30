
import React, { useState, useRef, useEffect } from 'react';
import { IndiaFlagIcon } from './icons/IndiaFlagIcon';
import { USFlagIcon } from './icons/USFlagIcon';
import { UKFlagIcon } from './icons/UKFlagIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { SubmissionPopup } from './SubmissionPopup';

const countries = [
  { code: '+91', name: 'IN', icon: <IndiaFlagIcon className="w-5 h-5"/> },
  { code: '+1', name: 'US', icon: <USFlagIcon className="w-5 h-5"/> },
  { code: '+44', name: 'UK', icon: <UKFlagIcon className="w-5 h-5"/> },
];

export const BookDemoPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState<{
        success: boolean;
        fullName: string;
        email: string;
        phone: string;
    }>({ success: false, fullName: '', email: '', phone: '' });


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const FORM_API_KEY = import.meta.env.VITE_FORM_API_KEY || '';
            
            if (!FORM_API_KEY) {
                throw new Error('Form API key is not configured');
            }
            
            const response = await fetch(`${API_URL}/submit-form/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'API_KEY': FORM_API_KEY,
                },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    company_name: companyName,
                    phone_number: fullPhoneNumber,
                }),
            });
    
            const result = await response.json();
    
            if (result.status === 1) {
                setPopupData({
                    success: true,
                    fullName: fullName,
                    email: email,
                    phone: fullPhoneNumber,
                });
                setIsPopupOpen(true);
                // Clear form on success
                setFullName('');
                setEmail('');
                setCompanyName('');
                setPhoneNumber('');
                setSelectedCountry(countries[0]);
            } else {
                throw new Error(result.message || 'Submission was not successful.');
            }
    
        } catch (error) {
            console.error('Submission failed:', error);
            setPopupData({
                success: false,
                fullName: fullName,
                email: email,
                phone: fullPhoneNumber,
            });
            setIsPopupOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
                    {/* Left Column */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <span className="inline-flex items-center gap-2.5 bg-neutral-800/60 border border-neutral-700 text-sm font-semibold px-4 py-2 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            BOOK YOUR DEMO
                        </span>
                        <h1 className="mt-6 font-serif-display text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                            See{' '}
                            <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                                MARO Studio
                            </span>{' '}
                            in{' '}
                            <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                                Action
                            </span>
                        </h1>
                        <p className="mt-6 text-neutral-300 text-lg">
                            Watch how leading fashion brands are transforming their photography workflow with AI.
                        </p>
                        <p className="mt-4 font-semibold text-white text-lg">
                            Book a personalized demo tailored to your specific needs.
                        </p>
                    </div>

                    {/* Right Column: Form Card */}
                    <div className="lg:w-1/2 w-full">
                        <div className="w-full max-w-md mx-auto bg-neutral-900/50 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-8">
                            <h2 className="text-2xl font-bold text-center text-white">
                                Schedule Your{' '}
                                <span className="bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">
                                    Demo
                                </span>
                            </h2>
                            <p className="text-center text-neutral-400 text-sm mt-2">
                                Fill out the form below and we'll get back to you within 24 hours.
                            </p>
                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="full-name" className="block text-xs font-medium text-neutral-400 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            id="full-name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="John Doe"
                                            required
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-medium text-neutral-400 mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="john@company.com"
                                            required
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="company-name" className="block text-xs font-medium text-neutral-400 mb-2">Company Name *</label>
                                    <input
                                        type="text"
                                        id="company-name"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Your Company"
                                        required
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone-number" className="block text-xs font-medium text-neutral-400 mb-2">Phone Number *</label>
                                    <div className="flex items-center">
                                        <div ref={dropdownRef} className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-l-lg hover:bg-neutral-700 focus:ring-1 focus:ring-neutral-600 focus:outline-none h-full"
                                                aria-haspopup="listbox"
                                                aria-expanded={isDropdownOpen}
                                            >
                                                {selectedCountry.icon}
                                                <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isDropdownOpen && (
                                                <div className="absolute bottom-full left-0 mb-2 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-20 animate-pop-in">
                                                    <ul className="py-1" role="listbox">
                                                        {countries.map(country => (
                                                        <li key={country.name} role="option" aria-selected={selectedCountry.code === country.code}>
                                                            <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedCountry(country);
                                                                setIsDropdownOpen(false);
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
                                                id="phone-number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="Mobile number"
                                                required
                                                className="block w-full z-20 bg-neutral-800 border border-l-0 border-neutral-700 rounded-r-lg py-2.5 px-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-12"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 font-semibold py-3 px-8 rounded-lg shadow-lg shadow-indigo-900/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Booking...' : 'Book Your Demo'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {isPopupOpen && <SubmissionPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} {...popupData} />}
        </>
    );
};
