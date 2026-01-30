import { X } from 'lucide-react';

interface Address {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AddressVerificationModalProps {
  currentAddress: Address;
  onClose: () => void;
  onConfirm: (address: Address, useVerified: boolean) => void;
}

export function AddressVerificationModal({ 
  currentAddress, 
  onClose, 
  onConfirm 
}: AddressVerificationModalProps) {
  // Mock verified address - in production this would come from Google Maps API
  const verifiedAddress: Address = {
    address1: currentAddress.address1 || '3901 Rainbow Blvd',
    address2: currentAddress.address2 || 'MS 1039',
    city: currentAddress.city || 'Kansas City',
    state: currentAddress.state || 'KS',
    zip: currentAddress.zip || '66160',
    country: currentAddress.country || 'United States'
  };

  const handleKeepCurrent = () => {
    onConfirm(currentAddress, false);
  };

  const handleUseVerified = () => {
    onConfirm(verifiedAddress, true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-blue-50">
          <div>
            <h2 className="text-xl">Address Verification</h2>
            <p className="text-sm text-gray-600 mt-1">
              Review and select the correct address format
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> The address verification service uses Google Maps API to standardize and validate addresses. 
              Please review both versions and select the most appropriate format.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Address */}
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                <h3 className="font-semibold text-gray-900">Current Address</h3>
                <p className="text-xs text-gray-600 mt-1">Address as entered</p>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Address Line 1</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {currentAddress.address1 || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Address Line 2</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {currentAddress.address2 || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">City</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {currentAddress.city || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">State</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {currentAddress.state || <span className="text-gray-400 italic">--</span>}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium">ZIP Code</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {currentAddress.zip || <span className="text-gray-400 italic">--</span>}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Country</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {currentAddress.country || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Address */}
            <div className="border-2 border-green-400 rounded-lg overflow-hidden">
              <div className="bg-green-50 px-4 py-3 border-b border-green-300">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  Verified Address
                  <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">Recommended</span>
                </h3>
                <p className="text-xs text-gray-600 mt-1">Standardized by Google Maps</p>
              </div>
              <div className="p-4 space-y-3 bg-green-50/30">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Address Line 1</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">
                    {verifiedAddress.address1}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Address Line 2</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">
                    {verifiedAddress.address2 || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">City</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">
                    {verifiedAddress.city}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">State</label>
                    <p className="text-sm text-gray-900 mt-1 font-medium">
                      {verifiedAddress.state}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium">ZIP Code</label>
                    <p className="text-sm text-gray-900 mt-1 font-medium">
                      {verifiedAddress.zip}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Country</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">
                    {verifiedAddress.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">What's the difference?</h4>
            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
              <li>The verified address has been standardized using USPS formatting guidelines</li>
              <li>Street names, abbreviations, and capitalization may have been corrected</li>
              <li>Using the verified address improves mail delivery reliability</li>
              <li>You can keep your current address if it's already correct</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleKeepCurrent}
            className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 bg-white rounded-lg hover:bg-blue-50 font-medium transition-colors"
          >
            Keep Current Address
          </button>
          <button 
            onClick={handleUseVerified}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm transition-colors"
          >
            Use Verified Address
          </button>
        </div>
      </div>
    </div>
  );
}
