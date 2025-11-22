import React from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, BriefcaseIcon, SparklesIcon } from '../components/Icons';

const Welcome: React.FC = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Interactive Background Texture */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {/* Glassmorphism Card */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 max-w-4xl w-full mx-4 shadow-2xl flex flex-col items-center text-center">

                {/* Logo / Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 border border-white/10 shadow-inner">
                    <SparklesIcon className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                    Eventure
                </h1>
                <p className="text-blue-100 text-lg mb-12 font-light tracking-wide">
                    Connecting passion with purpose.
                </p>

                {/* Role Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">

                    {/* Volunteer Option */}
                    <Link to="/login/volunteer" className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400/30 hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-cyan-500/10 p-6 flex flex-col items-center justify-center gap-4">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 bg-blue-500/20 rounded-full group-hover:bg-blue-500/30 transition-colors shadow-lg shadow-blue-500/10">
                            <UsersIcon className="w-8 h-8 text-blue-300 group-hover:text-blue-100 transition-colors" />
                        </div>
                        <div className="relative text-center">
                            <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-100 transition-colors">Volunteer</h3>
                            <p className="text-sm text-blue-200/60 group-hover:text-blue-200/80 transition-colors">Find events & track hours</p>
                        </div>
                    </Link>

                    {/* Admin Option */}
                    <Link to="/login/admin" className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-400/30 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/10 p-6 flex flex-col items-center justify-center gap-4">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 bg-purple-500/20 rounded-full group-hover:bg-purple-500/30 transition-colors shadow-lg shadow-purple-500/10">
                            <BriefcaseIcon className="w-8 h-8 text-purple-300 group-hover:text-purple-100 transition-colors" />
                        </div>
                        <div className="relative text-center">
                            <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-purple-100 transition-colors">Event Manager</h3>
                            <p className="text-sm text-purple-200/60 group-hover:text-purple-200/80 transition-colors">Organize & manage rosters</p>
                        </div>
                    </Link>

                </div>

                <div className="mt-12 text-xs text-white/30 font-mono">
                    VIP
                </div>
            </div>

            {/* Custom Animation Styles */}
            <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
};

export default Welcome;
