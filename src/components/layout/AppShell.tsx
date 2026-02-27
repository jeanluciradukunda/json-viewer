import React from 'react';
import type { SidebarView } from '@/types/ui';
import type { JsonStats } from '@/types/json';
import DottedBackground from '@/components/layout/DottedBackground';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/sidebar/Sidebar';

interface AppShellProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  onExpand?: () => void;
  stats: JsonStats | null;
  isPopup?: boolean;
  tabBar?: React.ReactNode;
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({
  activeView,
  onViewChange,
  onExpand,
  stats,
  isPopup,
  tabBar,
  children,
}) => {
  return (
    <DottedBackground>
      <div
        className="flex flex-col h-full"
        style={isPopup ? { width: '400px', height: '500px' } : undefined}
      >
        <Header onExpand={onExpand} isPopup={isPopup} />
        {tabBar}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeView={activeView}
            onViewChange={onViewChange}
            onExpand={onExpand}
          />
          <main className="flex-1 overflow-auto p-3">
            {children}
          </main>
        </div>
        <Footer stats={stats} />
      </div>
    </DottedBackground>
  );
};

export default AppShell;
