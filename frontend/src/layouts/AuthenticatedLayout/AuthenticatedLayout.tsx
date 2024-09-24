import React from 'react';
import Header from './components/Header';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <div >
      <Header />
      <main className="flex-grow mt-16 px-6 py-4 bg-background">
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
