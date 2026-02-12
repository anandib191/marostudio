import React, { useState } from 'react';
import { EnvelopeIcon } from '../icons/EnvelopeIcon';
import { PhoneInput, Country } from '../PhoneInput';
import { IndiaFlagIcon } from '../icons/IndiaFlagIcon';
import { Logo } from '../Logo';

export const ContactPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<Country>({ code: '+91', name: 'IN', icon: <IndiaFlagIcon className="w-5 h-5" /> });
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
        
        // Get WhatsApp number from environment variable
        const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
        
        // Format message with prefix
        const messageText = `Query from MARO Studio\n\nName: ${fullName}\nEmail: ${email}\nCompany: ${companyName}\nPhone: ${fullPhoneNumber}\n\nMessage: ${message}`;
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
        window.open(whatsappUrl, '_blank');
        
        // Reset form fields after opening WhatsApp
        setFullName('');
        setCompanyName('');
        setEmail('');
        setPhoneNumber('');
        setMessage('');
    };

    return (
        <div className="contact-page w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden relative z-10">
            <div className="max-w-7xl w-full py-4 md:py-6 relative z-10">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="font-serif-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                        Send Us Your{' '}
                        <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-transparent bg-clip-text">
                            Query
                        </span>
                    </h1>
                    <p className="mt-4 text-neutral-400 text-lg max-w-2xl mx-auto">
                        Have questions? We're here to help. Fill out the form below and we'll contact you via WhatsApp.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    {/* Left Column: Info */}
                    <div className="space-y-8 text-center lg:text-left">
                        <Logo />
                        <p className="max-w-md text-neutral-500 font-light text-lg leading-relaxed mx-auto lg:mx-0">
                            The ultimate AI photography engine for modern brands. High-fidelity visuals without the studio logistics.
                        </p>
                        <div className="pt-4 flex flex-col gap-4">
                            <a href="mailto:ceogrowlouder@gmail.com" className="flex items-center gap-4 text-neutral-300 hover:text-gold-400 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-500/10">
                                    <EnvelopeIcon className="w-5 h-5" />
                                </div>
                                <span className="font-semibold tracking-wider text-sm">ceogrowlouder@gmail.com</span>
                            </a>
                            <div className="flex items-center gap-4 text-neutral-300">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <span className="font-semibold tracking-wider text-sm">+91 9876543210</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-neutral-900/40 p-6 md:p-8 rounded-[32px] border border-white/5 shadow-2xl backdrop-blur-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-neutral-700"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-neutral-700"
                                />
                            </div>
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Brand / Label Name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-neutral-700"
                            />
                            <PhoneInput
                                selectedCountry={selectedCountry}
                                onCountryChange={setSelectedCountry}
                                phoneNumber={phoneNumber}
                                onPhoneNumberChange={setPhoneNumber}
                            />
                                <label htmlFor="message-textarea" className="sr-only">Message</label>
                                <textarea
                                    id="message-textarea"
                                    name="message"
                                    placeholder="How can we help your brand?"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={3}
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-neutral-700 resize-none"
                                />
                            <button
                                type="submit"
                                className="btn-gradient-gold w-full text-[11px] uppercase tracking-[0.3em] py-5 rounded-xl active:scale-[0.98]"
                            >
                                Send Inquiry
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
