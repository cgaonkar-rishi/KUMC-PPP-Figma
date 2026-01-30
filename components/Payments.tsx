import { useState } from 'react';
import { Search, Plus, Filter, DollarSign, X, Edit, Eye, ChevronDown, ChevronUp, FileSpreadsheet, Zap, History, UserCheck, Clock, CheckCircle2, XCircle, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentsPanel } from './PaymentsPanel';

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRequestType, setFilterRequestType] = useState('all');
  const [filterReimbursementType, setFilterReimbursementType] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showKPIs, setShowKPIs] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [viewingPayment, setViewingPayment] = useState<any>(null);
  const [reviewingPayment, setReviewingPayment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [activeQueue, setActiveQueue] = useState<'unassigned' | 'myQueue' | 'teamQueue' | 'needsReview' | 'approved' | 'myRequests'>('myRequests');
  const [claimingPayment, setClaimingPayment] = useState<any>(null);
  const [assigningPayment, setAssigningPayment] = useState<any>(null);
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
  const [showAutoApproveModal, setShowAutoApproveModal] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<any>(null);

  // Current logged-in user
  const currentUser = 'Dr. Sarah Chen';

  const reimbursements = [
    { id: 1, requestId: 'REQ-2026-001', participantId: 'P-2026-001', participantName: 'John Smith', study: 'CHS-2026-001', requestType: 'Reimbursement', amount: 125.00, type: 'Travel', date: '2026-01-03', status: 'New', description: 'Mileage reimbursement - 50 miles', receipt: true, requester: 'Dr. Sarah Chen', approver: null, priority: 'high', daysOld: 0 },
    { id: 2, requestId: 'REQ-2026-002', participantId: 'P-2025-156', participantName: 'Sarah Johnson', study: 'NDR-2025-042', requestType: 'Reimbursement', amount: 75.00, type: 'Parking', date: '2026-01-02', status: 'Approved', description: 'Parking fee at medical center', receipt: true, requester: 'Dr. Sarah Chen', approver: 'Patrick Cruz', priority: 'normal', daysOld: 1 },
    { id: 3, requestId: 'REQ-2026-003', participantId: 'P-2026-045', participantName: 'Michael Brown', study: 'DPT-2025-019', requestType: 'Payment', amount: 50.00, type: '', date: '2026-01-04', status: 'Pending Approval', description: 'Visit completion stipend', receipt: false, requester: 'Dr. Sarah Chen', approver: 'Dr. Sarah Chen', priority: 'normal', daysOld: 0 },
    { id: 4, requestId: 'REQ-2026-004', participantId: 'P-2026-089', participantName: 'Emily Davis', study: 'PNS-2026-008', requestType: 'Reimbursement', amount: 100.00, type: 'Travel', date: '2026-01-05', status: 'New', description: 'Public transportation costs', receipt: true, requester: 'Dr. Sarah Chen', approver: null, priority: 'normal', daysOld: 0 },
    { id: 5, requestId: 'REQ-2025-005', participantId: 'P-2025-234', participantName: 'Robert Wilson', study: 'CIS-2025-055', requestType: 'Payment', amount: 200.00, type: '', date: '2025-12-28', status: 'Payment Complete', description: 'Monthly participation stipend', receipt: false, requester: 'Dr. Sarah Chen', approver: 'Kimmy Clifton', priority: 'normal', daysOld: 30 },
    { id: 6, requestId: 'REQ-2026-006', participantId: 'P-2025-178', participantName: 'Linda Martinez', study: 'DPT-2025-019', requestType: 'Reimbursement', amount: 35.00, type: 'Meal', date: '2026-01-03', status: 'Approved', description: 'Meal allowance during extended visit', receipt: true, requester: 'Dr. Sarah Chen', approver: 'Tashanna Sawyer', priority: 'low', daysOld: 0 },
    { id: 7, requestId: 'REQ-2026-007', participantId: 'P-2026-012', participantName: 'Jennifer Taylor', study: 'CHS-2026-001', requestType: 'Reimbursement', amount: 150.00, type: 'Travel', date: '2026-01-04', status: 'Rejected', description: 'Taxi service to clinic', receipt: false, requester: 'Dr. Sarah Chen', approver: 'Douglas Ross', priority: 'normal', daysOld: 0 },
    { id: 8, requestId: 'REQ-2025-008', participantId: 'P-2025-298', participantName: 'David Anderson', study: 'ATE-2025-031', requestType: 'Payment', amount: 300.00, type: '', date: '2025-12-30', status: 'Payment Complete', description: 'Final study completion payment', receipt: false, requester: 'Dr. Sarah Chen', approver: 'Jennifer Staley', priority: 'normal', daysOld: 28 },
    { id: 9, requestId: 'REQ-2026-009', participantId: 'P-2026-078', participantName: 'Patricia Moore', study: 'CHS-2026-001', requestType: 'Payment', amount: 125.00, type: '', date: '2026-01-03', status: 'On Hold', description: 'Awaiting additional documentation', receipt: false, requester: 'Dr. Sarah Chen', approver: 'Ted Noravong', priority: 'high', daysOld: 0 },
    { id: 10, requestId: 'REQ-2026-010', participantId: 'P-2026-099', participantName: 'James Wilson', study: 'CHS-2026-001', requestType: 'Reimbursement', amount: 85.00, type: 'Travel', date: '2026-01-02', status: 'New', description: 'Bus fare for clinic visits', receipt: true, requester: 'Megan Hummelgaard', approver: null, priority: 'normal', daysOld: 1 },
  ];

  // Queue filtering logic
  const getQueueRequests = () => {
    switch (activeQueue) {
      case 'unassigned':
        return reimbursements.filter(r => r.status === 'New' && r.approver === null);
      case 'myQueue':
        return reimbursements.filter(r => r.status === 'Pending Approval' && r.approver === currentUser);
      case 'teamQueue':
        return reimbursements.filter(r => r.status === 'Pending Approval');
      case 'needsReview':
        return reimbursements.filter(r => r.status === 'Rejected' || r.status === 'On Hold');
      case 'approved':
        return reimbursements.filter(r => r.status === 'Approved');
      case 'myRequests':
        return reimbursements.filter(r => r.requester === currentUser);
      default:
        return reimbursements;
    }
  };

  const queueRequests = getQueueRequests();

  const filteredReimbursements = queueRequests.filter(reimbursement => {
    const matchesSearch = reimbursement.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reimbursement.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reimbursement.study.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reimbursement.requestId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRequestType = filterRequestType === 'all' || reimbursement.requestType === filterRequestType;
    const matchesReimbursementType = filterReimbursementType === 'all' || reimbursement.type === filterReimbursementType;

    // Date range filtering based on Request Date
    const requestDate = new Date(reimbursement.date);
    const matchesDateFrom = !filterDateFrom || requestDate >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || requestDate <= new Date(filterDateTo);

    return matchesSearch && matchesRequestType && matchesReimbursementType && matchesDateFrom && matchesDateTo;
  });

  // Queue counts
  const unassignedCount = reimbursements.filter(r => r.status === 'New' && r.approver === null).length;
  const myQueueCount = reimbursements.filter(r => r.status === 'Pending Approval' && r.approver === currentUser).length;
  const teamQueueCount = reimbursements.filter(r => r.status === 'Pending Approval').length;
  const needsReviewCount = reimbursements.filter(r => r.status === 'Rejected' || r.status === 'On Hold').length;
  const approvedCount = reimbursements.filter(r => r.status === 'Approved').length;

  const handleClosePanel = () => {
    setShowAddModal(false);
    setEditingPayment(null);
    setViewingPayment(null);
    setReviewingPayment(null);
    setActiveTab('details');
  };

  const handleClaimRequest = (payment: any) => {
    toast.success('Request claimed successfully', {
      description: `${payment.requestId} assigned to you`
    });
    setClaimingPayment(null);
  };

  const handleAssignRequest = (payment: any, assignee: string) => {
    toast.success('Request assigned successfully', {
      description: `${payment.requestId} assigned to ${assignee}`
    });
    setAssigningPayment(null);
  };

  // Bulk actions handlers
  const handleSelectAll = () => {
    if (selectedRequests.length === filteredReimbursements.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredReimbursements.map(r => r.id));
    }
  };

  const handleSelectRequest = (id: number) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter(reqId => reqId !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };

  const handleBulkClaim = () => {
    const count = selectedRequests.length;
    toast.success(`${count} request(s) claimed successfully`, {
      description: `Assigned to ${currentUser}`
    });
    setSelectedRequests([]);
    setShowBulkAssignModal(false);
  };

  const handleBulkAssign = (assignee: string) => {
    const count = selectedRequests.length;
    toast.success(`${count} request(s) assigned successfully`, {
      description: `Assigned to ${assignee}`
    });
    setSelectedRequests([]);
    setShowBulkAssignModal(false);
  };

  const handleBulkApprove = () => {
    const count = selectedRequests.length;
    const totalAmount = filteredReimbursements
      .filter(r => selectedRequests.includes(r.id))
      .reduce((sum, r) => sum + r.amount, 0);
    toast.success(`${count} request(s) approved successfully!`, {
      description: `Total amount: $${totalAmount.toFixed(2)}`
    });
    setSelectedRequests([]);
    setShowBulkApproveModal(false);
  };

  const handleAutoApprove = () => {
    const count = selectedRequests.length;
    const totalAmount = filteredReimbursements
      .filter(r => selectedRequests.includes(r.id))
      .reduce((sum, r) => sum + r.amount, 0);
    toast.success(`${count} request(s) auto-approved successfully!`, {
      description: `Total amount: $${totalAmount.toFixed(2)} - Moved to Approved queue`
    });
    setSelectedRequests([]);
    setShowAutoApproveModal(false);
  };


  const exportToExcel = () => {
    // Implement export to Excel logic here
    toast.success('Payments exported to Excel successfully');
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Action Buttons */}
      <div className="bg-white border-l-4 border-ku-blue rounded-lg shadow-sm p-5 flex items-center justify-between">
        {/* Left Side - Icon and Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
            <DollarSign className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl text-gray-800 font-semibold">Payment Request Queue</h2>
            <p className="text-gray-600 text-sm">Review and approve participant payment requests</p>
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
            onClick={exportToExcel}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition-all"
            title="Export Payments to Excel"
          >
            <FileSpreadsheet size={20} />
          </button>
          {/* Create Payment Request button removed - use sidebar navigation */}
        </div>
      </div>

      {/* Collapsible Statistics */}
      {showKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Unassigned</p>
              <Clock className="text-orange-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{unassignedCount}</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting assignment</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">My Queue</p>
              <UserCheck className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{myQueueCount}</p>
            <p className="text-sm text-gray-500 mt-1">Assigned to me</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Team Queue</p>
              <Users className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{teamQueueCount}</p>
            <p className="text-sm text-gray-500 mt-1">In review</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Needs Review</p>
              <AlertCircle className="text-red-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{needsReviewCount}</p>
            <p className="text-sm text-gray-500 mt-1">Rejected / On Hold</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Approved</p>
              <CheckCircle2 className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{approvedCount}</p>
            <p className="text-sm text-gray-500 mt-1">Ready for payment</p>
          </div>
        </div>
      )}

      {/* Queue Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {/* My Requests Tab - First with distinct styling */}
            <button
              onClick={() => setActiveQueue('myRequests')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${activeQueue === 'myRequests'
                  ? 'border-ku-blue text-ku-blue bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
            >
              <Edit size={18} />
              My Requests
            </button>

            {/* Divider */}
            <div className="w-px bg-gray-300 my-3"></div>

            <button
              onClick={() => setActiveQueue('unassigned')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${activeQueue === 'unassigned'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
            >
              <Clock size={18} />
              Unassigned Queue
              {unassignedCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full font-semibold">
                  {unassignedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveQueue('myQueue')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${activeQueue === 'myQueue'
                  ? 'border-ku-blue text-ku-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
            >
              <UserCheck size={18} />
              My Review Queue
              {myQueueCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                  {myQueueCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveQueue('teamQueue')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${activeQueue === 'teamQueue'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
            >
              <Users size={18} />
              Team Queue
              {teamQueueCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full font-semibold">
                  {teamQueueCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveQueue('needsReview')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${activeQueue === 'needsReview'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
            >
              <AlertCircle size={18} />
              Needs Review
              {needsReviewCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full font-semibold">
                  {needsReviewCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveQueue('approved')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${activeQueue === 'approved'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
            >
              <CheckCircle2 size={18} />
              Approved
              {approvedCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full font-semibold">
                  {approvedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by participant, ID, request ID, or study..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterRequestType}
                onChange={(e) => setFilterRequestType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Payment">Payment</option>
                <option value="Reimbursement">Reimbursement</option>
              </select>

              <select
                value={filterReimbursementType}
                onChange={(e) => setFilterReimbursementType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reimbursement Types</option>
                <option value="Travel">Travel</option>
                <option value="Parking">Parking</option>
                <option value="Meal">Meal</option>
              </select>

              <div className="flex items-center gap-2">
                <label htmlFor="dateFrom" className="text-sm text-gray-700 whitespace-nowrap">From:</label>
                <input
                  id="dateFrom"
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="dateTo" className="text-sm text-gray-700 whitespace-nowrap">To:</label>
                <input
                  id="dateTo"
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedRequests.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                {selectedRequests.length} request(s) selected
              </span>
              <button
                onClick={() => setSelectedRequests([])}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              {activeQueue === 'unassigned' && (
                <>
                  <button
                    onClick={handleBulkClaim}
                    className="flex items-center gap-2 px-4 py-2 bg-ku-blue text-white rounded-lg hover:bg-ku-blue-dark font-medium"
                  >
                    <UserCheck size={16} />
                    Bulk Claim
                  </button>
                  <button
                    onClick={() => setShowBulkAssignModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                  >
                    <Users size={16} />
                    Bulk Assign
                  </button>
                  <button
                    onClick={() => setShowAutoApproveModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    <Zap size={16} />
                    Auto Approve
                  </button>
                </>
              )}
              {activeQueue === 'myQueue' && (
                <button
                  onClick={() => setShowBulkApproveModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  <CheckCircle2 size={16} />
                  Bulk Approve
                </button>
              )}
            </div>
          </div>
        )}

        {/* Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {(activeQueue === 'unassigned' || activeQueue === 'myQueue') && (
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRequests.length === filteredReimbursements.length && filteredReimbursements.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-gray-600">Priority</th>
                <th className="px-6 py-3 text-left text-gray-600">Request ID</th>
                <th className="px-6 py-3 text-left text-gray-600">Participant</th>
                <th className="px-6 py-3 text-left text-gray-600">Requester</th>
                <th className="px-6 py-3 text-left text-gray-600">Type</th>
                <th className="px-6 py-3 text-left text-gray-600">Study</th>
                <th className="px-6 py-3 text-left text-gray-600">Amount</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Age</th>
                {activeQueue !== 'unassigned' && (
                  <th className="px-6 py-3 text-left text-gray-600">Approver</th>
                )}
                <th className="px-6 py-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReimbursements.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  {(activeQueue === 'unassigned' || activeQueue === 'myQueue') && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${request.priority === 'high' ? 'bg-red-100 text-red-800' :
                        request.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {request.priority === 'high' ? '🔴' : request.priority === 'normal' ? '🔵' : '⚪'} {request.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{request.requestId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium">{request.participantName}</p>
                      <p className="text-xs text-gray-500">{request.participantId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{request.requester}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${request.requestType === 'Payment' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                      {request.requestType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{request.study}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${request.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'New' ? 'bg-gray-100 text-gray-800' :
                        request.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'Payment Complete' ? 'bg-blue-100 text-blue-800' :
                              request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-orange-100 text-orange-800'
                      }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${request.daysOld > 3 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                      {request.daysOld === 0 ? 'Today' : request.daysOld === 1 ? '1 day' : `${request.daysOld} days`}
                    </span>
                  </td>
                  {activeQueue !== 'unassigned' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.approver || <span className="text-gray-400">Not Assigned</span>}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {/* Unassigned Queue Actions */}
                      {activeQueue === 'unassigned' && (
                        <>
                          <button
                            onClick={() => setClaimingPayment(request)}
                            className="px-3 py-1.5 bg-ku-blue text-white text-xs rounded hover:bg-ku-blue-dark font-medium"
                            title="Claim this request"
                          >
                            Claim
                          </button>
                          <button
                            onClick={() => setAssigningPayment(request)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 font-medium"
                            title="Assign to colleague"
                          >
                            Assign
                          </button>
                        </>
                      )}

                      {/* My Queue Actions */}
                      {activeQueue === 'myQueue' && (
                        <button
                          onClick={() => setReviewingPayment(request)}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 font-medium"
                          title="Review & Approve/Reject"
                        >
                          Review
                        </button>
                      )}

                      {/* My Requests Actions - Edit only if status is New */}
                      {activeQueue === 'myRequests' && request.status === 'New' && (
                        <button
                          onClick={() => setEditingPayment(request)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium"
                          title="Edit Request"
                        >
                          <Edit size={14} className="inline mr-1" />
                          Edit
                        </button>
                      )}

                      {/* Common Actions */}
                      <button
                        onClick={() => setViewingPayment(request)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setViewingHistory(request)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                        title="Workflow History"
                      >
                        <History size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReimbursements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No requests in this queue</p>
            <p className="text-sm mt-1">Check other queues or adjust your filters</p>
          </div>
        )}

        {filteredReimbursements.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-gray-600">Showing {filteredReimbursements.length} of {queueRequests.length} requests</p>
          </div>
        )}
      </div>

      {/* Create Payment Request Modal */}
      {showAddModal && (
        <PaymentsPanel
          isViewMode={false}
          isEditMode={false}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={handleClosePanel}
        />
      )}

      {/* View Payment Details Modal */}
      {viewingPayment && (
        <PaymentsPanel
          isViewMode={true}
          isEditMode={false}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={handleClosePanel}
          viewingPayment={viewingPayment}
        />
      )}

      {/* Edit Payment Request Modal */}
      {editingPayment && (
        <PaymentsPanel
          isViewMode={false}
          isEditMode={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={handleClosePanel}
          editingPayment={editingPayment}
        />
      )}

      {/* Claim Request Modal */}
      {claimingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setClaimingPayment(null)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="text-ku-blue" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Claim Request</h2>
                  <p className="text-sm text-gray-600">Assign this request to yourself</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="mb-2"><span className="text-gray-600 text-sm">Request ID:</span> <span className="font-medium">{claimingPayment.requestId}</span></p>
                <p className="mb-2"><span className="text-gray-600 text-sm">Participant:</span> <span className="font-medium">{claimingPayment.participantName}</span></p>
                <p className="mb-2"><span className="text-gray-600 text-sm">Amount:</span> <span className="font-medium">${claimingPayment.amount.toFixed(2)}</span></p>
                <p><span className="text-gray-600 text-sm">Type:</span> <span className="font-medium">{claimingPayment.requestType}</span></p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  ℹ️ This request will be moved to your review queue and you will be responsible for approving or rejecting it.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setClaimingPayment(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleClaimRequest(claimingPayment)}
                  className="flex-1 px-6 py-3 bg-ku-blue text-white rounded-lg hover:bg-ku-blue-dark font-medium"
                >
                  Claim Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Request Modal */}
      {assigningPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setAssigningPayment(null)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Assign Request</h2>
                  <p className="text-sm text-gray-600">Assign this request to a colleague</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="mb-2"><span className="text-gray-600 text-sm">Request ID:</span> <span className="font-medium">{assigningPayment.requestId}</span></p>
                <p className="mb-2"><span className="text-gray-600 text-sm">Participant:</span> <span className="font-medium">{assigningPayment.participantName}</span></p>
                <p className="mb-2"><span className="text-gray-600 text-sm">Amount:</span> <span className="font-medium">${assigningPayment.amount.toFixed(2)}</span></p>
                <p><span className="text-gray-600 text-sm">Type:</span> <span className="font-medium">{assigningPayment.requestType}</span></p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign to:</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select approver...</option>
                  <option value="Patrick Cruz">Patrick Cruz</option>
                  <option value="Kimmy Clifton">Kimmy Clifton</option>
                  <option value="Tashanna Sawyer">Tashanna Sawyer</option>
                  <option value="Douglas Ross">Douglas Ross</option>
                  <option value="Jennifer Staley">Jennifer Staley</option>
                  <option value="Ted Noravong">Ted Noravong</option>
                  <option value="Megan Hummelgaard">Megan Hummelgaard</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setAssigningPayment(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAssignRequest(assigningPayment, 'Dr. Michael Torres')}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Request Modal */}
      {reviewingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setReviewingPayment(null)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Review Payment Request ({reviewingPayment.participantName})</h2>
                <p className="text-sm text-gray-600">{reviewingPayment.requestId}</p>
              </div>
              <button onClick={() => setReviewingPayment(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Request Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Request Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Participant</p>
                    <p className="font-medium">{reviewingPayment.participantName}</p>
                    <p className="text-xs text-gray-500">{reviewingPayment.participantId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Study</p>
                    <p className="font-medium">{reviewingPayment.study}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Request Type</p>
                    <p className="font-medium">{reviewingPayment.requestType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-medium text-lg">${reviewingPayment.amount.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Description</p>
                    <p className="font-medium">{reviewingPayment.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Requester</p>
                    <p className="font-medium">{reviewingPayment.requester}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date Submitted</p>
                    <p className="font-medium">{reviewingPayment.date}</p>
                  </div>
                </div>
              </div>

              {/* Review Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes / Reason {reviewingPayment.status === 'Pending Approval' && '*'}
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter your review notes or reason for approval/rejection..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">These notes will be visible to the requester and audit trail</p>
              </div>

              {/* Decision Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setReviewingPayment(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.error('Request rejected', {
                      description: `${reviewingPayment.requestId} has been rejected`
                    });
                    setReviewingPayment(null);
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  Reject
                </button>
                <button
                  onClick={() => {
                    toast.success('Request approved successfully!', {
                      description: `${reviewingPayment.requestId} for $${reviewingPayment.amount.toFixed(2)}`
                    });
                    setReviewingPayment(null);
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Assign Modal */}
      {showBulkAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowBulkAssignModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Bulk Assign Requests</h2>
                  <p className="text-sm text-gray-600">Assign {selectedRequests.length} request(s) to a colleague</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Requests:</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {filteredReimbursements
                    .filter(r => selectedRequests.includes(r.id))
                    .map(r => (
                      <div key={r.id} className="text-sm text-gray-600 flex justify-between">
                        <span>{r.requestId}</span>
                        <span className="font-medium">${r.amount.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>
                    ${filteredReimbursements
                      .filter(r => selectedRequests.includes(r.id))
                      .reduce((sum, r) => sum + r.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign to:</label>
                <select
                  id="bulkAssignee"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select approver...</option>
                  <option value="Patrick Cruz">Patrick Cruz</option>
                  <option value="Kimmy Clifton">Kimmy Clifton</option>
                  <option value="Tashanna Sawyer">Tashanna Sawyer</option>
                  <option value="Douglas Ross">Douglas Ross</option>
                  <option value="Jennifer Staley">Jennifer Staley</option>
                  <option value="Ted Noravong">Ted Noravong</option>
                  <option value="Megan Hummelgaard">Megan Hummelgaard</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkAssignModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const assignee = (document.getElementById('bulkAssignee') as HTMLSelectElement)?.value;
                    if (assignee) {
                      handleBulkAssign(assignee);
                    } else {
                      toast.error('Please select an approver');
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Assign All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Approve Modal */}
      {showBulkApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowBulkApproveModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Bulk Approve Requests</h2>
                  <p className="text-sm text-gray-600">Approve {selectedRequests.length} request(s)</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Requests:</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {filteredReimbursements
                    .filter(r => selectedRequests.includes(r.id))
                    .map(r => (
                      <div key={r.id} className="text-sm text-gray-600 flex justify-between">
                        <span>{r.requestId} - {r.participantName}</span>
                        <span className="font-medium">${r.amount.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-green-600 text-lg">
                    ${filteredReimbursements
                      .filter(r => selectedRequests.includes(r.id))
                      .reduce((sum, r) => sum + r.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ This will approve all {selectedRequests.length} selected request(s). This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkApproveModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkApprove}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Approve All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto Approve Modal */}
      {showAutoApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAutoApproveModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Auto Approve Requests</h2>
                  <p className="text-sm text-gray-600">Automatically approve {selectedRequests.length} request(s)</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Requests:</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {filteredReimbursements
                    .filter(r => selectedRequests.includes(r.id))
                    .map(r => (
                      <div key={r.id} className="text-sm text-gray-600 flex justify-between">
                        <span>{r.requestId} - {r.participantName}</span>
                        <span className="font-medium">${r.amount.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-green-600 text-lg">
                    ${filteredReimbursements
                      .filter(r => selectedRequests.includes(r.id))
                      .reduce((sum, r) => sum + r.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 mb-2">
                  ℹ️ <strong>Auto Approval Details:</strong>
                </p>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>• All requests will be moved to the <strong>Approved</strong> queue</li>
                  <li>• Approval reason will be: <strong>"Auto approved by {currentUser}"</strong></li>
                  <li>• This action bypasses the standard review process</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ This will auto-approve all {selectedRequests.length} selected request(s) without manual review. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAutoApproveModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAutoApprove}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                >
                  <Zap size={18} />
                  Auto Approve All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow History Modal */}
      {viewingHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setViewingHistory(null)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <History className="text-purple-600" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Workflow History ({viewingHistory.requestId})</h2>
                  <p className="text-sm text-gray-600">{viewingHistory.participantName} - {viewingHistory.study}</p>
                </div>
              </div>
              <button onClick={() => setViewingHistory(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Request Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Request Type</p>
                    <p className="font-medium">{viewingHistory.requestType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Amount</p>
                    <p className="font-medium text-lg">${viewingHistory.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Current Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${viewingHistory.status === 'New' ? 'bg-gray-100 text-gray-800' :
                        viewingHistory.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                          viewingHistory.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            viewingHistory.status === 'Payment Complete' ? 'bg-blue-100 text-blue-800' :
                              viewingHistory.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-orange-100 text-orange-800'
                      }`}>
                      {viewingHistory.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Priority</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${viewingHistory.priority === 'high' ? 'bg-red-100 text-red-800' :
                        viewingHistory.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {viewingHistory.priority === 'high' ? '🔴' : viewingHistory.priority === 'normal' ? '🔵' : '⚪'} {viewingHistory.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-4">Workflow Timeline</h3>

                {/* Timeline Items */}
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-gray-200"></div>

                  {/* Timeline Events */}
                  <div className="space-y-6">
                    {/* Request Created */}
                    <div className="relative flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center z-10">
                        <Plus className="text-blue-600" size={18} />
                      </div>
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">Request Created</p>
                            <p className="text-sm text-gray-600">by {viewingHistory.requester}</p>
                          </div>
                          <span className="text-xs text-gray-500">{viewingHistory.date} 09:15 AM</span>
                        </div>
                        <p className="text-sm text-gray-600">Payment request submitted for approval</p>
                      </div>
                    </div>

                    {/* Assigned/Claimed (if applicable) */}
                    {viewingHistory.approver && (
                      <div className="relative flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center z-10">
                          <UserCheck className="text-purple-600" size={18} />
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">Request Assigned</p>
                              <p className="text-sm text-gray-600">to {viewingHistory.approver}</p>
                            </div>
                            <span className="text-xs text-gray-500">{viewingHistory.date} 10:32 AM</span>
                          </div>
                          <p className="text-sm text-gray-600">Request assigned for review and approval</p>
                        </div>
                      </div>
                    )}

                    {/* Status Changes */}
                    {viewingHistory.status === 'Pending Approval' && (
                      <div className="relative flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center z-10">
                          <Clock className="text-yellow-600" size={18} />
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">Status Changed to Pending Approval</p>
                              <p className="text-sm text-gray-600">by System</p>
                            </div>
                            <span className="text-xs text-gray-500">{viewingHistory.date} 10:33 AM</span>
                          </div>
                          <p className="text-sm text-gray-600">Awaiting approver review</p>
                        </div>
                      </div>
                    )}

                    {viewingHistory.status === 'Approved' && (
                      <div className="relative flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center z-10">
                          <CheckCircle2 className="text-green-600" size={18} />
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">Request Approved</p>
                              <p className="text-sm text-gray-600">by {viewingHistory.approver}</p>
                            </div>
                            <span className="text-xs text-gray-500">{viewingHistory.date} 02:18 PM</span>
                          </div>
                          <p className="text-sm text-gray-600">Request approved for payment processing</p>
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                            <span className="font-medium">Note:</span> All documentation verified and complete
                          </div>
                        </div>
                      </div>
                    )}

                    {viewingHistory.status === 'Rejected' && (
                      <div className="relative flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center z-10">
                          <XCircle className="text-red-600" size={18} />
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">Request Rejected</p>
                              <p className="text-sm text-gray-600">by {viewingHistory.approver}</p>
                            </div>
                            <span className="text-xs text-gray-500">{viewingHistory.date} 03:45 PM</span>
                          </div>
                          <p className="text-sm text-gray-600">Request rejected and returned</p>
                          <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                            <span className="font-medium">Reason:</span> Missing required receipt documentation
                          </div>
                        </div>
                      </div>
                    )}

                    {viewingHistory.status === 'On Hold' && (
                      <div className="relative flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center z-10">
                          <AlertCircle className="text-orange-600" size={18} />
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">Request Placed On Hold</p>
                              <p className="text-sm text-gray-600">by {viewingHistory.approver}</p>
                            </div>
                            <span className="text-xs text-gray-500">{viewingHistory.date} 11:20 AM</span>
                          </div>
                          <p className="text-sm text-gray-600">Request on hold pending additional information</p>
                          <div className="mt-2 p-2 bg-orange-50 rounded text-xs text-orange-700">
                            <span className="font-medium">Note:</span> {viewingHistory.description}
                          </div>
                        </div>
                      </div>
                    )}

                    {viewingHistory.status === 'Payment Complete' && (
                      <>
                        <div className="relative flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center z-10">
                            <CheckCircle2 className="text-green-600" size={18} />
                          </div>
                          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900">Request Approved</p>
                                <p className="text-sm text-gray-600">by {viewingHistory.approver}</p>
                              </div>
                              <span className="text-xs text-gray-500">{viewingHistory.date} 01:15 PM</span>
                            </div>
                            <p className="text-sm text-gray-600">Request approved for payment processing</p>
                          </div>
                        </div>
                        <div className="relative flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center z-10">
                            <DollarSign className="text-blue-600" size={18} />
                          </div>
                          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900">Payment Processed</p>
                                <p className="text-sm text-gray-600">by Finance Department</p>
                              </div>
                              <span className="text-xs text-gray-500">{viewingHistory.date} 04:30 PM</span>
                            </div>
                            <p className="text-sm text-gray-600">Payment of ${viewingHistory.amount.toFixed(2)} processed successfully</p>
                            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                              <span className="font-medium">Transaction ID:</span> TXN-{viewingHistory.id}-2026
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setViewingHistory(null)}
                className="w-full px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}