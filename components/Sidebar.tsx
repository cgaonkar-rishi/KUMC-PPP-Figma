import { LayoutDashboard, Users, UserCog, Calendar, Building2, FileText, ChevronLeft, ChevronRight, FlaskConical, UserRound, DollarSign, ChevronDown, ChevronUp, CreditCard, Workflow } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ currentPage, onNavigate, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [reportsExpanded, setReportsExpanded] = useState(false);
  const [paymentsExpanded, setPaymentsExpanded] = useState(false);

  const menuItems = [
    { 
      id: 'studies', 
      label: 'Studies', 
      icon: FlaskConical
    },
    { id: 'participants', label: 'Participants', icon: UserRound },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: DollarSign,
      hasSubmenu: true
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: FileText,
      hasSubmenu: true
    },
  ];

  return (
    <div className={`bg-ku-blue text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || currentPage.startsWith(item.id + '-');
            
            if (item.hasSubmenu && item.id === 'payments') {
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (isCollapsed) {
                        onNavigate(item.id);
                      } else {
                        setPaymentsExpanded(!paymentsExpanded);
                      }
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-white text-ku-blue shadow-lg' : 'hover:bg-ku-blue-dark/70'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (paymentsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </button>
                  
                  {!isCollapsed && paymentsExpanded && (
                    <ul className="mt-2 ml-4 space-y-1">
                      {/* Payment Requests Overview */}
                      <li>
                        <button
                          onClick={() => onNavigate('payments')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentPage === 'payments' ? 'bg-ku-blue-dark/50' : 'hover:bg-ku-blue-dark/30'
                          }`}
                        >
                          Payment Requests
                        </button>
                      </li>
                      
                      {/* Wizard Flow */}
                      <li>
                        <button
                          onClick={() => onNavigate('payments-wizard')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentPage === 'payments-wizard' ? 'bg-ku-blue-dark/50' : 'hover:bg-ku-blue-dark/30'
                          }`}
                        >
                          Create Payment Request
                        </button>
                      </li>
                      
                      {/* Completed Payments */}
                      <li>
                        <button
                          onClick={() => onNavigate('completed-payments')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentPage === 'completed-payments' ? 'bg-ku-blue-dark/50' : 'hover:bg-ku-blue-dark/30'
                          }`}
                        >
                          Completed Payments
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              );
            }
            
            if (item.hasSubmenu && item.id === 'reports') {
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (isCollapsed) {
                        onNavigate(item.id);
                      } else {
                        setReportsExpanded(!reportsExpanded);
                      }
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-white text-ku-blue shadow-lg' : 'hover:bg-ku-blue-dark/70'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (reportsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </button>
                  
                  {!isCollapsed && reportsExpanded && (
                    <ul className="mt-2 ml-4 space-y-1">
                      {/* Financial Reporting - single item */}
                      <li>
                        <button
                          onClick={() => onNavigate('reports-financial')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentPage.startsWith('reports-financial') ? 'bg-ku-blue-dark/50' : 'hover:bg-ku-blue-dark/30'
                          }`}
                        >
                          Financial Reporting
                        </button>
                      </li>
                      
                      {/* 1099 Tax Report */}
                      <li>
                        <button
                          onClick={() => onNavigate('reports-1099')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentPage === 'reports-1099' ? 'bg-ku-blue-dark/50' : 'hover:bg-ku-blue-dark/30'
                          }`}
                        >
                          1099 Tax Report
                        </button>
                      </li>
                      
                      {/* Reconciliation */}
                      <li>
                        <button
                          onClick={() => onNavigate('reports-reconciliation')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentPage === 'reports-reconciliation' ? 'bg-ku-blue-dark/50' : 'hover:bg-ku-blue-dark/30'
                          }`}
                        >
                          Reconciliation
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              );
            }
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-white text-ku-blue shadow-lg' : 'hover:bg-ku-blue-dark/70'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-400">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
            <span>A</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm">Admin User</p>
              <p className="text-xs text-blue-200">admin@hospital.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}