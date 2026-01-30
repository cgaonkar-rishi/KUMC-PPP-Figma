import { useState } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Studies } from './components/Studies';
import { Participants } from './components/Participants';
import { Funding } from './components/Funding';
import { OrganizationsLocations } from './components/OrganizationsLocations';
import { SSOLogin } from './components/SSOLogin';
import { Security } from './components/Security';
import { Payments } from './components/Payments';
import { PaymentRequestWizard } from './components/PaymentRequestWizard';
import { CompletedPayments } from './components/CompletedPayments';
import { Reports } from './components/Reports';
import { Help } from './components/Help';

export default function App() {
  const [currentPage, setCurrentPage] = useState('studies');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSSO, setShowSSO] = useState(false);

  // Allow toggling SSO view via URL hash or button
  // In production, this would be handled by proper auth flow
  const handleShowSSO = () => setShowSSO(true);
  const handleHideSSO = () => {
    setShowSSO(false);
    setCurrentPage('studies');
  };

  // Show SSO login screen
  if (showSSO) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <SSOLogin onReturnToApp={handleHideSSO} />
      </>
    );
  }

  const renderPage = () => {
    if (currentPage.startsWith('reports')) {
      return <Reports reportType={currentPage} />;
    }
    
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'studies':
        return <Studies />;
      case 'funding':
        return <Funding />;
      case 'organizations':
        return <OrganizationsLocations />;
      case 'security':
        return <Security />;
      case 'participants':
        return <Participants />;
      case 'payments':
        return <Payments />;
      case 'payments-wizard':
        return <PaymentRequestWizard onBack={() => setCurrentPage('payments')} />;
      case 'completed-payments':
        return <CompletedPayments />;
      case 'help':
        return <Help />;
      case 'sso':
        handleShowSSO();
        return null;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col flex-1">
        <Header 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <main className="flex-1 overflow-y-auto p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}