import React from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  currentPage: string;
  onNavigate: (page: 'search' | 'favorites' | 'match') => void;
  children: React.ReactNode;
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onNavigate={onNavigate} currentPage={currentPage} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
