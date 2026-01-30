import { X, Download, Trash2, Upload, Search, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface PaymentsPanelProps {
  isViewMode: boolean;
  isEditMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
  viewingPayment?: any;
  editingPayment?: any;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  notes: string;
}

export function PaymentsPanel({ 
  isViewMode, 
  isEditMode, 
  activeTab, 
  setActiveTab, 
  onClose,
  viewingPayment,
  editingPayment
}: PaymentsPanelProps) {
  const currentPayment = isViewMode ? viewingPayment : editingPayment;
  
  const [recipientType, setRecipientType] = useState(currentPayment?.recipientType || 'Participant');
  const [participantName, setParticipantName] = useState(currentPayment?.participantName || '');
  const [requestType, setRequestType] = useState(currentPayment?.requestType || 'Payment');
  const [selectedStudy, setSelectedStudy] = useState(currentPayment?.study || '');
  const [selectedPaymentSchedule, setSelectedPaymentSchedule] = useState('');
  const [paymentType, setPaymentType] = useState(currentPayment?.type || '');
  const [baseAmount, setBaseAmount] = useState(currentPayment?.amount || 0);
  const [mileage, setMileage] = useState(0);
  const [mileageRate, setMileageRate] = useState(0.67); // IRS standard mileage rate for 2024
  const [taxRate, setTaxRate] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showMileageCalc, setShowMileageCalc] = useState(false);
  const [showTaxCalc, setShowTaxCalc] = useState(false);
  
  // Participant search autocomplete state
  const [participantSearch, setParticipantSearch] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);
  
  // Requester state
  const [requester, setRequester] = useState(currentPayment?.requester || '');
  
  // List of requesters
  const requesters = [
    "Amber Unrein", "Cristal Monge", "Emily Kelly", "Michelle Truesdale", "Jenae Moore",
    "Ankita Tiwari", "Emma Kelly", "Morgan Brucks", "Grace Heenan", "Cary Felzien",
    "Tamara Rounds", "Keri Cox", "Julianna McKee", "Macaria Velasquez", "Nasim Nosratinia",
    "Anna Rice", "Annie Henderson", "Jade Robichaud", "Anna Brashear", "April Langhammer",
    "Sarah Irvin", "Leo Leonard", "Raechel Camones", "Anne Nugent", "Theresa Howard",
    "Hannah Melton", "Amanda Thimmesch", "Nicole Mathis", "Annette Becker", "Lety Sarmiento",
    "Olivia Price", "Krystal Pittman", "Jill Torneden", "Ali Russo", "Shannon Fletcher",
    "Chelsey Aulukh", "Megan Gangwish", "Elizabeth Dillon", "Vianca Williams", "Alyssa Bowker",
    "Asuka Suzuki", "Rachel Nikolov", "Esha Garg", "Terry Christenson", "Nicholas Levine",
    "Jillian Case", "Hafsah Diakhate", "Jodi Claybaugh", "Sravya Kaparthi", "Tanner Wilson",
    "Katie Chavez", "Sara Baker", "Lauryn Gorby", "Bethany Forseth", "Marion Leaman",
    "Rachael Rawlings", "Megan Murray", "Jessie Lamphier", "Daniel Rivera", "Rahul Chanolian",
    "Kelsey Strube", "Abigayle Joyce", "Grace Bolamperti", "Madelyn Arnautov", "Becca Johnson",
    "Luigi Boccardi", "Sarina Fay", "Crystal Billings", "Vanessa Verschelden", "Kelsi Palacios",
    "Nancy Ziegler", "Kristin Fravel", "Daijah Jones", "Yolanda Murr", "Betsy Sweiger",
    "John Mclean", "Jordan Elliott", "Emilia Potts", "Bailey Foster", "Kate Canova",
    "Reagan Smith", "Ashley Barry", "Wamda Ahmed", "Rachel Heueisen", "Linda d'Silva",
    "Rachel Ruiz", "Ronal Castro", "Robin Davis", "Andrea Klempnauer", "Victoria Dorman",
    "Emily Work", "Rachel Holden", "Dan Le", "Julie-Ann Dutton", "Lucas Lemar",
    "Nashwa Mohammad", "Mya Milius", "Laura Crabtree", "Makaila Pelter", "Caitlin Payne",
    "Stephanie Stauffer", "Bria Bartsch", "Max Hardenbrook", "Grace Millington", "Jacqueline Smart",
    "Jeffery Honas", "Mary Butler", "Rafaela Nelson", "Francisca Javiera Allendes", "Mia Smith",
    "Jonath0n Barnette", "Joseph Kelly", "Whitney Theis", "Cameron Zoraghchi", "KUMCRI_batch KUMCRI_batch"
  ];
  
  // Mock participant data with associated studies
  const allParticipants = [
    { id: 'P-2026-001', name: 'John Smith', studies: ['CHS-2026-001', 'PNS-2026-008'] },
    { id: 'P-2025-156', name: 'Sarah Johnson', studies: ['NDR-2025-042', 'DPT-2025-019'] },
    { id: 'P-2026-045', name: 'Michael Brown', studies: ['DPT-2025-019'] },
    { id: 'P-2026-089', name: 'Emily Davis', studies: ['PNS-2026-008', 'CHS-2026-001'] },
    { id: 'P-2025-178', name: 'Linda Martinez', studies: ['DPT-2025-019'] },
    { id: 'P-2026-012', name: 'Jennifer Taylor', studies: ['CHS-2026-001'] },
    { id: 'P-2025-234', name: 'Robert Wilson', studies: ['NDR-2025-042'] },
    { id: 'P-2026-078', name: 'Patricia Moore', studies: ['CHS-2026-001', 'PNS-2026-008'] },
  ];
  
  // All available studies
  const allStudies = [
    { id: 'CHS-2026-001', name: 'Cardiovascular Health Study' },
    { id: 'NDR-2025-042', name: 'Neurological Disorders Research' },
    { id: 'DPT-2025-019', name: 'Diabetes Prevention Trial' },
    { id: 'PNS-2026-008', name: 'Pediatric Nutrition Study' },
  ];
  
  // Filter participants based on search
  const filteredParticipants = allParticipants.filter(participant =>
    participant.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
    participant.id.toLowerCase().includes(participantSearch.toLowerCase())
  );
  
  // Filter studies based on selected participant
  const availableStudies = selectedParticipant 
    ? allStudies.filter(study => selectedParticipant.studies.includes(study.id))
    : allStudies;
  const [editingAmount, setEditingAmount] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(currentPayment?.description || '');
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [editingFileNotes, setEditingFileNotes] = useState<string | null>(null);
  
  // Reimbursement line items state
  const [reimbursementLineItems, setReimbursementLineItems] = useState([
    { id: '1', description: description, amount: baseAmount, type: paymentType }
  ]);
  const [showAddReimbursement, setShowAddReimbursement] = useState(false);
  const [newReimbursementDesc, setNewReimbursementDesc] = useState('');
  const [newReimbursementAmount, setNewReimbursementAmount] = useState(0);
  const [newReimbursementType, setNewReimbursementType] = useState('');

  // Calculate mileage amount
  const mileageAmount = mileage * mileageRate;

  // Update calculations when values change
  useEffect(() => {
    const calculatedBaseAmount = paymentType === 'Travel' && mileage > 0 ? mileageAmount : baseAmount;
    const calculatedTaxAmount = calculatedBaseAmount * (taxRate / 100);
    const calculatedTotal = calculatedBaseAmount + calculatedTaxAmount;
    
    setTaxAmount(calculatedTaxAmount);
    setTotalAmount(calculatedTotal);
  }, [baseAmount, mileage, mileageRate, taxRate, paymentType, mileageAmount]);

  // Mock payment schedules data for studies
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

  // File upload handlers
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleDateString(),
      notes: ''
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} file(s) uploaded successfully`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success('File removed');
  };

  const updateFileNotes = (fileId: string, notes: string) => {
    setUploadedFiles(prev => prev.map(f => f.id === fileId ? { ...f, notes } : f));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Reimbursement line item handlers
  const addReimbursementLineItem = () => {
    if (!newReimbursementDesc || newReimbursementAmount <= 0) {
      toast.error('Please enter description and amount');
      return;
    }
    
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: newReimbursementDesc,
      amount: newReimbursementAmount,
      type: newReimbursementType
    };
    
    setReimbursementLineItems(prev => [...prev, newItem]);
    setNewReimbursementDesc('');
    setNewReimbursementAmount(0);
    setNewReimbursementType('');
    setShowAddReimbursement(false);
    toast.success('Reimbursement line item added');
  };

  const removeReimbursementLineItem = (itemId: string) => {
    if (reimbursementLineItems.length === 1) {
      toast.error('Cannot remove the last reimbursement item');
      return;
    }
    setReimbursementLineItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Reimbursement line item removed');
  };

  const updateReimbursementLineItem = (itemId: string, field: string, value: any) => {
    setReimbursementLineItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  // Calculate total from all reimbursement line items
  const calculateReimbursementTotal = () => {
    return reimbursementLineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full lg:w-3/4 xl:w-2/3 bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl">{isViewMode ? 'View Payment' : isEditMode ? 'Edit Payment' : 'New Payment Request'}</h2>
              <p className="text-sm text-gray-500">
                {isViewMode ? 'View payment request details' : isEditMode ? 'Update payment information' : 'Submit a new payment or reimbursement request'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          {/* Tabs Navigation */}
          <div className="px-6">
            <div className="flex gap-1 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('verification')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'verification'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Verification & Documents
              </button>
              {(isViewMode || isEditMode) && (
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'history'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Audit History
                </button>
              )}
            </div>
          </div>
        </div>

        <form className="p-6 space-y-6">
          {/* Details Tab Content */}
          {activeTab === 'details' && (
            <>
              {/* FOR EXISTING PAYMENTS (View/Edit Mode) */}
              {(isViewMode || isEditMode) && currentPayment && (
                <>
                  {/* Collapsible Request Summary */}
                  <div className="bg-gray-50 border border-gray-300 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSummaryExpanded(!summaryExpanded)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-sm text-gray-600">Request Summary</p>
                        <p className="font-medium text-gray-900">
                          {requestType === 'Reimbursement' ? `${paymentType} Reimbursement` : 'Payment'} • {currentPayment.participantName} • {currentPayment.study}
                        </p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${summaryExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {summaryExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Participant</label>
                            <p className="text-gray-900 font-medium">{currentPayment.participantName}</p>
                            <p className="text-sm text-gray-500">{currentPayment.participantId}</p>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Study</label>
                            <p className="text-gray-900 font-medium">{currentPayment.study}</p>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Recipient Type</label>
                            <p className="text-gray-900">{recipientType}</p>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Request Type</label>
                            <p className="text-gray-900">{requestType}</p>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Status</label>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                              currentPayment.status === 'New' ? 'bg-orange-100 text-orange-800' :
                              currentPayment.status === 'Pending Approval' ? 'bg-orange-100 text-orange-800' :
                              currentPayment.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                              currentPayment.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              currentPayment.status === 'Payment Complete' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {currentPayment.status}
                            </span>
                          </div>
                          {requestType === 'Reimbursement' && paymentType && (
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Reimbursement Type</label>
                              <p className="text-gray-900">{paymentType}</p>
                            </div>
                          )}
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Date</label>
                            <p className="text-gray-900">{currentPayment.date}</p>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Requester</label>
                            <p className="text-gray-900">{currentPayment.requester}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Details - Table Format */}
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg">Payment Details</h3>
                      {isEditMode && requestType === 'Reimbursement' && (
                        <button
                          type="button"
                          onClick={() => setShowAddReimbursement(!showAddReimbursement)}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          {showAddReimbursement ? 'Cancel' : '+ Add Reimbursement'}
                        </button>
                      )}
                    </div>

                    {/* Reimbursement Line Items Table */}
                    {requestType === 'Reimbursement' && isEditMode ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-200 border-b-2 border-gray-400">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                              {reimbursementLineItems.length > 1 && (
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {reimbursementLineItems.map((item) => (
                              <tr key={item.id} className="bg-white hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => updateReimbursementLineItem(item.id, 'description', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Description..."
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <select
                                    value={item.type}
                                    onChange={(e) => updateReimbursementLineItem(item.id, 'type', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    <option value="">Select Type</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Parking">Parking</option>
                                    <option value="Meal">Meal</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">$</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={item.amount}
                                      onChange={(e) => updateReimbursementLineItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      placeholder="0.00"
                                    />
                                    {item.type === 'Travel' && (
                                      <button
                                        type="button"
                                        onClick={() => setShowMileageCalc(!showMileageCalc)}
                                        className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                                      >
                                        {showMileageCalc ? 'Hide' : 'Calc'}
                                      </button>
                                    )}
                                  </div>
                                </td>
                                {reimbursementLineItems.length > 1 && (
                                  <td className="px-4 py-3">
                                    <button
                                      onClick={() => removeReimbursementLineItem(item.id)}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                      title="Remove reimbursement"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                            {/* Total Row */}
                            <tr className="bg-gray-100 font-medium">
                              <td className="px-4 py-3 text-right" colSpan={2}>
                                <span className="text-sm text-gray-700">Subtotal:</span>
                              </td>
                              <td className="px-4 py-3 text-left" colSpan={reimbursementLineItems.length > 1 ? 2 : 1}>
                                <span className="text-sm text-gray-900">${calculateReimbursementTotal().toFixed(2)}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : isViewMode ? (
                      /* View Mode - Table Layout */
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-200 border-b-2 border-gray-400">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr className="bg-white">
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {description || currentPayment?.description || 'No description provided'}
                              </td>
                              <td className="px-4 py-3">
                                {currentPayment?.type ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {currentPayment.type}
                                  </span>
                                ) : (
                                  <span className="text-gray-500 text-sm">N/A</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                ${currentPayment?.amount?.toFixed(2) || '0.00'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null}

                    {/* Add New Reimbursement Line Item Form - Edit Mode Only */}
                    {showAddReimbursement && isEditMode && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Reimbursement Line Item</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Description</label>
                            <input
                              type="text"
                              value={newReimbursementDesc}
                              onChange={(e) => setNewReimbursementDesc(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter description..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Type</label>
                            <select
                              value={newReimbursementType}
                              onChange={(e) => setNewReimbursementType(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Type</option>
                              <option value="Travel">Travel</option>
                              <option value="Parking">Parking</option>
                              <option value="Meal">Meal</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Amount</label>
                            <input
                              type="number"
                              step="0.01"
                              value={newReimbursementAmount}
                              onChange={(e) => setNewReimbursementAmount(parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={addReimbursementLineItem}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Add Item
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddReimbursement(false)}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Receipt Attachment Section */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm text-gray-600 mb-2">Receipts ({uploadedFiles.length})</label>
                        {!isViewMode ? (
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                            <p className="text-sm text-gray-600 mb-1">
                              Drag and drop files here, or{' '}
                              <label className="text-blue-600 hover:underline cursor-pointer">
                                browse
                                <input
                                  type="file"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e.target.files)}
                                />
                              </label>
                            </p>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB each</p>
                          </div>
                        ) : uploadedFiles.length === 0 ? (
                          <p className="text-gray-500 text-sm">No receipts attached</p>
                        ) : null}
                        
                        {/* Uploaded Files List */}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {uploadedFiles.map((file) => (
                              <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-2">
                                <div className="flex items-start gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {file.uploadDate}</p>
                                    {editingFileNotes === file.id ? (
                                      <input
                                        type="text"
                                        value={file.notes}
                                        onChange={(e) => updateFileNotes(file.id, e.target.value)}
                                        onBlur={() => setEditingFileNotes(null)}
                                        placeholder="Add notes..."
                                        className="mt-1 w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        autoFocus
                                      />
                                    ) : (
                                      <p 
                                        onClick={() => !isViewMode && setEditingFileNotes(file.id)}
                                        className={`text-xs mt-1 ${file.notes ? 'text-gray-600' : 'text-gray-400 italic'} ${!isViewMode && 'cursor-pointer hover:text-gray-800'}`}
                                      >
                                        {file.notes || 'Click to add notes...'}
                                      </p>
                                    )}
                                  </div>
                                  {!isViewMode && (
                                    <button
                                      onClick={() => removeFile(file.id)}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      title="Remove file"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Tax Calculation Line Item */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <label className="block text-sm text-gray-600 mb-1">Tax Calculation</label>
                          <p className="text-gray-900">
                            {taxRate > 0 ? (
                              <span>{taxRate}% = ${taxAmount.toFixed(2)}</span>
                            ) : (
                              <span className="text-gray-500">No tax applied</span>
                            )}
                          </p>
                        </div>
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => setShowTaxCalc(!showTaxCalc)}
                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-gray-100 rounded-lg"
                          >
                            {showTaxCalc ? 'Hide' : 'Show'} Tax Calculator
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mileage Calculator Panel - Show when editing mileage */}
                  {showMileageCalc && !isViewMode && (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <h3 className="text-lg mb-4">Mileage Calculator</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Miles Driven
                          </label>
                          <input 
                            type="number" 
                            step="1" 
                            placeholder="0" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={mileage}
                            onChange={(e) => setMileage(parseFloat(e.target.value) || 0)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter total miles driven</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Rate per Mile
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.67" 
                              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={mileageRate}
                              onChange={(e) => setMileageRate(parseFloat(e.target.value) || 0.67)}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">IRS standard rate (2024)</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Calculated Amount
                          </label>
                          <div className="w-full px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg text-blue-900 font-medium text-lg">
                            ${mileageAmount.toFixed(2)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{mileage} miles × ${mileageRate}/mile</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Note:</strong> The calculated amount (${mileageAmount.toFixed(2)}) will automatically update the payment amount above.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tax Calculation Panel - Show when editing tax */}
                  {showTaxCalc && !isViewMode && (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <h3 className="text-lg mb-4">Tax Calculation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Base Amount
                          </label>
                          <div className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 font-medium">
                            ${paymentType === 'Travel' && mileage > 0 ? mileageAmount.toFixed(2) : baseAmount.toFixed(2)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {paymentType === 'Travel' && mileage > 0 ? 'From mileage calculation' : 'From amount field'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Tax Rate (%)
                          </label>
                          <input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={taxRate}
                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter 0 if not taxable</p>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Tax Amount
                          </label>
                          <div className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 font-medium">
                            ${taxAmount.toFixed(2)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{taxRate}% of base amount</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total Amount Section */}
                  <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl mb-2">Total Amount</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Base Amount: ${paymentType === 'Travel' && mileage > 0 ? mileageAmount.toFixed(2) : baseAmount.toFixed(2)}</p>
                          <p>Tax Amount: ${taxAmount.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl text-gray-900 font-bold">${totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600 mt-1">Total Payment</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button 
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {isViewMode ? 'Close' : 'Cancel'}
                    </button>
                    {!isViewMode && (
                      <button 
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          onClose();
                          toast.success('Payment updated successfully!');
                        }}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Update Payment
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* FOR NEW PAYMENTS - Show Full Form */}
              {!isViewMode && !isEditMode && (
                <>
                  {/* SECTION 1: Participant Information - Compact Data Collection */}
                  <div className="bg-white border-l-4 border-blue-600 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">1</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Participant Information</h3>
                        <p className="text-sm text-gray-500">Select recipient and associated study</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Requester Field */}
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Requester <span className="text-red-500">*</span>
                        </label>
                        <select 
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={requester}
                          onChange={(e) => setRequester(e.target.value)}
                        >
                          <option value="">Select Requester...</option>
                          {requesters.map((name) => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Person submitting this payment request</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Recipient Type <span className="text-red-500">*</span>
                        </label>
                        <select 
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={recipientType}
                          onChange={(e) => {
                            setRecipientType(e.target.value);
                            if (e.target.value === 'Third-Party/Other') {
                              setParticipantName('');
                              setSelectedStudy('');
                            }
                          }}
                        >
                          <option value="Participant">Participant</option>
                          <option value="Caregiver">Caregiver</option>
                          <option value="Third-Party/Other">Third-Party/Other</option>
                        </select>
                      </div>
                      
                      {recipientType === 'Participant' ? (
                        <>
                          <div className="md:col-span-2 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Participant <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                type="text"
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search by name or ID..."
                                value={participantSearch}
                                onChange={(e) => {
                                  setParticipantSearch(e.target.value);
                                  setShowParticipantDropdown(true);
                                }}
                                onFocus={() => setShowParticipantDropdown(true)}
                              />
                            </div>
                            {showParticipantDropdown && filteredParticipants.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {filteredParticipants.map(participant => (
                                  <button
                                    key={participant.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedParticipant(participant);
                                      setParticipantSearch(`${participant.name} (${participant.id})`);
                                      setShowParticipantDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-200 last:border-b-0"
                                  >
                                    <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                                    <p className="text-xs text-gray-500">{participant.id}</p>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Study or Program <span className="text-red-500">*</span>
                            </label>
                            <select 
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={selectedStudy}
                              onChange={(e) => setSelectedStudy(e.target.value)}
                              disabled={!selectedParticipant}
                            >
                              <option value="">Select Study or Program</option>
                              {availableStudies.map(study => (
                                <option key={study.id} value={study.id}>
                                  {study.id} - {study.name}
                                </option>
                              ))}
                            </select>
                            {selectedParticipant && availableStudies.length === 0 && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <span>⚠️</span> No studies found for this participant
                              </p>
                            )}
                          </div>
                        </>
                      ) : recipientType === 'Caregiver' ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Caregiver Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter caregiver name"
                              value={participantName}
                              onChange={(e) => setParticipantName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Associated Participant <span className="text-red-500">*</span>
                            </label>
                            <select 
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              defaultValue=""
                            >
                              <option value="">Select Participant</option>
                              <option value="P-2026-001">John Smith (P-2026-001)</option>
                              <option value="P-2025-156">Sarah Johnson (P-2025-156)</option>
                              <option value="P-2026-045">Michael Brown (P-2026-045)</option>
                              <option value="P-2026-089">Emily Davis (P-2026-089)</option>
                            </select>
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Study or Program <span className="text-red-500">*</span>
                            </label>
                            <select 
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={selectedStudy}
                              onChange={(e) => setSelectedStudy(e.target.value)}
                            >
                              <option value="">Select Study or Program</option>
                              <option value="CHS-2026-001">CHS-2026-001 - Cardiovascular Health Study</option>
                              <option value="NDR-2025-042">NDR-2025-042 - Neurological Disorders Research</option>
                              <option value="DPT-2025-019">DPT-2025-019 - Diabetes Prevention Trial</option>
                              <option value="PNS-2026-008">PNS-2026-008 - Pediatric Nutrition Study</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Recipient Name <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter recipient name"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                          />
                        </div>
                      )}
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2">
                          Request Type <span className="text-red-500">*</span>
                        </label>
                        <select 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={requestType}
                          onChange={(e) => {
                            setRequestType(e.target.value);
                            if (e.target.value === 'Payment') {
                              setPaymentType('');
                              setSelectedPaymentSchedule('');
                            }
                          }}
                        >
                          <option value="Payment">Payment</option>
                          <option value="Reimbursement">Reimbursement</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          {requestType === 'Payment' ? 'Standard participant payment (stipend, compensation, etc.)' : 'Reimbursement for expenses (travel, parking, meals, etc.)'}
                        </p>
                      </div>
                      {requestType === 'Payment' && recipientType === 'Participant' && (
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 mb-2">
                            Payment Schedule <span className="text-red-500">*</span>
                          </label>
                          <select 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedPaymentSchedule}
                            onChange={(e) => {
                              setSelectedPaymentSchedule(e.target.value);
                              const selected = paymentSchedules.find(ps => ps.id === e.target.value);
                              if (selected) {
                                setBaseAmount(selected.amount);
                                setDescription(selected.description);
                              }
                            }}
                            disabled={!selectedStudy}
                          >
                            <option value="">Select Payment Schedule...</option>
                            {paymentSchedules.map((schedule) => (
                              <option key={schedule.id} value={schedule.id}>
                                {schedule.visitName} - ${schedule.amount.toFixed(2)}
                              </option>
                            ))}
                          </select>
                          {!selectedStudy && (
                            <p className="text-xs text-orange-600 mt-1">⚠️ Please select a study first</p>
                          )}
                          {selectedStudy && paymentSchedules.length === 0 && (
                            <p className="text-xs text-red-600 mt-1">⚠️ No payment schedules found for this study</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2 & 3 would continue here... */}
                  {/* Placeholder for submission button */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button 
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!requester) {
                          toast.error('Please select a requester');
                          return;
                        }
                        onClose();
                        toast.success('Payment request created successfully!');
                      }}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create Payment Request
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Verification Tab Content */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ℹ️ Verification and documentation features will be available here.
                </p>
              </div>
            </div>
          )}

          {/* Audit History Tab Content */}
          {activeTab === 'history' && (isViewMode || isEditMode) && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  📋 Audit trail and history will be displayed here.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
