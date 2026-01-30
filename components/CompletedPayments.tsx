import { useState } from 'react';
import { Search, Filter, DollarSign, ChevronDown, ChevronUp, FileSpreadsheet, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';

export function CompletedPayments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [filterPaymentType, setFilterPaymentType] = useState('all');
  const [showKPIs, setShowKPIs] = useState(false);

  // Sample completed payments data
  const completedPayments = [
    {
      id: 1,
      paymentId: 'PAY-2026-001',
      requestId: 'REQ-2026-002',
      participantId: 'P-2025-156',
      participantName: 'Sarah Johnson',
      study: 'NDR-2025-042',
      disbursementCurrency: 'USD',
      amountInDisbursementCurrency: 75.00,
      transactionDate: '2026-01-15',
      transactionType: 'Reimbursement',
      transactionSubType: 'Parking',
      paymentType: 'Direct Deposit',
      paymentSubtype: 'ACH',
      milestone: 'Visit 1',
      paymentMethod: 'Bank Transfer',
      approver: 'Patrick Cruz',
      approveDate: '2026-01-10',
      approvalNotes: 'All documentation verified and complete'
    },
    {
      id: 2,
      paymentId: 'PAY-2026-002',
      requestId: 'REQ-2026-006',
      participantId: 'P-2025-178',
      participantName: 'Linda Martinez',
      study: 'DPT-2025-019',
      disbursementCurrency: 'USD',
      amountInDisbursementCurrency: 35.00,
      transactionDate: '2026-01-14',
      transactionType: 'Reimbursement',
      transactionSubType: 'Meal',
      paymentType: 'Check',
      paymentSubtype: 'Paper Check',
      milestone: 'Visit 2',
      paymentMethod: 'Mail Check',
      approver: 'Tashanna Sawyer',
      approveDate: '2026-01-08',
      approvalNotes: 'Meal receipts reviewed and approved'
    },
    {
      id: 3,
      paymentId: 'PAY-2025-045',
      requestId: 'REQ-2025-005',
      participantId: 'P-2025-234',
      participantName: 'Robert Wilson',
      study: 'CIS-2025-055',
      disbursementCurrency: 'USD',
      amountInDisbursementCurrency: 200.00,
      transactionDate: '2026-01-05',
      transactionType: 'Payment',
      transactionSubType: 'Stipend',
      paymentType: 'Direct Deposit',
      paymentSubtype: 'ACH',
      milestone: 'Monthly Participation',
      paymentMethod: 'Bank Transfer',
      approver: 'Kimmy Clifton',
      approveDate: '2025-12-30',
      approvalNotes: 'Monthly participation payment approved'
    },
    {
      id: 4,
      paymentId: 'PAY-2025-046',
      requestId: 'REQ-2025-008',
      participantId: 'P-2025-298',
      participantName: 'David Anderson',
      study: 'ATE-2025-031',
      disbursementCurrency: 'USD',
      amountInDisbursementCurrency: 300.00,
      transactionDate: '2026-01-08',
      transactionType: 'Payment',
      transactionSubType: 'Completion Bonus',
      paymentType: 'Direct Deposit',
      paymentSubtype: 'ACH',
      milestone: 'Study Completion',
      paymentMethod: 'Bank Transfer',
      approver: 'Jennifer Staley',
      approveDate: '2026-01-02',
      approvalNotes: 'Final study completion payment - all milestones met'
    },
    {
      id: 5,
      paymentId: 'PAY-2026-003',
      requestId: 'REQ-2025-087',
      participantId: 'P-2025-089',
      participantName: 'Maria Garcia',
      study: 'CHS-2026-001',
      disbursementCurrency: 'USD',
      amountInDisbursementCurrency: 150.00,
      transactionDate: '2026-01-12',
      transactionType: 'Reimbursement',
      transactionSubType: 'Travel',
      paymentType: 'Prepaid Card',
      paymentSubtype: 'Visa Gift Card',
      milestone: 'Visit 3',
      paymentMethod: 'Prepaid Card',
      approver: 'Dr. Sarah Chen',
      approveDate: '2026-01-06',
      approvalNotes: 'Mileage reimbursement approved - 60 miles @ $2.50/mile'
    },
    {
      id: 6,
      paymentId: 'PAY-2026-004',
      requestId: 'REQ-2025-123',
      participantId: 'P-2025-045',
      participantName: 'Thomas Lee',
      study: 'PNS-2026-008',
      disbursementCurrency: 'USD',
      amountInDisbursementCurrency: 100.00,
      transactionDate: '2026-01-18',
      transactionType: 'Payment',
      transactionSubType: 'Stipend',
      paymentType: 'Direct Deposit',
      paymentSubtype: 'ACH',
      milestone: 'Baseline Visit',
      paymentMethod: 'Bank Transfer',
      approver: 'Douglas Ross',
      approveDate: '2026-01-14',
      approvalNotes: 'Baseline visit compensation approved'
    },
    {
      id: 7,
      paymentId: 'PAY-2026-005',
      requestId: 'REQ-2025-156',
      participantId: 'P-2025-201',
      participantName: 'Angela White',
      study: 'DPT-2025-019',
      disbursementCurrency: 'USD',
      amountInDisbursementCurrency: 50.00,
      transactionDate: '2026-01-20',
      transactionType: 'Reimbursement',
      transactionSubType: 'Parking',
      paymentType: 'Check',
      paymentSubtype: 'Paper Check',
      milestone: 'Visit 1',
      paymentMethod: 'Mail Check',
      approver: 'Ted Noravong',
      approveDate: '2026-01-16',
      approvalNotes: 'Parking fees verified and approved'
    },
    {
      id: 8,
      paymentId: 'PAY-2026-006',
      requestId: 'REQ-2026-034',
      participantId: 'P-2026-012',
      participantName: 'Christopher Brown',
      study: 'NDR-2025-042',
      disbursementCurrency: 'USD',
      amountInDisbursementCurrency: 250.00,
      transactionDate: '2026-01-22',
      transactionType: 'Payment',
      transactionSubType: 'Incentive',
      paymentType: 'Direct Deposit',
      paymentSubtype: 'ACH',
      milestone: '6-Month Follow-up',
      paymentMethod: 'Bank Transfer',
      approver: 'Megan Hummelgaard',
      approveDate: '2026-01-19',
      approvalNotes: 'Follow-up visit incentive approved'
    }
  ];

  const filteredPayments = completedPayments.filter(payment => {
    const matchesSearch = payment.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.study.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.requestId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPaymentMethod = filterPaymentMethod === 'all' || payment.paymentMethod === filterPaymentMethod;
    const matchesPaymentType = filterPaymentType === 'all' || payment.paymentType === filterPaymentType;
    
    return matchesSearch && matchesPaymentMethod && matchesPaymentType;
  });

  // Calculate KPIs
  const totalPayments = completedPayments.length;
  const totalAmount = completedPayments.reduce((sum, p) => sum + p.amountInDisbursementCurrency, 0);
  const avgPayment = totalAmount / totalPayments;
  const thisMonthPayments = completedPayments.filter(p => p.transactionDate >= '2026-01-01').length;

  const exportToExcel = () => {
    toast.success('Completed Payments exported to Excel successfully');
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Action Buttons */}
      <div className="bg-white border-l-4 border-ku-blue rounded-lg shadow-sm p-5 flex items-center justify-between">
        {/* Left Side - Icon and Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
            <DollarSign className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl text-gray-800 font-semibold">Completed Payments</h2>
            <p className="text-gray-600 text-sm">View all processed and completed payments</p>
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
            title="Export to Excel"
          >
            <FileSpreadsheet size={20} />
          </button>
        </div>
      </div>

      {/* Collapsible Statistics */}
      {showKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Payments</p>
              <DollarSign className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{totalPayments}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Amount</p>
              <DollarSign className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">All payments</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Average Payment</p>
              <DollarSign className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold">${avgPayment.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Per transaction</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">This Month</p>
              <DollarSign className="text-orange-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{thisMonthPayments}</p>
            <p className="text-sm text-gray-500 mt-1">January 2026</p>
          </div>
        </div>
      )}

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow">
        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by participant, payment ID, request ID, or study..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Payment Methods</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mail Check">Mail Check</option>
                <option value="Prepaid Card">Prepaid Card</option>
              </select>

              <select
                value={filterPaymentType}
                onChange={(e) => setFilterPaymentType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Payment Types</option>
                <option value="Direct Deposit">Direct Deposit</option>
                <option value="Check">Check</option>
                <option value="Prepaid Card">Prepaid Card</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Payment ID</th>
                <th className="px-6 py-3 text-left text-gray-600">Request ID</th>
                <th className="px-6 py-3 text-left text-gray-600">Participant</th>
                <th className="px-6 py-3 text-left text-gray-600">Study</th>
                <th className="px-6 py-3 text-left text-gray-600">Disbursement Currency</th>
                <th className="px-6 py-3 text-left text-gray-600">Amount</th>
                <th className="px-6 py-3 text-left text-gray-600">Transaction Date</th>
                <th className="px-6 py-3 text-left text-gray-600">Transaction Type</th>
                <th className="px-6 py-3 text-left text-gray-600">Transaction SubType</th>
                <th className="px-6 py-3 text-left text-gray-600">Payment Type</th>
                <th className="px-6 py-3 text-left text-gray-600">Payment Subtype</th>
                <th className="px-6 py-3 text-left text-gray-600">Milestone</th>
                <th className="px-6 py-3 text-left text-gray-600">Payment Method</th>
                <th className="px-6 py-3 text-left text-gray-600">Approver</th>
                <th className="px-6 py-3 text-left text-gray-600">Approve Date</th>
                <th className="px-6 py-3 text-left text-gray-600">Approval Notes</th>
                <th className="px-6 py-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{payment.paymentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.requestId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium">{payment.participantName}</p>
                      <p className="text-xs text-gray-500">{payment.participantId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.study}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{payment.disbursementCurrency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${payment.amountInDisbursementCurrency.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.transactionDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.transactionType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.transactionSubType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.paymentType === 'Direct Deposit' ? 'bg-blue-100 text-blue-800' :
                      payment.paymentType === 'Check' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {payment.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.paymentSubtype}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.milestone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.approver}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.approveDate}</td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-gray-600 truncate" title={payment.approvalNotes}>
                      {payment.approvalNotes}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded" 
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-2 text-green-600 hover:bg-green-50 rounded" 
                        title="Download Receipt"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No completed payments found</p>
            <p className="text-sm mt-1">Adjust your filters to see more results</p>
          </div>
        )}

        {filteredPayments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredPayments.length} of {completedPayments.length} payments
            </p>
            <p className="text-gray-600 font-medium">
              Total: ${filteredPayments.reduce((sum, p) => sum + p.amountInDisbursementCurrency, 0).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
