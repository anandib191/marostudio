import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <Link to="/" className="inline-block mb-8">
          <Logo />
        </Link>
        <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-neutral-400 text-base">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 lg:p-10 space-y-8 text-neutral-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-neutral-300 leading-relaxed">
              Welcome to MARO Studio ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI-powered photography services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.1 Personal Information</h3>
                <p className="text-neutral-300 leading-relaxed">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2 text-neutral-300">
                  <li>Register for an account or create a profile</li>
                  <li>Use our AI photography generation services</li>
                  <li>Contact us for support or inquiries</li>
                  <li>Subscribe to our newsletter or marketing communications</li>
                  <li>Make a purchase or transaction</li>
                </ul>
                <p className="text-neutral-300 leading-relaxed mt-4">
                  This information may include: name, email address, phone number, billing address, payment information, and any other information you choose to provide.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.2 Usage Data</h3>
                <p className="text-neutral-300 leading-relaxed">
                  We automatically collect certain information when you access and use our services, including:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-2 text-neutral-300">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Date and time of access</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.3 Generated Content</h3>
                <p className="text-neutral-300 leading-relaxed">
                  When you use our AI photography generation services, we may store the images and content you generate for the purpose of providing our services and allowing you to access your previously generated content.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-neutral-300">
              <li>To provide, maintain, and improve our services</li>
              <li>To process your transactions and manage your account</li>
              <li>To communicate with you about your account, our services, and updates</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send you marketing and promotional communications (with your consent)</li>
              <li>To detect, prevent, and address technical issues and security threats</li>
              <li>To comply with legal obligations and enforce our terms of service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Google OAuth</h2>
            <p className="text-neutral-300 leading-relaxed">
              When you choose to sign in with Google, we use Google OAuth to authenticate your identity. We only receive basic profile information (name, email address) from Google. We do not store your Google password or have access to your Google account beyond what you explicitly authorize. Your use of Google OAuth is also subject to Google's Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Storage and Security</h2>
            <p className="text-neutral-300 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Sharing and Disclosure</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-neutral-300">
              <li>With service providers who assist us in operating our website and conducting our business</li>
              <li>When required by law or to respond to legal process</li>
              <li>To protect our rights, property, or safety, or that of our users</li>
              <li>In connection with a merger, acquisition, or sale of assets (with notice to users)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights and Choices</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-neutral-300">
              <li>The right to access and receive a copy of your personal data</li>
              <li>The right to rectify inaccurate or incomplete data</li>
              <li>The right to request deletion of your personal data</li>
              <li>The right to object to or restrict processing of your data</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent at any time</li>
            </ul>
            <p className="text-neutral-300 leading-relaxed mt-4">
              To exercise these rights, please contact us at <a href="mailto:info@growlouder.in" className="text-gold-400 hover:text-gold-300">info@growlouder.in</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-neutral-300 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
            <p className="text-neutral-300 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-neutral-300 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p className="text-neutral-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-neutral-300">
              <p><strong>Email:</strong> <a href="mailto:info@growlouder.in" className="text-gold-400 hover:text-gold-300">info@growlouder.in</a></p>
              <p><strong>Company:</strong> Growlouder Productions</p>
            </div>
          </section>

        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-12 text-center space-x-6 text-base">
        <Link to="/terms" className="text-gold-400 hover:text-gold-300 transition-colors">
          Terms of Service
        </Link>
        <span className="text-neutral-600">•</span>
        <Link to="/" className="text-gold-400 hover:text-gold-300 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
};
