import React from 'react';
import { UserRole } from '../types';
import { UsersIcon, CalendarIcon, BriefcaseIcon, MoonIcon, SunIcon, LogOutIcon } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children, role, darkMode, toggleDarkMode, onLogout, currentPath, onNavigate
}) => {
  const isAdmin = role === UserRole.ADMIN;

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: <BriefcaseIcon className="w-5 h-5" /> },
    { name: 'Event Manager', path: '/admin/events', icon: <CalendarIcon className="w-5 h-5" /> },
    { name: 'Roster', path: '/admin/roster', icon: <UsersIcon className="w-5 h-5" /> },
  ];

  const volunteerLinks = [
    { name: 'Browse Opportunities', path: '/volunteer', icon: <BriefcaseIcon className="w-5 h-5" /> },
    { name: 'My Schedule', path: '/volunteer/schedule', icon: <CalendarIcon className="w-5 h-5" /> },
  ];

  const links = isAdmin ? adminLinks : volunteerLinks;

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col fixed h-full z-10 transition-colors dark:bg-slate-900">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xl">V</div>
          <span className="font-bold text-xl tracking-tight">VolunTier AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => onNavigate(link.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPath === link.path
                ? 'bg-white/20 text-white font-medium'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-red-300 transition-colors"
          >
            <LogOutIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-slate-50 text-slate-900 dark:bg-dark-bg dark:text-dark-text transition-colors min-h-screen">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;