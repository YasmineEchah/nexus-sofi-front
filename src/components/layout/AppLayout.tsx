import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`;

const AppLayout: React.FC<{ children: React.ReactNode }>= ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <nav className="container mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <NavLink to="/" className={({isActive}) => isActive ? 'font-semibold text-primary' : 'font-semibold'}>SofiSoft</NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            <NavLink to="/stores" className={navLinkClass}>Magasins</NavLink>
            <NavLink to="/stock" className={navLinkClass}>Stock</NavLink>
            <NavLink to="/comparateur" className={navLinkClass}>Comparateur</NavLink>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to="/profile" className={navLinkClass}>Profil</NavLink>
            {user ? (
              <Button variant="outline" onClick={handleLogout}>Se déconnecter</Button>
            ) : (
              <Button onClick={() => navigate('/login')}>Se connecter</Button>
            )}
          </div>
        </nav>
      </header>
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
};

export default AppLayout;
