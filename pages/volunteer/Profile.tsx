import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UsersIcon, SaveIcon, TrashIcon, CameraIcon } from '../../components/Icons';
import Card from '../../components/ui/Card';
import { deleteUserAccount } from '../../services/supabaseService';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.user_metadata?.full_name || 'Volunteer');
    const [email] = useState(user?.email || '');
    const [skills, setSkills] = useState<string>('Event Planning, Team Leadership');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsEditing(false);
        setIsLoading(false);
        // In a real app, update Supabase user metadata or profile table
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            const success = await deleteUserAccount(user.id);
            if (success) {
                await signOut();
                navigate('/login');
            } else {
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UsersIcon className="w-8 h-8 text-indigo-500" />
                My Profile
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="text-center p-6">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold mx-auto border-4 border-white dark:border-slate-800 shadow-lg">
                                {email.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md">
                                <CameraIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{name}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{email}</p>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium">
                            Active Volunteer
                        </div>
                    </Card>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Personal Information">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Skills & Interests
                                </label>
                                <textarea
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    disabled={!isEditing}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                    placeholder="E.g., Event Planning, Photography, First Aid..."
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                {isEditing ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70"
                                        >
                                            {isLoading ? 'Saving...' : (
                                                <>
                                                    <SaveIcon className="w-4 h-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                        >
                            <TrashIcon className="w-4 h-4" />
                            Delete Account
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
