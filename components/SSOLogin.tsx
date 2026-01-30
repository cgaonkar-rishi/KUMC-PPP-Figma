import React, { useState } from 'react';
import { Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';

interface SSOLoginProps {
  onReturnToApp?: () => void;
}

export function SSOLogin({ onReturnToApp }: SSOLoginProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSSOLogin = () => {
    setIsAuthenticating(true);
    // Placeholder for SAML 2.0 authentication flow
    // In production, this would redirect to the SAML IdP
    setTimeout(() => {
      setIsAuthenticating(false);
      // Simulate redirect to main app
      if (onReturnToApp) {
        onReturnToApp();
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <svg viewBox="0 0 200 40" className="h-16 w-auto" xmlns="http://www.w3.org/2000/svg">
                  <text x="10" y="28" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#0051BA">KUMC</text>
                  <text x="10" y="38" fontFamily="Arial, sans-serif" fontSize="8" fill="#0051BA">Medical Center</text>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Participant Payment Portal
            </h1>
            <p className="text-gray-600">
              Clinical Research Study Management
            </p>
          </div>

          {/* SAML 2.0 Security Badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Shield className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-blue-900">
                    SAML 2.0 Authentication
                  </p>
                  <CheckCircle size={16} className="text-blue-600" />
                </div>
                <p className="text-xs text-blue-700">
                  Secure Single Sign-On enabled
                </p>
              </div>
            </div>
          </div>

          {/* SSO Login Button */}
          <button
            onClick={handleSSOLogin}
            disabled={isAuthenticating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 mb-6"
          >
            {isAuthenticating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Lock size={20} />
                <span>Sign In with KUMC SSO</span>
              </>
            )}
          </button>

          {/* Security Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>Enterprise-grade security with SAML 2.0</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>Seamless integration with institutional credentials</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>HIPAA and 21 CFR Part 11 compliant</span>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">
                SAML Service Provider
              </span>
            </div>
          </div>

          {/* Technical Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Protocol:</span>
                <span>SAML 2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Binding:</span>
                <span>HTTP-POST</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Entity ID:</span>
                <span className="font-mono">kumc.edu/payment-portal</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 inline-flex items-start gap-2 text-sm text-gray-600">
            <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-medium text-gray-900 mb-1">Need help signing in?</p>
              <p className="text-xs">
                Contact IT Support at{' '}
                <a href="mailto:support@kumc.edu" className="text-blue-600 hover:underline">
                  support@kumc.edu
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2026 University of Kansas Medical Center</p>
          <p className="mt-1">
            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
            {' • '}
            <a href="#" className="hover:text-gray-700">Terms of Service</a>
          </p>
        </div>
      </div>

      {/* Demo Return Button */}
      {onReturnToApp && (
        <button
          onClick={onReturnToApp}
          className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm opacity-50 hover:opacity-100 transition-all z-50 shadow-lg"
        >
          Return to App (Demo)
        </button>
      )}
    </div>
  );
}