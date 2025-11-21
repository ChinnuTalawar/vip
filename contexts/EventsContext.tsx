import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    description: string;
    imageUrl: string;
    status: 'Published' | 'Draft' | 'Completed' | 'Ongoing';
    volunteers: number;
    totalSlots: number;
    shifts: number;
    organizerId?: string;
}

interface EventsContextType {
    events: Event[];
    addEvent: (event: Omit<Event, 'id'>) => void;
    updateEvent: (id: string, event: Partial<Event>) => void;
    deleteEvent: (id: string) => void;
    getEventById: (id: string) => Event | undefined;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

// Initial mock events
const INITIAL_EVENTS: Event[] = [
    {
        id: '1',
        name: 'Summer Beach Cleanup',
        date: '2024-07-15',
        location: 'Santa Monica Beach',
        description: 'Join us for a community beach cleanup event to help preserve our beautiful coastline.',
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        status: 'Published',
        volunteers: 24,
        totalSlots: 30,
        shifts: 3
    },
    {
        id: '2',
        name: 'Food Bank Distribution',
        date: '2024-07-20',
        location: 'Community Center',
        description: 'Help distribute food to families in need at our local community center.',
        imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop',
        status: 'Published',
        volunteers: 15,
        totalSlots: 20,
        shifts: 2
    },
    {
        id: '3',
        name: 'Tree Planting Initiative',
        date: '2024-08-05',
        location: 'Central Park',
        description: 'Plant trees and help make our city greener for future generations.',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
        status: 'Draft',
        volunteers: 0,
        totalSlots: 40,
        shifts: 4
    },
    {
        id: '4',
        name: 'Senior Care Visit',
        date: '2024-07-25',
        location: 'Sunrise Retirement Home',
        description: 'Spend quality time with seniors and brighten their day with conversation and activities.',
        imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=300&fit=crop',
        status: 'Published',
        volunteers: 8,
        totalSlots: 10,
        shifts: 1
    },
    {
        id: '5',
        name: 'Spring Community Garden Project',
        date: '2024-05-10',
        location: 'Downtown Community Garden',
        description: 'Successfully completed community garden project where volunteers planted vegetables and flowers, built raised beds, and created a beautiful green space for the neighborhood.',
        imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop',
        status: 'Completed',
        volunteers: 35,
        totalSlots: 40,
        shifts: 3
    },
    {
        id: '6',
        name: 'Winter Coat Drive',
        date: '2024-01-15',
        location: 'City Hall',
        description: 'Completed winter coat drive that collected and distributed over 500 coats to families in need. Volunteers sorted, cleaned, and organized donations for distribution.',
        imageUrl: 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=400&h=300&fit=crop',
        status: 'Completed',
        volunteers: 28,
        totalSlots: 30,
        shifts: 2
    }
];

export const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);

    const addEvent = (event: Omit<Event, 'id'>) => {
        const newEvent: Event = {
            ...event,
            id: Date.now().toString(), // Simple ID generation
        };
        setEvents(prev => [...prev, newEvent]);
    };

    const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
        setEvents(prev =>
            prev.map(event =>
                event.id === id ? { ...event, ...updatedEvent } : event
            )
        );
    };

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(event => event.id !== id));
    };

    const getEventById = (id: string) => {
        return events.find(event => event.id === id);
    };

    return (
        <EventsContext.Provider
            value={{
                events,
                addEvent,
                updateEvent,
                deleteEvent,
                getEventById,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventsProvider');
    }
    return context;
};
