import { useState } from 'react';
import { Search, Plus, Edit, Archive, Eye, Filter, FlaskConical, ChevronDown, ChevronUp, X, Upload, FileSpreadsheet, Users, Calendar, DollarSign, GripVertical, Trash2, Lock } from 'lucide-react';
import { EnrollmentPanel } from './EnrollmentPanel';
import { ConfirmDialog } from './ConfirmDialog';
import { PaymentSchedulePanel } from './PaymentSchedulePanel';
import { toast } from 'sonner';

export function Studies() {
  // Mock user role - in production, this would come from auth context
  const userRole = 'Study Coordinator'; // Options: 'System', 'Global Admin', 'Study Coordinator', 'PI', etc.

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPI, setFilterPI] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKPIs, setShowKPIs] = useState(false);
  const [showSetupPanel, setShowSetupPanel] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [editingStudy, setEditingStudy] = useState<any>(null);
  const [deletingStudy, setDeletingStudy] = useState<any>(null);
  const [viewingStudy, setViewingStudy] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [managingEnrollment, setManagingEnrollment] = useState<any>(null);
  const [selectedParticipants] = useState<string[]>([]);
  const [detailsParticipantSearch, setDetailsParticipantSearch] = useState('');
  const [showPaymentSchedulePanel, setShowPaymentSchedulePanel] = useState(false);
  const [studyParticipantIds, setStudyParticipantIds] = useState<{ [key: string]: string }>({});
  const [enrolledParticipants, setEnrolledParticipants] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [studyLocations, setStudyLocations] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [visitOrder, setVisitOrder] = useState<any[]>([]);
  const [hasVisitChanges, setHasVisitChanges] = useState(false);
  const [visitSearch, setVisitSearch] = useState('');
  const [showUploadParticipantsModal, setShowUploadParticipantsModal] = useState(false);
  const [showUploadVisitsModal, setShowUploadVisitsModal] = useState(false);
  const [uploadedParticipantsFile, setUploadedParticipantsFile] = useState<File | null>(null);
  const [uploadedVisitsFile, setUploadedVisitsFile] = useState<File | null>(null);
  const [dragActiveParticipants, setDragActiveParticipants] = useState(false);
  const [dragActiveVisits, setDragActiveVisits] = useState(false);
  const [visitsEffectiveDate, setVisitsEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [showExportParticipantsModal, setShowExportParticipantsModal] = useState(false);
  const [showExportVisitsModal, setShowExportVisitsModal] = useState(false);

  // Participant Rules state
  const [selectedRuleParticipant, setSelectedRuleParticipant] = useState('');
  const [ruleStudyParticipantId, setRuleStudyParticipantId] = useState('');
  const [ruleWaiveSSN, setRuleWaiveSSN] = useState('No');
  const [ruleWithholdTaxes, setRuleWithholdTaxes] = useState('No');
  const [ruleStatus, setRuleStatus] = useState('Registered');
  const [showRulesConfirmation, setShowRulesConfirmation] = useState(false);
  const [originalRuleValues, setOriginalRuleValues] = useState({
    studyParticipantId: '',
    waiveSSN: 'No',
    withholdTaxes: 'No',
    status: 'Registered'
  });
  const [participantRules, setParticipantRules] = useState<{
    [key: string]: {
      studyParticipantId: string;
      waiveSSN: string;
      withholdTaxes: string;
      status: string;
    }
  }>({});
  const [showVisitChangesConfirmation, setShowVisitChangesConfirmation] = useState(false);
  const [newVisitId, setNewVisitId] = useState('');
  const [newVisitName, setNewVisitName] = useState('');
  const [newVisitType, setNewVisitType] = useState('');
  const [newVisitPayment, setNewVisitPayment] = useState('');

  // Payment Schedule versioning state
  const [currentVersionDate, setCurrentVersionDate] = useState('2026-01-26');
  const [priorVersions, setPriorVersions] = useState<string[]>(['2026-01-15', '2026-01-01', '2025-12-15']);
  const [selectedPriorVersion, setSelectedPriorVersion] = useState('');
  const [showPriorVersions, setShowPriorVersions] = useState(false);

  // Mock participant data for the details tab
  const allParticipants = [
    { id: 'P-2026-001', name: 'John Smith', status: 'Active' },
    { id: 'P-2025-156', name: 'Sarah Johnson', status: 'Active' },
    { id: 'P-2026-045', name: 'Michael Brown', status: 'Active' },
    { id: 'P-2026-089', name: 'Emily Davis', status: 'Screening' },
    { id: 'P-2025-234', name: 'Robert Wilson', status: 'Active' },
    { id: 'P-2025-178', name: 'Linda Martinez', status: 'Completed' },
    { id: 'P-2026-012', name: 'Jennifer Taylor', status: 'Active' },
    { id: 'P-2025-298', name: 'David Anderson', status: 'Completed' },
    { id: 'P-2026-150', name: 'Thomas Garcia', status: 'Registered' },
    { id: 'P-2026-151', name: 'Jessica White', status: 'Registered' },
  ];

  // Available study locations from KUMC organization
  const availableLocations = [
    'Main Research Center - Building A',
    'Outpatient Clinic - West Campus',
    'Home Visit - Johnson County Area',
    'Virtual/Remote Participation',
    'Westwood',
    'Corp',
    'Remote'
  ];

  // Location details mapping including addresses
  const locationDetails: { [key: string]: { address: string; type: string } } = {
    'Main Research Center - Building A': {
      address: '3901 Rainbow Blvd, Kansas City, KS 66160',
      type: 'Study Facility'
    },
    'Outpatient Clinic - West Campus': {
      address: '4000 Cambridge St, Kansas City, KS 66160',
      type: 'Study Facility'
    },
    'Home Visit - Johnson County Area': {
      address: 'Service Area: Johnson County, KS',
      type: 'Participant Location'
    },
    'Virtual/Remote Participation': {
      address: 'Remote/Telehealth',
      type: 'Participant Location'
    },
    'Westwood': {
      address: '5520 College Blvd, Overland Park, KS 66211',
      type: 'Study Facility'
    },
    'Corp': {
      address: '4330 Shawnee Mission Pkwy, Fairway, KS 66205',
      type: 'Study Facility'
    },
    'Remote': {
      address: 'Remote Work Location',
      type: 'Participant Location'
    }
  };

  const studies = [
    { id: 1, name: 'Cardiovascular Health Study 2026', code: 'CHS-2026-001', irb: 'IRB-2025-345', protocol: 'PROTO-CHS-2026', pi: 'Dr. Sarah Williams', status: 'Active', participants: 145, startDate: '2025-06-01', endDate: '2027-06-01', location: 'Main Research Center - Building A', locations: ['Main Research Center - Building A', 'Outpatient Clinic - West Campus'], participantList: ['P-2026-001', 'P-2025-156', 'P-2026-012', 'P-2025-178'] },
    { id: 2, name: 'Neurological Disorders Research', code: 'NDR-2025-042', irb: 'IRB-2025-198', protocol: 'PROTO-NDR-2025', pi: 'Dr. James Anderson', status: 'Active', participants: 89, startDate: '2025-03-15', endDate: '2026-12-31', location: 'Outpatient Clinic - West Campus', locations: ['Outpatient Clinic - West Campus', 'Virtual/Remote Participation'], participantList: ['P-2025-156', 'P-2026-089'] },
    { id: 3, name: 'Pediatric Nutrition Study', code: 'PNS-2026-008', irb: 'IRB-2026-012', protocol: 'PROTO-PNS-2026', pi: 'Dr. Robert Taylor', status: 'Active', participants: 67, startDate: '2026-01-01', endDate: '2027-12-31', location: 'Westwood', locations: ['Westwood', 'Home Visit - Johnson County Area'], participantList: ['P-2026-089', 'P-2025-234'] },
    { id: 4, name: 'Diabetes Prevention Trial', code: 'DPT-2025-019', irb: 'IRB-2024-567', protocol: 'PROTO-DPT-2025', pi: 'Dr. Michael Chen', status: 'Study completed', participants: 203, startDate: '2025-02-01', endDate: '2027-02-01', location: 'Main Research Center - Building A', locations: ['Main Research Center - Building A', 'Corp', 'Remote'], participantList: ['P-2026-045', 'P-2025-178', 'P-2025-298'] },
    { id: 5, name: 'Cancer Immunotherapy Study', code: 'CIS-2025-055', irb: 'IRB-2025-289', protocol: 'PROTO-CIS-2025', pi: 'Dr. Lisa Brown', status: 'Active', participants: 78, startDate: '2025-08-01', endDate: '2028-08-01', location: 'Corp', locations: ['Corp'], participantList: ['P-2025-234', 'P-2025-298'] },
    { id: 6, name: 'Sleep Disorder Analysis', code: 'SDA-2026-003', irb: 'IRB-2026-045', protocol: 'PROTO-SDA-2026', pi: 'Dr. Maria Martinez', status: 'Study start', participants: 2, startDate: '2026-03-01', endDate: '2027-09-01', location: 'Outpatient Clinic - West Campus', locations: ['Outpatient Clinic - West Campus'], participantList: ['P-2026-150', 'P-2026-151'] },
    { id: 7, name: 'Arthritis Treatment Efficacy', code: 'ATE-2025-031', irb: 'IRB-2024-123', protocol: 'PROTO-ATE-2025', pi: 'Dr. David Kim', status: 'Canceled/withdrawn', participants: 156, startDate: '2024-01-01', endDate: '2025-12-31', location: 'Main Research Center - Building A', locations: ['Main Research Center - Building A'], participantList: ['P-2025-298', 'P-2026-001'] },
  ];

  const filteredStudies = studies.filter(study => {
    const matchesSearch = study.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.pi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.irb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || study.status === filterStatus;
    const matchesPI = filterPI === 'all' || study.pi === filterPI;
    return matchesSearch && matchesStatus && matchesPI;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDragParticipants = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveParticipants(true);
    } else if (e.type === "dragleave") {
      setDragActiveParticipants(false);
    }
  };

  const handleDropParticipants = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveParticipants(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedParticipantsFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChangeParticipants = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedParticipantsFile(e.target.files[0]);
    }
  };

  const handleDragVisits = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveVisits(true);
    } else if (e.type === "dragleave") {
      setDragActiveVisits(false);
    }
  };

  const handleDropVisits = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveVisits(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedVisitsFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChangeVisits = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedVisitsFile(e.target.files[0]);
    }
  };


  const handleArchiveStudy = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Study "${deletingStudy?.name}" has been archived`);
    setIsProcessing(false);
    setDeletingStudy(null);
  };

  const saveParticipantRules = () => {
    // Save the study participant ID
    setStudyParticipantIds({
      ...studyParticipantIds,
      [selectedRuleParticipant]: ruleStudyParticipantId
    });

    // Save all participant rules
    setParticipantRules({
      ...participantRules,
      [selectedRuleParticipant]: {
        studyParticipantId: ruleStudyParticipantId,
        waiveSSN: ruleWaiveSSN,
        withholdTaxes: ruleWithholdTaxes,
        status: ruleStatus
      }
    });

    toast.success('Participant rules saved successfully');

    // Reset form
    setRuleStatus('Registered');
  };


  const handleCloseSetupPanel = () => {
    // Check if there are unsaved visit changes
    if (hasVisitChanges && activeTab === 'paymentSchedule') {
      setShowVisitChangesConfirmation(true);
      return;
    }

    setShowSetupPanel(false);
    setEditingStudy(null);
    setViewingStudy(null);
    setActiveTab('details');
    setEnrolledParticipants([]);
    setStudyParticipantIds({});
    
    setDetailsParticipantSearch('');
    setLocationSearch('');
    setStudyLocations([]);
    setHasVisitChanges(false);
    setVisitOrder([]);
  };

  const confirmCloseWithVisitChanges = () => {
    setShowVisitChangesConfirmation(false);
    setShowSetupPanel(false);
    setEditingStudy(null);
    setViewingStudy(null);
    setActiveTab('details');
    setEnrolledParticipants([]);
    setStudyParticipantIds({});
    
    setDetailsParticipantSearch('');
    setLocationSearch('');
    setStudyLocations([]);
    setHasVisitChanges(false);
    setVisitOrder([]);
  };

  const isEditMode = editingStudy !== null;
  const isViewMode = viewingStudy !== null && editingStudy === null;

  return (
    <div className="space-y-6">
      {/* Section Header with Action Buttons */}
      <div className="bg-white border-l-4 border-ku-blue rounded-lg shadow-sm p-5 flex items-center justify-between">
        {/* Left Side - Icon and Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-ku-blue rounded-lg flex items-center justify-center shadow-sm">
            <FlaskConical className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl text-gray-800 font-semibold">Studies</h2>
            <p className="text-gray-600 text-sm">Manage research studies and protocols</p>
          </div>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKPIs(!showKPIs)}
            className="p-2.5 text-gray-600 hover:bg-white hover:text-blue-600 rounded-lg transition-all shadow-sm"
            title={showKPIs ? 'Hide Key Performance Indicators' : 'Show Key Performance Indicators'}
          >
            {showKPIs ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="p-2.5 text-gray-600 hover:bg-white hover:text-blue-600 rounded-lg transition-all shadow-sm"
            title="Bulk Upload Studies from Excel"
          >
            <Upload size={20} />
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="p-2.5 text-gray-600 hover:bg-white hover:text-green-600 rounded-lg transition-all shadow-sm"
            title="Export Studies to Excel"
          >
            <FileSpreadsheet size={20} />
          </button>
          <button
            onClick={() => setShowSetupPanel(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-all"
            title="Setup New Study"
          >
            <Plus size={20} />
            Setup Study
          </button>
        </div>
      </div>

      {/* Collapsible Statistics */}
      {showKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Studies</p>
              <FlaskConical className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl">{studies.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Active Studies</p>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-3xl">{studies.filter(s => s.status === 'Active').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Recruiting</p>
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
            <p className="text-3xl">{studies.filter(s => s.status === 'Recruiting').length}</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <label htmlFor="study-search" className="sr-only">
              Search studies by name, code, IRB number, protocol, or principal investigator
            </label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} aria-hidden="true" />
            <input
              id="study-search"
              type="text"
              placeholder="Search by study name, code, IRB, protocol, or PI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" aria-hidden="true" />
            <label htmlFor="filter-status" className="sr-only">Filter by study status</label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Study start">Study start</option>
              <option value="Study completed">Study completed</option>
              <option value="Canceled/withdrawn">Canceled/withdrawn</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" aria-hidden="true" />
            <label htmlFor="filter-pi" className="sr-only">Filter by principal investigator</label>
            <select
              id="filter-pi"
              value={filterPI}
              onChange={(e) => setFilterPI(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <option value="all">All PIs</option>
              <option value="Dr. Sarah Williams">Dr. Sarah Williams</option>
              <option value="Dr. James Anderson">Dr. James Anderson</option>
              <option value="Dr. Robert Taylor">Dr. Robert Taylor</option>
              <option value="Dr. Michael Chen">Dr. Michael Chen</option>
              <option value="Dr. Lisa Brown">Dr. Lisa Brown</option>
              <option value="Dr. Maria Martinez">Dr. Maria Martinez</option>
              <option value="Dr. David Kim">Dr. David Kim</option>
            </select>
          </div>
        </div>
      </div>

      {/* Studies Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">IRB #</th>
                <th className="px-6 py-3 text-left text-gray-600">Protocol #</th>
                <th className="px-6 py-3 text-left text-gray-600">Study Name</th>
                <th className="px-6 py-3 text-left text-gray-600">Principal Investigator</th>
                <th className="px-6 py-3 text-left text-gray-600">Start Date</th>
                <th className="px-6 py-3 text-left text-gray-600">End Date</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudies.map((study) => (
                <tr key={study.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{study.irb}</td>
                  <td className="px-6 py-4">{study.protocol}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setViewingStudy(study);
                        setEnrolledParticipants(study.participantList || []);
                        setShowSetupPanel(true);
                      }}
                      className="text-blue-600 hover:underline text-left"
                    >
                      {study.name}
                    </button>
                  </td>
                  <td className="px-6 py-4">{study.pi}</td>
                  <td className="px-6 py-4">{study.startDate}</td>
                  <td className="px-6 py-4">{study.endDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${study.status === 'Active' ? 'bg-green-100 text-green-800' :
                      study.status === 'Study start' ? 'bg-blue-100 text-blue-800' :
                        study.status === 'Study completed' ? 'bg-gray-100 text-gray-800' :
                          study.status === 'Canceled/withdrawn' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {study.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setViewingStudy(study);
                          setEnrolledParticipants(study.participantList || []);
                          setStudyLocations(study.locations || []);
                          setShowSetupPanel(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View"
                      >
                        <Eye size={16} />
                      </button>
                      {study.status !== 'Active' && study.status !== 'Study start' && (userRole as string) !== 'System' && (userRole as string) !== 'Global Admin' ? (
                        <button
                          className="p-2 text-gray-400 cursor-not-allowed rounded"
                          title={
                            study.status === 'Study completed' ? 'Study has completed, no enrollments or payments can be made.' :
                              study.status === 'Canceled/withdrawn' ? 'Study never started, no enrollments or payments can be made.' :
                                'Study cannot be edited'
                          }
                          disabled
                        >
                          <Lock size={16} />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingStudy(study);
                              setEnrolledParticipants(study.participantList || []);
                              setStudyLocations(study.locations || []);
                              setShowSetupPanel(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudy(study);
                              setActiveTab('participants');
                              setEnrolledParticipants(study.participantList || []);
                              setStudyLocations(study.locations || []);
                              setShowSetupPanel(true);
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                            title="Manage Participants"
                          >
                            <Users size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudy(study);
                              setActiveTab('paymentSchedule');
                              setEnrolledParticipants(study.participantList || []);
                              setStudyLocations(study.locations || []);
                              setShowSetupPanel(true);
                            }}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                            title="Payment Schedule"
                          >
                            <DollarSign size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingStudy(study)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Archive"
                          >
                            <Archive size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-gray-600">Showing {filteredStudies.length} of {studies.length} studies</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Setup Study Flyout Panel */}
      {showSetupPanel && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => handleCloseSetupPanel()}></div>
          <div className="absolute right-0 top-0 h-full w-full lg:w-3/4 xl:w-2/3 bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl">
                        {isViewMode ? `View Study (${viewingStudy?.name})` : isEditMode ? `Edit Study (${editingStudy?.name})` : 'Setup New Study'}
                      </h2>
                      {!isViewMode && !isEditMode && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Plus size={12} />
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {isViewMode ? 'View study details' : isEditMode ? 'Update study details' : 'Enter study details to create a new research study'}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleCloseSetupPanel()} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="px-6">
                <div className="flex gap-1 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Details
                  </button>
                  {(isViewMode || isEditMode) && (
                    <>
                      <button
                        onClick={() => setActiveTab('locations')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'locations'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        Locations
                      </button>
                      <button
                        onClick={() => setActiveTab('participants')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'participants'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        Participants
                      </button>
                      <button
                        onClick={() => setActiveTab('paymentSchedule')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'paymentSchedule'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        Payment Schedule
                      </button>
                      <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        Audit History
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Details Tab Content */}
              {activeTab === 'details' && (
                <>
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg border-b pb-2">Basic Information</h3>

                    <div>
                      <label className="block text-sm mb-1 text-gray-700">Study Name *</label>
                      {isViewMode ? (
                        <p className="text-gray-900 py-2">{viewingStudy.name}</p>
                      ) : (
                        <input
                          type="text"
                          placeholder="Enter study name"
                          defaultValue={editingStudy?.name || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 text-gray-700">IRB # *</label>
                        {isViewMode ? (
                          <p className="text-gray-900 py-2">{viewingStudy.irb}</p>
                        ) : (
                          <input
                            type="text"
                            placeholder="e.g., IRB-2025-345"
                            defaultValue={editingStudy?.irb || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm mb-1 text-gray-700">Protocol # *</label>
                        {isViewMode ? (
                          <p className="text-gray-900 py-2">{viewingStudy.protocol}</p>
                        ) : (
                          <input
                            type="text"
                            placeholder="e.g., PROTO-CHS-2026"
                            defaultValue={editingStudy?.protocol || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-1 text-gray-700">Status *</label>
                      {isViewMode ? (
                        <p className="text-gray-900 py-2">{viewingStudy.status}</p>
                      ) : (
                        <select
                          defaultValue={editingStudy?.status || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Select status</option>
                          <option>Active</option>
                          <option>Study start</option>
                          <option>Study completed</option>
                          <option>Canceled/withdrawn</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Study Team */}
                  <div className="space-y-4">
                    <h3 className="text-lg border-b pb-2">Study Team</h3>

                    <div>
                      <label className="block text-sm mb-1 text-gray-700">Principal Investigator *</label>
                      {isViewMode ? (
                        <p className="text-gray-900 py-2">{viewingStudy.pi}</p>
                      ) : (
                        <input
                          type="text"
                          placeholder="Dr. Name"
                          defaultValue={editingStudy?.pi || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>

                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-lg border-b pb-2">Study Timeline</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 text-gray-700">Start Date *</label>
                        {isViewMode ? (
                          <p className="text-gray-900 py-2">{viewingStudy.startDate}</p>
                        ) : (
                          <input
                            type="date"
                            defaultValue={editingStudy?.startDate || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm mb-1 text-gray-700">End Date *</label>
                        {isViewMode ? (
                          <p className="text-gray-900 py-2">{viewingStudy.endDate}</p>
                        ) : (
                          <input
                            type="date"
                            defaultValue={editingStudy?.endDate || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Study Description */}
                  <div className="space-y-4">
                    <h3 className="text-lg border-b pb-2">Study Description</h3>

                    <div>
                      <label className="block text-sm mb-1 text-gray-700">Description</label>
                      {isViewMode ? (
                        <p className="text-gray-900 py-2">A comprehensive research study investigating the effects and outcomes of cardiovascular health interventions.</p>
                      ) : (
                        <textarea
                          rows={4}
                          placeholder="Enter study description and objectives"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Billing Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg border-b pb-2">Billing Settings</h3>

                    <div>
                      {isViewMode ? (
                        <div className="flex items-center gap-2 py-2">
                          <input
                            type="checkbox"
                            id="allowTravelInvoicing"
                            defaultChecked={true}
                            disabled
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="allowTravelInvoicing" className="text-sm text-gray-700">
                            Allow travel reimbursements to be invoiced back to sponsor
                          </label>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="allowTravelInvoicing"
                            defaultChecked={editingStudy?.allowTravelInvoicing || false}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="allowTravelInvoicing" className="text-sm text-gray-700 cursor-pointer">
                            Allow travel reimbursements to be invoiced back to sponsor
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleCloseSetupPanel()}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {isViewMode ? 'Close' : 'Cancel'}
                    </button>
                    {!isViewMode && (
                      <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        {isEditMode ? 'Update Study' : 'Create Study'}
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Locations Tab Content */}
              {activeTab === 'locations' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium">Study Locations</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage locations where this study is being conducted
                      </p>
                    </div>
                  </div>

                  {/* Assigned Locations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Locations</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {studyLocations.length > 0 ? (
                        studyLocations.map((location, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                            {location}
                            {!isViewMode && (
                              <button
                                onClick={() => setStudyLocations(studyLocations.filter(l => l !== location))}
                                className="text-green-600 hover:text-green-800"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 py-1">No locations assigned</span>
                      )}
                    </div>

                    {!isViewMode && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search and add locations..."
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          onFocus={() => setShowLocationDropdown(true)}
                          onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        {showLocationDropdown && locationSearch && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {availableLocations
                              .filter(location =>
                                location.toLowerCase().includes(locationSearch.toLowerCase()) &&
                                !studyLocations.includes(location)
                              )
                              .map((location) => (
                                <button
                                  key={location}
                                  onClick={() => {
                                    setStudyLocations([...studyLocations, location]);
                                    setLocationSearch('');
                                    setShowLocationDropdown(false);
                                    toast.success(`Added location: ${location}`);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="text-sm">{location}</div>
                                </button>
                              ))}
                            {availableLocations.filter(location =>
                              location.toLowerCase().includes(locationSearch.toLowerCase()) &&
                              !studyLocations.includes(location)
                            ).length === 0 && (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">No locations found</div>
                              )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Locations Table */}
                  {studyLocations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Location Details</h4>
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-300">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Address</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                {!isViewMode && <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {studyLocations.map((location, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{location}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {locationDetails[location]?.address || 'Address not available'}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {locationDetails[location]?.type || 'Study Facility'}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                      Active
                                    </span>
                                  </td>
                                  {!isViewMode && (
                                    <td className="px-4 py-3">
                                      <button
                                        onClick={() => {
                                          setStudyLocations(studyLocations.filter(l => l !== location));
                                          toast.success(`Removed location: ${location}`);
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                        title="Remove location"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <span className="text-xs text-gray-600">
                            Showing {studyLocations.length} location(s)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Participants Tab Content */}
              {activeTab === 'participants' && (
                <div className="space-y-6">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium">Study Participants</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage participants enrolled in this study and configure participant-specific rules.
                    </p>
                  </div>

                  {/* Enrolled Participants Table */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">
                        Enrolled Participants ({(isViewMode ? viewingStudy : editingStudy)?.participantList?.length || enrolledParticipants.length || 0})
                      </h4>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Filter participants..."
                          value={detailsParticipantSearch}
                          onChange={(e) => setDetailsParticipantSearch(e.target.value)}
                          className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                      </div>
                    </div>

                    {((isViewMode ? viewingStudy?.participantList : isEditMode ? editingStudy?.participantList : enrolledParticipants) || []).length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Users className="mx-auto text-gray-400 mb-2" size={48} />
                        <p className="text-gray-500">No participants enrolled yet</p>
                        {!isViewMode && (
                          <p className="text-sm text-gray-400 mt-1">Use the search above to add participants to this study</p>
                        )}
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-300">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                  Participant ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                  Participant Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {((isViewMode ? viewingStudy?.participantList : isEditMode ? editingStudy?.participantList : enrolledParticipants) || [])
                                .filter((participantId: string) => {
                                  if (!detailsParticipantSearch) return true;
                                  const participant = allParticipants.find(p => p.id === participantId);
                                  const searchLower = detailsParticipantSearch.toLowerCase();
                                  return participantId.toLowerCase().includes(searchLower) ||
                                    participant?.name.toLowerCase().includes(searchLower) ||
                                    false;
                                })
                                .map((participantId: string) => {
                                  const participant = allParticipants.find(p => p.id === participantId);
                                  return (
                                    <tr key={participantId} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {participantId}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {participant?.name || '-'}
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${(participantRules[participantId]?.status || 'Registered') === 'Registered' ? 'bg-blue-100 text-blue-800' :
                                          (participantRules[participantId]?.status || 'Registered') === 'Completed' ? 'bg-gray-100 text-gray-800' :
                                            (participantRules[participantId]?.status || 'Registered') === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-green-100 text-green-800'
                                          }`}>
                                          {participantRules[participantId]?.status || 'Registered'}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <span className="text-xs text-gray-600">
                            Showing {((isViewMode ? viewingStudy?.participantList : isEditMode ? editingStudy?.participantList : enrolledParticipants) || []).length} participant(s)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Participant Rules Section */}
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-medium text-gray-900 mb-4">Participant Rules</h4>
                    {isViewMode ? (
                      <p className="text-sm text-gray-500 italic">View mode - participant rules cannot be edited</p>
                    ) : (
                      <div className="space-y-4">
                        {/* Select Participant */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Participant <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedRuleParticipant}
                            onChange={(e) => {
                              setSelectedRuleParticipant(e.target.value);
                              // Load existing rules or reset to defaults
                              const existingRules = participantRules[e.target.value];
                              const studyId = existingRules?.studyParticipantId || studyParticipantIds[e.target.value] || '';
                              const waiveSSN = existingRules?.waiveSSN || 'No';
                              const withholdTaxes = existingRules?.withholdTaxes || 'No';
                              const status = existingRules?.status || 'Registered';

                              setRuleStudyParticipantId(studyId);
                              setRuleWaiveSSN(waiveSSN);
                              setRuleWithholdTaxes(withholdTaxes);
                              setRuleStatus(status);

                              // Store original values for change detection
                              setOriginalRuleValues({
                                studyParticipantId: studyId,
                                waiveSSN: waiveSSN,
                                withholdTaxes: withholdTaxes,
                                status: status
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Choose a participant...</option>
                            {((isEditMode ? editingStudy?.participantList : enrolledParticipants) || []).map((participantId: string) => {
                              const participant = allParticipants.find(p => p.id === participantId);
                              return (
                                <option key={participantId} value={participantId}>
                                  {participantId} - {participant?.name || 'Unknown'}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {selectedRuleParticipant && (
                          <>
                            {/* Study Participant ID */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Study Participant ID <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={ruleStudyParticipantId}
                                onChange={(e) => setRuleStudyParticipantId(e.target.value)}
                                placeholder="Enter study-specific participant ID..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* Waive SSN */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Waive SSN
                              </label>
                              <select
                                value={ruleWaiveSSN}
                                onChange={(e) => setRuleWaiveSSN(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </div>

                            {/* Withhold Taxes */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Withhold Taxes
                              </label>
                              <select
                                value={ruleWithholdTaxes}
                                onChange={(e) => setRuleWithholdTaxes(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </div>

                            {/* Update Status */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Participant Status
                              </label>
                              <select
                                value={ruleStatus}
                                onChange={(e) => setRuleStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="Registered">Registered</option>
                                <option value="Completed">Completed</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            </div>

                            {/* Save Changes Button */}
                            <div className="pt-2">
                              <button
                                onClick={() => {
                                  if (!ruleStudyParticipantId.trim()) {
                                    toast.error('Study Participant ID is required');
                                    return;
                                  }

                                  // Check if any rules have been modified
                                  const hasChanges =
                                    originalRuleValues.studyParticipantId !== ruleStudyParticipantId ||
                                    originalRuleValues.waiveSSN !== ruleWaiveSSN ||
                                    originalRuleValues.withholdTaxes !== ruleWithholdTaxes ||
                                    originalRuleValues.status !== ruleStatus;

                                  if (hasChanges) {
                                    // Show confirmation dialog
                                    setShowRulesConfirmation(true);
                                  } else {
                                    // No changes, just save
                                    saveParticipantRules();
                                  }
                                }}
                                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                              >
                                Save Changes
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Schedule Tab Content */}
              {activeTab === 'paymentSchedule' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg border-b pb-2 mb-4">Payment Schedule</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Configure payment schedules for study visits. Payments will be automatically calculated based on the schedule below.
                    </p>
                    <p className="text-sm text-gray-700 font-medium mb-4">
                      Current Payment Schedule as of: <span className="text-blue-600">{new Date(currentVersionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </p>
                  </div>

                  {/* Study Visits */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Study Visits</h4>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text"
                            placeholder="Filter visits..."
                            value={visitSearch}
                            onChange={(e) => setVisitSearch(e.target.value)}
                            className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                          />
                        </div>
                        {!isViewMode && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowUploadVisitsModal(true);
                              }}
                              className="flex items-center gap-2 px-3 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 text-sm"
                            >
                              <Upload size={16} />
                              Upload Visits
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowExportVisitsModal(true);
                              }}
                              className="flex items-center gap-2 px-3 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 text-sm"
                            >
                              <FileSpreadsheet size={16} />
                              Export
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAddVisit(!showAddVisit);
                              }}
                              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                            >
                              <Plus size={16} />
                              Add Visit
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Add Visit Section */}
                    {!isViewMode && showAddVisit && (
                      <div className="mb-4 border border-purple-300 rounded-lg bg-purple-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-purple-900">Add New Visit</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewVisitId('');
                              setNewVisitName('');
                              setNewVisitType('');
                              setNewVisitPayment('');
                              setShowAddVisit(false);
                            }}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Visit ID <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newVisitId}
                              onChange={(e) => setNewVisitId(e.target.value)}
                              placeholder="e.g., V7"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Visit Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newVisitName}
                              onChange={(e) => setNewVisitName(e.target.value)}
                              placeholder="e.g., Follow-up Visit"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={newVisitType}
                              onChange={(e) => setNewVisitType(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            >
                              <option value="">Select type...</option>
                              <option value="One-time">One-time</option>
                              <option value="Recurring">Recurring</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Payment Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newVisitPayment}
                              onChange={(e) => setNewVisitPayment(e.target.value)}
                              placeholder="e.g., $150"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewVisitId('');
                              setNewVisitName('');
                              setNewVisitType('');
                              setNewVisitPayment('');
                              setShowAddVisit(false);
                            }}
                            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              // Validation
                              if (!newVisitId.trim()) {
                                toast.error('Visit ID is required');
                                return;
                              }
                              if (!newVisitName.trim()) {
                                toast.error('Visit Name is required');
                                return;
                              }
                              if (!newVisitType) {
                                toast.error('Visit Type is required');
                                return;
                              }
                              if (!newVisitPayment.trim()) {
                                toast.error('Payment Amount is required');
                                return;
                              }

                              // Duplicate check - check against existing visits
                              const existingVisits = visitOrder.length > 0 ? visitOrder : [];
                              const isDuplicate = existingVisits.some((visit: any) => visit.id === newVisitId.trim());

                              if (isDuplicate) {
                                toast.error(`Visit ID "${newVisitId}" already exists. Please use a unique Visit ID.`);
                                return;
                              }

                              // Add the new visit
                              const newVisit = {
                                id: newVisitId.trim(),
                                name: newVisitName.trim(),
                                type: newVisitType,
                                payment: newVisitPayment.trim()
                              };

                              setVisitOrder([...visitOrder, newVisit]);
                              setHasVisitChanges(true);

                              toast.success('Visit added successfully');

                              // Reset form
                              setNewVisitId('');
                              setNewVisitName('');
                              setNewVisitType('');
                              setNewVisitPayment('');
                              setShowAddVisit(false);
                            }}
                            className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                          >
                            Add Visit
                          </button>
                        </div>
                      </div>
                    )}

                    {(() => {
                      const currentStudy = (isViewMode ? viewingStudy : editingStudy);
                      const getVisitsForStudy = (studyCode: string) => {
                        const visitsMap: { [key: string]: any[] } = {
                          'CHS-2026-001': [
                            { id: 'V1', name: 'Screening Visit', type: 'One-time', payment: '$150' },
                            { id: 'V2', name: 'Baseline Assessment', type: 'One-time', payment: '$200' },
                            { id: 'V3', name: 'Week 4 Follow-up', type: 'Recurring', payment: '$100' },
                            { id: 'V4', name: 'Month 3 Assessment', type: 'One-time', payment: '$150' },
                            { id: 'V5', name: 'Month 6 Assessment', type: 'One-time', payment: '$150' },
                            { id: 'V6', name: 'Final Visit', type: 'One-time', payment: '$250' },
                          ],
                          'NDR-2025-042': [
                            { id: 'V1', name: 'Initial Screening', type: 'One-time', payment: '$125' },
                            { id: 'V2', name: 'Neurological Baseline', type: 'One-time', payment: '$300' },
                            { id: 'V3', name: 'Week 2 Check', type: 'Recurring', payment: '$75' },
                            { id: 'V4', name: 'Month 1 Assessment', type: 'One-time', payment: '$200' },
                            { id: 'V5', name: 'Study Completion', type: 'One-time', payment: '$150' },
                          ],
                          'DPT-2025-019': [
                            { id: 'V1', name: 'Screening & Consent', type: 'One-time', payment: '$100' },
                            { id: 'V2', name: 'Baseline Labs', type: 'One-time', payment: '$150' },
                            { id: 'V3', name: 'Monthly Check-in', type: 'Recurring', payment: '$50' },
                            { id: 'V4', name: '6-Month Evaluation', type: 'One-time', payment: '$175' },
                          ],
                        };
                        return visitsMap[studyCode] || [];
                      };
                      const visits = currentStudy ? getVisitsForStudy(currentStudy.code) : [];
                      let displayVisits = visitOrder.length > 0 ? visitOrder : visits;

                      // Filter visits based on search
                      if (visitSearch) {
                        const searchLower = visitSearch.toLowerCase();
                        displayVisits = displayVisits.filter((visit) =>
                          visit.id.toLowerCase().includes(searchLower) ||
                          visit.name.toLowerCase().includes(searchLower) ||
                          visit.type.toLowerCase().includes(searchLower) ||
                          visit.payment.toLowerCase().includes(searchLower)
                        );
                      }

                      // Initialize visit order if not set
                      if (visits.length > 0 && visitOrder.length === 0) {
                        setVisitOrder(visits);
                      }

                      const handleDragStart = (index: number) => {
                        if (!isViewMode) {
                          setDraggedIndex(index);
                        }
                      };

                      const handleDragOver = (e: React.DragEvent, index: number) => {
                        e.preventDefault();
                        if (draggedIndex === null || draggedIndex === index || isViewMode) return;

                        const newOrder = [...displayVisits];
                        const draggedItem = newOrder[draggedIndex];
                        newOrder.splice(draggedIndex, 1);
                        newOrder.splice(index, 0, draggedItem);

                        setVisitOrder(newOrder);
                        setDraggedIndex(index);
                        setHasVisitChanges(true);
                      };

                      const handleDragEnd = () => {
                        setDraggedIndex(null);
                      };

                      return visits.length > 0 ? (
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-b border-gray-300">
                                <tr>
                                  {!isViewMode && (
                                    <th className="px-2 py-3 w-8"></th>
                                  )}
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Visit ID
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Visit Name
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Type
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Payment
                                  </th>
                                  {!isViewMode && (
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-24">
                                      Actions
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {displayVisits.map((visit, index) => (
                                  <tr
                                    key={visit.id}
                                    className={`hover:bg-gray-50 ${draggedIndex === index ? 'opacity-50' : ''}`}
                                    draggable={!isViewMode}
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                  >
                                    {!isViewMode && (
                                      <td className="px-2 py-3 text-sm">
                                        <div className="cursor-move text-gray-400 hover:text-gray-600">
                                          <GripVertical size={16} />
                                        </div>
                                      </td>
                                    )}
                                    <td className="px-4 py-3 text-sm">
                                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                        {visit.id}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      {isViewMode ? (
                                        <span className="text-gray-900 font-medium">{visit.name}</span>
                                      ) : (
                                        <input
                                          type="text"
                                          defaultValue={visit.name}
                                          onChange={() => setHasVisitChanges(true)}
                                          className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      {isViewMode ? (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                          {visit.type}
                                        </span>
                                      ) : (
                                        <select
                                          defaultValue={visit.type}
                                          onChange={() => setHasVisitChanges(true)}
                                          className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                                        >
                                          <option value="One-time">One-time</option>
                                          <option value="Recurring">Recurring</option>
                                        </select>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      {isViewMode ? (
                                        <span className="text-gray-900 font-medium">{visit.payment}</span>
                                      ) : (
                                        <input
                                          type="text"
                                          defaultValue={visit.payment}
                                          onChange={() => setHasVisitChanges(true)}
                                          className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                      )}
                                    </td>
                                    {!isViewMode && (
                                      <td className="px-4 py-3 text-sm text-center">
                                        <button
                                          onClick={() => {
                                            toast.success('Visit archived');
                                          }}
                                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                          title="Archive visit"
                                        >
                                          <Archive size={16} />
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              Showing {displayVisits.length} visit(s)
                            </span>
                            {!isViewMode && hasVisitChanges && (
                              <button
                                onClick={() => {
                                  toast.success('Visit order saved successfully');
                                  setHasVisitChanges(false);
                                }}
                                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Save Changes
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <Calendar className="mx-auto text-gray-400 mb-2" size={48} />
                          <p className="text-gray-500">No visits found for this study</p>
                          {!isViewMode && (
                            <p className="text-sm text-gray-400 mt-1">Click Add Visit to create a new visit</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Prior Versions Section */}
                  {priorVersions.length > 0 && (
                    <div className="border rounded-lg">
                      <button
                        onClick={() => setShowPriorVersions(!showPriorVersions)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-900">Prior Versions</h4>
                          <span className="text-xs text-gray-500">({priorVersions.length} version{priorVersions.length !== 1 ? 's' : ''})</span>
                        </div>
                        {showPriorVersions ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                      </button>

                      {showPriorVersions && (
                        <div className="border-t p-4 space-y-4 bg-gray-50">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select Version to View:
                            </label>
                            <select
                              value={selectedPriorVersion}
                              onChange={(e) => setSelectedPriorVersion(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Choose a version...</option>
                              {priorVersions.map((version) => (
                                <option key={version} value={version}>
                                  {new Date(version).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </option>
                              ))}
                            </select>
                          </div>

                          {selectedPriorVersion && (() => {
                            // Mock data for prior versions - in reality this would come from a database
                            const priorVersionData: { [key: string]: any[] } = {
                              '2026-01-15': [
                                { id: 'V1', name: 'Screening Visit', type: 'One-time', payment: '$125' },
                                { id: 'V2', name: 'Baseline Assessment', type: 'One-time', payment: '$175' },
                                { id: 'V3', name: 'Week 4 Follow-up', type: 'Recurring', payment: '$100' },
                                { id: 'V4', name: 'Month 3 Assessment', type: 'One-time', payment: '$150' },
                                { id: 'V5', name: 'Final Visit', type: 'One-time', payment: '$200' },
                              ],
                              '2026-01-01': [
                                { id: 'V1', name: 'Initial Screening', type: 'One-time', payment: '$100' },
                                { id: 'V2', name: 'Baseline Visit', type: 'One-time', payment: '$150' },
                                { id: 'V3', name: 'Follow-up', type: 'Recurring', payment: '$75' },
                                { id: 'V4', name: 'Completion', type: 'One-time', payment: '$175' },
                              ],
                              '2025-12-15': [
                                { id: 'V1', name: 'Screening', type: 'One-time', payment: '$100' },
                                { id: 'V2', name: 'Baseline', type: 'One-time', payment: '$150' },
                                { id: 'V3', name: 'Final Visit', type: 'One-time', payment: '$150' },
                              ],
                            };
                            const priorVisits = priorVersionData[selectedPriorVersion] || [];

                            return (
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-sm font-medium text-gray-900">
                                    Version from {new Date(selectedPriorVersion).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </h5>
                                  <span className="text-xs text-gray-500 italic">Read-only view</span>
                                </div>

                                {priorVisits.length > 0 ? (
                                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                                    <div className="overflow-x-auto">
                                      <table className="w-full">
                                        <thead className="bg-gray-100 border-b border-gray-300">
                                          <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                              Visit ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                              Visit Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                              Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                              Payment
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                          {priorVisits.map((visit) => (
                                            <tr key={visit.id} className="hover:bg-gray-50">
                                              <td className="px-4 py-3 text-sm">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                                  {visit.id}
                                                </span>
                                              </td>
                                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                                {visit.name}
                                              </td>
                                              <td className="px-4 py-3 text-sm">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                  {visit.type}
                                                </span>
                                              </td>
                                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                                {visit.payment}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    <div className="px-4 py-3 bg-gray-100 border-t border-gray-200">
                                      <span className="text-xs text-gray-600">
                                        Showing {priorVisits.length} visit(s)
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8 bg-white rounded-lg border border-gray-300">
                                    <p className="text-sm text-gray-500">No visits found for this version</p>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* History Tab Content */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-lg border-b pb-2">Audit History</h3>

                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-900">Status changed to <span className="font-medium">Active</span></p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                      <p className="text-xs text-gray-600">By Dr. Sarah Williams on Jan 3, 2026 at 2:45 PM</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-500">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-900">End date extended to <span className="font-medium">{(isViewMode ? viewingStudy : editingStudy)?.endDate}</span></p>
                        <p className="text-xs text-gray-500">2 weeks ago</p>
                      </div>
                      <p className="text-xs text-gray-600">By Dr. Sarah Williams on Dec 22, 2025 at 4:30 PM</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-900">Study record created</p>
                        <p className="text-xs text-gray-500">{(isViewMode ? viewingStudy : editingStudy)?.startDate}</p>
                      </div>
                      <p className="text-xs text-gray-600">By Dr. Sarah Williams on {(isViewMode ? viewingStudy : editingStudy)?.startDate} at 8:00 AM</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Multiple Studies Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowUploadModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">Upload Multiple Studies</h2>
                <p className="text-sm text-gray-500">Upload a CSV or Excel file with study data</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                  }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="text-blue-600" size={32} />
                  </div>

                  {uploadedFile ? (
                    <div className="space-y-2">
                      <p className="text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-gray-900 mb-1">
                          Drag and drop your file here, or
                        </p>
                        <label className="text-blue-600 hover:underline cursor-pointer">
                          browse files
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Supported formats: CSV, Excel (.xlsx, .xls)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Template Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="text-blue-600 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">Need a template?</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Download our CSV template with the required columns and sample data
                    </p>
                    <button className="text-sm text-blue-600 hover:underline">
                      Download Template
                    </button>
                  </div>
                </div>
              </div>

              {/* Required Fields Info */}
              <div className="space-y-2">
                <p className="text-sm">Required fields in your file:</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Study Name
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Principal Investigator
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Start Date
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Status
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadedFile(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={!uploadedFile}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Upload and Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Studies Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowExportModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">Export Studies</h2>
                <p className="text-sm text-gray-500">Download study data in your preferred format</p>
              </div>
              <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Export Format */}
              <div>
                <label className="block text-gray-700 mb-3">Select Export Format</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="exportFormat" value="excel" defaultChecked className="w-4 h-4 text-blue-600" />
                    <FileSpreadsheet className="text-green-600" size={20} />
                    <div className="flex-1">
                      <p className="font-medium">Excel (.xlsx)</p>
                      <p className="text-sm text-gray-500">Best for data analysis and reporting</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="exportFormat" value="csv" className="w-4 h-4 text-blue-600" />
                    <FileSpreadsheet className="text-blue-600" size={20} />
                    <div className="flex-1">
                      <p className="font-medium">CSV (.csv)</p>
                      <p className="text-sm text-gray-500">Compatible with most applications</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Export Options */}
              <div>
                <label className="block text-gray-700 mb-3">Export Options</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Include all studies ({studies.length} total)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Include audit history</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Active studies only</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Export logic would go here
                    setShowExportModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet size={20} />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Participants Modal */}
      {showUploadParticipantsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowUploadParticipantsModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">Upload Participant List</h2>
                <p className="text-sm text-gray-500">Upload a CSV or Excel file with participant enrollment data</p>
              </div>
              <button onClick={() => setShowUploadParticipantsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload Area */}
              <div
                onDragEnter={handleDragParticipants}
                onDragLeave={handleDragParticipants}
                onDragOver={handleDragParticipants}
                onDrop={handleDropParticipants}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActiveParticipants ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                  }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="text-blue-600" size={32} />
                  </div>

                  {uploadedParticipantsFile ? (
                    <div className="space-y-2">
                      <p className="text-gray-900">{uploadedParticipantsFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadedParticipantsFile.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        onClick={() => setUploadedParticipantsFile(null)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-gray-900 mb-1">
                          Drag and drop your file here, or
                        </p>
                        <label className="text-blue-600 hover:underline cursor-pointer">
                          browse files
                          <input
                            type="file"
                            onChange={handleFileChangeParticipants}
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Supported formats: CSV, Excel (.xlsx, .xls)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Template Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="text-blue-600 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">Need a template?</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Download our CSV template with the required columns and sample data
                    </p>
                    <button className="text-sm text-blue-600 hover:underline">
                      Download Template
                    </button>
                  </div>
                </div>
              </div>

              {/* Required Fields Info */}
              <div className="space-y-2">
                <p className="text-sm">Required fields in your file:</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Participant ID
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Participant Name
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Study Participant ID (optional)
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowUploadParticipantsModal(false);
                    setUploadedParticipantsFile(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={!uploadedParticipantsFile}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Upload and Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Visits Modal */}
      {showUploadVisitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowUploadVisitsModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">Upload Study Visits</h2>
                <p className="text-sm text-gray-500">Upload a CSV or Excel file with study visit data</p>
              </div>
              <button onClick={() => setShowUploadVisitsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Effective Date Field */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Effective Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={visitsEffectiveDate}
                  onChange={(e) => setVisitsEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-600 mt-2">
                  This will create a new version of the Payment Schedule as of the date above
                </p>
              </div>

              {/* File Upload Area */}
              <div
                onDragEnter={handleDragVisits}
                onDragLeave={handleDragVisits}
                onDragOver={handleDragVisits}
                onDrop={handleDropVisits}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActiveVisits ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'
                  }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Upload className="text-purple-600" size={32} />
                  </div>

                  {uploadedVisitsFile ? (
                    <div className="space-y-2">
                      <p className="text-gray-900">{uploadedVisitsFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadedVisitsFile.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        onClick={() => setUploadedVisitsFile(null)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-gray-900 mb-1">
                          Drag and drop your file here, or
                        </p>
                        <label className="text-purple-600 hover:underline cursor-pointer">
                          browse files
                          <input
                            type="file"
                            onChange={handleFileChangeVisits}
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Supported formats: CSV, Excel (.xlsx, .xls)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Template Download */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="text-purple-600 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">Need a template?</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Download our CSV template with the required columns and sample data
                    </p>
                    <button className="text-sm text-purple-600 hover:underline">
                      Download Template
                    </button>
                  </div>
                </div>
              </div>

              {/* Required Fields Info */}
              <div className="space-y-2">
                <p className="text-sm">Required fields in your file:</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Visit ID
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Visit Name
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Visit Type
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Payment Amount
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowUploadVisitsModal(false);
                    setUploadedVisitsFile(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={!uploadedVisitsFile}
                  onClick={() => {
                    if (uploadedVisitsFile) {
                      // Add current version to prior versions
                      setPriorVersions([currentVersionDate, ...priorVersions]);
                      // Set new current version date to the selected effective date
                      setCurrentVersionDate(visitsEffectiveDate);
                      // Close modal and reset
                      setShowUploadVisitsModal(false);
                      setUploadedVisitsFile(null);
                      // Reset effective date to today for next upload
                      setVisitsEffectiveDate(new Date().toISOString().split('T')[0]);
                      toast.success(`New payment schedule version created as of ${new Date(visitsEffectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Upload and Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Participants Modal */}
      {showExportParticipantsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowExportParticipantsModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">Export Participants</h2>
                <p className="text-sm text-gray-500">Download participant enrollment data in your preferred format</p>
              </div>
              <button onClick={() => setShowExportParticipantsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Export Format */}
              <div>
                <label className="block text-gray-700 mb-3">Select Export Format</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="exportParticipantsFormat" value="excel" defaultChecked className="w-4 h-4 text-blue-600" />
                    <FileSpreadsheet className="text-green-600" size={20} />
                    <div className="flex-1">
                      <p className="font-medium">Excel (.xlsx)</p>
                      <p className="text-sm text-gray-500">Best for data analysis and reporting</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="exportParticipantsFormat" value="csv" className="w-4 h-4 text-blue-600" />
                    <FileSpreadsheet className="text-blue-600" size={20} />
                    <div className="flex-1">
                      <p className="font-medium">CSV (.csv)</p>
                      <p className="text-sm text-gray-500">Compatible with most applications</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Export Options */}
              <div>
                <label className="block text-gray-700 mb-3">Export Options</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Include all enrolled participants ({((isViewMode ? viewingStudy?.participantList : isEditMode ? editingStudy?.participantList : enrolledParticipants) || []).length} total)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Include Study Participant IDs</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Include participant demographics</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowExportParticipantsModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Export logic would go here
                    toast.success('Participant data exported successfully');
                    setShowExportParticipantsModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet size={20} />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Visits Modal */}
      {showExportVisitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowExportVisitsModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">Export Study Visits</h2>
                <p className="text-sm text-gray-500">Download study visit data in your preferred format</p>
              </div>
              <button onClick={() => setShowExportVisitsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Export Format */}
              <div>
                <label className="block text-gray-700 mb-3">Select Export Format</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="exportVisitsFormat" value="excel" defaultChecked className="w-4 h-4 text-blue-600" />
                    <FileSpreadsheet className="text-green-600" size={20} />
                    <div className="flex-1">
                      <p className="font-medium">Excel (.xlsx)</p>
                      <p className="text-sm text-gray-500">Best for data analysis and reporting</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="exportVisitsFormat" value="csv" className="w-4 h-4 text-blue-600" />
                    <FileSpreadsheet className="text-blue-600" size={20} />
                    <div className="flex-1">
                      <p className="font-medium">CSV (.csv)</p>
                      <p className="text-sm text-gray-500">Compatible with most applications</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Export Options */}
              <div>
                <label className="block text-gray-700 mb-3">Export Options</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Include all study visits</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Include payment information</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Include visit schedule details</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowExportVisitsModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Export logic would go here
                    toast.success('Visit data exported successfully');
                    setShowExportVisitsModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet size={20} />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingStudy !== null}
        onClose={() => setDeletingStudy(null)}
        onConfirm={handleArchiveStudy}
        title="Archive Study"
        message={`Are you sure you want to archive "${deletingStudy?.name}" (${deletingStudy?.code})? The study will be moved to the archive and can be restored later. All participant data associated with this study will remain intact.`}
        confirmText="Archive Study"
        variant="danger"
        isLoading={isProcessing}
      />

      {/* Participant Rules Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRulesConfirmation}
        onClose={() => setShowRulesConfirmation(false)}
        onConfirm={saveParticipantRules}
        title="Confirm Rule Changes"
        message="Updating the rules will impact future Payment Requests for this Participant. Do you want to continue with the changes?"
        confirmText="Yes"
        cancelText="No"
        variant="warning"
      />

      {/* Visit Changes Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showVisitChangesConfirmation}
        onClose={() => setShowVisitChangesConfirmation(false)}
        onConfirm={confirmCloseWithVisitChanges}
        title="Confirm Visit Changes"
        message="Updating the visits will impact future Payment Requests for this Study. Do you want to continue with the changes?"
        confirmText="Yes"
        cancelText="No"
        variant="warning"
      />

      {/* Enrollment Panel */}
      {managingEnrollment && (
        <EnrollmentPanel
          study={managingEnrollment}
          selectedParticipants={selectedParticipants}
          onClose={() => setManagingEnrollment(null)}
          onSave={(participants, studyParticipantIds) => {
            // Handle save logic
            console.log('Saved participants:', participants);
            console.log('Study Participant IDs:', studyParticipantIds);
            toast.success('Study enrollment updated successfully!');
            setManagingEnrollment(null);
          }}
        />
      )}

      {/* Payment Schedule Panel */}
      {showPaymentSchedulePanel && (
        <PaymentSchedulePanel
          onClose={() => setShowPaymentSchedulePanel(false)}
        />
      )}
    </div>
  );
}
