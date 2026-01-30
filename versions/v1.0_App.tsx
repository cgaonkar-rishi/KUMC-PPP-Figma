import { useState } from 'react';
import { Dashboard } from '../components/Dashboard';
import { Studies } from '../components/Studies';
import { Participants } from '../components/Participants';
import { Payments } from '../components/Payments';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Toaster } from 'sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'studies':
        return <Studies />;
      case 'participants':
        return <Participants />;
      case 'payments':
        return <Payments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isCollapsed={false}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
