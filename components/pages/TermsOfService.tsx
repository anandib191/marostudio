import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';

export const TermsOfService: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <Link to="/" className="inline-block mb-8">
          <Logo />
        </Link>
        <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-neutral-400 text-base">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 lg:p-10 space-y-8 text-neutral-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-300 leading-relaxed">
              By accessing and using MARO Studio ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-neutral-300 leading-relaxed">
              MARO Studio provides AI-powered photography generation services, including but not limited to professional photoshoot generation, marketing poster creation, and related visual content generation tools. The Service uses artificial intelligence to generate images based on user-provided inputs and preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">3.1 Account Creation</h3>
                <p className="text-neutral-300 leading-relaxed">
                  To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">3.2 Account Security</h3>
                <p className="text-neutral-300 leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">3.3 Google OAuth</h3>
                <p className="text-neutral-300 leading-relaxed">
                  When you choose to sign in with Google, you are subject to Google's Terms of Service and Privacy Policy. We are not responsible for Google's authentication services or any issues arising from their use.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Credits and Billing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">4.1 Credit System</h3>
                <p className="text-neutral-300 leading-relaxed">
                  The Service operates on a credit-based system. Each generation of content consumes credits as specified in your selected plan. Credits are non-transferable and non-refundable except as required by law.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">4.2 Subscription Plans</h3>
                <p className="text-neutral-300 leading-relaxed">
                  We offer various subscription plans with different credit allocations. Plan prices, features, and credit amounts are subject to change. We will provide reasonable notice of any material changes to your plan.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">4.3 Payment Terms</h3>
                <p className="text-neutral-300 leading-relaxed">
                  All payments are processed through third-party payment processors. You agree to provide valid payment information and authorize us to charge your payment method for all fees associated with your subscription.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">4.4 Refunds</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Refund policies are governed by applicable consumer protection laws. Unused credits are generally non-refundable. If you believe you are entitled to a refund, please contact us at <a href="mailto:info@growlouder.in" className="text-gold-400 hover:text-gold-300">info@growlouder.in</a>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. User Content and Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">5.1 User-Generated Content</h3>
                <p className="text-neutral-300 leading-relaxed">
                  You retain ownership of any content you upload or provide to the Service. By using the Service, you grant us a license to use, store, and process your content solely for the purpose of providing the Service to you.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">5.2 Generated Content</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Content generated by our AI services is provided "as is" for your use. You are responsible for ensuring that your use of generated content complies with applicable laws and does not infringe upon the rights of third parties.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">5.3 Prohibited Uses</h3>
                <p className="text-neutral-300 leading-relaxed mb-2">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-neutral-300">
                  <li>Generate content that is illegal, harmful, or violates any applicable laws</li>
                  <li>Create content that infringes upon intellectual property rights</li>
                  <li>Generate misleading, defamatory, or fraudulent content</li>
                  <li>Attempt to reverse engineer or extract our AI models or algorithms</li>
                  <li>Use the Service for any commercial purpose without proper authorization</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Service Availability and Modifications</h2>
            <p className="text-neutral-300 leading-relaxed">
              We strive to maintain the availability of the Service but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue the Service or any part thereof at any time with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Disclaimers and Limitations of Liability</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">7.1 Service "As Is"</h3>
                <p className="text-neutral-300 leading-relaxed">
                  The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free from viruses or other harmful components.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">7.2 Limitation of Liability</h3>
                <p className="text-neutral-300 leading-relaxed">
                  To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Indemnification</h2>
            <p className="text-neutral-300 leading-relaxed">
              You agree to indemnify, defend, and hold harmless MARO Studio, Growlouder Productions, and their officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of or relating to your use of the Service, violation of these Terms, or infringement of any intellectual property or other right of any person or entity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
            <p className="text-neutral-300 leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law and Dispute Resolution</h2>
            <p className="text-neutral-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with applicable arbitration rules.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
            <p className="text-neutral-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
            <p className="text-neutral-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
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
        <Link to="/privacy-policy" className="text-gold-400 hover:text-gold-300 transition-colors">
          Privacy Policy
        </Link>
        <span className="text-neutral-600">•</span>
        <Link to="/" className="text-gold-400 hover:text-gold-300 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
};
