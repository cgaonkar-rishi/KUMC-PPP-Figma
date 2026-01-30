import { useState } from 'react';
import { Search, Plus, Edit, Archive, Eye, Filter, UserRound, ChevronDown, ChevronUp, X, Calendar, FlaskConical, FileSpreadsheet, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { StudyEnrollmentPanel } from './StudyEnrollmentPanel';
import { AddressVerificationModal } from './AddressVerificationModal';
import { ParticipantVerificationModal } from './ParticipantVerificationModal';

export function Participants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showKPIs, setShowKPIs] = useState(false);
  const [showEnrollPanel, setShowEnrollPanel] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [editingParticipant, setEditingParticipant] = useState<any>(null);
  const [deletingParticipant, setDeletingParticipant] = useState<any>(null);
  const [viewingParticipant, setViewingParticipant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [managingEnrollment, setManagingEnrollment] = useState<any>(null);
  const [detailsStudySearch, setDetailsStudySearch] = useState('');
  const [showAddressVerification, setShowAddressVerification] = useState(false);
  const [showParticipantVerification, setShowParticipantVerification] = useState(false);
  const [addressFields, setAddressFields] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });
  const [showAddStudy, setShowAddStudy] = useState(false);
  const [studySearch, setStudySearch] = useState('');
  const [enrolledStudies, setEnrolledStudies] = useState<string[]>([]);
  const [studySpecificIds, setStudySpecificIds] = useState<{ [key: string]: string }>({});

  // Study Rules state
  const [selectedRuleStudy, setSelectedRuleStudy] = useState('');
  const [ruleStudyParticipantId, setRuleStudyParticipantId] = useState('');
  const [ruleWaiveSSN, setRuleWaiveSSN] = useState('No');
  const [ruleWithholdTaxes, setRuleWithholdTaxes] = useState('No');
  const [ruleStatus, setRuleStatus] = useState('Registered');
  const [studyPrimaryLocations, setStudyPrimaryLocations] = useState<{ [key: string]: string }>({});

  // Mock study data for the details tab
  const allStudies = [
    { code: 'CHS-2026-001', name: 'Cardiovascular Health Study 2026', pi: 'Dr. Sarah Williams', status: 'Active' },
    { code: 'NDR-2025-042', name: 'Neurological Disorders Research', pi: 'Dr. James Anderson', status: 'Active' },
    { code: 'DPT-2025-019', name: 'Diabetes Prevention Trial', pi: 'Dr. Michael Chen', status: 'Active' },
    { code: 'PNS-2026-008', name: 'Pediatric Nutrition Study', pi: 'Dr. Robert Taylor', status: 'Recruiting' },
    { code: 'CIS-2025-055', name: 'Cancer Immunotherapy Study', pi: 'Dr. Lisa Brown', status: 'Active' },
    { code: 'ATE-2025-031', name: 'Arthritis Treatment Efficacy', pi: 'Dr. David Kim', status: 'Completed' },
    { code: 'SDA-2026-003', name: 'Sleep Disorder Analysis', pi: 'Dr. Maria Martinez', status: 'Planning' },
  ];

  const participants = [
    { id: 1, participantId: 'P-2026-001', name: 'John Smith', firstName: 'John', lastName: 'Smith', dob: '1985-03-15', gender: 'Male', study: 'CHS-2026-001', enrollDate: '2025-08-15', status: 'Active', participantStatus: 'Active', visits: 12, studyList: ['CHS-2026-001', 'ATE-2025-031'], email: 'john.smith@email.com', phone: '(555) 123-4567', location: 'Home Visit - Johnson County Area', address1: '123 Main St', address2: 'Apt 4B', city: 'Kansas City', state: 'KS', zip: '66101', country: 'United States', ssn: '***-**-1234', withholdTax: 'no', taxExempt: false },
    { id: 2, participantId: 'P-2025-156', name: 'Sarah Johnson', firstName: 'Sarah', lastName: 'Johnson', dob: '1990-07-22', gender: 'Female', study: 'NDR-2025-042', enrollDate: '2025-04-20', status: 'Active', participantStatus: 'Active', visits: 8, studyList: ['NDR-2025-042', 'CHS-2026-001'], email: 'sarah.j@email.com', phone: '(555) 234-5678', location: 'Community Health Center - Downtown', address1: '456 Oak Ave', address2: '', city: 'Overland Park', state: 'KS', zip: '66062', country: 'United States', ssn: '***-**-5678', withholdTax: 'yes', taxExempt: false },
    { id: 3, participantId: 'P-2026-045', name: 'Michael Brown', firstName: 'Michael', lastName: 'Brown', dob: '1978-11-30', gender: 'Male', study: 'DPT-2025-019', enrollDate: '2025-06-10', status: 'Active', participantStatus: 'Active', visits: 15, studyList: ['DPT-2025-019'], email: 'mbrown@email.com', phone: '(555) 345-6789', location: 'Virtual/Remote Participation', address1: '789 Elm Street', address2: 'Suite 200', city: 'Lenexa', state: 'KS', zip: '66215', country: 'United States', ssn: '***-**-9012', withholdTax: 'no', taxExempt: false },
    { id: 4, participantId: 'P-2026-089', name: 'Emily Davis', firstName: 'Emily', lastName: 'Davis', dob: '1995-02-14', gender: 'Female', study: 'PNS-2026-008', enrollDate: '2026-01-05', status: 'Screening', participantStatus: 'Active', visits: 2, studyList: ['PNS-2026-008', 'NDR-2025-042'], email: 'emily.d@email.com', phone: '(555) 456-7890', location: 'Home Visit - Wyandotte County Area', address1: '321 Pine Rd', address2: '', city: 'Kansas City', state: 'MO', zip: '64110', country: 'United States', ssn: '***-**-3456', withholdTax: 'no', taxExempt: false },
    { id: 5, participantId: 'P-2025-234', name: 'Robert Wilson', firstName: 'Robert', lastName: 'Wilson', dob: '1982-09-08', gender: 'Male', study: 'CIS-2025-055', enrollDate: '2025-09-01', status: 'Active', participantStatus: 'Active', visits: 10, studyList: ['CIS-2025-055', 'PNS-2026-008'], email: 'rwilson@email.com', phone: '(555) 567-8901', location: 'Community Health Center - Downtown', address1: '654 Maple Dr', address2: 'Unit 12', city: 'Shawnee', state: 'KS', zip: '66203', country: 'United States', ssn: '***-**-7890', withholdTax: 'yes', taxExempt: true },
    { id: 6, participantId: 'P-2025-178', name: 'Linda Martinez', firstName: 'Linda', lastName: 'Martinez', dob: '1988-05-19', gender: 'Female', study: 'DPT-2025-019', enrollDate: '2025-07-22', status: 'Completed', participantStatus: 'Inactive', visits: 24, studyList: ['DPT-2025-019', 'CHS-2026-001'], email: 'linda.m@email.com', phone: '(555) 678-9012', location: 'Home Visit - Johnson County Area', address1: '987 Cedar Ln', address2: '', city: 'Olathe', state: 'KS', zip: '66061', country: 'United States', ssn: '***-**-2345', withholdTax: 'no', taxExempt: false },
    { id: 7, participantId: 'P-2025-298', name: 'David Anderson', firstName: 'David', lastName: 'Anderson', dob: '1975-12-03', gender: 'Male', study: 'ATE-2025-031', enrollDate: '2024-03-15', status: 'Completed', participantStatus: 'Inactive', visits: 18, studyList: ['ATE-2025-031', 'DPT-2025-019', 'CIS-2025-055'], email: 'danderson@email.com', phone: '(555) 789-0123', location: 'Virtual/Remote Participation', address1: '147 Birch Ave', address2: 'Bldg C', city: 'Prairie Village', state: 'KS', zip: '66208', country: 'United States', ssn: '***-**-6789', withholdTax: 'yes', taxExempt: false },
    { id: 8, participantId: 'P-2026-012', name: 'Jennifer Taylor', firstName: 'Jennifer', lastName: 'Taylor', dob: '1992-08-27', gender: 'Female', study: 'CHS-2026-001', enrollDate: '2025-08-28', status: 'Active', participantStatus: 'Active', visits: 11, studyList: ['CHS-2026-001'], email: 'jtaylor@email.com', phone: '(555) 890-1234', location: 'Community Health Center - Downtown', address1: '258 Walnut St', address2: 'Apt 3A', city: 'Kansas City', state: 'KS', zip: '66102', country: 'United States', ssn: '***-**-0123', withholdTax: 'no', taxExempt: false },
    { id: 9, participantId: 'P-2026-150', name: 'Thomas Garcia', firstName: 'Thomas', lastName: 'Garcia', dob: '1987-06-18', gender: 'Male', study: 'SDA-2026-003', enrollDate: '2026-01-20', status: 'Registered', participantStatus: 'Active', visits: 0, studyList: ['SDA-2026-003'], email: 'thomas.garcia@email.com', phone: '(555) 901-2345', location: 'Outpatient Clinic - West Campus', address1: '741 Spruce St', address2: '', city: 'Kansas City', state: 'KS', zip: '66112', country: 'United States', ssn: '***-**-4567', withholdTax: 'no', taxExempt: false },
    { id: 10, participantId: 'P-2026-151', name: 'Jessica White', firstName: 'Jessica', lastName: 'White', dob: '1993-11-09', gender: 'Female', study: 'SDA-2026-003', enrollDate: '2026-01-22', status: 'Registered', participantStatus: 'Active', visits: 0, studyList: ['SDA-2026-003'], email: 'jessica.white@email.com', phone: '(555) 012-3456', location: 'Outpatient Clinic - West Campus', address1: '852 Ash Blvd', address2: '', city: 'Overland Park', state: 'KS', zip: '66085', country: 'United States', ssn: '***-**-8901', withholdTax: 'no', taxExempt: false },
  ];

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.study.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || participant.participantStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleClosePanel = () => {
    setShowEnrollPanel(false);
    setEditingParticipant(null);
    setViewingParticipant(null);
    setEnrolledStudies([]);
    setShowAddStudy(false);
    setStudySearch('');
    setStudySpecificIds({});
    setActiveTab('details');
  };

  const handleSaveParticipant = () => {
    if (!editingParticipant) return;

    // In a real application, this would make an API call to save the participant
    // For now, we'll just show a success message with tax withholding status

    const taxStatus = editingParticipant.withholdTax === 'yes'
      ? 'Tax withholding enabled - 10% will be deducted from payments'
      : 'Tax withholding disabled';

    toast.success(
      `Participant ${editingParticipant.participantId} updated successfully. ${taxStatus}`,
      { duration: 5000 }
    );

    handleClosePanel();
  };

  const isEditMode = editingParticipant !== null;
  const isViewMode = viewingParticipant !== null && editingParticipant === null;
  const currentParticipant = isViewMode ? viewingParticipant : isEditMode ? editingParticipant : null;

  return (
    <div className="space-y-6">
      {/* Section Header with Action Buttons */}
      <div className="bg-white border-l-4 border-ku-blue rounded-lg shadow-sm p-5 flex items-center justify-between">
        {/* Left Side - Icon and Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
            <UserRound className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl text-gray-800 font-semibold">Participants</h2>
            <p className="text-gray-600 text-sm">Manage study participants and enrollment</p>
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
            title="Bulk Upload Participants from Excel"
          >
            <Upload size={20} />
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="p-2.5 text-gray-600 hover:bg-white hover:text-green-600 rounded-lg transition-all shadow-sm"
            title="Export Participants to Excel"
          >
            <FileSpreadsheet size={20} />
          </button>
          <button
            onClick={() => setShowEnrollPanel(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-all"
            title="Register New Participant"
          >
            <Plus size={20} />
            Register Participant
          </button>
        </div>
      </div>

      {/* Collapsible Statistics */}
      {showKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Participants</p>
              <UserRound className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl">{participants.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Active</p>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-3xl">{participants.filter(p => p.participantStatus === 'Active').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Inactive</p>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
            <p className="text-3xl">{participants.filter(p => p.participantStatus === 'Inactive').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Visits</p>
              <Calendar className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl">{participants.reduce((sum, p) => sum + p.visits, 0)}</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, ID, or study..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Participant Code</th>
                <th className="px-6 py-3 text-left text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-gray-600">DOB</th>
                <th className="px-6 py-3 text-left text-gray-600">Address</th>
                <th className="px-6 py-3 text-left text-gray-600">Linked Studies</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{participant.participantId}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setViewingParticipant(participant);
                        setEnrolledStudies(participant.studyList || []);
                        setShowEnrollPanel(true);
                      }}
                      className="text-blue-600 hover:underline text-left"
                    >
                      {participant.name}
                    </button>
                  </td>
                  <td className="px-6 py-4">{participant.dob}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {participant.address1}{participant.address2 ? `, ${participant.address2}` : ''}
                      <br />
                      {participant.city}, {participant.state} {participant.zip}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {participant.studyList && participant.studyList.length > 0 ? (
                        participant.studyList.map((studyCode: string) => (
                          <span
                            key={studyCode}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium"
                          >
                            {studyCode}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm italic">No studies</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${participant.participantStatus === 'Active' ? 'bg-green-100 text-green-800' :
                      participant.participantStatus === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {participant.participantStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setViewingParticipant(participant);
                          setShowEnrollPanel(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingParticipant(participant);
                          setEnrolledStudies(participant.studyList || []);
                          setShowEnrollPanel(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingParticipant(participant);
                          setEnrolledStudies(participant.studyList || []);
                          setActiveTab('studies');
                          setShowEnrollPanel(true);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                        title="Manage Study Enrollment"
                      >
                        <FlaskConical size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingParticipant(participant)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Archive"
                      >
                        <Archive size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-gray-600">Showing {filteredParticipants.length} of {participants.length} participants</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Study Enrollment Management Panel */}
      {managingEnrollment && (
        <StudyEnrollmentPanel
          participant={managingEnrollment}
          selectedStudies={[]}
          onClose={() => setManagingEnrollment(null)}
          onSave={() => {
            // Handle save logic here
            setManagingEnrollment(null);
          }}
        />
      )}

      {/* Register Participant Panel */}
      {showEnrollPanel && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClosePanel}></div>
          <div className="absolute right-0 top-0 h-full w-full lg:w-3/4 xl:w-2/3 bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl">
                    {isViewMode ? `View Participant (${currentParticipant?.name})` : isEditMode ? `Edit Participant (${currentParticipant?.name})` : 'Register Participant'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isViewMode ? 'View participant details' : isEditMode ? 'Update participant information' : 'Enter participant details to register in study'}
                  </p>
                </div>
                <button onClick={handleClosePanel} className="p-2 hover:bg-gray-100 rounded-lg">
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
                    <button
                      onClick={() => setActiveTab('studies')}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'studies'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      Studies
                    </button>
                  )}
                  {(isViewMode || isEditMode) && (
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history'
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
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg border-b pb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1 text-gray-700">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={currentParticipant?.firstName || ''}
                          onChange={() => { }}
                          readOnly={isViewMode}
                          disabled={isViewMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-gray-700">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={currentParticipant?.lastName || ''}
                          onChange={() => { }}
                          readOnly={isViewMode}
                          disabled={isViewMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-gray-700">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={currentParticipant?.dob || ''}
                          onChange={() => { }}
                          readOnly={isViewMode}
                          disabled={isViewMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-gray-700">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={currentParticipant?.gender || ''}
                          onChange={() => { }}
                          disabled={isViewMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                          <option value="">-- Select --</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-gray-700">
                          Participant Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={currentParticipant?.participantStatus || 'Active'}
                          onChange={(e) => {
                            if (!isViewMode && editingParticipant) {
                              setEditingParticipant({
                                ...editingParticipant,
                                participantStatus: e.target.value
                              });
                            }
                          }}
                          disabled={isViewMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg border-b pb-2">Contact Information</h3>
                    <div className="space-y-4">

                      <div>
                        <label className="block text-sm mb-1 text-gray-700">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={currentParticipant?.email || ''}
                          onChange={() => { }}
                          readOnly={isViewMode}
                          disabled={isViewMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          placeholder="participant@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-gray-700">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={currentParticipant?.phone || ''}
                          onChange={() => { }}
                          readOnly={isViewMode}
                          disabled={isViewMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      {/* Address Section with Verify Button */}
                      <div className="border-t border-gray-300 pt-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-gray-700 font-medium">
                            Mailing Address
                          </label>
                          {!isViewMode && (
                            <button
                              type="button"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              onClick={() => setShowAddressVerification(true)}
                            >
                              Verify Address
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-gray-700 text-sm mb-2">
                              Address Line 1 <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={currentParticipant?.address1 || addressFields.address1}
                              onChange={(e) => !isViewMode && setAddressFields({ ...addressFields, address1: e.target.value })}
                              readOnly={isViewMode}
                              disabled={isViewMode}
                              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              placeholder="Street number and name"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 text-sm mb-2">
                              Address Line 2
                            </label>
                            <input
                              type="text"
                              value={currentParticipant?.address2 || addressFields.address2}
                              onChange={(e) => !isViewMode && setAddressFields({ ...addressFields, address2: e.target.value })}
                              readOnly={isViewMode}
                              disabled={isViewMode}
                              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              placeholder="Apartment, suite, unit, etc. (optional)"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-gray-700 text-sm mb-2">
                                City <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={currentParticipant?.city || addressFields.city}
                                onChange={(e) => !isViewMode && setAddressFields({ ...addressFields, city: e.target.value })}
                                readOnly={isViewMode}
                                disabled={isViewMode}
                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                placeholder="City"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm mb-2">
                                State <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={currentParticipant?.state || addressFields.state}
                                onChange={(e) => !isViewMode && setAddressFields({ ...addressFields, state: e.target.value })}
                                disabled={isViewMode}
                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              >
                                <option value="">Select</option>
                                <option value="KS">Kansas</option>
                                <option value="MO">Missouri</option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-gray-700 text-sm mb-2">
                                ZIP Code <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={currentParticipant?.zip || addressFields.zip}
                                onChange={(e) => !isViewMode && setAddressFields({ ...addressFields, zip: e.target.value })}
                                readOnly={isViewMode}
                                disabled={isViewMode}
                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                placeholder="12345"
                                maxLength={10}
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm mb-2">
                                Country <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={currentParticipant?.country || addressFields.country}
                                onChange={(e) => !isViewMode && setAddressFields({ ...addressFields, country: e.target.value })}
                                disabled={isViewMode}
                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                              >
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tax Withholding */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="text-lg mb-4">Tax Withholding</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-gray-700">
                            Social Security Number (SSN) <span className="text-red-500">*</span>
                          </label>
                          {!isViewMode && (
                            <button
                              type="button"
                              className="text-sm text-ku-blue hover:text-ku-blue-dark hover:underline"
                              onClick={() => setShowParticipantVerification(true)}
                            >
                              Verify Participant
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={currentParticipant?.ssn || ''}
                          onChange={() => { }}
                          readOnly={isViewMode}
                          disabled={isViewMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          placeholder="XXX-XX-XXXX"
                          maxLength={11}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-gray-700">
                          Withhold Taxes? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                          <label className={`flex items-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg ${!isViewMode ? 'hover:bg-white cursor-pointer' : 'bg-gray-100 cursor-not-allowed'}`}>
                            <input
                              type="radio"
                              name="withhold-tax"
                              value="yes"
                              checked={currentParticipant?.withholdTax === 'yes'}
                              onChange={() => {
                                if (!isViewMode && editingParticipant) {
                                  setEditingParticipant({
                                    ...editingParticipant,
                                    withholdTax: 'yes'
                                  });
                                }
                              }}
                              disabled={isViewMode}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Yes - Withhold taxes from payments</span>
                          </label>
                          <label className={`flex items-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg ${!isViewMode ? 'hover:bg-white cursor-pointer' : 'bg-gray-100 cursor-not-allowed'}`}>
                            <input
                              type="radio"
                              name="withhold-tax"
                              value="no"
                              checked={currentParticipant?.withholdTax === 'no' || !currentParticipant?.withholdTax}
                              onChange={() => {
                                if (!isViewMode && editingParticipant) {
                                  setEditingParticipant({
                                    ...editingParticipant,
                                    withholdTax: 'no'
                                  });
                                }
                              }}
                              disabled={isViewMode}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">No - Do not withhold taxes</span>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Select whether to withhold federal taxes from participant payments
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm mb-1 text-gray-700">
                          Tax Withholding Notes
                        </label>
                        <textarea
                          onChange={() => { }}
                          readOnly={isViewMode}
                          disabled={isViewMode}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          rows={2}
                          placeholder="Additional tax information or special circumstances"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      onChange={() => { }}
                      readOnly={isViewMode}
                      disabled={isViewMode}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      rows={4}
                      placeholder="Any additional information about this participant..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClosePanel}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {isViewMode ? 'Close' : 'Cancel'}
                    </button>
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={handleSaveParticipant}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        {isEditMode ? 'Update Participant' : 'Register Participant'}
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Studies Tab Content */}
              {activeTab === 'studies' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium">Study Enrollment</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage studies this participant is enrolled in and assign study-specific participant IDs.
                      </p>
                    </div>
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => setShowAddStudy(!showAddStudy)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <Plus size={16} />
                        Add Study
                      </button>
                    )}
                  </div>

                  {!isViewMode && showAddStudy && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">Add Participant to Studies</h4>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddStudy(false);
                            setStudySearch('');
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Search by study code or name..."
                          value={studySearch}
                          onChange={(e) => setStudySearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Search Results */}
                      {studySearch && (
                        <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto bg-white">
                          {allStudies
                            .filter(s =>
                              !enrolledStudies.includes(s.code) &&
                              (s.code.toLowerCase().includes(studySearch.toLowerCase()) ||
                                s.name.toLowerCase().includes(studySearch.toLowerCase()))
                            )
                            .map((study) => (
                              <div
                                key={study.code}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{study.code} - {study.name}</p>
                                  <p className="text-xs text-gray-500">PI: {study.pi} | Status: {study.status}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEnrolledStudies([...enrolledStudies, study.code]);
                                    setStudySearch('');
                                    toast.success(`Enrolled in ${study.name}`);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  <Plus size={16} />
                                  Add
                                </button>
                              </div>
                            ))}
                          {allStudies.filter(s =>
                            !enrolledStudies.includes(s.code) &&
                            (s.code.toLowerCase().includes(studySearch.toLowerCase()) ||
                              s.name.toLowerCase().includes(studySearch.toLowerCase()))
                          ).length === 0 && (
                              <div className="p-4 text-center text-gray-500 text-sm">
                                No studies found
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enrolled Studies Table */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">
                        Enrolled Studies ({currentParticipant?.studyList?.length || enrolledStudies.length || 0})
                      </h4>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Filter studies..."
                          value={detailsStudySearch}
                          onChange={(e) => setDetailsStudySearch(e.target.value)}
                          className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                      </div>
                    </div>

                    {((isViewMode ? viewingParticipant?.studyList : isEditMode ? editingParticipant?.studyList : enrolledStudies) || []).length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <FlaskConical className="mx-auto text-gray-400 mb-2" size={48} />
                        <p className="text-gray-500">No studies enrolled yet</p>
                        {!isViewMode && (
                          <p className="text-sm text-gray-400 mt-1">Use the search above to enroll this participant in studies</p>
                        )}
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-300">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                  Study Code
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                  Study Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                  Study Participant ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                  Primary Location
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {((isViewMode ? viewingParticipant?.studyList : isEditMode ? editingParticipant?.studyList : enrolledStudies) || [])
                                .filter((studyCode: string) => {
                                  if (!detailsStudySearch) return true;
                                  const study = allStudies.find(s => s.code === studyCode);
                                  const searchLower = detailsStudySearch.toLowerCase();
                                  return studyCode.toLowerCase().includes(searchLower) ||
                                    study?.name.toLowerCase().includes(searchLower) ||
                                    false;
                                })
                                .map((studyCode: string) => {
                                  const study = allStudies.find(s => s.code === studyCode);
                                  return (
                                    <tr key={studyCode} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {studyCode}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {study?.name || '-'}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {studySpecificIds[studyCode] || <span className="text-gray-400 italic">Not assigned</span>}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900">
                                        {studyPrimaryLocations[studyCode] || <span className="text-gray-400 italic">Not assigned</span>}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Participant - Study Setup Section */}
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-medium text-gray-900 mb-4">Participant - Study Setup</h4>
                    {isViewMode ? (
                      <p className="text-sm text-gray-500 italic">View mode - participant-study setup cannot be edited</p>
                    ) : (
                      <div className="space-y-4">
                        {/* Select Study */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Study <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedRuleStudy}
                            onChange={(e) => {
                              setSelectedRuleStudy(e.target.value);
                              // Reset fields when study changes
                              setRuleStudyParticipantId(studySpecificIds[e.target.value] || '');
                              setRuleWaiveSSN('No');
                              setRuleWithholdTaxes('No');
                              setRuleStatus('Registered');
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Choose a study...</option>
                            {((isEditMode ? editingParticipant?.studyList : enrolledStudies) || []).map((studyCode: string) => {
                              const study = allStudies.find(s => s.code === studyCode);
                              return (
                                <option key={studyCode} value={studyCode}>
                                  {studyCode} - {study?.name || 'Unknown'}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {selectedRuleStudy && (
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

                            {/* Primary Location */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Primary Location <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={studyPrimaryLocations[selectedRuleStudy] || ''}
                                onChange={(e) => {
                                  setStudyPrimaryLocations({
                                    ...studyPrimaryLocations,
                                    [selectedRuleStudy]: e.target.value
                                  });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select location...</option>
                                <option>Main Research Center - Building A</option>
                                <option>Outpatient Clinic - West Campus</option>
                                <option>Home Visit - Johnson County Area</option>
                                <option>Virtual/Remote Participation</option>
                                <option>Westwood</option>
                                <option>Corp</option>
                                <option>Remote</option>
                              </select>
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
                                Study Enrollment Status
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
                                  if (!studyPrimaryLocations[selectedRuleStudy]) {
                                    toast.error('Primary Location is required');
                                    return;
                                  }
                                  // Save the study participant ID
                                  setStudySpecificIds({
                                    ...studySpecificIds,
                                    [selectedRuleStudy]: ruleStudyParticipantId
                                  });
                                  toast.success('Participant-study setup saved successfully');
                                  // Reset form
                                  setSelectedRuleStudy('');
                                  setRuleStudyParticipantId('');
                                  setRuleWaiveSSN('No');
                                  setRuleWithholdTaxes('No');
                                  setRuleStatus('Registered');
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

              {/* History Section */}
              {(isViewMode || isEditMode) && activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-lg border-b pb-2">Audit History</h3>

                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-900">Payment method updated to <span className="font-medium">Direct Deposit</span></p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                      <p className="text-xs text-gray-600">By Admin User on Jan 4, 2026 at 11:30 AM</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-900">Visit #{(isViewMode ? viewingParticipant : editingParticipant)?.visits} completed</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                      <p className="text-xs text-gray-600">By Study Coordinator on Jan 2, 2026 at 3:15 PM</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-500">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-900">Contact information updated</p>
                        <p className="text-xs text-gray-500">1 week ago</p>
                      </div>
                      <p className="text-xs text-gray-600">By {(isViewMode ? viewingParticipant : editingParticipant)?.name} on Dec 29, 2025 at 9:45 AM</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-900">W-9 form submitted and approved</p>
                        <p className="text-xs text-gray-500">2 weeks ago</p>
                      </div>
                      <p className="text-xs text-gray-600">By Finance Team on Dec 22, 2025 at 2:00 PM</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-900">Status changed to <span className="font-medium">{(isViewMode ? viewingParticipant : editingParticipant)?.status}</span></p>
                        <p className="text-xs text-gray-500">3 weeks ago</p>
                      </div>
                      <p className="text-xs text-gray-600">By Study Coordinator on Dec 15, 2025 at 10:00 AM</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-900">Participant enrolled in study</p>
                        <p className="text-xs text-gray-500">{(isViewMode ? viewingParticipant : editingParticipant)?.enrollDate}</p>
                      </div>
                      <p className="text-xs text-gray-600">By Study Coordinator on {(isViewMode ? viewingParticipant : editingParticipant)?.enrollDate} at 9:00 AM</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Export Participants Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowExportModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">Export Participants</h2>
                <p className="text-sm text-gray-500">Download participant data in your preferred format</p>
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
                    <span className="text-sm">Include all participants ({participants.length} total)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Include audit history</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm">Active participants only</span>
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
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowUploadModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">Upload Multiple Participants</h2>
                <p className="text-sm text-gray-500">Upload a CSV or Excel file with participant data</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* File Upload Area */}
              <div
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setUploadedFile(e.dataTransfer.files[0]);
                  }
                }}
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
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setUploadedFile(e.target.files[0]);
                              }
                            }}
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
                    First Name
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Last Name
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

      {/* Archive Confirmation Modal */}
      {deletingParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setDeletingParticipant(null)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl mb-4">Archive Participant</h2>
              <p className="text-gray-600 mb-2">
                Are you sure you want to archive this participant? The participant will be moved to the archive and can be restored later.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="mb-1"><span className="text-gray-600">Name:</span> {deletingParticipant.name}</p>
                <p className="mb-1"><span className="text-gray-600">ID:</span> {deletingParticipant.participantId}</p>
                <p><span className="text-gray-600">Study:</span> {deletingParticipant.study}</p>
              </div>
              <p className="text-sm text-red-600 mb-6">
                This action cannot be undone. All visit records and payment history for this participant will also be removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingParticipant(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle archive logic here
                    setDeletingParticipant(null);
                    toast.success('Participant archived successfully!');
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Verification Modal */}
      {showAddressVerification && (
        <AddressVerificationModal
          currentAddress={addressFields}
          onClose={() => setShowAddressVerification(false)}
          onConfirm={(address, useVerified) => {
            setAddressFields(address);
            setShowAddressVerification(false);
            if (useVerified) {
              toast.success('Address verified and updated successfully!');
            } else {
              toast.info('Keeping current address');
            }
          }}
        />
      )}

      {/* Participant Verification Modal */}
      {showParticipantVerification && currentParticipant && (
        <ParticipantVerificationModal
          participant={{
            firstName: currentParticipant.firstName || '',
            lastName: currentParticipant.lastName || '',
            ssn: currentParticipant.ssn || ''
          }}
          onClose={() => setShowParticipantVerification(false)}
          onVerified={(verifiedData) => {
            // Update participant data with verified information
            if (editingParticipant) {
              setEditingParticipant({
                ...editingParticipant,
                firstName: verifiedData.firstName,
                lastName: verifiedData.lastName,
                ssn: verifiedData.ssn,
                name: `${verifiedData.firstName} ${verifiedData.lastName}`
              });
            }
            // Keep modal open - user must manually close it
          }}
        />
      )}
    </div>
  );
}