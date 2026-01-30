import { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';

interface StudyEnrollmentPanelProps {
  participant: any;
  selectedStudies: string[];
  onClose: () => void;
  onSave: (studies: string[]) => void;
}

export function StudyEnrollmentPanel({ participant, selectedStudies: initialSelected, onClose, onSave }: StudyEnrollmentPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudies, setSelectedStudies] = useState<string[]>(initialSelected);

  // Mock study data
  const allStudies = [
    { code: 'CHS-2026-001', name: 'Cardiovascular Health Study 2026', pi: 'Dr. Sarah Williams', status: 'Active' },
    { code: 'NDR-2025-042', name: 'Neurological Disorders Research', pi: 'Dr. James Anderson', status: 'Active' },
    { code: 'DPT-2025-019', name: 'Diabetes Prevention Trial', pi: 'Dr. Michael Chen', status: 'Active' },
    { code: 'PNS-2026-008', name: 'Pediatric Nutrition Study', pi: 'Dr. Robert Taylor', status: 'Recruiting' },
    { code: 'CIS-2025-055', name: 'Cancer Immunotherapy Study', pi: 'Dr. Lisa Brown', status: 'Active' },
    { code: 'ATE-2025-031', name: 'Arthritis Treatment Efficacy', pi: 'Dr. David Kim', status: 'Completed' },
    { code: 'SDA-2026-003', name: 'Sleep Disorder Analysis', pi: 'Dr. Maria Martinez', status: 'Planning' },
  ];

  const filteredStudies = allStudies.filter(s => 
    !selectedStudies.includes(s.code) && 
    (s.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addStudy = (studyCode: string) => {
    setSelectedStudies([...selectedStudies, studyCode]);
    setSearchTerm('');
  };

  const removeStudy = (studyCode: string) => {
    setSelectedStudies(selectedStudies.filter(code => code !== studyCode));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full lg:w-2/3 xl:w-1/2 bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl">Manage Study Enrollment ({participant.name})</h2>
              <p className="text-sm text-gray-500">{participant.participantId} - {participant.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Search and Add Studies */}
          <div className="space-y-4">
            <h3 className="text-lg border-b pb-2">Add Studies</h3>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by study code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                {filteredStudies.length > 0 ? (
                  filteredStudies.map((study) => (
                    <div 
                      key={study.code}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{study.code} - {study.name}</p>
                        <p className="text-xs text-gray-500">PI: {study.pi} | Status: {study.status}</p>
                      </div>
                      <button
                        onClick={() => addStudy(study.code)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-sm text-gray-500 text-center">No studies found</p>
                )}
              </div>
            )}
          </div>

          {/* Currently Enrolled Studies */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg">Currently Enrolled</h3>
              <span className="text-sm text-gray-500">{selectedStudies.length} {selectedStudies.length !== 1 ? 'studies' : 'study'}</span>
            </div>
            
            {selectedStudies.length > 0 ? (
              <div className="space-y-2">
                {selectedStudies.map((studyCode) => {
                  const study = allStudies.find(s => s.code === studyCode);
                  return (
                    <div 
                      key={studyCode}
                      className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{studyCode}</p>
                        {study && (
                          <p className="text-xs text-gray-600">{study.name} - PI: {study.pi}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeStudy(studyCode)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Withdraw
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Not enrolled in any studies</p>
                <p className="text-sm text-gray-400 mt-1">Use the search above to enroll in studies</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave(selectedStudies)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Enrollment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
