import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Participant {
  firstName: string;
  lastName: string;
  ssn: string;
}

interface ParticipantVerificationModalProps {
  participant: Participant;
  onClose: () => void;
  onVerified?: (participant: Participant) => void;
}

export function ParticipantVerificationModal({ 
  participant, 
  onClose,
  onVerified 
}: ParticipantVerificationModalProps) {
  const [firstName, setFirstName] = useState(participant.firstName || '');
  const [lastName, setLastName] = useState(participant.lastName || '');
  const [ssn, setSsn] = useState(participant.ssn || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    ssn: ''
  });

  // Format SSN with dashes as user types
  const formatSSN = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as XXX-XX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 5) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
    }
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    setSsn(formatted);
    // Clear SSN error when user types
    if (errors.ssn) {
      setErrors(prev => ({ ...prev, ssn: '' }));
    }
  };

  const validateFields = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      ssn: ''
    };

    let isValid = true;

    // Validate First Name
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
      isValid = false;
    }

    // Validate Last Name
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
      isValid = false;
    }

    // Validate SSN
    const ssnDigits = ssn.replace(/\D/g, '');
    if (!ssn.trim()) {
      newErrors.ssn = 'SSN is required';
      isValid = false;
    } else if (ssnDigits.length !== 9) {
      newErrors.ssn = 'SSN must be 9 digits';
      isValid = false;
    } else if (!/^\d{3}-\d{2}-\d{4}$/.test(ssn)) {
      newErrors.ssn = 'SSN must be in format XXX-XX-XXXX';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCheck = async () => {
    // Validate all fields first
    if (!validateFields()) {
      toast.error('Please correct the errors before verifying');
      return;
    }

    setIsVerifying(true);

    // Simulate external verification API call
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      
      toast.success('Participant verified successfully', {
        description: `${firstName} ${lastName} has been verified`,
        duration: 4000
      });

      // Update participant data but keep modal open
      if (onVerified) {
        onVerified({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          ssn: ssn.trim()
        });
      }
    }, 1500);
  };

  const handleClose = () => {
    if (isVerifying) return; // Prevent closing while verifying
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-blue-50">
          <div>
            <h2 className="text-xl font-semibold">Participant Verification</h2>
            <p className="text-sm text-gray-600 mt-1">
              Verify participant identity against external verification service
            </p>
          </div>
          <button 
            onClick={handleClose} 
            className="p-2 hover:bg-white rounded-lg transition-colors"
            disabled={isVerifying}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Limited Tries Warning */}
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-900">
                  Limited Verification Attempts
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  The number of verification attempts is limited. Please ensure all information is accurate before proceeding.
                </p>
              </div>
            </div>
          </div>

          {/* Info Notice */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  This process will validate the participant's identity information against an external verification service.
                </p>
              </div>
            </div>
          </div>

          {/* Verification Form */}
          <div className="space-y-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) {
                    setErrors(prev => ({ ...prev, firstName: '' }));
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.firstName 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter first name"
                disabled={isVerifying || isVerified}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) {
                    setErrors(prev => ({ ...prev, lastName: '' }));
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.lastName 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter last name"
                disabled={isVerifying || isVerified}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* SSN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Security Number (SSN) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ssn}
                onChange={handleSSNChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all font-mono ${
                  errors.ssn 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="XXX-XX-XXXX"
                maxLength={11}
                disabled={isVerifying || isVerified}
              />
              {errors.ssn && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.ssn}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Format: XXX-XX-XXXX (e.g., 123-45-6789)
              </p>
            </div>
          </div>

          {/* Verification Success Message */}
          {isVerified && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    Participant verified successfully
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {firstName} {lastName} has been successfully verified.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3">
          <button 
            onClick={handleClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            disabled={isVerifying}
          >
            {isVerified ? 'Close' : 'Cancel'}
          </button>
          {!isVerified && (
            <button 
              onClick={handleCheck}
              disabled={isVerifying}
              className="flex-1 px-6 py-3 bg-ku-blue text-white rounded-lg hover:bg-ku-blue-dark font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Verify Participant
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}