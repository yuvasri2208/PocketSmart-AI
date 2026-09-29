import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VSCodeGuideModal } from './components/VSCodeGuideModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePlannerPage } from './pages/HomePlannerPage';
import { PartyPlannerPage } from './pages/PartyPlannerPage';
import { JewelryPlannerPage } from './pages/JewelryPlannerPage';
import { HistoryPage } from './pages/HistoryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RecommendationHistoryItem } from './types';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<RecommendationHistoryItem | null>(null);

  const renderContent = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return (
          <DashboardPage
            setCurrentPage={setCurrentPage}
            setSelectedHistoryItem={setSelectedHistoryItem}
          />
        );
      case 'home-planner':
        return <HomePlannerPage />;
      case 'party-planner':
        return <PartyPlannerPage />;
      case 'jewelry-planner':
        return <JewelryPlannerPage />;
      case 'history':
        return <HistoryPage selectedHistoryItem={selectedHistoryItem} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'register':
        return <RegisterPage setCurrentPage={setCurrentPage} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="flex-1">{renderContent()}</main>

      <Footer setCurrentPage={setCurrentPage} />

      <VSCodeGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
