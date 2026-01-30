import { FileText, Download, Filter, Calendar } from 'lucide-react';
import { useState } from 'react';

interface ReportsProps {
  reportType?: string;
}

export function Reports({ reportType = 'general' }: ReportsProps) {
  const [selectedFinancialReport, setSelectedFinancialReport] = useState('study-expense');

  const getReportContent = () => {
    // Handle consolidated Financial Reporting page
    if (reportType === 'reports-financial') {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl mb-2">Financial Reporting</h2>
                <p className="text-gray-600">
                  Generate comprehensive financial reports for studies, participants, and expenses.
                </p>
              </div>
              <div className="w-64">
                <label className="block text-sm text-gray-700 mb-2">Report Type</label>
                <select 
                  value={selectedFinancialReport}
                  onChange={(e) => setSelectedFinancialReport(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="study-expense">Study to Expense</option>
                  <option value="participant-expense">Participant to Expense</option>
                  <option value="itemized">Itemized Reports</option>
                  <option value="rollup">Roll-up Reports</option>
                </select>
              </div>
            </div>

            {/* Study to Expense */}
            {selectedFinancialReport === 'study-expense' && (
              <>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg mb-2">Study to Expense Report</h3>
                  <p className="text-gray-600 mb-4">
                    View expense breakdown by study with detailed financial analysis.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Study</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>All Studies</option>
                      <option>CHS-2026-001</option>
                      <option>NDR-2025-042</option>
                      <option>DPT-2025-019</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Start Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">End Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Download size={16} />
                  Generate Report
                </button>
              </>
            )}

            {/* Participant to Expense */}
            {selectedFinancialReport === 'participant-expense' && (
              <>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg mb-2">Participant to Expense Report</h3>
                  <p className="text-gray-600 mb-4">
                    View expense breakdown by participant with payment history.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Participant</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>All Participants</option>
                      <option>John Smith</option>
                      <option>Sarah Johnson</option>
                      <option>Michael Brown</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Start Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">End Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Download size={16} />
                  Generate Report
                </button>
              </>
            )}

            {/* Itemized Reports */}
            {selectedFinancialReport === 'itemized' && (
              <>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg mb-2">Itemized Reports</h3>
                  <p className="text-gray-600 mb-4">
                    Detailed itemized expense reports by Site, Study, Participant, and Reimbursement type.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Report By</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Site</option>
                      <option>Study</option>
                      <option>Participant</option>
                      <option>Reimbursement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Filter</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>All</option>
                      <option>KUMC Main</option>
                      <option>KUMC West</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Start Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">End Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Download size={16} />
                  Generate Itemized Report
                </button>
              </>
            )}

            {/* Roll-up Reports */}
            {selectedFinancialReport === 'rollup' && (
              <>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg mb-2">Roll-up Reports</h3>
                  <p className="text-gray-600 mb-4">
                    Aggregated roll-up reports by Site, Study, Participant, and Reimbursement type.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Roll-up By</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Site</option>
                      <option>Study</option>
                      <option>Participant</option>
                      <option>Reimbursement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Period</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Start Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">End Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Download size={16} />
                  Generate Roll-up Report
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    switch (reportType) {
      case 'reports-1099':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl mb-2">1099 Tax Report</h2>
              <p className="text-gray-600 mb-1">
                Extract data for 1099 tax compliance reporting.
              </p>
              <p className="text-sm text-blue-600 mb-4">
                Note: This report is for Calendar Year reporting purposes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Tax Year</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>2026</option>
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Threshold Amount</label>
                  <input type="number" placeholder="$600" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Download size={16} />
                Generate 1099 Extract
              </button>
            </div>
          </div>
        );

      case 'reports-reconciliation':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl mb-4">Reconciliation Report</h2>
              <p className="text-gray-600 mb-4">
                Study to Accounting alignment for expenses and accounting records.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Study</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>All Studies</option>
                    <option>CHS-2026-001</option>
                    <option>NDR-2025-042</option>
                    <option>DPT-2025-019</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Accounting Period</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Current Month</option>
                    <option>Last Month</option>
                    <option>Current Quarter</option>
                    <option>Last Quarter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Fiscal Year</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>FY 2026</option>
                    <option>FY 2025</option>
                    <option>FY 2024</option>
                    <option>FY 2023</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Fiscal Month</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>All</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Status</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>All</option>
                    <option>Reconciled</option>
                    <option>Pending</option>
                    <option>Discrepancy</option>
                  </select>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Download size={16} />
                Generate Reconciliation Report
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl mb-4">Reports Overview</h2>
              <p className="text-gray-600 mb-6">
                Select a report type from the sidebar to generate financial reports, tax documents, and reconciliation data.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <FileText className="text-blue-600 mb-3" size={32} />
                  <h3 className="text-lg mb-2">Financial Reporting</h3>
                  <p className="text-sm text-gray-600">Study, participant, itemized and roll-up reports</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <Calendar className="text-green-600 mb-3" size={32} />
                  <h3 className="text-lg mb-2">1099 Tax Report</h3>
                  <p className="text-sm text-gray-600">Extract for 1099 tax compliance</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <Filter className="text-purple-600 mb-3" size={32} />
                  <h3 className="text-lg mb-2">Reconciliation</h3>
                  <p className="text-sm text-gray-600">Study to accounting alignment</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {getReportContent()}
    </div>
  );
}