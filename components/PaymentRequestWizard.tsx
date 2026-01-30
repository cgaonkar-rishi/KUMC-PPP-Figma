import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, User, Receipt, Upload, FileCheck, Plus, Trash2, FileText, X, Search, ChevronDown, ChevronUp, AlertTriangle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { requesters } from './RequestersList';
import { ReceiptDropZone } from './ReceiptDropZone';

interface LineItem {
  id: string;
  description: string;
  amount: number;
  type: string;
  notes?: string;
  receipts: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
}

interface PaymentRequestWizardProps {
  onBack?: () => void;
}

export function PaymentRequestWizard({ onBack }: PaymentRequestWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Request Information
  const [recipientType, setRecipientType] = useState<'Participant' | 'Caregiver' | 'Third-Party/Other'>('Participant');
  const [participantSearch, setParticipantSearch] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);
  const [caregiverName, setCaregiverName] = useState('');
  const [associatedParticipant, setAssociatedParticipant] = useState('');
  const [thirdPartyName, setThirdPartyName] = useState('');
  const [selectedStudy, setSelectedStudy] = useState('');
  const [requestType, setRequestType] = useState<'Payment' | 'Reimbursement'>('Payment');
  const [selectedPaymentSchedule, setSelectedPaymentSchedule] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [requesterLabel, setRequesterLabel] = useState('');

  // Step 2: Line Items
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemType, setNewItemType] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Mileage Calculator State
  const [showMileageCalc, setShowMileageCalc] = useState(false);
  const [mileageDistance, setMileageDistance] = useState(0);
  const [mileageRate, setMileageRate] = useState(0.67); // IRS standard mileage rate for 2024
  const [selectedStudyLocation, setSelectedStudyLocation] = useState('');

  // Step 3: Receipts
  const [isDragging, setIsDragging] = useState(false);

  // Expand/collapse state for step summaries
  const [expandedSteps, setExpandedSteps] = useState<{ [key: number]: boolean }>({});
  
  // Cancel confirmation modal
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock participant data with associated studies and addresses
  const allParticipants = [
    { id: 'P-2026-001', name: 'John Smith', studies: ['CHS-2026-001', 'PNS-2026-008'], address: '123 Main St, Kansas City, KS 66101', withholdTax: 'no', participantStatus: 'Active', status: 'Registered' },
    { id: 'P-2025-156', name: 'Sarah Johnson', studies: ['NDR-2025-042', 'DPT-2025-019'], address: '456 Oak Ave, Overland Park, KS 66062', withholdTax: 'yes', participantStatus: 'Active', status: 'Registered' },
    { id: 'P-2026-045', name: 'Michael Brown', studies: ['DPT-2025-019'], address: '789 Elm Street, Lenexa, KS 66215', withholdTax: 'no', participantStatus: 'Active', status: 'Registered' },
    { id: 'P-2026-089', name: 'Emily Davis', studies: ['PNS-2026-008', 'CHS-2026-001'], address: '321 Pine Rd, Kansas City, MO 64110', withholdTax: 'no', participantStatus: 'Active', status: 'Registered' },
    { id: 'P-2025-178', name: 'Linda Martinez', studies: ['DPT-2025-019', 'NDR-2025-042', 'CHS-2026-001'], address: '987 Cedar Ln, Olathe, KS 66061', withholdTax: 'no', participantStatus: 'Inactive', status: 'Registered' },
    { id: 'P-2026-012', name: 'Jennifer Taylor', studies: ['CHS-2026-001'], address: '258 Walnut St, Kansas City, KS 66102', withholdTax: 'no', participantStatus: 'Active', status: 'Registered' },
    { id: 'P-2025-234', name: 'Robert Wilson', studies: ['NDR-2025-042'], address: '654 Maple Dr, Shawnee, KS 66203', withholdTax: 'yes', participantStatus: 'Active', status: 'Registered' },
    { id: 'P-2026-078', name: 'Patricia Moore', studies: ['CHS-2026-001', 'PNS-2026-008'], address: '147 Birch Ave, Prairie Village, KS 66208', withholdTax: 'no', participantStatus: 'Active', status: 'Registered' },
    { id: 'P-2026-150', name: 'Thomas Garcia', studies: ['SDA-2026-003', 'CHS-2026-001'], address: '741 Spruce St, Kansas City, KS 66112', withholdTax: 'no', participantStatus: 'Active', status: 'Registered' },
    { id: 'P-2026-151', name: 'Jessica White', studies: ['SDA-2026-003'], address: '852 Ash Blvd, Overland Park, KS 66085', withholdTax: 'no', participantStatus: 'Active', status: 'Registered' },
  ];

  // All available studies with locations
  const allStudies = [
    { id: 'CHS-2026-001', name: 'Cardiovascular Health Study', status: 'Active', locations: ['Main Research Center - Building A', 'Outpatient Clinic - West Campus'] },
    { id: 'NDR-2025-042', name: 'Neurological Disorders Research', status: 'Active', locations: ['Outpatient Clinic - West Campus', 'Virtual/Remote Participation'] },
    { id: 'DPT-2025-019', name: 'Diabetes Prevention Trial', status: 'Study completed', locations: ['Main Research Center - Building A', 'Corp', 'Remote'] },
    { id: 'PNS-2026-008', name: 'Pediatric Nutrition Study', status: 'Active', locations: ['Westwood', 'Home Visit - Johnson County Area'] },
    { id: 'SDA-2026-003', name: 'Sleep Disorder Analysis', status: 'Study start', locations: ['Outpatient Clinic - West Campus'] },
  ];

  // Study location addresses
  const locationAddresses: { [key: string]: string } = {
    'Main Research Center - Building A': '3901 Rainbow Blvd, Kansas City, KS 66160',
    'Outpatient Clinic - West Campus': '4000 Cambridge St, Kansas City, KS 66160',
    'Westwood': '5520 College Blvd, Overland Park, KS 66211',
    'Corp': '4330 Shawnee Mission Pkwy, Fairway, KS 66205',
  };

  const reimbursementTypes = [
    'Drive/Mileage',
    'Tolls/Parking',
    'Flight',
    'Hotel/Accommodations',
    'Rental Car',
    'Public Transit',
    'Taxi/Rideshare',
    'Meals/Food',
    'Other reimbursement'
  ];

  // Filter participants based on search - only show Active participants with Registered status
  const filteredParticipants = allParticipants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
      participant.id.toLowerCase().includes(participantSearch.toLowerCase());
    const isEligible = participant.participantStatus === 'Active' && participant.status === 'Registered';
    return matchesSearch && isEligible;
  });

  // Filter studies based on selected participant
  const availableStudies = selectedParticipant 
    ? allStudies.filter(study => selectedParticipant.studies.includes(study.id))
    : allStudies;

  // Mock payment schedules for studies
  const getPaymentSchedulesForStudy = (studyCode: string) => {
    const schedulesMap: { [key: string]: any[] } = {
      'CHS-2026-001': [
        { id: 'PS1', visitId: 'V1', visitName: 'Screening Visit', amount: 0, description: 'No payment for screening' },
        { id: 'PS2', visitId: 'V2', visitName: 'Baseline Assessment', amount: 75, description: 'Baseline visit completion' },
        { id: 'PS3', visitId: 'V3', visitName: 'Week 4 Follow-up', amount: 50, description: 'Follow-up visit stipend' },
        { id: 'PS4', visitId: 'V4', visitName: 'Month 3 Assessment', amount: 100, description: 'Month 3 assessment payment' },
        { id: 'PS5', visitId: 'V5', visitName: 'Month 6 Assessment', amount: 100, description: 'Month 6 assessment payment' },
        { id: 'PS6', visitId: 'V6', visitName: 'Final Visit', amount: 150, description: 'Study completion bonus' },
      ],
      'NDR-2025-042': [
        { id: 'PS1', visitId: 'V1', visitName: 'Initial Screening', amount: 0, description: 'No payment for screening' },
        { id: 'PS2', visitId: 'V2', visitName: 'Neurological Baseline', amount: 125, description: 'Extensive baseline testing' },
        { id: 'PS3', visitId: 'V3', visitName: 'Week 2 Check', amount: 50, description: 'Quick follow-up' },
        { id: 'PS4', visitId: 'V4', visitName: 'Month 1 Assessment', amount: 100, description: 'Month 1 comprehensive' },
        { id: 'PS5', visitId: 'V5', visitName: 'Study Completion', amount: 200, description: 'Final completion payment' },
      ],
      'DPT-2025-019': [
        { id: 'PS1', visitId: 'V1', visitName: 'Screening & Consent', amount: 25, description: 'Initial consent visit' },
        { id: 'PS2', visitId: 'V2', visitName: 'Baseline Labs', amount: 75, description: 'Lab work completion' },
        { id: 'PS3', visitId: 'V3', visitName: 'Monthly Check-in', amount: 30, description: 'Monthly stipend' },
        { id: 'PS4', visitId: 'V4', visitName: '6-Month Evaluation', amount: 150, description: 'Six month completion' },
      ],
      'PNS-2026-008': [
        { id: 'PS1', visitId: 'V1', visitName: 'Enrollment Visit', amount: 50, description: 'Enrollment payment' },
        { id: 'PS2', visitId: 'V2', visitName: 'Week 2 Assessment', amount: 75, description: 'Week 2 stipend' },
        { id: 'PS3', visitId: 'V3', visitName: 'Week 4 Assessment', amount: 75, description: 'Week 4 stipend' },
        { id: 'PS4', visitId: 'V4', visitName: 'Final Assessment', amount: 100, description: 'Study completion' },
      ],
    };
    return schedulesMap[studyCode] || [];
  };

  const paymentSchedules = selectedStudy ? getPaymentSchedulesForStudy(selectedStudy) : [];

  const steps = [
    { number: 1, title: 'Request Information', icon: User },
    { number: 2, title: 'Line Items & Receipts', icon: Receipt },
    { number: 3, title: 'Review and Confirm', icon: FileCheck },
    { number: 4, title: 'Confirmation', icon: Check },
  ];

  // Auto-manage tax withholding line item
  useEffect(() => {
    // Only apply tax withholding for Payment requests with participants who have elected to withhold
    if (requestType === 'Payment' && selectedParticipant?.withholdTax === 'yes' && lineItems.length > 0) {
      // Calculate total of non-tax line items
      const nonTaxItems = lineItems.filter(item => item.type !== 'Tax Withholding');
      const subtotal = nonTaxItems.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = subtotal * 0.10; // 10% withholding

      // Check if tax line item already exists
      const existingTaxItem = lineItems.find(item => item.type === 'Tax Withholding');
      
      if (existingTaxItem) {
        // Update existing tax line item if amount changed
        if (existingTaxItem.amount !== -taxAmount) {
          setLineItems(lineItems.map(item => 
            item.type === 'Tax Withholding'
              ? { ...item, amount: -taxAmount, description: `Federal Tax Withholding (10% of $${subtotal.toFixed(2)})` }
              : item
          ));
        }
      } else {
        // Add new tax line item
        setLineItems([...lineItems, {
          id: 'TAX-WITHHOLDING',
          description: `Federal Tax Withholding (10% of $${subtotal.toFixed(2)})`,
          amount: -taxAmount,
          type: 'Tax Withholding',
          receipts: []
        }]);
      }
    } else if (selectedParticipant?.withholdTax !== 'yes') {
      // Remove tax line item if participant doesn't have tax withholding
      const hasTaxItem = lineItems.some(item => item.type === 'Tax Withholding');
      if (hasTaxItem) {
        setLineItems(lineItems.filter(item => item.type !== 'Tax Withholding'));
      }
    }
  }, [lineItems, selectedParticipant, requestType]);

  const handleNext = () => {
    // Step 1 validation
    if (currentStep === 1) {
      if (recipientType === 'Participant' && !selectedParticipant) {
        toast.error('Please select a participant');
        return;
      }
      if (recipientType === 'Caregiver') {
        if (!caregiverName) {
          toast.error('Please enter caregiver name');
          return;
        }
        if (!associatedParticipant) {
          toast.error('Please enter associated participant ID');
          return;
        }
      }
      if (recipientType === 'Third-Party/Other' && !thirdPartyName) {
        toast.error('Please enter third-party/other name');
        return;
      }
      if (!selectedStudy) {
        toast.error('Please select a study');
        return;
      }
    }
    
    // Step 2 validation
    if (currentStep === 2) {
      if (lineItems.length === 0) {
        toast.error('Please add at least one line item');
        return;
      }
      // Validate all line items have required fields
      for (const item of lineItems) {
        if (!item.description) {
          toast.error('All line items must have a description');
          return;
        }
        // Skip amount validation for tax withholding items (they are negative)
        if (item.type !== 'Tax Withholding' && item.amount <= 0) {
          toast.error('All line items must have a valid amount');
          return;
        }
        if (requestType === 'Reimbursement' && !item.type) {
          toast.error('All reimbursement items must have a type');
          return;
        }
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleParticipantSelect = (participant: any) => {
    setSelectedParticipant(participant);
    setParticipantSearch(`${participant.id} - ${participant.name}`);
    setShowParticipantDropdown(false);
    // Reset study selection if it's not available for this participant
    if (selectedStudy && !participant.studies.includes(selectedStudy)) {
      setSelectedStudy('');
    }
  };

  const addLineItem = () => {
    if (!newItemDescription) {
      toast.error('Please enter a description');
      return;
    }
    if (!newItemAmount || parseFloat(newItemAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (requestType === 'Reimbursement' && !newItemType) {
      toast.error('Please select a reimbursement type');
      return;
    }

    if (editingItemId && editingItemId !== 'new') {
      // Update existing item
      setLineItems(lineItems.map(item => 
        item.id === editingItemId
          ? { ...item, description: newItemDescription, amount: parseFloat(newItemAmount), type: requestType === 'Payment' ? 'Payment' : newItemType }
          : item
      ));
      toast.success('Line item updated');
      setEditingItemId(null);
    } else {
      // Add new item
      const newItem: LineItem = {
        id: `LI-${Date.now()}`,
        description: newItemDescription,
        amount: parseFloat(newItemAmount),
        type: requestType === 'Payment' ? 'Payment' : newItemType,
        receipts: []
      };
      setLineItems([...lineItems, newItem]);
      toast.success('Line item added');
      setEditingItemId(null);
    }

    // Clear form
    setNewItemDescription('');
    setNewItemAmount('');
    setNewItemType('');
    setSelectedPaymentSchedule('');
  };

  const editLineItem = (item: LineItem) => {
    setEditingItemId(item.id);
    setNewItemDescription(item.description);
    setNewItemAmount(item.amount.toString());
    setNewItemType(item.type);
  };

  const deleteLineItem = (id: string) => {
    // Check if trying to delete tax withholding line item
    const item = lineItems.find(i => i.id === id);
    if (item?.type === 'Tax Withholding') {
      toast.error('Cannot remove tax withholding line item');
      return;
    }
    
    if (lineItems.length === 1) {
      toast.error('Cannot remove the last line item');
      return;
    }
    setLineItems(lineItems.filter(item => item.id !== id));
    toast.success('Line item removed');
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setNewItemDescription('');
    setNewItemAmount('');
    setNewItemType('');
  };

  // Calculate estimated miles between participant address and study location
  // This is a simplified calculation - in production, you would use a real geocoding/mapping API
  const calculateEstimatedMiles = (participantAddress: string, studyLocationAddress: string): number => {
    // Mock calculation - returns a realistic estimate based on the addresses
    // In production, use Google Maps Distance Matrix API or similar
    const hash = (participantAddress + studyLocationAddress).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    return Math.abs(hash % 30) + 5; // Returns between 5-35 miles
  };

  const applyMileageCalculation = () => {
    if (!selectedParticipant || !selectedStudyLocation) {
      toast.error('Please ensure participant and study location are selected');
      return;
    }

    const participantAddress = selectedParticipant.address;
    const studyAddress = locationAddresses[selectedStudyLocation];

    if (!studyAddress) {
      toast.error('Study location address not found');
      return;
    }

    // Calculate estimated miles
    const estimatedMiles = calculateEstimatedMiles(participantAddress, studyAddress);
    setMileageDistance(estimatedMiles);

    // Calculate amount
    const calculatedAmount = estimatedMiles * mileageRate;
    setNewItemAmount(calculatedAmount.toFixed(2));

    toast.success(`Calculated ${estimatedMiles} miles × $${mileageRate}/mile = $${calculatedAmount.toFixed(2)}`);
  };

  const handleFileUpload = (itemId: string, files: FileList | null) => {
    if (!files) return;
    
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleDateString()
    }));
    
    setLineItems(lineItems.map(item => 
      item.id === itemId 
        ? { ...item, receipts: [...item.receipts, ...newFiles] }
        : item
    ));
    
    toast.success(`${newFiles.length} receipt(s) uploaded`);
  };

  const removeReceipt = (itemId: string, receiptId: string) => {
    setLineItems(lineItems.map(item =>
      item.id === itemId
        ? { ...item, receipts: item.receipts.filter(r => r.id !== receiptId) }
        : item
    ));
    toast.success('Receipt removed');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(itemId, e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = () => {
    toast.success('Payment request submitted for approval');
    setCurrentStep(4); // Move to confirmation screen
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  const toggleStepSummary = (stepNumber: number) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const getStepSummary = (stepNumber: number) => {
    if (stepNumber === 1) {
      // Step 1: Request Information Summary
      if (recipientType === 'Participant' && selectedParticipant) {
        return `${selectedParticipant.name} • ${selectedStudy} • ${requestType}`;
      } else if (recipientType === 'Caregiver' && caregiverName) {
        return `${caregiverName} (Caregiver) • ${selectedStudy} • ${requestType}`;
      } else if (recipientType === 'Third-Party/Other' && thirdPartyName) {
        return `${thirdPartyName} • ${selectedStudy} • ${requestType}`;
      }
      return 'Incomplete';
    } else if (stepNumber === 2) {
      // Step 2: Line Items & Receipts Summary
      const totalReceipts = lineItems.reduce((sum, item) => sum + item.receipts.length, 0);
      return `${lineItems.length} item(s) • $${calculateTotal().toFixed(2)} • ${totalReceipts} receipt(s)`;
    }
    return '';
  };

  const handleCancelRequest = () => {
    setShowCancelModal(false);
    if (onBack) onBack();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Payment Request</h1>
          <p className="text-gray-600 mt-1">Step {currentStep} of {currentStep === 4 ? 'Confirmation' : '3'}: {steps[currentStep - 1].title}</p>
        </div>
        {onBack && currentStep < 4 && (
          <Button variant="outline" onClick={() => setShowCancelModal(true)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <X className="h-4 w-4 mr-2" />
            Cancel Request
          </Button>
        )}
      </div>

      {/* Progress Steps - Compact Version */}
      <Card className="p-4">
        <div className="mb-3">
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
        <div className="flex items-start justify-between gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const canExpand = isCompleted && currentStep !== step.number;
            
            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center w-full">
                  {/* Step Icon and Title Row */}
                  <div className="flex items-center gap-2 w-full">
                    {canExpand && (
                      <button
                        onClick={() => toggleStepSummary(step.number)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                        title={expandedSteps[step.number] ? 'Collapse' : 'Expand'}
                      >
                        {expandedSteps[step.number] ? (
                          <ChevronUp className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    )}
                    {!canExpand && <div className="w-6" />}
                    
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                        isActive
                          ? 'bg-ku-blue text-white'
                          : isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${isActive ? 'text-ku-blue' : 'text-gray-700'}`}>
                          {step.number < 4 ? `${step.number}. ` : ''}{step.title}
                        </p>
                        {requestType === 'Payment' && selectedParticipant?.withholdTax === 'yes' && step.number <= 3 && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-semibold rounded">
                            TAX
                          </span>
                        )}
                      </div>
                      {isCompleted && expandedSteps[step.number] && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {getStepSummary(step.number)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-5 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="p-6 min-h-[500px]">
        {/* Step 1: Request Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-4">Request Information</h2>
                <p className="text-gray-600">Provide basic details about the payment request.</p>
              </div>
            </div>

            {/* Tax Withholding Alert */}
            {requestType === 'Payment' && selectedParticipant?.withholdTax === 'yes' && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-orange-900">Tax Withholding Active</h3>
                    <p className="text-sm text-orange-800 mt-1">
                      This participant has elected to withhold federal taxes. A 10% tax withholding line item will be automatically added to deduct from the total payment amount.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6 max-w-4xl">
              {/* First Row: 3 Columns - Recipient Type, Search/Name, Participant Name/Search */}
              <div className="grid grid-cols-3 gap-4">
                {/* Column 1: Recipient Type (always shown) */}
                <div className="space-y-2">
                  <Label htmlFor="recipientType">Recipient Type *</Label>
                  <Select 
                    value={recipientType} 
                    onValueChange={(v: 'Participant' | 'Caregiver' | 'Third-Party/Other') => {
                      setRecipientType(v);
                      // Reset fields when changing type
                      setSelectedParticipant(null);
                      setParticipantSearch('');
                      setCaregiverName('');
                      setAssociatedParticipant('');
                      setThirdPartyName('');
                    }}
                  >
                    <SelectTrigger id="recipientType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Participant">Participant</SelectItem>
                      <SelectItem value="Caregiver">Caregiver</SelectItem>
                      <SelectItem value="Third-Party/Other">Third-Party/Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Column 2: Changes based on recipient type */}
                {recipientType === 'Participant' && (
                  <div className="space-y-2 relative">
                    <Label htmlFor="participant">Search Participant *</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="participant"
                        value={participantSearch}
                        onChange={(e) => {
                          setParticipantSearch(e.target.value);
                          setShowParticipantDropdown(true);
                        }}
                        onFocus={() => setShowParticipantDropdown(true)}
                        placeholder="Search by ID or name..."
                        className="pl-10"
                      />
                    </div>
                    {showParticipantDropdown && filteredParticipants.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredParticipants.map(participant => (
                          <button
                            key={participant.id}
                            type="button"
                            onClick={() => handleParticipantSelect(participant)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                          >
                            <div className="font-medium">{participant.id}</div>
                            <div className="text-sm text-gray-600">{participant.name}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {recipientType === 'Caregiver' && (
                  <div className="space-y-2">
                    <Label htmlFor="caregiverName">Caregiver Name *</Label>
                    <Input
                      id="caregiverName"
                      value={caregiverName}
                      onChange={(e) => setCaregiverName(e.target.value)}
                      placeholder="Enter caregiver's name..."
                    />
                  </div>
                )}

                {recipientType === 'Third-Party/Other' && (
                  <div className="space-y-2">
                    <Label htmlFor="thirdPartyName">Third-Party/Other Name *</Label>
                    <Input
                      id="thirdPartyName"
                      value={thirdPartyName}
                      onChange={(e) => setThirdPartyName(e.target.value)}
                      placeholder="Enter name..."
                    />
                  </div>
                )}

                {/* Column 3: Changes based on recipient type */}
                {recipientType === 'Participant' && (
                  <div className="space-y-2">
                    <Label htmlFor="participantName">Participant Name</Label>
                    <Input
                      id="participantName"
                      value={selectedParticipant ? selectedParticipant.name : ''}
                      readOnly
                      disabled
                      placeholder="Select participant first..."
                      className="bg-gray-100"
                    />
                  </div>
                )}

                {recipientType === 'Caregiver' && (
                  <div className="space-y-2 relative">
                    <Label htmlFor="associatedParticipant">Associated Participant *</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="associatedParticipant"
                        value={associatedParticipant}
                        onChange={(e) => {
                          setAssociatedParticipant(e.target.value);
                          setShowParticipantDropdown(true);
                        }}
                        onFocus={() => setShowParticipantDropdown(true)}
                        placeholder="Search participant..."
                        className="pl-10"
                      />
                    </div>
                    {showParticipantDropdown && filteredParticipants.length > 0 && associatedParticipant && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {allParticipants
                          .filter(p => 
                            p.name.toLowerCase().includes(associatedParticipant.toLowerCase()) ||
                            p.id.toLowerCase().includes(associatedParticipant.toLowerCase())
                          )
                          .map(participant => (
                            <button
                              key={participant.id}
                              type="button"
                              onClick={() => {
                                setSelectedParticipant(participant);
                                setAssociatedParticipant(`${participant.id} - ${participant.name}`);
                                setShowParticipantDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                            >
                              <div className="font-medium">{participant.id}</div>
                              <div className="text-sm text-gray-600">{participant.name}</div>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {recipientType === 'Third-Party/Other' && (
                  <div className="space-y-2">
                    {/* Empty column for Third-Party/Other */}
                  </div>
                )}
              </div>

              {/* Second Row: Study */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="study">Study *</Label>
                  <Select value={selectedStudy} onValueChange={setSelectedStudy}>
                    <SelectTrigger id="study">
                      <SelectValue placeholder="Select study" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStudies.map(s => (
                        <SelectItem 
                          key={s.id} 
                          value={s.id}
                          disabled={s.status === 'Study start' || s.status === 'Study completed' || s.status === 'Canceled/withdrawn'}
                          className={s.status !== 'Active' ? 'text-gray-400' : ''}
                        >
                          {s.id} - {s.name}{s.status !== 'Active' ? ` (${s.status})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Third Row: Request Type, Requester, and Date */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestType">Request Type *</Label>
                  <Select 
                    value={requestType} 
                    onValueChange={(v: 'Payment' | 'Reimbursement') => {
                      setRequestType(v);
                      setSelectedPaymentSchedule('');
                      setLineItems([]);
                    }}
                  >
                    <SelectTrigger id="requestType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Payment">Payment (from schedule)</SelectItem>
                      <SelectItem value="Reimbursement">Reimbursement (expense)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requesterLabel">Requester</Label>
                  <Select value={requesterLabel} onValueChange={setRequesterLabel}>
                    <SelectTrigger id="requesterLabel">
                      <SelectValue placeholder="Select requester (optional)" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {requesters.map(requester => (
                        <SelectItem key={requester} value={requester}>{requester}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requestDate">Request Date</Label>
                  <Input
                    id="requestDate"
                    value={new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Fourth Row: Request Notes */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Request Notes</Label>
                  <Textarea
                    id="notes"
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    placeholder="Add any additional notes or context for this request..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Line Items & Receipts (Merged) */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Line Items & Receipts</h2>
                <p className="text-gray-600 mt-1">
                  {requestType === 'Payment' 
                    ? 'Add payment line items for scheduled visits and upload receipts as needed.' 
                    : 'Add reimbursement expenses and upload supporting receipts.'}
                </p>
              </div>
              {(requestType === 'Reimbursement' || requestType === 'Payment') && (
                <Button
                  onClick={() => {
                    if (!editingItemId) {
                      setEditingItemId('new');
                      setNewItemDescription('');
                      setNewItemAmount('');
                      setNewItemType(requestType === 'Payment' ? 'Payment' : '');
                    }
                  }}
                  className="bg-ku-blue hover:bg-ku-blue-dark"
                  disabled={editingItemId !== null}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
              )}
            </div>

            {/* Tax Withholding Alert */}
            {requestType === 'Payment' && selectedParticipant?.withholdTax === 'yes' && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-orange-900">Tax Withholding Active</h3>
                    <p className="text-sm text-orange-800 mt-1">
                      A 10% federal tax withholding line item will be automatically added at the end of your line items to deduct from the total payment amount.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Add/Edit Line Item Form - Inline at top */}
            {editingItemId && (
              <div className="bg-blue-50 border border-ku-blue rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">
                    {editingItemId === 'new' ? 'Add New Line Item' : 'Edit Line Item'}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={cancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  {requestType === 'Reimbursement' && (
                    <div className="col-span-3">
                      <Label>Type *</Label>
                      <Select value={newItemType} onValueChange={(value) => {
                        setNewItemType(value);
                        // Show mileage calculator when Drive/Mileage is selected
                        if (value === 'Drive/Mileage') {
                          setShowMileageCalc(true);
                        } else {
                          setShowMileageCalc(false);
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {reimbursementTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {requestType === 'Payment' && (
                    <div className="col-span-3">
                      <Label>Visit *</Label>
                      <Select value={selectedPaymentSchedule} onValueChange={(scheduleId) => {
                        setSelectedPaymentSchedule(scheduleId);
                        const schedule = paymentSchedules.find(s => s.id === scheduleId);
                        if (schedule) {
                          setNewItemDescription(schedule.description);
                          setNewItemAmount(schedule.amount.toString());
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visit" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentSchedules.map(schedule => (
                            <SelectItem key={schedule.id} value={schedule.id}>
                              {schedule.visitName} - ${schedule.amount}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="col-span-5">
                    <Label>Description *</Label>
                    <Input
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                      placeholder="Enter description..."
                      readOnly={requestType === 'Payment'}
                      className={requestType === 'Payment' ? 'bg-gray-50' : ''}
                    />
                  </div>
                  <div className="col-span-3">
                    <Label>Amount *</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        step="0.01"
                        value={newItemAmount}
                        onChange={(e) => setNewItemAmount(e.target.value)}
                        placeholder="0.00"
                        className={newItemType === 'Drive/Mileage' || requestType === 'Payment' ? 'bg-gray-50' : ''}
                        readOnly={newItemType === 'Drive/Mileage' || requestType === 'Payment'}
                      />
                      {newItemType === 'Drive/Mileage' && (
                        <button
                          type="button"
                          onClick={() => setShowMileageCalc(!showMileageCalc)}
                          className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                        >
                          {showMileageCalc ? 'Hide' : 'Calc'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button 
                      type="button"
                      onClick={addLineItem} 
                      className="bg-ku-blue hover:bg-ku-blue-dark w-full"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Mileage Calculator - Show when Drive/Mileage is selected */}
                {showMileageCalc && newItemType === 'Drive/Mileage' && (
                  <div className="mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Mileage Calculator</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="studyLocation">Study Location *</Label>
                        <Select value={selectedStudyLocation} onValueChange={setSelectedStudyLocation}>
                          <SelectTrigger id="studyLocation">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedStudy && allStudies.find(s => s.id === selectedStudy)?.locations.map(location => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedStudyLocation && locationAddresses[selectedStudyLocation] && (
                          <p className="text-xs text-gray-500 mt-1">{locationAddresses[selectedStudyLocation]}</p>
                        )}
                      </div>
                      <div>
                        <Label>Participant Address</Label>
                        <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900">
                          {selectedParticipant?.address || 'No participant selected'}
                        </div>
                      </div>
                      <div>
                        <Label>Estimated Miles</Label>
                        <Input
                          type="number"
                          step="1"
                          value={mileageDistance}
                          onChange={(e) => {
                            const miles = parseFloat(e.target.value) || 0;
                            setMileageDistance(miles);
                            const amount = miles * mileageRate;
                            setNewItemAmount(amount.toFixed(2));
                          }}
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Manual entry or auto-calculate</p>
                      </div>
                      <div>
                        <Label>Mileage Rate</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={mileageRate}
                            onChange={(e) => {
                              const rate = parseFloat(e.target.value) || 0.67;
                              setMileageRate(rate);
                              const amount = mileageDistance * rate;
                              setNewItemAmount(amount.toFixed(2));
                            }}
                            className="pl-7"
                            placeholder="0.67"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">IRS standard rate (2024)</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        type="button"
                        onClick={applyMileageCalculation}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Auto-Calculate Distance
                      </Button>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Calculated Amount</p>
                        <p className="text-xl font-bold text-ku-blue">${(mileageDistance * mileageRate).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{mileageDistance} miles × ${mileageRate}/mile</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Note:</strong> Click "Auto-Calculate Distance" to estimate miles between participant address and study location, or manually enter the miles driven.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Line Items Table with Inline Receipts */}
            {lineItems.length > 0 ? (
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-200 border-b-2 border-gray-400">
                    <tr>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 w-32">Request Type</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 w-28">Type</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                      <th className="px-3 py-3 text-right text-sm font-medium text-gray-700 w-28">Amount</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 w-48">Notes</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 w-64">Receipts</th>
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lineItems.map((item) => {
                      const isTaxItem = item.type === 'Tax Withholding';
                      return (
                      <tr key={item.id} className={isTaxItem ? "bg-orange-50 hover:bg-orange-100" : "hover:bg-gray-50"}>
                        <td className="px-3 py-3 text-sm text-gray-900">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isTaxItem ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {isTaxItem ? 'Tax' : requestType}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-900">
                          {item.type && (
                            <span className={`px-2 py-1 text-xs rounded ${
                              isTaxItem ? 'bg-orange-200 text-orange-900 font-semibold' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {item.type}
                            </span>
                          )}
                          {!item.type && <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-900">
                          {isTaxItem && <Clock className="h-4 w-4 inline mr-1 text-orange-600" />}
                          {item.description}
                        </td>
                        <td className={`px-3 py-3 text-sm text-right font-medium ${
                          isTaxItem ? 'text-orange-900 font-bold' : 'text-gray-900'
                        }`}>
                          {isTaxItem && item.amount > 0 ? '-' : ''}${Math.abs(item.amount).toFixed(2)}
                        </td>
                        <td className="px-3 py-3">
                          {isTaxItem ? (
                            <span className="text-xs text-gray-400 italic">Auto-calculated</span>
                          ) : (
                            <Input
                              type="text"
                              value={item.notes || ''}
                              onChange={(e) => {
                                setLineItems(lineItems.map(li => 
                                  li.id === item.id ? { ...li, notes: e.target.value } : li
                                ));
                              }}
                              placeholder="Add notes..."
                              className="text-xs"
                            />
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {isTaxItem ? (
                            <span className="text-xs text-gray-400 italic">No receipt needed</span>
                          ) : (
                            <ReceiptDropZone
                              files={item.receipts}
                              onFilesChange={(newFiles) => {
                                setLineItems(lineItems.map(li => 
                                  li.id === item.id ? { ...li, receipts: newFiles } : li
                                ));
                              }}
                              itemId={item.id}
                            />
                          )}
                        </td>
                        {!isTaxItem && (
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-center gap-1">
                              {requestType === 'Reimbursement' && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editLineItem(item)}
                                >
                                  Edit
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteLineItem(item.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                        {isTaxItem && requestType === 'Reimbursement' && (
                          <td className="px-3 py-3"></td>
                        )}
                      </tr>
                      );
                    })}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-3 py-3 text-sm text-gray-900" colSpan={4}>
                        Total Amount
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900 text-right">
                        ${calculateTotal().toFixed(2)}
                      </td>
                      <td className="px-3 py-3"></td>
                      <td className="px-3 py-3"></td>
                      {requestType === 'Reimbursement' && <td></td>}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No line items added yet</p>
                <p className="text-sm mt-1">
                  Click "Add Line Item" to get started
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review and Confirm */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Review and Confirm</h2>
              <p className="text-gray-600 mt-1">Review all details before submitting for approval.</p>
            </div>

            {/* Tax Withholding Alert */}
            {requestType === 'Payment' && selectedParticipant?.withholdTax === 'yes' && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-orange-900">Tax Withholding Applied</h3>
                    <p className="text-sm text-orange-800 mt-1">
                      A 10% federal tax withholding has been deducted from the total payment amount as per participant's tax election.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Request Summary */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Request Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Recipient Type</p>
                  <p className="font-medium">{recipientType}</p>
                </div>
                {selectedParticipant && (
                  <>
                    <div>
                      <p className="text-gray-600">Participant ID</p>
                      <p className="font-medium">{selectedParticipant.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Participant Name</p>
                      <p className="font-medium">{selectedParticipant.name}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-gray-600">Study</p>
                  <p className="font-medium">{selectedStudy}</p>
                </div>
                <div>
                  <p className="text-gray-600">Request Type</p>
                  <p className="font-medium">{requestType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Requester</p>
                  <p className="font-medium">{requesterLabel || <span className="text-gray-400">Not specified</span>}</p>
                </div>
                <div>
                  <p className="text-gray-600">Request Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</p>
                </div>
                {requestNotes && (
                  <div className="col-span-2">
                    <p className="text-gray-600">Notes</p>
                    <p className="font-medium">{requestNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Summary */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                <h3 className="font-semibold">Line Items ({lineItems.length})</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-200 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                    {requestType === 'Reimbursement' && (
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    )}
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Notes</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Receipts</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                      {requestType === 'Reimbursement' && (
                        <td className="px-4 py-3 text-sm text-gray-600">{item.type}</td>
                      )}
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.notes || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {item.receipts.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            <FileText className="h-3 w-3" />
                            {item.receipts.length}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-4 py-3 text-sm text-gray-900" colSpan={requestType === 'Reimbursement' ? 4 : 3}>
                      Total Amount
                    </td>
                    <td className="px-4 py-3 text-sm text-ku-blue text-right text-lg">
                      ${calculateTotal().toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6 text-center py-8">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Successfully Submitted!</h2>
              <p className="text-gray-600">Your payment request has been submitted for approval.</p>
            </div>

            {/* Request Details Card */}
            <div className="bg-white border-2 border-green-200 rounded-lg p-6 max-w-2xl mx-auto text-left">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Request ID</p>
                  <p className="font-semibold text-lg">REQ-{Math.floor(Math.random() * 9000) + 1000}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted Date</p>
                  <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-2">Approval Workflow</h3>
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ku-blue text-white flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Study Coordinator Review</p>
                      <p className="text-xs text-gray-600">Dr. Sarah Chen • Expected: 1-2 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Finance Department Approval</p>
                      <p className="text-xs text-gray-600">Pending coordinator review</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment Processing</p>
                      <p className="text-xs text-gray-600">Pending finance approval</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                onClick={() => {
                  if (onBack) onBack();
                }}
                className="bg-ku-blue hover:bg-ku-blue-dark"
              >
                Return to Payments
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < 3 ? (
          <Button
            onClick={handleNext}
            className="bg-ku-blue hover:bg-ku-blue-dark"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Submit for Approval
          </Button>
        )}
      </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Payment Request?</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to cancel this payment request? All entered information will be lost and cannot be recovered.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
              >
                Continue Editing
              </Button>
              <Button
                onClick={handleCancelRequest}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Cancel Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}