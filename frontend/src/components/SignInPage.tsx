import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Logo } from './Logo';

interface SignInPageProps {
    onSignInSuccess: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onSignInSuccess }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [buttonWidth, setButtonWidth] = useState<number>(0);

    const updateButtonWidth = useCallback(() => {
        if (containerRef.current) {
            setButtonWidth(containerRef.current.clientWidth);
        }
    }, []);

    useEffect(() => {
        updateButtonWidth();
        window.addEventListener('resize', updateButtonWidth);
        return () => window.removeEventListener('resize', updateButtonWidth);
    }, [updateButtonWidth]);

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                // The 'credential' is the ID Token (JWT) that the backend expects.
                const res = await fetch("http://localhost:8000/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ credential: credentialResponse.credential }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.detail || "Login failed");

                localStorage.setItem("access_token", data.access_token);
                console.log("✅ User verified:", data.user);
                onSignInSuccess();
            } catch (err) {
                console.error("❌ Backend error:", err);
            }
        } else {
            console.error("Google login failed: No credential returned");
        }
    };

    const handleLoginError = () => {
        console.error("Google login failed");
    };


    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-evenly md:justify-between p-8 z-[100]">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-[-1]">
                <img 
                    src="https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=1920&auto=format&fit=crop" 
                    alt="A person in a creative setting"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            {/* Header with Logo */}
            <header className="w-full order-1">
                <div className="flex justify-center md:justify-start">
                    <div className="transform scale-150 md:scale-100">
                        <Logo />
                    </div>
                </div>
            </header>
            
            {/* Footer with Sign-in options */}
            <footer className="w-full max-w-sm mx-auto flex flex-col items-center text-center order-2 md:order-3">
                <h1 className="hidden md:block text-4xl sm:text-5xl font-bold text-amber-400 font-serif-display">
                    sign in
                </h1>
                <p className="mt-4 text-sm text-neutral-400">
                    Sign in with your Google Account to continue.
                </p>

                <div ref={containerRef} className="mt-8 w-full space-y-4 transition-transform duration-300 hover:scale-105">
                     <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginError}
                        theme="outline"
                        shape="rectangular"
                        text="continue_with"
                        width={buttonWidth > 0 ? `${buttonWidth}px` : undefined}
                        logo_alignment="left"
                    />
                </div>
            </footer>

            {/* Main Content (Quote) */}
            <main className="w-full max-w-lg mx-auto flex flex-col items-center text-center order-3 md:order-2 md:-mt-20">
                 <p className="font-serif-display text-lg md:text-xl lg:text-2xl text-neutral-300 leading-relaxed">
                    "The future of modeling begins with a single step — intuitive, intelligent, and entirely yours."
                </p>
            </main>
        </div>
    );
};
