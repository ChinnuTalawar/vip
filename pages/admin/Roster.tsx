import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { ROSTER_DATA } from '../../services/mockData';
import { UsersIcon, BriefcaseIcon, DownloadIcon } from '../../components/Icons';

const Roster: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string, visible: boolean, type: 'success' | 'error' }>({ message: '', visible: false, type: 'success' });

  const filteredRoster = ROSTER_DATA.filter(entry => {
    const matchesSearch = entry.volunteerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const handleExport = () => {
    setIsExporting(true);

    try {
      // Generate CSV from filteredRoster
      const headers = ['Volunteer Name', 'Volunteer Email', 'Event Name', 'Role', 'Date', 'Status'];
      const csvRows = filteredRoster.map(entry => [
        `"${entry.volunteerName}"`,
        `"${entry.volunteerEmail}"`,
        `"${entry.eventName}"`,
        `"${entry.shiftRole}"`,
        `"${new Date(entry.date).toLocaleDateString()}"`,
        `"${entry.status}"`
      ]);

      const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Volunteer_Roster_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToast({ message: 'Roster exported successfully!', visible: true, type: 'success' });
    } catch (error) {
      console.error('Export failed:', error);
      setToast({ message: 'Failed to export roster.', visible: true, type: 'error' });
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-bounce-up border ${toast.type === 'success' ? 'bg-[#4CAF50] text-white border-green-600' : 'bg-red-500 text-white border-red-600'}`}>
          <div className="bg-white/20 rounded-full p-1">
            {toast.type === 'success' ? (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
          </div>
          <div className="font-medium">{toast.message}</div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Volunteer Roster</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage assignments and track attendance.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-[#435663] hover:bg-[#33424d] text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <DownloadIcon className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export My Volunteers (CSV)'}</span>
          </button>

          <button className="bg-primary hover:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            <span>Add Volunteer</span>
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search volunteers or events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Volunteer</th>
                <th className="px-4 py-3">Event & Role</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoster.map((entry) => (
                <tr key={entry.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img className="w-8 h-8 rounded-full" src={entry.avatar} alt={entry.volunteerName} />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{entry.volunteerName}</div>
                        <div className="text-xs text-slate-500">{entry.volunteerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-white">{entry.eventName}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <BriefcaseIcon className="w-3 h-3" /> {entry.shiftRole}
                    </div>
                  </td>
                  <td className="px-4 py-3">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-primary dark:hover:text-white font-medium text-xs transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRoster.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No roster entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Roster;