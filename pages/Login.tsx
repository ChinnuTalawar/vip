import React from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6">
          V
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">VolunTier AI</h1>
        <p className="text-slate-500 mb-8">Select a role to proceed to the MVP demo.</p>

        <div className="space-y-4">
          <button
            onClick={() => onLogin(UserRole.ADMIN)}
            className="w-full py-4 px-6 bg-primary hover:bg-slate-700 text-white rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <span>Login as Administrator</span>
          </button>

          <button
            onClick={() => onLogin(UserRole.VOLUNTEER)}
            className="w-full py-4 px-6 bg-white border-2 border-slate-200 hover:border-primary text-slate-700 hover:text-primary rounded-xl font-semibold transition-all transform hover:scale-[1.02]"
          >
            Login as Volunteer
          </button>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          VIP
        </p>
      </div>
    </div>
  );
};

export default Login;