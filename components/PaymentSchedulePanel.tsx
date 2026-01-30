import { X, Calendar, DollarSign, Archive, AlertCircle, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PaymentSchedulePanelProps {
  onClose: () => void;
  study?: any;
}

export function PaymentSchedulePanel({ onClose, study }: PaymentSchedulePanelProps) {
  const [selectedStudy, setSelectedStudy] = useState(study?.code || '');
  const [scheduleItems, setScheduleItems] = useState<any[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Mock studies data
  const studies = [
    { code: 'CHS-2026-001', name: 'Cardiovascular Health Study 2026', pi: 'Dr. Sarah Williams' },
    { code: 'NDR-2025-042', name: 'Neurological Disorders Research', pi: 'Dr. James Anderson' },
    { code: 'DPT-2025-019', name: 'Diabetes Prevention Trial', pi: 'Dr. Michael Chen' },
    { code: 'PNS-2026-008', name: 'Pediatric Nutrition Study', pi: 'Dr. Robert Taylor' },
    { code: 'CIS-2025-055', name: 'Cancer Immunotherapy Study', pi: 'Dr. Lisa Brown' },
  ];

  // Mock visits data for selected study
  const getVisitsForStudy = (studyCode: string) => {
    const visitsMap: { [key: string]: any[] } = {
      'CHS-2026-001': [
        { id: 'V1', name: 'Screening Visit', type: 'Screening', typicalDuration: '2 hours', window: 'Day 0' },
        { id: 'V2', name: 'Baseline Assessment', type: 'Baseline', typicalDuration: '3 hours', window: 'Day 1-7' },
        { id: 'V3', name: 'Week 4 Follow-up', type: 'Follow-up', typicalDuration: '1 hour', window: 'Week 4 ±3 days' },
        { id: 'V4', name: 'Month 3 Assessment', type: 'Assessment', typicalDuration: '2 hours', window: 'Month 3 ±7 days' },
        { id: 'V5', name: 'Month 6 Assessment', type: 'Assessment', typicalDuration: '2 hours', window: 'Month 6 ±7 days' },
        { id: 'V6', name: 'Final Visit', type: 'Closeout', typicalDuration: '2.5 hours', window: 'Month 12 ±14 days' },
      ],
      'NDR-2025-042': [
        { id: 'V1', name: 'Initial Screening', type: 'Screening', typicalDuration: '1.5 hours', window: 'Day 0' },
        { id: 'V2', name: 'Neurological Baseline', type: 'Baseline', typicalDuration: '4 hours', window: 'Week 1' },
        { id: 'V3', name: 'Week 2 Check', type: 'Follow-up', typicalDuration: '1 hour', window: 'Week 2 ±2 days' },
        { id: 'V4', name: 'Month 1 Assessment', type: 'Assessment', typicalDuration: '3 hours', window: 'Month 1 ±5 days' },
        { id: 'V5', name: 'Study Completion', type: 'Closeout', typicalDuration: '2 hours', window: 'Month 3 ±7 days' },
      ],
      'DPT-2025-019': [
        { id: 'V1', name: 'Screening & Consent', type: 'Screening', typicalDuration: '1 hour', window: 'Day 0' },
        { id: 'V2', name: 'Baseline Labs', type: 'Baseline', typicalDuration: '2 hours', window: 'Week 1' },
        { id: 'V3', name: 'Monthly Check-in', type: 'Follow-up', typicalDuration: '30 min', window: 'Monthly' },
        { id: 'V4', name: '6-Month Evaluation', type: 'Assessment', typicalDuration: '2 hours', window: 'Month 6 ±10 days' },
      ],
    };
    return visitsMap[studyCode] || [];
  };

  const visits = selectedStudy ? getVisitsForStudy(selectedStudy) : [];


  const removeScheduleItem = (index: number) => {
    setScheduleItems(scheduleItems.filter((_, i) => i !== index));
  };

  const updateScheduleItem = (index: number, field: string, value: any) => {
    const updated = [...scheduleItems];
    updated[index] = { ...updated[index], [field]: value };
    setScheduleItems(updated);
  };

  const handleSave = () => {
    if (!selectedStudy) {
      toast.error('Please select a study');
      return;
    }
    if (scheduleItems.length === 0) {
      toast.error('Please add at least one payment schedule item');
      return;
    }
    toast.success('Payment schedule saved successfully!');
    onClose();
  };

  const getSelectedStudyInfo = () => {
    return studies.find(s => s.code === selectedStudy);
  };

  const totalScheduledAmount = scheduleItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const items = [...scheduleItems];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, draggedItem);

    setScheduleItems(items);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full lg:w-3/4 xl:w-2/3 bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl">
                {study ? `Payment Schedule (${study.name})` : 'Payment Schedule'}
              </h2>
              <p className="text-sm text-gray-500">
                Set up payment schedules for study visits
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Study Selection */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg mb-4">Study Information</h3>
            <div>
              <label className="block text-gray-700 mb-2">
                Select Study <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStudy}
                onChange={(e) => {
                  setSelectedStudy(e.target.value);
                  setScheduleItems([]); // Reset schedule items when study changes
                }}
              >
                <option value="">Select a study...</option>
                {studies.map(s => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
              {selectedStudy && (
                <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Principal Investigator:</strong> {getSelectedStudyInfo()?.pi}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Available Visits */}
          {selectedStudy && visits.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg mb-4">Available Study Visits</h3>
              <div className="space-y-2">
                {visits.map(visit => {
                  return (
                    <div
                      key={visit.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            {visit.id}
                          </span>
                          <h4 className="font-medium">{visit.name}</h4>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {visit.type}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 flex gap-4">
                          <span><Calendar size={14} className="inline mr-1" />{visit.window}</span>
                          <span>Duration: {visit.typicalDuration}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment Schedule Items */}
          {scheduleItems.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Payment Schedule Configuration</h3>
                <p className="text-sm text-gray-600">
                  <GripVertical size={16} className="inline mr-1" />
                  Drag to reorder
                </p>
              </div>
              <div className="space-y-4">
                {scheduleItems.map((item, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-lg p-4 border-2 border-green-300 cursor-move transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                      }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                        <GripVertical size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            #{index + 1}
                          </span>
                          <h4 className="font-medium">{item.visitName}</h4>
                        </div>
                        <span className="text-sm text-gray-600">Visit ID: {item.visitId}</span>
                      </div>
                      <button
                        onClick={() => removeScheduleItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Remove from schedule"
                      >
                        <Archive size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 text-sm">
                          Payment Type
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={item.paymentType}
                          onChange={(e) => updateScheduleItem(index, 'paymentType', e.target.value)}
                        >
                          <option value="Stipend">Stipend</option>
                          <option value="Travel">Travel Reimbursement</option>
                          <option value="Parking">Parking</option>
                          <option value="Meal">Meal Allowance</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2 text-sm">
                          Amount ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={item.amount}
                          onChange={(e) => updateScheduleItem(index, 'amount', e.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2 text-sm">
                          Description
                        </label>
                        <input
                          type="text"
                          placeholder="Payment description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={item.description}
                          onChange={(e) => updateScheduleItem(index, 'description', e.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2 flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded"
                            checked={item.taxable}
                            onChange={(e) => updateScheduleItem(index, 'taxable', e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">Taxable Payment</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded"
                            checked={item.travelReimbursement}
                            onChange={(e) => updateScheduleItem(index, 'travelReimbursement', e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">Include Travel Reimbursement</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="mt-4 p-4 bg-green-100 rounded-lg border-2 border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 font-medium">Total Scheduled Payments</p>
                    <p className="text-sm text-gray-600">{scheduleItems.length} payment(s) across {scheduleItems.length} visit(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-700">${totalScheduledAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Per participant</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Information Box */}
          {selectedStudy && visits.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-gray-700">
                  No visits found for this study. Please ensure the study has defined visit schedules before setting up payment schedules.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!selectedStudy || scheduleItems.length === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <DollarSign size={20} />
              Save Payment Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}