import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { SparklesIcon, UsersIcon } from '../../components/Icons';
import { generateEventDescription, findBestMatches } from '../../services/geminiService';

const EventManager: React.FC = () => {
  const [eventName, setEventName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Shift State
  const [shiftRole, setShiftRole] = useState('');
  const [shiftSkills, setShiftSkills] = useState('');
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);

  const handleAiGenerate = async () => {
    if (!eventName || !keywords) return;
    setIsGenerating(true);
    const result = await generateEventDescription(eventName, keywords);
    setDescription(result);
    setIsGenerating(false);
  };

  const handleAiMatch = async () => {
    if (!shiftRole || !shiftSkills) return;
    setMatching(true);
    const result = await findBestMatches(shiftRole, shiftSkills.split(','));
    setMatches(result);
    setMatching(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Event & Roster Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Event Panel */}
        <Card title="Create New Event">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Name</label>
              <input 
                type="text" 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                placeholder="e.g., Summer Beach Cleanup"
              />
            </div>
            
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords for AI</label>
               <div className="flex gap-2">
                 <input 
                  type="text" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g., fun, sunny, teamwork, eco-friendly"
                />
                <button 
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !eventName}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium disabled:opacity-50 transition-colors"
                >
                  <SparklesIcon className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? '...' : 'AI Write'}
                </button>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                placeholder="Generated description will appear here..."
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button className="bg-primary hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-primary/20 transition-colors">
                Publish Event
              </button>
            </div>
          </div>
        </Card>

        {/* Shift & Matching Panel */}
        <Card title="AI Shift Matcher">
          <div className="space-y-4">
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
               Define a shift role and let Gemini AI find the best candidates from your volunteer pool.
             </p>

             <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shift Role</label>
              <input 
                type="text" 
                value={shiftRole}
                onChange={(e) => setShiftRole(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                placeholder="e.g., Team Logistics Lead"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Required Skills (Comma separated)</label>
              <input 
                type="text" 
                value={shiftSkills}
                onChange={(e) => setShiftSkills(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                placeholder="e.g., Leadership, Driving, Inventory"
              />
            </div>

            <button 
              onClick={handleAiMatch}
              disabled={matching || !shiftRole}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <UsersIcon className="w-5 h-5" />
              {matching ? 'Analyzing Roster...' : 'Find Top Candidates'}
            </button>

            {matches.length > 0 && (
              <div className="mt-6 space-y-3 animate-pulse-once">
                <h4 className="font-semibold text-slate-800 dark:text-white text-sm uppercase tracking-wide">Top Recommendations</h4>
                {matches.map((match, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200">{match}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EventManager;