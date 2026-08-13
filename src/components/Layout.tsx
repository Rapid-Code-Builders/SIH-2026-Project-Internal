import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#07111F] text-slate-200 flex">
      {showSidebar && <Sidebar />}
      
      <main className="flex-1 overflow-x-hidden min-w-0">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
