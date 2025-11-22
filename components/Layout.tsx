import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  UsersIcon,
  CalendarIcon,
  BriefcaseIcon,
  MoonIcon,
  SunIcon,
  LogOutIcon,
  GridIcon,
  PlusIcon,
  FileTextIcon,
  ChartIcon,
  SettingsIcon,
  ClockIcon,
  ChevronDownIcon,
  SearchIcon,
  TrophyIcon,
  SparklesIcon
} from './Icons';
import { useAuth } from '../contexts/AuthContext';
import UniversalSearch from './UniversalSearch';

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
  children,
  role,
  darkMode,
  toggleDarkMode,
  onLogout,
  currentPath,
  onNavigate
}) => {
  const { user } = useAuth();
  const [isAdditionalItemsOpen, setIsAdditionalItemsOpen] = useState(true);

  // Admin Sidebar Design
  if (role === UserRole.ADMIN) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-[#4338ca] text-white flex flex-col flex-shrink-0 transition-all duration-300">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-none">Eventure</h1>
                <span className="text-xs text-indigo-200">Event Management</span>
              </div>
            </div>
            <p className="text-xs text-indigo-200 mt-2 truncate">{user?.email}</p>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
            <nav className="space-y-1">
              <NavItem
                icon={<GridIcon />}
                label="Dashboard"
                active={currentPath === '/admin'}
                onClick={() => onNavigate('/admin')}
                admin
              />
              <NavItem
                icon={<CalendarIcon />}
                label="All Events"
                active={currentPath === '/admin/events'}
                onClick={() => onNavigate('/admin/events')}
                admin
              />
              <NavItem
                icon={<BriefcaseIcon />}
                label="College Events"
                active={currentPath === '/admin/college-events'}
                onClick={() => onNavigate('/admin/college-events')}
                admin
              />
              <NavItem
                icon={<PlusIcon />}
                label="Create Event"
                active={currentPath === '/admin/create'}
                onClick={() => onNavigate('/admin/create')}
                admin
              />
              <NavItem
                icon={<FileTextIcon />}
                label="Reports"
                active={currentPath === '/admin/reports'}
                onClick={() => onNavigate('/admin/reports')}
                admin
              />
              <NavItem
                icon={<ChartIcon />}
                label="Attendee Insights"
                active={currentPath === '/admin/insights'}
                onClick={() => onNavigate('/admin/insights')}
                admin
              />
            </nav>

            <div className="mt-8">
              <button
                onClick={() => setIsAdditionalItemsOpen(!isAdditionalItemsOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-3 px-3 hover:text-white transition-colors group"
              >
                <span>Additional Items</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isAdditionalItemsOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isAdditionalItemsOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <nav className="space-y-1">
                  <NavItem
                    icon={<UsersIcon />}
                    label="Volunteers"
                    active={currentPath === '/admin/roster'}
                    onClick={() => onNavigate('/admin/roster')}
                    admin
                  />
                  <NavItem
                    icon={<SettingsIcon />}
                    label="Settings"
                    active={currentPath === '/admin/settings'}
                    onClick={() => onNavigate('/admin/settings')}
                    admin
                  />
                </nav>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-indigo-100 hover:bg-white/10 rounded-xl transition-colors text-sm font-medium"
            >
              <LogOutIcon className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
              {currentPath.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
              <UniversalSearch onNavigate={onNavigate} />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Volunteer Layout - Matching Admin Theme
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#4338ca] text-white flex flex-col flex-shrink-0 transition-all duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">Eventure</h1>
              <span className="text-xs text-indigo-200">Event Management</span>
            </div>
          </div>
          <p className="text-xs text-indigo-200 mt-2 truncate">{user?.email}</p>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <nav className="space-y-1">
            <NavItem
              icon={<GridIcon />}
              label="Dashboard"
              active={currentPath === '/volunteer'}
              onClick={() => onNavigate('/volunteer')}
              admin
            />
            <NavItem
              icon={<SearchIcon />}
              label="Browse Events"
              active={currentPath === '/volunteer/browse'}
              onClick={() => onNavigate('/volunteer/browse')}
              admin
            />
            <NavItem
              icon={<SparklesIcon />}
              label="Recommended"
              active={currentPath === '/volunteer/recommended'}
              onClick={() => onNavigate('/volunteer/recommended')}
              admin
            />
            <NavItem
              icon={<CalendarIcon />}
              label="My Events"
              active={currentPath === '/volunteer/schedule'}
              onClick={() => onNavigate('/volunteer/schedule')}
              admin
            />
            <NavItem
              icon={<FileTextIcon />}
              label="My Certificates"
              active={currentPath === '/volunteer/certificates'}
              onClick={() => onNavigate('/volunteer/certificates')}
              admin
            />
            <NavItem
              icon={<ChartIcon />}
              label="Statistics"
              active={currentPath === '/volunteer/stats'}
              onClick={() => onNavigate('/volunteer/stats')}
              admin
            />
            <NavItem
              icon={<TrophyIcon />}
              label="Leaderboard"
              active={currentPath === '/volunteer/leaderboard'}
              onClick={() => onNavigate('/volunteer/leaderboard')}
              admin
            />
            <NavItem
              icon={<UsersIcon />}
              label="Profile"
              active={currentPath === '/volunteer/profile'}
              onClick={() => onNavigate('/volunteer/profile')}
              admin
            />
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-indigo-100 hover:bg-white/10 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOutIcon className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
            {currentPath.split('/').pop()?.replace('-', ' ') || 'Volunteer'}
          </h2>
          <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
            <UniversalSearch onNavigate={onNavigate} />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};


interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  admin?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, admin }) => {
  if (admin) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group ${active
          ? 'bg-white/10 text-white shadow-sm'
          : 'text-indigo-100 hover:bg-white/5 hover:text-white'
          }`}
      >
        <div className={`w-5 h-5 ${active ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`}>
          {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
        </div>
        <span className="font-medium text-sm">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center lg:justify-start gap-3 w-full p-3 rounded-xl transition-all duration-200 ${active
        ? 'bg-primary text-white shadow-lg shadow-primary/30'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
        }`}
    >
      <div className="w-5 h-5">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      </div>
      <span className="hidden lg:block font-medium text-sm">{label}</span>
    </button>
  );
};

export default Layout;