import React from 'react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side - Hero */}
                <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white flex flex-col justify-center items-center text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm mb-8">
                        <span className="text-4xl font-bold">V</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">VolunTier AI</h1>
                    <p className="text-lg text-blue-100 mb-8">
                        Connecting passionate volunteers with meaningful opportunities through the power of AI.
                    </p>
                </div>

                {/* Right Side - Selection */}
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Welcome</h2>
                    <p className="text-slate-500 mb-10 text-center">Choose your portal to get started</p>

                    <div className="space-y-6">
                        {/* Volunteer Option */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-300 to-blue-600 rounded-2xl opacity-30 group-hover:opacity-100 transition duration-200 blur"></div>
                            <Link to="/login/volunteer" className="relative flex items-center p-6 bg-white rounded-xl leading-none hover:bg-blue-50 transition duration-200 border border-slate-100">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-1">I am a Volunteer</h3>
                                    <p className="text-sm text-slate-500">Find events, track hours, and make an impact.</p>
                                </div>
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </Link>
                        </div>

                        {/* Admin Option */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-300 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-100 transition duration-200 blur"></div>
                            <Link to="/login/admin" className="relative flex items-center p-6 bg-white rounded-xl leading-none hover:bg-purple-50 transition duration-200 border border-slate-100">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-1">I am an Event Manager</h3>
                                    <p className="text-sm text-slate-500">Organize events, manage rosters, and track stats.</p>
                                </div>
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-xs text-slate-400">
                        Powered by Gemini AI • v0.1.0 MVP
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
