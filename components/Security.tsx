import { useState } from 'react';
import { Search, Edit, Eye, X, Shield, Users, Key, ChevronDown, ChevronUp, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { securityUsers } from './SecurityUsersData';

export function Security() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showKPIs, setShowKPIs] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');

  // User Management
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [userModalTab, setUserModalTab] = useState<'details' | 'role'>('details');

  // Role Management
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [viewingRole, setViewingRole] = useState<any>(null);
  const [roleModalTab, setRoleModalTab] = useState<'details' | 'permissions'>('details');

  // User-Role Assignment
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
  const [assigningUser] = useState<any>(null);

  // Study and Location Search
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Refresh Users from IDP
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // IDP User Search (for Add User)
  const [idpSearchTerm, setIdpSearchTerm] = useState('');
  const [selectedIdpUser, setSelectedIdpUser] = useState<any>(null);
  const [selectedUserRole, setSelectedUserRole] = useState('');
  const [selectedUserLocations, setSelectedUserLocations] = useState<string[]>([]);

  // Mock IDP Users (simulating users from Identity Provider)
  const idpUsers = [
    { kumcUsername: '****', firstName: 'Elena', lastName: 'Garcia', email: '****@kumc.edu', department: 'Neurology' },
    { kumcUsername: '****', firstName: 'David', lastName: 'Kim', email: '****@kumc.edu', department: 'Radiology' },
    { kumcUsername: '****', firstName: 'Amanda', lastName: 'Martin', email: '****@kumc.edu', department: 'Oncology' },
    { kumcUsername: '****', firstName: 'James', lastName: 'Thompson', email: '****@kumc.edu', department: 'Surgery' },
    { kumcUsername: '****', firstName: 'Maria', lastName: 'Rodriguez', email: '****@kumc.edu', department: 'Emergency Medicine' },
    { kumcUsername: '****', firstName: 'Patrick', lastName: 'Lee', email: '****@kumc.edu', department: 'Pathology' },
    { kumcUsername: '****', firstName: 'Susan', lastName: 'Wilson', email: '****@kumc.edu', department: 'Nursing' },
    { kumcUsername: '****', firstName: 'Thomas', lastName: 'Nguyen', email: '****@kumc.edu', department: 'Laboratory Medicine' },
  ];

  // Mock Users Data
  const users = [
    {
      id: 0,
      kumcUsername: '****',
      firstName: 'Elena',
      lastName: 'Garcia',
      email: '****@kumc.edu',
      department: 'Neurology',
      organization: 'KUMC',
      organizationName: 'University of Kansas Medical Center',
      role: '',
      assignedStudies: [],
      assignedLocations: [],
      status: 'Pending',
      lastLogin: ''
    },
    {
      id: 1,
      kumcUsername: '****',
      firstName: 'John',
      lastName: 'Williams',
      email: '****@kumc.edu',
      department: 'Clinical Research',
      organization: 'KUMC',
      organizationName: 'University of Kansas Medical Center',
      role: 'Study Coordinator',
      assignedStudies: ['CHS-2026-001', 'NDR-2025-042'],
      assignedLocations: ['Main Campus', 'West Campus'],
      status: 'Active',
      lastLogin: '2026-01-23 09:15 AM'
    },
    {
      id: 2,
      kumcUsername: '****',
      firstName: 'Sarah',
      lastName: 'Anderson',
      email: '****@kumc.edu',
      department: 'Cardiology',
      organization: 'KUMC',
      organizationName: 'University of Kansas Medical Center',
      role: 'System Administrator',
      assignedStudies: [],
      assignedLocations: [],
      status: 'Active',
      lastLogin: '2026-01-23 08:30 AM'
    },
    {
      id: 3,
      kumcUsername: '****',
      firstName: 'Michael',
      lastName: 'Chen',
      email: '****@kumc.edu',
      department: 'Finance',
      organization: 'KUMC',
      organizationName: 'University of Kansas Medical Center',
      role: 'Approver',
      assignedStudies: ['DPT-2025-019', 'DPT-2025-020'],
      assignedLocations: ['Main Campus'],
      status: 'Active',
      lastLogin: '2026-01-22 04:45 PM'
    },
    {
      id: 4,
      kumcUsername: '****',
      firstName: 'Lisa',
      lastName: 'Brown',
      email: '****@kumc.edu',
      department: 'IT Support',
      organization: 'KUMC',
      organizationName: 'University of Kansas Medical Center',
      role: 'Global Administrator',
      assignedStudies: [],
      assignedLocations: [],
      status: 'Active',
      lastLogin: '2026-01-23 07:00 AM'
    },
    {
      id: 5,
      kumcUsername: '****',
      firstName: 'Robert',
      lastName: 'Taylor',
      email: '****@kumc.edu',
      department: 'Pediatrics',
      organization: 'KUMC',
      organizationName: 'University of Kansas Medical Center',
      role: 'Study Coordinator',
      assignedStudies: ['PNS-2026-008'],
      assignedLocations: ['Children\'s Hospital'],
      status: 'Inactive',
      lastLogin: '2025-12-15 03:20 PM'
    },
    {
      id: 6,
      kumcUsername: '****',
      firstName: 'Jennifer',
      lastName: 'Davis',
      email: '****@kumc.edu',
      department: 'Reporting',
      organization: 'KUMC',
      organizationName: 'University of Kansas Medical Center',
      role: 'Report only',
      assignedStudies: [],
      assignedLocations: [],
      status: 'Active',
      lastLogin: '2026-01-23 06:45 AM'
    }
  ];

  // Use the imported users data
  const allUsers = securityUsers;

  // Available studies for assignment
  const availableStudies = [
    { code: 'CHS-2026-001', name: 'Cardiovascular Health Study 2026' },
    { code: 'NDR-2025-042', name: 'Neurological Disorders Research' },
    { code: 'PNS-2026-008', name: 'Pediatric Nutrition Study' },
    { code: 'DPT-2025-019', name: 'Diabetes Prevention Trial - Adult' },
    { code: 'DPT-2025-020', name: 'Diabetes Prevention Trial - Pediatric' },
    { code: 'CIS-2025-055', name: 'Cancer Immunotherapy Study' }
  ];

  // Available locations for assignment
  const availableLocations = [
    'Main Campus',
    'West Campus',
    'East Campus',
    'Children\'s Hospital',
    'Cancer Center',
    'Research Institute'
  ];

  // Mock Roles Data
  const roles = [
    {
      id: 1,
      name: 'Global Administrator',
      description: 'Full system access with all permissions across all modules',
      userCount: 3,
      permissions: ['manage_users', 'manage_roles', 'manage_studies', 'manage_participants', 'manage_payments', 'manage_grants', 'manage_locations', 'view_reports', 'export_data', 'manage_settings', 'approve_payments', 'process_payments'],
      status: 'Active'
    },
    {
      id: 2,
      name: 'System Administrator',
      description: 'Technical system administration and configuration',
      userCount: 1,
      permissions: ['manage_users', 'manage_roles', 'manage_settings', 'view_reports', 'export_data', 'manage_locations'],
      status: 'Active'
    },
    {
      id: 3,
      name: 'Study Coordinator',
      description: 'Manages day-to-day study operations and participant interactions',
      userCount: 117,
      permissions: ['manage_participants', 'manage_visits', 'view_studies', 'view_payments', 'process_payments'],
      status: 'Active'
    },
    {
      id: 4,
      name: 'Approver',
      description: 'Reviews and approves participant payments and study activities',
      userCount: 7,
      permissions: ['approve_payments', 'view_participants', 'view_studies', 'view_payments', 'view_reports'],
      status: 'Active'
    },
    {
      id: 5,
      name: 'Reader',
      description: 'Read-only access to view study and participant information',
      userCount: 1,
      permissions: ['view_studies', 'view_participants', 'view_payments', 'view_grants', 'view_locations'],
      status: 'Active'
    },
    {
      id: 6,
      name: 'Report only',
      description: 'Access limited to viewing and exporting reports',
      userCount: 1,
      permissions: ['view_reports', 'export_data'],
      status: 'Active'
    }
  ];

  // All Available Permissions
  const allPermissions = [
    { id: 'manage_users', name: 'Manage Users', category: 'User Management' },
    { id: 'manage_roles', name: 'Manage Roles', category: 'User Management' },
    { id: 'manage_studies', name: 'Manage Studies', category: 'Study Management' },
    { id: 'view_studies', name: 'View Studies', category: 'Study Management' },
    { id: 'manage_participants', name: 'Manage Participants', category: 'Participant Management' },
    { id: 'view_participants', name: 'View Participants', category: 'Participant Management' },
    { id: 'manage_visits', name: 'Manage Visits', category: 'Visit Management' },
    { id: 'view_visits', name: 'View Visits', category: 'Visit Management' },
    { id: 'manage_payments', name: 'Manage Payments', category: 'Payment Management' },
    { id: 'process_payments', name: 'Process Payments', category: 'Payment Management' },
    { id: 'view_payments', name: 'View Payments', category: 'Payment Management' },
    { id: 'export_payment_data', name: 'Export Payment Data', category: 'Payment Management' },
    { id: 'manage_grants', name: 'Manage Grants', category: 'Grant Management' },
    { id: 'view_grants', name: 'View Grants', category: 'Grant Management' },
    { id: 'manage_locations', name: 'Manage Locations', category: 'Location Management' },
    { id: 'view_locations', name: 'View Locations', category: 'Location Management' },
    { id: 'view_reports', name: 'View Reports', category: 'Reporting' },
    { id: 'export_data', name: 'Export Data', category: 'Reporting' },
    { id: 'manage_settings', name: 'Manage System Settings', category: 'System' },
    { id: 'approve_payments', name: 'Approve Payments', category: 'Payment Management' }
  ];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.kumcUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isUserModalViewMode = viewingUser !== null && editingUser === null;
  const isUserModalEditMode = editingUser !== null;
  const showUserPanel = showUserModal || editingUser || viewingUser;
  const currentUser = isUserModalEditMode ? editingUser : isUserModalViewMode ? viewingUser : null;

  const isRoleModalViewMode = viewingRole !== null && editingRole === null;
  const isRoleModalEditMode = editingRole !== null;
  const showRolePanel = showRoleModal || editingRole || viewingRole;
  const currentRole = isRoleModalEditMode ? editingRole : isRoleModalViewMode ? viewingRole : null;

  const handleCloseUserPanel = () => {
    setShowUserModal(false);
    setEditingUser(null);
    setViewingUser(null);
    setIdpSearchTerm('');
    setSelectedIdpUser(null);
    setSelectedUserRole('');
    setSelectedUserLocations([]);
  };

  const handleCloseRolePanel = () => {
    setShowRoleModal(false);
    setEditingRole(null);
    setViewingRole(null);
  };

  const groupPermissionsByCategory = () => {
    const grouped: Record<string, typeof allPermissions> = {};
    allPermissions.forEach(perm => {
      if (!grouped[perm.category]) {
        grouped[perm.category] = [];
      }
      grouped[perm.category].push(perm);
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border-l-4 border-ku-blue rounded-lg shadow-sm p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl text-gray-800 font-semibold">Roles and Permissions</h2>
            <p className="text-gray-600 text-sm">Manage users, roles, and permissions</p>
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
          {activeTab === 'users' && (
            <button
              onClick={() => {
                setShowRefreshModal(true);
                setRefreshStatus('idle');
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 font-medium shadow-sm transition-all"
            >
              <RefreshCw size={20} />
              Refresh Users
            </button>
          )}
        </div>
      </div>

      {/* KPIs */}
      {showKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Users</p>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl">{users.length}</p>
            <p className="text-sm text-gray-500 mt-1">{users.filter(u => u.status === 'Active').length} active</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Roles</p>
              <Shield className="text-green-500" size={24} />
            </div>
            <p className="text-3xl">{roles.length}</p>
            <p className="text-sm text-gray-500 mt-1">{roles.filter(r => r.status === 'Active').length} active</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Permissions</p>
              <Key className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl">{allPermissions.length}</p>
            <p className="text-sm text-gray-500 mt-1">System-wide</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Active Sessions</p>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-3xl">{users.filter(u => u.status === 'Active').length}</p>
            <p className="text-sm text-gray-500 mt-1">Logged in today</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => {
                setActiveTab('users');
                setSearchTerm('');
              }}
              className={`py-4 px-1 border-b-2 transition-colors ${activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span className="font-medium">Users</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('roles');
                setSearchTerm('');
              }}
              className={`py-4 px-1 border-b-2 transition-colors ${activeTab === 'roles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <Shield size={20} />
                <span className="font-medium">Roles & Permissions</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by username, name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px]"
                >
                  <option value="">All Roles</option>
                  <option value="Global Administrator">Global Administrator</option>
                  <option value="System Administrator">System Administrator</option>
                  <option value="Study Coordinator">Study Coordinator</option>
                  <option value="Approver">Approver</option>
                  <option value="Reader">Reader</option>
                  <option value="Report only">Report only</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-600">KUMC Username</th>
                        <th className="px-6 py-3 text-left text-gray-600">Name</th>
                        <th className="px-6 py-3 text-left text-gray-600">Email</th>
                        <th className="px-6 py-3 text-left text-gray-600">Department</th>
                        <th className="px-6 py-3 text-left text-gray-600">Organization</th>
                        <th className="px-6 py-3 text-left text-gray-600">Role</th>
                        <th className="px-6 py-3 text-left text-gray-600">Status</th>
                        <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className={`hover:bg-gray-50 ${user.status === 'Pending' ? 'bg-yellow-50' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {user.status === 'Pending' && (
                                <AlertCircle className="text-yellow-600" size={16} />
                              )}
                              <span className="font-medium font-mono text-sm">{user.kumcUsername}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                          <td className="px-6 py-4 text-sm">{user.email}</td>
                          <td className="px-6 py-4">{user.department}</td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {user.organization}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.role ? (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {user.role}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">Not assigned</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setViewingUser(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setViewingUser(user);
                                  setUserModalTab('role');
                                }}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                                title="Assign Role"
                              >
                                <Shield size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by role name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Roles Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-600">Role Name</th>
                        <th className="px-6 py-3 text-left text-gray-600">Description</th>
                        <th className="px-6 py-3 text-left text-gray-600">Status</th>
                        <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredRoles.map((role) => (
                        <tr key={role.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="text-purple-600" size={20} />
                              </div>
                              <span className="font-medium text-gray-900">{role.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-md">{role.description}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${role.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {role.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setViewingRole(role)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setViewingRole(role);
                                  setRoleModalTab('permissions');
                                }}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                                title="View Permissions"
                              >
                                <Key size={16} />
                              </button>
                            </div>
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

      {/* Refresh Users Modal */}
      {showRefreshModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => {
            if (!isRefreshing) {
              setShowRefreshModal(false);
              setRefreshStatus('idle');
            }
          }}></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Refresh Users from IDP</h3>
                {!isRefreshing && (
                  <button
                    onClick={() => {
                      setShowRefreshModal(false);
                      setRefreshStatus('idle');
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {refreshStatus === 'idle' && (
                <>
                  <p className="text-gray-600 mb-6">
                    This will connect to the external Identity Provider (IDP) system and query for new users. Any new users will be added to the system with a "Pending" status.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsRefreshing(true);
                        // Simulate API call to external IDP
                        setTimeout(() => {
                          setIsRefreshing(false);
                          setRefreshStatus('success');
                        }, 2000);
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 font-medium"
                    >
                      Start Refresh
                    </button>
                    <button
                      onClick={() => {
                        setShowRefreshModal(false);
                        setRefreshStatus('idle');
                      }}
                      className="flex-1 border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {isRefreshing && (
                <div className="text-center py-8">
                  <RefreshCw className="animate-spin mx-auto mb-4 text-green-600" size={48} />
                  <p className="text-gray-600">Connecting to IDP system...</p>
                  <p className="text-sm text-gray-500 mt-2">Please wait while we query for new users</p>
                </div>
              )}

              {refreshStatus === 'success' && (
                <>
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="text-green-600" size={32} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Refresh Successful!</h4>
                    <p className="text-gray-600 mb-1">Found 1 new user from IDP system</p>
                    <p className="text-sm text-gray-500">New user has been added with "Pending" status</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowRefreshModal(false);
                      setRefreshStatus('idle');
                      toast.success('User list refreshed from IDP');
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Close
                  </button>
                </>
              )}

              {refreshStatus === 'error' && (
                <>
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="text-red-600" size={32} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Refresh Failed</h4>
                    <p className="text-gray-600 mb-1">Could not connect to IDP system</p>
                    <p className="text-sm text-gray-500">Please try again later or contact IT support</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowRefreshModal(false);
                      setRefreshStatus('idle');
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Modal/Panel */}
      {showUserPanel && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseUserPanel}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl">
                  {isUserModalViewMode ? 'View User' : isUserModalEditMode ? 'Edit User' : 'Add New User'}
                </h2>
                {currentUser && (
                  <p className="text-sm text-gray-500 mt-1">{currentUser.kumcUsername}</p>
                )}
              </div>
              <button onClick={handleCloseUserPanel} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            {/* Tabs for User Panel */}
            {currentUser ? (
              <>
                <div className="border-b border-gray-200 px-6 bg-gray-50">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setUserModalTab('details')}
                      className={`py-3 px-1 border-b-2 transition-colors ${userModalTab === 'details'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield size={18} />
                        <span className="font-medium">Details</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setUserModalTab('role')}
                      className={`py-3 px-1 border-b-2 transition-colors ${userModalTab === 'role'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Key size={18} />
                        <span className="font-medium">Role</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Details Tab */}
                  {userModalTab === 'details' && (
                    <div>
                      <h3 className="text-lg border-b pb-2 mb-4">User Information</h3>

                      {/* Compact User Details Summary (Read-only from IDP) */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-32">KUMC Username:</span>
                            <span className="text-sm font-mono font-medium">{currentUser?.kumcUsername || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-32">Name:</span>
                            <span className="text-sm font-medium">{currentUser?.firstName || ''} {currentUser?.lastName || ''}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-32">Email:</span>
                            <span className="text-sm">{currentUser?.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-32">Department:</span>
                            <span className="text-sm">{currentUser?.department || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-32">Status:</span>
                            <span className={`text-sm px-2 py-0.5 rounded-full ${currentUser?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {currentUser?.status || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-32">Last Login:</span>
                            <span className="text-sm">{currentUser?.lastLogin || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {currentUser && (
                        <>
                          <div className="mt-4">
                            <label className="block text-gray-700 mb-2">Assigned Locations</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {currentUser.assignedLocations.length > 0 ? (
                                currentUser.assignedLocations.map((location: string, idx: number) => (
                                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                                    {location}
                                    {!isUserModalViewMode && (
                                      <button className="text-green-600 hover:text-green-800">
                                        <X size={14} />
                                      </button>
                                    )}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-400 py-1">Access to all locations</span>
                              )}
                            </div>
                            {!isUserModalViewMode && (
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                  type="text"
                                  placeholder="Search and add locations..."
                                  value={locationSearchTerm}
                                  onChange={(e) => setLocationSearchTerm(e.target.value)}
                                  onFocus={() => setShowLocationDropdown(true)}
                                  onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                {showLocationDropdown && locationSearchTerm && (
                                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {availableLocations
                                      .filter(location =>
                                        location.toLowerCase().includes(locationSearchTerm.toLowerCase()) &&
                                        !currentUser.assignedLocations.includes(location)
                                      )
                                      .map((location) => (
                                        <button
                                          key={location}
                                          onClick={() => {
                                            toast.success(`Added location: ${location}`);
                                            setLocationSearchTerm('');
                                            setShowLocationDropdown(false);
                                          }}
                                          className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                          <div className="text-sm">{location}</div>
                                        </button>
                                      ))}
                                    {availableLocations.filter(location =>
                                      location.toLowerCase().includes(locationSearchTerm.toLowerCase()) &&
                                      !currentUser.assignedLocations.includes(location)
                                    ).length === 0 && (
                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">No locations found</div>
                                      )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="mt-6">
                            <label className="block text-gray-700 mb-2">Studies (via Assigned Locations)</label>
                            <p className="text-xs text-gray-500 mb-3">Studies accessible through assigned locations</p>
                            {currentUser.assignedStudies.length > 0 ? (
                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full">
                                  <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Study Code</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Study Name</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {currentUser.assignedStudies.map((studyCode: string, idx: number) => {
                                      const study = availableStudies.find(s => s.code === studyCode);
                                      return (
                                        <tr key={idx} className="hover:bg-gray-50">
                                          <td className="px-4 py-2 text-sm font-mono">{studyCode}</td>
                                          <td className="px-4 py-2 text-sm text-gray-600">{study?.name || 'Unknown Study'}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-400">Access to all studies</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Role Tab */}
                  {userModalTab === 'role' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg">Role Assignment</h3>
                        <span className="text-sm text-gray-500">
                          Current: {currentUser.role}
                        </span>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700">
                          <strong>Note:</strong> {isUserModalViewMode ? 'This role is currently assigned to this user.' : 'Select one role for this user. The user will inherit all permissions from the selected role.'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {roles.map((role) => {
                          const isAssigned = currentUser.role === role.name;
                          return (
                            <label
                              key={role.id}
                              className={`flex items-center justify-between p-4 border rounded-lg ${isUserModalViewMode ? '' : 'cursor-pointer hover:bg-gray-50'
                                } ${isAssigned ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                                }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <input
                                  type="radio"
                                  name="user-role"
                                  defaultChecked={isAssigned}
                                  disabled={isUserModalViewMode}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{role.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {role.permissions.slice(0, 3).map((perm, idx) => (
                                      <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                        {perm.replace(/_/g, ' ')}
                                      </span>
                                    ))}
                                    {role.permissions.length > 3 && (
                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                        +{role.permissions.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {isAssigned && <Check className="text-purple-600 flex-shrink-0 ml-3" size={20} />}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Add New User - IDP Search
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg border-b pb-2 mb-4">Search IDP User</h3>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={idpSearchTerm}
                      onChange={(e) => setIdpSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* IDP Search Results */}
                  {idpSearchTerm && !selectedIdpUser && (
                    <div className="mt-3 border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                      {idpUsers.filter(user =>
                        user.firstName.toLowerCase().includes(idpSearchTerm.toLowerCase()) ||
                        user.lastName.toLowerCase().includes(idpSearchTerm.toLowerCase()) ||
                        user.kumcUsername.toLowerCase().includes(idpSearchTerm.toLowerCase())
                      ).map((user) => (
                        <button
                          key={user.kumcUsername}
                          onClick={() => {
                            setSelectedIdpUser(user);
                            setIdpSearchTerm('');
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-600">{user.kumcUsername} • {user.email}</div>
                          <div className="text-xs text-gray-500">{user.department}</div>
                        </button>
                      ))}
                      {idpUsers.filter(user =>
                        user.firstName.toLowerCase().includes(idpSearchTerm.toLowerCase()) ||
                        user.lastName.toLowerCase().includes(idpSearchTerm.toLowerCase()) ||
                        user.kumcUsername.toLowerCase().includes(idpSearchTerm.toLowerCase())
                      ).length === 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">No users found</div>
                        )}
                    </div>
                  )}

                  {/* Selected User Details */}
                  {selectedIdpUser && (
                    <>
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Selected User</h4>
                          <button
                            onClick={() => setSelectedIdpUser(null)}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Change
                          </button>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-32">KUMC Username:</span>
                            <span className="text-sm font-mono font-medium">{selectedIdpUser.kumcUsername}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-32">Name:</span>
                            <span className="text-sm font-medium">{selectedIdpUser.firstName} {selectedIdpUser.lastName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-32">Email:</span>
                            <span className="text-sm">{selectedIdpUser.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-32">Department:</span>
                            <span className="text-sm">{selectedIdpUser.department}</span>
                          </div>
                        </div>
                      </div>

                      {/* Role Assignment */}
                      <div className="mt-6">
                        <h3 className="text-lg border-b pb-2 mb-4">Assign Role</h3>
                        <p className="text-sm text-gray-600 mb-3">Select one role for this user:</p>
                        <div className="space-y-2">
                          {roles.map((role) => (
                            <label
                              key={role.id}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedUserRole === role.name ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                                }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <input
                                  type="radio"
                                  name="add-user-role"
                                  checked={selectedUserRole === role.name}
                                  onChange={() => setSelectedUserRole(role.name)}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{role.name}</p>
                                  <p className="text-xs text-gray-500">{role.description}</p>
                                </div>
                              </div>
                              {selectedUserRole === role.name && <Check className="text-purple-600 flex-shrink-0" size={16} />}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Location Assignment */}
                      <div className="mt-6">
                        <h3 className="text-lg border-b pb-2 mb-4">Assign Locations</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedUserLocations.length > 0 ? (
                            selectedUserLocations.map((location, idx) => (
                              <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                                {location}
                                <button
                                  onClick={() => setSelectedUserLocations(selectedUserLocations.filter(l => l !== location))}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <X size={14} />
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400 py-1">Access to all locations (no restrictions)</span>
                          )}
                        </div>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text"
                            placeholder="Search and add locations..."
                            value={locationSearchTerm}
                            onChange={(e) => setLocationSearchTerm(e.target.value)}
                            onFocus={() => setShowLocationDropdown(true)}
                            onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          {showLocationDropdown && locationSearchTerm && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {availableLocations
                                .filter(location =>
                                  location.toLowerCase().includes(locationSearchTerm.toLowerCase()) &&
                                  !selectedUserLocations.includes(location)
                                )
                                .map((location) => (
                                  <button
                                    key={location}
                                    onClick={() => {
                                      setSelectedUserLocations([...selectedUserLocations, location]);
                                      setLocationSearchTerm('');
                                      setShowLocationDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="text-sm">{location}</div>
                                  </button>
                                ))}
                              {availableLocations.filter(location =>
                                location.toLowerCase().includes(locationSearchTerm.toLowerCase()) &&
                                !selectedUserLocations.includes(location)
                              ).length === 0 && (
                                  <div className="px-4 py-3 text-sm text-gray-500 text-center">No locations found</div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex gap-3">
                <button
                  onClick={handleCloseUserPanel}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {isUserModalViewMode ? 'Close' : 'Cancel'}
                </button>
                {!isUserModalViewMode && (
                  <button
                    onClick={() => {
                      toast.success(isUserModalEditMode ? 'User updated successfully' : 'User added successfully');
                      handleCloseUserPanel();
                    }}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {isUserModalEditMode ? 'Save Changes' : 'Add User'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Modal/Panel */}
      {showRolePanel && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseRolePanel}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl">View Role</h2>
                {currentRole && (
                  <p className="text-sm text-gray-500 mt-1">{currentRole.name}</p>
                )}
              </div>
              <button onClick={handleCloseRolePanel} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            {/* Tabs for Role Panel */}
            {currentRole && (
              <>
                <div className="border-b border-gray-200 px-6 bg-gray-50">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setRoleModalTab('details')}
                      className={`py-3 px-1 border-b-2 transition-colors ${roleModalTab === 'details'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield size={18} />
                        <span className="font-medium">Details</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setRoleModalTab('permissions')}
                      className={`py-3 px-1 border-b-2 transition-colors ${roleModalTab === 'permissions'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Key size={18} />
                        <span className="font-medium">Permissions</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Details Tab */}
                  {roleModalTab === 'details' && (
                    <div>
                      <h3 className="text-lg border-b pb-2 mb-4">Role Information</h3>

                      <div>
                        <label className="block text-gray-700 mb-2">Role Name</label>
                        <p className="py-2 text-gray-900">{currentRole?.name}</p>
                      </div>

                      <div className="mt-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <p className="py-2 text-gray-900">{currentRole?.description}</p>
                      </div>

                      <div className="mt-4">
                        <label className="block text-gray-700 mb-2">Status</label>
                        <p className="py-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${currentRole.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {currentRole.status}
                          </span>
                        </p>
                      </div>

                      {/* Users with this role */}
                      <div className="mt-6">
                        <h3 className="text-lg border-b pb-2 mb-4">Users with this Role</h3>
                        {users.filter(u => u.role === currentRole.name).length > 0 ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Username</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Name</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Email</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Department</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {users.filter(u => u.role === currentRole.name).map((user) => (
                                  <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-mono">{user.kumcUsername}</td>
                                    <td className="px-4 py-3 text-sm">{user.firstName} {user.lastName}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-4 py-3 text-sm">{user.department}</td>
                                    <td className="px-4 py-3">
                                      <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="border border-gray-200 rounded-lg p-6 text-center">
                            <Users className="mx-auto text-gray-300 mb-2" size={48} />
                            <p className="text-sm text-gray-400">No users assigned to this role</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Permissions Tab */}
                  {roleModalTab === 'permissions' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg">Manage Permissions</h3>
                        <span className="text-sm text-gray-500">
                          {currentRole.permissions.length} of {allPermissions.length} selected
                        </span>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700">
                          <strong>Note:</strong> These permissions are currently assigned to this role.
                        </p>
                      </div>

                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        {Object.entries(groupPermissionsByCategory()).map(([category, perms], idx) => (
                          <div key={category} className={idx > 0 ? 'border-t border-gray-200' : ''}>
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                              <h4 className="font-medium text-gray-900">{category}</h4>
                            </div>
                            <div className="p-4 space-y-3">
                              {perms.map((perm) => (
                                <div key={perm.id} className="flex items-center gap-3 p-2 rounded">
                                  <input
                                    type="checkbox"
                                    checked={currentRole.permissions.includes(perm.id)}
                                    disabled
                                    className="w-4 h-4 text-blue-600 rounded"
                                  />
                                  <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-900">{perm.name}</span>
                                    <p className="text-xs text-gray-500">Permission ID: {perm.id}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={handleCloseRolePanel}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {showAssignRoleModal && assigningUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAssignRoleModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl">Assign Role</h2>
                <p className="text-sm text-gray-500 mt-1">{assigningUser.firstName} {assigningUser.lastName}</p>
              </div>
              <button onClick={() => setShowAssignRoleModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              <p className="text-sm text-gray-600 mb-4">Select one role for this user:</p>
              <div className="space-y-2">
                {roles.map((role) => {
                  const isAssigned = assigningUser.role === role.name;
                  return (
                    <label
                      key={role.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${isAssigned ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="user-role"
                          defaultChecked={isAssigned}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <p className="font-medium text-sm">{role.name}</p>
                          <p className="text-xs text-gray-500">{role.description}</p>
                        </div>
                      </div>
                      {isAssigned && <Check className="text-purple-600" size={16} />}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowAssignRoleModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Role updated successfully');
                  setShowAssignRoleModal(false);
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}