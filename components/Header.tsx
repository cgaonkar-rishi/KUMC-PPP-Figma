import { Bell, Mail, User, Settings, LogOut, UserCircle, FlaskConical, Shield, FileText, ChevronRight, DollarSign, UserRound, Calendar as CalendarIcon, LayoutDashboard, HelpCircle, Building2, MapPin, ChevronLeft, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate?: (page: string) => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ currentPage, onNavigate, isSidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowProfileMenu(false);
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const notifications = [
    { id: 1, title: 'New participant enrolled', message: 'John Smith has been enrolled in CHS-2026-001', time: '5 min ago', type: 'success', read: false },
    { id: 2, title: 'Visit reminder', message: 'Sarah Johnson has a scheduled visit at 10:30 AM', time: '15 min ago', type: 'info', read: false },
    { id: 3, title: 'Study milestone reached', message: 'DPT-2025-019 has reached 200 participants', time: '1 hour ago', type: 'success', read: false },
    { id: 4, title: 'Document pending review', message: 'Protocol amendment requires your approval', time: '2 hours ago', type: 'warning', read: true },
    { id: 5, title: 'Visit completed', message: 'Michael Brown completed follow-up visit', time: '3 hours ago', type: 'info', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'studies':
        return 'Studies';
      case 'funding':
        return 'Funding and Grants';
      case 'organizations':
        return 'Organizations & Locations';
      case 'participants':
        return 'Participants';
      case 'visits':
        return 'Visits';
      case 'payments':
        return 'Payments';
      case 'reports':
        return 'Reports';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'studies':
        return 'Studies Management';
      case 'funding':
        return 'Funding Management';
      case 'organizations':
        return 'Organizations & Locations Management';
      case 'participants':
        return 'Participants Management';
      case 'visits':
        return 'Study Visits';
      case 'payments':
        return 'Participant Reimbursements';
      case 'reports':
        return 'Reports & Analytics';
      case 'settings':
        return 'System Settings';
      default:
        return 'Dashboard Overview';
    }
  };

  const getPageIcon = () => {
    switch (currentPage) {
      case 'dashboard':
        return DollarSign;
      case 'studies':
        return FlaskConical;
      case 'funding':
        return Building2;
      case 'organizations':
        return Building2;
      case 'participants':
        return UserRound;
      case 'visits':
        return CalendarIcon;
      case 'payments':
        return DollarSign;
      case 'reports':
        return FileText;
      case 'settings':
        return Settings;
      default:
        return LayoutDashboard;
    }
  };

  const PageIcon = getPageIcon();
  const iconBgColor = currentPage === 'payments' ? 'bg-green-600' : 'bg-ku-blue';

  return (
    <header className="bg-white border-b border-gray-200 flex items-center h-16">
      {/* Logo Section - Blended white background */}
      <div className={`h-16 bg-white flex items-center justify-between px-6 border-r border-gray-200 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {!isSidebarCollapsed && (
          <div className="flex-1 mr-2">
            <svg viewBox="0 0 200 40" className="w-full h-10" xmlns="http://www.w3.org/2000/svg">
              <text x="10" y="28" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#0051BA">KUMC</text>
              <text x="10" y="38" fontFamily="Arial, sans-serif" fontSize="8" fill="#0051BA">Medical Center</text>
            </svg>
          </div>
        )}
        {isSidebarCollapsed && (
          <div className="w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <text x="5" y="28" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#0051BA">K</text>
            </svg>
          </div>
        )}
        <button 
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          {isSidebarCollapsed ? <ChevronRight size={20} className="text-gray-700" aria-hidden="true" /> : <ChevronLeft size={20} className="text-gray-700" aria-hidden="true" />}
        </button>
      </div>

      {/* Header Content */}
      <div className="flex-1 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ku-blue to-ku-blue-dark rounded-full flex items-center justify-center">
            <UserCircle size={24} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Welcome Back</p>
            <h1 className="text-2xl text-ku-blue font-semibold tracking-tight">
              Participant Payment Portal
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate?.('dashboard')}
            aria-label="Go to dashboard"
            className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <LayoutDashboard size={20} className="text-gray-700 hover:text-blue-600 transition-colors" aria-hidden="true" />
          </button>

          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={showNotifications}
              aria-haspopup="true"
              className="relative p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <Bell size={20} className="text-gray-700 hover:text-blue-600 transition-colors" aria-hidden="true" />
              {unreadCount > 0 && (
                <>
                  <span className="sr-only">{unreadCount} unread notifications</span>
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" aria-hidden="true">
                    {unreadCount}
                  </span>
                </>
              )}
            </button>

            {/* Notifications Panel */}
            {showNotifications && (
              <div 
                role="region"
                aria-label="Notifications panel"
                className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3>Notifications</h3>
                  <button className="text-sm text-ku-blue hover:text-ku-blue-dark">Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-orange-500' :
                          'bg-ku-blue'
                        }`}></div>
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button className="text-sm text-ku-blue hover:text-ku-blue-dark">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate?.('help')}
            aria-label="Help and support"
            className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <HelpCircle size={20} className="text-gray-700 hover:text-blue-600 transition-colors" aria-hidden="true" />
          </button>

          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              aria-label="Settings menu"
              aria-expanded={showSettingsMenu}
              aria-haspopup="true"
              className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <Settings size={20} className="text-gray-700 hover:text-blue-600 transition-colors" aria-hidden="true" />
            </button>

            {/* Settings Menu Panel */}
            {showSettingsMenu && (
              <div 
                role="menu"
                aria-label="Settings menu"
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="p-4 border-b border-gray-200">
                  <h3 id="settings-menu-title">Settings</h3>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      onNavigate?.('organizations');
                      setShowSettingsMenu(false);
                    }}
                    role="menuitem"
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 focus:outline-none focus:bg-gray-100"
                  >
                    <Building2 size={18} aria-hidden="true" />
                    <span>Organizations & Locations</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate?.('funding');
                      setShowSettingsMenu(false);
                    }}
                    role="menuitem"
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 focus:outline-none focus:bg-gray-100"
                  >
                    <DollarSign size={18} aria-hidden="true" />
                    <span>Funding and Grants</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate?.('security');
                      setShowSettingsMenu(false);
                    }}
                    role="menuitem"
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 focus:outline-none focus:bg-gray-100"
                  >
                    <Shield size={18} aria-hidden="true" />
                    <span>Roles and Permissions</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="User profile menu"
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
              className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-ku-blue to-ku-blue-dark rounded-full flex items-center justify-center">
                <User size={20} className="text-white" aria-hidden="true" />
              </div>
            </button>

            {/* Profile Menu Panel */}
            {showProfileMenu && (
              <div 
                role="menu"
                aria-label="User profile menu"
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-ku-blue to-ku-blue-dark rounded-full flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Admin User</p>
                      <p className="text-sm text-gray-500">admin@ppp.com</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                    <UserCircle size={18} />
                    <span>My Profile</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                  <button 
                    onClick={() => onNavigate?.('sso')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                  >
                    <Shield size={18} />
                    <span>View SSO Login</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button 
                    onClick={() => onNavigate?.('sso')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600"
                  >
                    <LogOut size={18} />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-right ml-1">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="font-medium">Admin User</p>
          </div>
        </div>
      </div>
    </header>
  );
}