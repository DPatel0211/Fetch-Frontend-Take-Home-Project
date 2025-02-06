import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DogsProvider } from './contexts/DogsContext';
import { LoginForm } from './components/auth/LoginForm';
import { DogSearch } from './components/dogs/DogSearch';
import { FavoritesPage } from './components/pages/FavoritesPage';
import { MatchPage } from './components/pages/MatchPage';
import { Layout } from './components/layout/Layout';
import { useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

type Page = 'search' | 'favorites' | 'match';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('search');

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <DogSearch />;
      case 'favorites':
        return <FavoritesPage onNavigate={setCurrentPage} />;
      case 'match':
        return <MatchPage onNavigate={setCurrentPage} />;
      default:
        return <DogSearch />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <DogsProvider>
            <AppContent />
          </DogsProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
