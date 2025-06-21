import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RightPanel from './components/RightPanel';

function App() {
  const [activeSection, setActiveSection] = useState('knowledge-articles');
  const [isMainContentCollapsed, setIsMainContentCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // If the main content is collapsed, expand it when a nav item is clicked
    if (isMainContentCollapsed) {
      setIsMainContentCollapsed(false);
    }
    // If the sidebar is collapsed, expand it when a nav item is clicked
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
    }
  };

  const handleCollapseAll = () => {
    setIsSidebarCollapsed(true);
    setIsMainContentCollapsed(true);
  };

  const handleExpandAll = () => {
    setIsSidebarCollapsed(false);
    setIsMainContentCollapsed(false);
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {!isSidebarCollapsed && (
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onLogoClick={() => setIsMainContentCollapsed(!isMainContentCollapsed)}
          onCollapseAll={handleCollapseAll}
        />
      )}
      {!isMainContentCollapsed && !isSidebarCollapsed && (
        <MainContent activeSection={activeSection} />
      )}
      <RightPanel 
        isExpanded={isMainContentCollapsed || isSidebarCollapsed} 
        isFullScreen={isSidebarCollapsed}
        onExpandAll={handleExpandAll}
      />
    </div>
  );
}

export default App;