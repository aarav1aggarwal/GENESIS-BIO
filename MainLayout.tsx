import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar />
      <main className="lg:ml-64 flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
