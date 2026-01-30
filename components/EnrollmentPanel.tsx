import { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface EnrollmentPanelProps {
  study: any;
  selectedParticipants: string[];
  onClose: () => void;
  onSave: (participants: string[], studyParticipantIds: {[key: string]: string}) => void;
}

export function EnrollmentPanel({ study, selectedParticipants: initialSelected, onClose, onSave }: EnrollmentPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(initialSelected);
  const [studyParticipantIds, setStudyParticipantIds] = useState<{[key: string]: string}>({});
  const [addingParticipantId, setAddingParticipantId] = useState<string | null>(null);
  const [newStudyParticipantId, setNewStudyParticipantId] = useState('');

  // Mock participant data
  const allParticipants = [
    { id: 'P-2026-001', name: 'John Smith', status: 'Active' },
    { id: 'P-2025-156', name: 'Sarah Johnson', status: 'Active' },
    { id: 'P-2026-045', name: 'Michael Brown', status: 'Active' },
    { id: 'P-2026-089', name: 'Emily Davis', status: 'Screening' },
    { id: 'P-2025-234', name: 'Robert Wilson', status: 'Active' },
    { id: 'P-2025-178', name: 'Linda Martinez', status: 'Completed' },
    { id: 'P-2026-012', name: 'Jennifer Taylor', status: 'Active' },
    { id: 'P-2025-298', name: 'David Anderson', status: 'Completed' },
  ];

  const filteredParticipants = allParticipants.filter(p => 
    !selectedParticipants.includes(p.id) && 
    (p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addParticipant = (participantId: string) => {
    setSelectedParticipants([...selectedParticipants, participantId]);
    setAddingParticipantId(participantId);
    setSearchTerm('');
  };

  const removeParticipant = (participantId: string) => {
    setSelectedParticipants(selectedParticipants.filter(id => id !== participantId));
    setStudyParticipantIds(prev => {
      const newIds = {...prev};
      delete newIds[participantId];
      return newIds;
    });
  };

  const handleSave = () => {
    onSave(selectedParticipants, studyParticipantIds);
    onClose();
  };

  const handleAddStudyParticipantId = () => {
    if (addingParticipantId && newStudyParticipantId) {
      setStudyParticipantIds(prev => ({
        ...prev,
        [addingParticipantId]: newStudyParticipantId
      }));
      setAddingParticipantId(null);
      setNewStudyParticipantId('');
      toast.success('Study Participant ID added successfully!');
    } else {
      toast.error('Please enter a valid Study Participant ID.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full lg:w-2/3 xl:w-1/2 bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl">Manage Study Enrollment ({study.name})</h2>
              <p className="text-sm text-gray-500">{study.code} - {study.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Search and Add Participants */}
          <div className="space-y-4">
            <h3 className="text-lg border-b pb-2">Add Participants</h3>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by participant ID or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant) => (
                    <div 
                      key={participant.id}
                      className="p-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{participant.id} - {participant.name}</p>
                          <p className="text-xs text-gray-500">Status: {participant.status}</p>
                        </div>
                      </div>
                      {addingParticipantId === participant.id ? (
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Enter Study Participant ID (required)"
                            value={newStudyParticipantId}
                            onChange={(e) => setNewStudyParticipantId(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={handleAddStudyParticipantId}
                            disabled={!newStudyParticipantId.trim()}
                            className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setAddingParticipantId(null);
                              setNewStudyParticipantId('');
                              removeParticipant(participant.id);
                            }}
                            className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addParticipant(participant.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-sm text-gray-500 text-center">No participants found</p>
                )}
              </div>
            )}
          </div>

          {/* Currently Enrolled Participants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg">Currently Enrolled</h3>
              <span className="text-sm text-gray-500">{selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''}</span>
            </div>
            
            {selectedParticipants.length > 0 ? (
              <div className="space-y-2">
                {selectedParticipants.map((participantId) => {
                  const participant = allParticipants.find(p => p.id === participantId);
                  const studyId = studyParticipantIds[participantId];
                  return (
                    <div 
                      key={participantId}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{participantId}</p>
                          {participant && (
                            <p className="text-xs text-gray-600">{participant.name}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeParticipant(participantId)}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          Remove
                        </button>
                      </div>
                      {studyId && (
                        <div className="mt-2 pt-2 border-t border-blue-300">
                          <p className="text-xs text-gray-600">Study Participant ID:</p>
                          <p className="text-sm font-medium text-blue-900">{studyId}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No participants enrolled yet</p>
                <p className="text-sm text-gray-400 mt-1">Use the search above to add participants</p>
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
              onClick={handleSave}
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