import { useState } from 'react';
import { Search, Building2, MapPin, Archive, ChevronDown, ChevronUp, X, Briefcase, Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function OrganizationsLocations() {
  const [activeTab, setActiveTab] = useState<'organizations' | 'locations'>('locations');
  const [searchTerm, setSearchTerm] = useState('');
  const [showKPIs, setShowKPIs] = useState(false);
  
  // Organizations state
  const [showOrgPanel, setShowOrgPanel] = useState(false);
  const [viewingOrg, setViewingOrg] = useState<any>(null);
  const [orgPanelTab, setOrgPanelTab] = useState('details');

  // Locations state
  const [filterType, setFilterType] = useState('all');
  const [filterOrganization, setFilterOrganization] = useState('all');
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [viewingLocation, setViewingLocation] = useState<any>(null);
  const [locationPanelTab, setLocationPanelTab] = useState('details');
  
  // Search for Locations/Units in panel
  const [locationsSearch, setLocationsSearch] = useState('');
  const [unitsSearch, setUnitsSearch] = useState('');

  // Mock Organizations data
  const organizations = [
    {
      id: 1,
      name: 'University of Kansas Medical Center',
      code: 'KUMC',
      type: 'Medical Center',
      status: 'Active',
      establishedDate: '1905-01-15',
      locationsCount: 7,
      unitsCount: 2,
    },
  ];

  // Mock Organization Locations (Westwood, Corp, Remote)
  const orgLocations = [
    { id: 1, organizationId: 1, name: 'Main Research Center - Building A', code: 'MRC-A', status: 'Active' },
    { id: 2, organizationId: 1, name: 'Outpatient Clinic - West Campus', code: 'OPC-W', status: 'Active' },
    { id: 3, organizationId: 1, name: 'Home Visit - Johnson County Area', code: 'HV-JC', status: 'Active' },
    { id: 7, organizationId: 1, name: 'Virtual/Remote Participation', code: 'VRT-RM', status: 'Active' },
    { id: 4, organizationId: 1, name: 'Westwood', code: 'WW', status: 'Active' },
    { id: 5, organizationId: 1, name: 'Corp', code: 'CP', status: 'Active' },
    { id: 6, organizationId: 1, name: 'Remote', code: 'RM', status: 'Active' },
  ];

  // Mock Organization Units (Cancer Center, Radiology)
  const orgUnits = [
    { id: 1, organizationId: 1, name: 'Cancer Center', code: 'CC', status: 'Active', description: 'Cancer research and treatment' },
    { id: 2, organizationId: 1, name: 'Radiology', code: 'RAD', status: 'Active', description: 'Diagnostic imaging services' },
  ];

  // Mock Location Units - units associated with specific locations
  const locationUnits = [
    { id: 1, locationId: 1, name: 'Cancer Center', code: 'CC', address: '3901 Rainbow Blvd, Kansas City, KS 66160', status: 'Active', description: 'Cancer research and treatment' },
    { id: 2, locationId: 1, name: 'Radiology', code: 'RAD', address: '3901 Rainbow Blvd, Kansas City, KS 66160', status: 'Active', description: 'Diagnostic imaging services' },
    { id: 3, locationId: 2, name: 'Cancer Center', code: 'CC', address: '4000 Cambridge St, Kansas City, KS 66160', status: 'Active', description: 'Cancer research and treatment' },
    { id: 4, locationId: 4, name: 'Radiology', code: 'RAD', address: '5520 College Blvd, Overland Park, KS 66211', status: 'Active', description: 'Diagnostic imaging services' },
    { id: 5, locationId: 5, name: 'Cancer Center', code: 'CC', address: '4330 Shawnee Mission Pkwy, Fairway, KS 66205', status: 'Active', description: 'Cancer research and treatment' },
  ];

  // Mock Locations data - now tied to Organizations
  const locations = [
    { 
      id: 1, 
      name: 'KUCC Westwood',
      organizationId: 1,
      organizationName: 'University of Kansas Medical Center',
      organizationCode: 'KUMC',
      type: 'Study Facility',
      address: '2330 Shawnee Mission Pkwy, Westwood, KS 66205',
      address1: '2330 Shawnee Mission Pkwy',
      address2: '',
      city: 'Westwood',
      state: 'KS',
      zipCode: '66205',
      locationCode: 'KUCC-WW',
      status: 'Active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    },
    { 
      id: 2, 
      name: 'CRC',
      organizationId: 1,
      organizationName: 'University of Kansas Medical Center',
      organizationCode: 'KUMC',
      type: 'Study Facility',
      address: '4350 Shawnee Mission Pkwy, Fairway, KS 66205',
      address1: '4350 Shawnee Mission Pkwy',
      address2: '',
      city: 'Fairway',
      state: 'KS',
      zipCode: '66205',
      locationCode: 'CRC',
      status: 'Active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: 'KUCC, Research Clinic'
    },
    { 
      id: 3, 
      name: 'KUCC-Overland Park',
      organizationId: 1,
      organizationName: 'University of Kansas Medical Center',
      organizationCode: 'KUMC',
      type: 'Study Facility',
      address: '12200 W 110th St., Overland Park, KS 66210',
      address1: '12200 W 110th St.',
      address2: '',
      city: 'Overland Park',
      state: 'KS',
      zipCode: '66210',
      locationCode: 'KUCC-OP',
      status: 'Active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    },
    { 
      id: 4, 
      name: 'KUCC-East/Lee\'s Summit',
      organizationId: 1,
      organizationName: 'University of Kansas Medical Center',
      organizationCode: 'KUMC',
      type: 'Study Facility',
      address: '4881 NE Goodview Cir, Lees Summit, MO 64064',
      address1: '4881 NE Goodview Cir',
      address2: '',
      city: 'Lees Summit',
      state: 'MO',
      zipCode: '64064',
      locationCode: 'KUCC-E',
      status: 'Active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    },
    { 
      id: 5, 
      name: 'KUCC-North',
      organizationId: 1,
      organizationName: 'University of Kansas Medical Center',
      organizationCode: 'KUMC',
      type: 'Study Facility',
      address: '8700 N Green Hills Road, Kansas City, MO 64154',
      address1: '8700 N Green Hills Road',
      address2: '',
      city: 'Kansas City',
      state: 'MO',
      zipCode: '64154',
      locationCode: 'KUCC-N',
      status: 'Active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    },
    { 
      id: 6, 
      name: 'KUCC-Briarcliff',
      organizationId: 1,
      organizationName: 'University of Kansas Medical Center',
      organizationCode: 'KUMC',
      type: 'Study Facility',
      address: '4150 N Mulberry Dr #150, Kansas City, MO 64116',
      address1: '4150 N Mulberry Dr #150',
      address2: '',
      city: 'Kansas City',
      state: 'MO',
      zipCode: '64116',
      locationCode: 'KUCC-B',
      status: 'Active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    },
    { 
      id: 7, 
      name: 'KUCC-Other',
      organizationId: 1,
      organizationName: 'University of Kansas Medical Center',
      organizationCode: 'KUMC',
      type: 'Study Facility',
      address: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      locationCode: 'KUCC-Other',
      status: 'Active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    },
    { 
      id: 8, 
      name: 'University of Kansas Medical Center',
      organizationId: 1,
      organizationName: 'University of Kansas Medical Center',
      organizationCode: 'KUMC',
      type: 'Study Facility',
      address: '3901 Rainbow Blvd, Kansas City, KS 66160',
      address1: '3901 Rainbow Blvd',
      address2: '',
      city: 'Kansas City',
      state: 'KS',
      zipCode: '66160',
      locationCode: 'KUMC',
      status: 'Active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    },
    { 
      id: 9, 
      name: 'University of Kansas Health-Main',
      organizationId: 1,
      organizationName: 'University of Kansas Medical Center',
      organizationCode: 'KUMC',
      type: 'Study Facility',
      address: '4000 Cambridge, Kansas City, KS 66160',
      address1: '4000 Cambridge',
      address2: '',
      city: 'Kansas City',
      state: 'KS',
      zipCode: '66160',
      locationCode: 'UKHS-Main',
      status: 'Active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    },
    { 
      id: 10, 
      name: 'University of Kansas-Midwest',
      organizationId: 1,
      organizationName: 'University of Kansas Medical Center',
      organizationCode: 'KUMC',
      type: 'Study Facility',
      address: '405 Renner Road Shawnee, KS 66217',
      address1: '405 Renner Road',
      address2: '',
      city: 'Shawnee',
      state: 'KS',
      zipCode: '66217',
      locationCode: 'KUMW',
      status: 'Active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      notes: ''
    },
  ];

  // Mock audit history
  const auditHistory = [
    { id: 1, date: '2025-01-20', user: 'John Smith', action: 'Added Location', details: 'Added Westwood location' },
    { id: 2, date: '2025-01-15', user: 'Jane Doe', action: 'Added Unit', details: 'Added Cancer Center unit' },
    { id: 3, date: '2025-01-10', user: 'Admin User', action: 'Updated Organization', details: 'Updated status to Active' },
    { id: 4, date: '2025-01-05', user: 'System', action: 'Created Organization', details: 'Organization created in system' },
  ];

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.locationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || location.type === filterType;
    const matchesOrg = filterOrganization === 'all' || location.organizationId.toString() === filterOrganization;
    return matchesSearch && matchesType && matchesOrg;
  });

  const handleCloseOrgPanel = () => {
    setShowOrgPanel(false);
    setViewingOrg(null);
    setOrgPanelTab('details');
    setLocationsSearch('');
    setUnitsSearch('');
  };

  const handleCloseLocationPanel = () => {
    setShowLocationPanel(false);
    setViewingLocation(null);
    setLocationPanelTab('details');
    setUnitsSearch('');
  };

  const totalLocations = locations.length;
  const totalUnits = organizations.reduce((sum, org) => sum + org.unitsCount, 0);

  const currentOrgLocations = orgLocations.filter(loc => 
    loc.organizationId === viewingOrg?.id &&
    loc.name.toLowerCase().includes(locationsSearch.toLowerCase())
  );
  
  const currentOrgUnits = orgUnits.filter(unit => 
    unit.organizationId === viewingOrg?.id &&
    (unit.name.toLowerCase().includes(unitsSearch.toLowerCase()) ||
     unit.description.toLowerCase().includes(unitsSearch.toLowerCase()))
  );

  const currentLocationUnits = locationUnits.filter(unit => 
    unit.locationId === viewingLocation?.id &&
    (unit.name.toLowerCase().includes(unitsSearch.toLowerCase()) ||
     unit.description.toLowerCase().includes(unitsSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border-l-4 border-ku-blue rounded-lg shadow-sm p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-ku-blue rounded-lg flex items-center justify-center shadow-sm">
            <Building2 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl text-gray-800 font-semibold">Organizations & Locations</h2>
            <p className="text-gray-600 text-sm">Manage organizational structure and locations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowKPIs(!showKPIs)}
            className="p-2.5 text-gray-600 hover:bg-white hover:text-blue-600 rounded-lg transition-all shadow-sm"
            title={showKPIs ? 'Hide Statistics' : 'Show Statistics'}
          >
            {showKPIs ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* KPIs Panel */}
      {showKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Organizations</p>
                <p className="text-3xl font-bold text-ku-blue mt-1">{organizations.length}</p>
              </div>
              <Building2 className="text-ku-blue" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Locations</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{totalLocations}</p>
              </div>
              <MapPin className="text-purple-600" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Units/Programs</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{totalUnits}</p>
              </div>
              <Briefcase className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Organizations</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{organizations.filter(o => o.status === 'Active').length}</p>
              </div>
              <Building2 className="text-blue-600" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => {
                setActiveTab('locations');
                setSearchTerm('');
              }}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeTab === 'locations'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span className="font-medium">Locations</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('organizations');
                setSearchTerm('');
              }}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeTab === 'organizations'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 size={20} />
                <span className="font-medium">Organizations</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Locations Tab */}
          {activeTab === 'locations' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search locations by name, code, address, or organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={filterOrganization}
                  onChange={(e) => setFilterOrganization(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Organizations</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id.toString()}>{org.code}</option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="Study Facility">Study Facility</option>
                  <option value="Participant Location">Participant Location</option>
                </select>
              </div>

              {/* Locations Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-600">Organization</th>
                        <th className="px-6 py-3 text-left text-gray-600">Location Name</th>
                        <th className="px-6 py-3 text-left text-gray-600">Type</th>
                        <th className="px-6 py-3 text-left text-gray-600">Code</th>
                        <th className="px-6 py-3 text-left text-gray-600">Address</th>
                        <th className="px-6 py-3 text-left text-gray-600">Status</th>
                        <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredLocations.map((location) => (
                        <tr key={location.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-ku-blue rounded flex items-center justify-center">
                                <Building2 className="text-white" size={16} />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{location.organizationCode}</div>
                                <div className="text-xs text-gray-500">{location.organizationName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium">{location.name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              location.type === 'Study Facility' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {location.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {location.locationCode}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">{location.address}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              location.status === 'Active' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {location.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => {
                                setViewingLocation(location);
                                setShowLocationPanel(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="View Location Details"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Organizations Tab */}
          {activeTab === 'organizations' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search organizations by name, code, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Organizations Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-600">Organization Name</th>
                        <th className="px-6 py-3 text-left text-gray-600">Code</th>
                        <th className="px-6 py-3 text-left text-gray-600">Type</th>
                        <th className="px-6 py-3 text-left text-gray-600">Locations</th>
                        <th className="px-6 py-3 text-left text-gray-600">Status</th>
                        <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredOrganizations.map((org) => (
                        <tr key={org.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-ku-blue rounded-lg flex items-center justify-center">
                                <Building2 className="text-white" size={20} />
                              </div>
                              <div>
                                <div className="font-medium">{org.name}</div>
                                <div className="text-sm text-gray-500">Est. {new Date(org.establishedDate).getFullYear()}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {org.code}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                              {org.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="text-purple-600" size={16} />
                              <span className="font-medium">{org.locationsCount}</span>
                              <span className="text-sm text-gray-500">locations</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              org.status === 'Active' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {org.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => {
                                setViewingOrg(org);
                                setShowOrgPanel(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="View Organization Details"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Detail Panel */}
      {showLocationPanel && viewingLocation && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseLocationPanel}></div>
          <div className="absolute right-0 top-0 h-full w-full lg:w-3/4 xl:w-2/3 bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl">View Location ({viewingLocation?.name})</h2>
                  <p className="text-sm text-gray-500">View location details and associated units</p>
                </div>
                <button onClick={handleCloseLocationPanel} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="px-6">
                <div className="flex gap-1 border-b border-gray-200">
                  <button
                    onClick={() => setLocationPanelTab('details')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      locationPanelTab === 'details'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setLocationPanelTab('units')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      locationPanelTab === 'units'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Units
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Details Tab */}
              {locationPanelTab === 'details' && (
                <>
                  {/* Basic Information */}
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <h3 className="text-sm text-gray-600 mb-3">Location Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Location Name</label>
                    <p className="text-gray-900 font-medium">{viewingLocation.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Location Code</label>
                    <p className="text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded inline-block">{viewingLocation.locationCode}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Organization</label>
                    <p className="text-gray-900">{viewingLocation.organizationName}</p>
                    <p className="text-sm text-gray-500">{viewingLocation.organizationCode}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Type</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      viewingLocation.type === 'Study Facility' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {viewingLocation.type}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      viewingLocation.status === 'Active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {viewingLocation.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-3">Address</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Address Line 1</label>
                    <p className="text-gray-900">{viewingLocation.address1}</p>
                  </div>

                  {viewingLocation.address2 && (
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Address Line 2</label>
                      <p className="text-gray-900">{viewingLocation.address2}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">City</label>
                    <p className="text-gray-900">{viewingLocation.city || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">State</label>
                    <p className="text-gray-900">{viewingLocation.state || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">ZIP Code</label>
                    <p className="text-gray-900">{viewingLocation.zipCode || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-3">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Contact Name</label>
                    <p className="text-gray-900">{viewingLocation.contactName || 'Not specified'}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Contact Phone</label>
                    <p className="text-gray-900">{viewingLocation.contactPhone || 'Not specified'}</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Contact Email</label>
                    <p className="text-gray-900">{viewingLocation.contactEmail || 'Not specified'}</p>
                  </div>
                </div>
              </div>

                  {/* Additional Notes */}
                  {viewingLocation.notes && (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <h3 className="text-sm text-gray-600 mb-3">Additional Notes</h3>
                      <p className="text-gray-900">{viewingLocation.notes}</p>
                    </div>
                  )}
                </>
              )}

              {/* Units Tab */}
              {locationPanelTab === 'units' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium">Location Units/Programs</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Units and programs assigned to this location
                      </p>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Filter units..."
                        value={unitsSearch}
                        onChange={(e) => setUnitsSearch(e.target.value)}
                        className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                      />
                    </div>
                  </div>

                  {currentLocationUnits.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Briefcase className="mx-auto text-gray-400 mb-2" size={48} />
                      <p className="text-gray-500">No units/programs assigned</p>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-300">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Unit Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Code
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Address
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentLocationUnits.map((unit: any) => (
                            <tr key={unit.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                <div className="flex items-center gap-2">
                                  <Briefcase className="text-green-600" size={16} />
                                  {unit.name}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                  {unit.code}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{unit.address}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{unit.description}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  {unit.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Showing {currentLocationUnits.length} unit(s)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={handleCloseLocationPanel}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Organization Detail Panel */}
      {showOrgPanel && viewingOrg && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseOrgPanel}></div>
          <div className="absolute right-0 top-0 h-full w-full lg:w-3/4 xl:w-2/3 bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl">View Organization ({viewingOrg?.name})</h2>
                  <p className="text-sm text-gray-500">View organization details</p>
                </div>
                <button onClick={handleCloseOrgPanel} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-3">Organization Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Organization Name</label>
                    <p className="text-gray-900 font-medium">{viewingOrg.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Code</label>
                    <p className="text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded inline-block">{viewingOrg.code}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Type</label>
                    <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {viewingOrg.type}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      viewingOrg.status === 'Active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {viewingOrg.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Established Date</label>
                    <p className="text-gray-900">{new Date(viewingOrg.establishedDate).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Total Locations</label>
                    <p className="text-gray-900 font-medium">{viewingOrg.locationsCount}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={handleCloseOrgPanel}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}