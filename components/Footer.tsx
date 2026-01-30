import React from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { Logo } from './Logo';

const Footer = React.forwardRef<HTMLElement>((props, ref) => {
    return (
        <footer ref={ref} id="contact" className="w-full bg-[#080808] text-neutral-300 py-16 md:py-20 lg:py-24 px-4 sm:px-5 md:px-6 lg:px-8 border-t border-white/5 relative mt-24 md:mt-28 lg:mt-32">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left Column: Info */}
                    <div className="space-y-8 text-center lg:text-left">
                        <Logo />
                        <p className="max-w-md text-neutral-500 font-light text-lg leading-relaxed mx-auto lg:mx-0">
                            The ultimate AI photography engine for modern brands. High-fidelity visuals without the studio logistics.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center lg:items-start">
                            <a href="mailto:ceogrowlouder@gmail.com" className="inline-flex items-center gap-4 text-neutral-300 hover:text-indigo-400 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10">
                                    <EnvelopeIcon className="w-5 h-5" />
                                </div>
                                <span className="font-semibold tracking-wider text-sm uppercase">Contact Studio</span>
                            </a>
                            <Link to="/contact" className="inline-flex items-center gap-4 text-neutral-300 hover:text-indigo-400 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10">
                                    <span className="text-lg">💬</span>
                                </div>
                                <span className="font-semibold tracking-wider text-sm uppercase">Have a Query?</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-24 pt-10 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-4">
                        <Link to="/privacy-policy" className="text-neutral-400 hover:text-indigo-400 transition-colors text-sm">
                            Privacy Policy
                        </Link>
                        <span className="text-neutral-600 hidden sm:inline">•</span>
                        <Link to="/terms" className="text-neutral-400 hover:text-indigo-400 transition-colors text-sm">
                            Terms of Service
                        </Link>
                    </div>
                    <div className="flex justify-center items-center text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-bold">
                        <p>&copy; {new Date().getFullYear()} MARO Studio. All rights reserved By Growlouder Productions</p>
                    </div>
                </div>
            </div>
        </footer>
    );
});

export { Footer };
