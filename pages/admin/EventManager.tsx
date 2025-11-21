import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { SparklesIcon, UsersIcon } from '../../components/Icons';
import { generateEventDescription, findBestMatches } from '../../services/geminiService';
import { uploadEventImage } from '../../services/supabaseService';
import { useEvents } from '../../contexts/EventsContext';

const EventManager: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addEvent, updateEvent, getEventById } = useEvents();
  const eventId = searchParams.get('eventId');
  const isEditMode = !!eventId;

  const [eventName, setEventName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Completed' | 'Ongoing'>('Draft');
  const [volunteers, setVolunteers] = useState(0);
  const [totalSlots, setTotalSlots] = useState(30);
  const [shifts, setShifts] = useState(1);

  // Shift State
  const [shiftRole, setShiftRole] = useState('');
  const [shiftSkills, setShiftSkills] = useState('');
  const [matching, setMatching] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);

  // Load event data if in edit mode
  useEffect(() => {
    if (isEditMode && eventId) {
      const event = getEventById(eventId);
      if (event) {
        setEventName(event.name);
        setDescription(event.description);
        setImageUrl(event.imageUrl);
        setDate(event.date);
        setLocation(event.location);
        setStatus(event.status);
        setVolunteers(event.volunteers);
        setTotalSlots(event.totalSlots);
        setShifts(event.shifts);
      }
    }
  }, [isEditMode, eventId, getEventById]);

  const handleSaveEvent = (targetStatus: 'Published' | 'Draft' | 'Completed' | 'Ongoing') => {
    // Validation
    if (!eventName || !description || !date || !location) {
      alert('Please fill in all required fields (Event Name, Description, Date, Location)');
      return;
    }

    const eventData = {
      name: eventName,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      date,
      location,
      status: targetStatus,
      volunteers,
      totalSlots,
      shifts
    };

    if (isEditMode && eventId) {
      // Update existing event
      updateEvent(eventId, eventData);
      alert('Event updated successfully!');
    } else {
      // Create new event
      addEvent(eventData);
      alert('Event saved successfully!');
    }

    // Navigate back to all events page
    navigate('/admin/events');
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setUploading(true);
    const file = e.target.files[0];
    const url = await uploadEventImage(file);
    if (url) {
      setImageUrl(url);
    } else {
      alert('Failed to upload image');
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEditMode ? 'Edit Event' : 'Event & Roster Management'}
        </h1>
        {isEditMode && (
          <button
            onClick={() => navigate('/admin/events')}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ← Back to All Events
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create/Edit Event Panel */}
        <Card title={isEditMode ? 'Edit Event Details' : 'Create New Event'}>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Image</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="w-full p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {imageUrl && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g., Central Park, New York"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Slots</label>
                <input
                  type="number"
                  value={totalSlots}
                  onChange={(e) => setTotalSlots(parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Shifts</label>
                <input
                  type="number"
                  value={shifts}
                  onChange={(e) => setShifts(parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  min="1"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              {isEditMode && (
                <>
                  <button
                    onClick={() => {
                      alert('Sent reminder');
                    }}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium shadow-lg shadow-amber-500/20 transition-colors"
                  >
                    Send Reminder
                  </button>
                  <button
                    onClick={() => navigate('/admin/events')}
                    className="px-6 py-3 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={() => handleSaveEvent('Draft')}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSaveEvent('Published')}
                className="bg-primary hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-primary/20 transition-colors"
              >
                {isEditMode ? 'Update & Publish' : 'Publish Event'}
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