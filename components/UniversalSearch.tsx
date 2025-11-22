import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, CalendarIcon, UsersIcon, ClockIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { getEvents, getAllVolunteers } from '../services/supabaseService';

interface SearchResult {
    id: string;
    title: string;
    subtitle: string;
    type: 'event' | 'volunteer' | 'schedule';
    path: string;
    icon: React.ReactNode;
}

interface UniversalSearchProps {
    onNavigate: (path: string) => void;
}

const UniversalSearch: React.FC<UniversalSearchProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search functionality
    useEffect(() => {
        const performSearch = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            const searchResults: SearchResult[] = [];
            const lowerQuery = query.toLowerCase();

            try {
                // Search events
                const events = await getEvents();
                const matchedEvents = events
                    .filter(event =>
                        event.name.toLowerCase().includes(lowerQuery) ||
                        event.location.toLowerCase().includes(lowerQuery) ||
                        event.description.toLowerCase().includes(lowerQuery)
                    )
                    .slice(0, 5)
                    .map(event => ({
                        id: event.id,
                        title: event.name,
                        subtitle: `${event.location} • ${new Date(event.date).toLocaleDateString()}`,
                        type: 'event' as const,
                        path: user?.role === UserRole.ADMIN ? `/admin/events` : `/volunteer/browse`,
                        icon: <CalendarIcon className="w-4 h-4" />
                    }));

                searchResults.push(...matchedEvents);

                // Search volunteers (Admin only)
                if (user?.role === UserRole.ADMIN) {
                    const volunteers = await getAllVolunteers();
                    const matchedVolunteers = volunteers
                        .filter(volunteer =>
                            volunteer.name.toLowerCase().includes(lowerQuery) ||
                            volunteer.email.toLowerCase().includes(lowerQuery)
                        )
                        .slice(0, 3)
                        .map(volunteer => ({
                            id: volunteer.id,
                            title: volunteer.name,
                            subtitle: `${volunteer.email} • ${volunteer.eventsCount || 0} events`,
                            type: 'volunteer' as const,
                            path: `/admin/roster`,
                            icon: <UsersIcon className="w-4 h-4" />
                        }));

                    searchResults.push(...matchedVolunteers);
                }

                setResults(searchResults);
                setSelectedIndex(0);
            } catch (error) {
                console.error('Search error:', error);
            }
        };

        const debounceTimer = setTimeout(performSearch, 300);
        return () => clearTimeout(debounceTimer);
    }, [query, user?.role]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % results.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    const handleSelect = (result: SearchResult) => {
        onNavigate(result.path);
        setQuery('');
        setIsOpen(false);
        setResults([]);
    };

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search events, volunteers... (⌘K)"
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            setIsOpen(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2">
                        {results.map((result, index) => (
                            <button
                                key={`${result.type}-${result.id}`}
                                onClick={() => handleSelect(result)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${index === selectedIndex
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${index === selectedIndex
                                        ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                    }`}>
                                    {result.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{result.title}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{result.subtitle}</div>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className={`text-xs px-2 py-1 rounded ${result.type === 'event'
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                            : result.type === 'volunteer'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                        }`}>
                                        {result.type}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {isOpen && query.length >= 2 && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-8 text-center z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <SearchIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">No results found for "{query}"</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Try searching for events or volunteers</p>
                </div>
            )}
        </div>
    );
};

export default UniversalSearch;
