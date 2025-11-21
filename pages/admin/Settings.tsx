import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { deleteUserAccount } from '../../services/supabaseService';
import Card from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!user) return;

        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setIsDeleting(true);
            const success = await deleteUserAccount(user.id);
            if (success) {
                await signOut();
                navigate('/login');
            } else {
                alert('Failed to delete account. Please try again.');
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your profile, preferences, and account security.</p>
            </div>

            {/* Profile Section */}
            <Card title="Profile Information" className="border-t-4 border-t-purple-500">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-lg">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                    <div className="flex-1 space-y-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user?.user_metadata?.full_name || ''}
                                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                            <textarea
                                rows={3}
                                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="Tell us a little about yourself..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Preferences Section */}
            <Card title="Preferences">
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Email Notifications</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates about your events and roster changes.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Dark Mode</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark themes.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>
            </Card>

            {/* Danger Zone */}
            <div className="pt-6">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Danger Zone
                </h3>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Delete Account</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Permanently delete your account and all of your content. This action cannot be undone.
                            </p>
                        </div>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/20 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
