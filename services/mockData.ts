import { Event, User, UserRole, DashboardStats, ChartData, RosterEntry } from '../types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Volunteer',
  email: 'alex@example.com',
  role: UserRole.VOLUNTEER,
  avatar: 'https://picsum.photos/100/100',
  skills: ['Teaching', 'First Aid', 'Logistics'],
  totalHours: 42.5
};

export const ADMIN_USER: User = {
  id: 'a1',
  name: 'Sarah Admin',
  email: 'sarah@org.com',
  role: UserRole.ADMIN,
  avatar: 'https://picsum.photos/101/101'
};

export const EVENTS: Event[] = [
  {
    id: 'e1',
    name: 'City Park Cleanup',
    date: '2024-06-15',
    location: 'Central Park, Downtown',
    description: 'Join us for a community-wide effort to clean up Central Park. We will be removing litter, planting flowers, and painting benches.',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    category: 'Environment',
    shifts: [
      { 
        id: 's1', 
        role: 'Team Leader', 
        startTime: '08:00', 
        endTime: '12:00', 
        requiredCount: 5, 
        filledCount: 2,
        assignedVolunteers: [
          { id: 'v1', name: 'John Doe', avatar: 'https://picsum.photos/50/50?random=1' },
          { id: 'v2', name: 'Jane Smith', avatar: 'https://picsum.photos/50/50?random=2' }
        ]
      },
      { 
        id: 's2', 
        role: 'General Cleanup', 
        startTime: '09:00', 
        endTime: '13:00', 
        requiredCount: 50, 
        filledCount: 34,
        assignedVolunteers: [
          { id: 'v3', name: 'Michael Brown', avatar: 'https://picsum.photos/50/50?random=3' },
          { id: 'v4', name: 'Emily Davis', avatar: 'https://picsum.photos/50/50?random=4' },
          { id: 'v5', name: 'David Wilson', avatar: 'https://picsum.photos/50/50?random=5' },
          { id: 'v6', name: 'Sarah Johnson', avatar: 'https://picsum.photos/50/50?random=6' },
          { id: 'v7', name: 'Tom Anderson', avatar: 'https://picsum.photos/50/50?random=7' }
        ]
      }
    ]
  },
  {
    id: 'e2',
    name: 'Food Bank Sort-a-thon',
    date: '2024-06-20',
    location: 'Community Center Hall',
    description: 'Help us sort and pack food donations for local families in need. This is a high-energy event requiring lifting and organization skills.',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    category: 'Community',
    shifts: [
      { 
        id: 's3', 
        role: 'Sorter', 
        startTime: '10:00', 
        endTime: '14:00', 
        requiredCount: 20, 
        filledCount: 20,
        assignedVolunteers: [
          { id: 'v8', name: 'Lisa Garcia', avatar: 'https://picsum.photos/50/50?random=8' },
          { id: 'v9', name: 'Robert Lee', avatar: 'https://picsum.photos/50/50?random=9' },
          { id: 'v10', name: 'Amanda White', avatar: 'https://picsum.photos/50/50?random=10' }
        ]
      },
      { 
        id: 's4', 
        role: 'Driver', 
        startTime: '13:00', 
        endTime: '17:00', 
        requiredCount: 5, 
        filledCount: 1,
        assignedVolunteers: [
          { id: 'v11', name: 'Chris Martinez', avatar: 'https://picsum.photos/50/50?random=11' }
        ]
      }
    ]
  },
  {
    id: 'e3',
    name: 'Tech Literacy Workshop',
    date: '2024-07-05',
    location: 'Public Library',
    description: 'Teach seniors how to use smartphones and tablets. Patience and tech knowledge required.',
    imageUrl: 'https://picsum.photos/800/400?random=3',
    category: 'Education',
    shifts: [
      { 
        id: 's5', 
        role: 'Instructor', 
        startTime: '14:00', 
        endTime: '16:00', 
        requiredCount: 10, 
        filledCount: 4,
        assignedVolunteers: [
          { id: 'v12', name: 'Daniel Kim', avatar: 'https://picsum.photos/50/50?random=12' },
          { id: 'v13', name: 'Rachel Green', avatar: 'https://picsum.photos/50/50?random=13' },
          { id: 'v14', name: 'Kevin Brown', avatar: 'https://picsum.photos/50/50?random=14' },
          { id: 'v15', name: 'Monica Chen', avatar: 'https://picsum.photos/50/50?random=15' }
        ]
      }
    ]
  }
];

export const ADMIN_STATS: DashboardStats = {
  totalHours: 1240,
  activeVolunteers: 342,
  openShifts: 18,
  upcomingEvents: 5
};

export const CHART_DATA_HOURS: ChartData[] = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 150 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 180 },
  { name: 'May', value: 250 },
  { name: 'Jun', value: 300 },
];

export const CHART_DATA_ROLES: ChartData[] = [
  { name: 'General', value: 45 },
  { name: 'Leadership', value: 15 },
  { name: 'Technical', value: 20 },
  { name: 'Logistics', value: 20 },
];

export const ROSTER_DATA: RosterEntry[] = [
  { id: 'r1', volunteerName: 'John Doe', volunteerEmail: 'john@example.com', eventName: 'City Park Cleanup', shiftRole: 'Team Leader', date: '2024-06-15', status: 'Confirmed', avatar: 'https://picsum.photos/50/50?random=1' },
  { id: 'r2', volunteerName: 'Jane Smith', volunteerEmail: 'jane@example.com', eventName: 'City Park Cleanup', shiftRole: 'General Cleanup', date: '2024-06-15', status: 'Confirmed', avatar: 'https://picsum.photos/50/50?random=2' },
  { id: 'r3', volunteerName: 'Michael Brown', volunteerEmail: 'mike@example.com', eventName: 'City Park Cleanup', shiftRole: 'General Cleanup', date: '2024-06-15', status: 'Pending', avatar: 'https://picsum.photos/50/50?random=3' },
  { id: 'r4', volunteerName: 'Emily Davis', volunteerEmail: 'emily@example.com', eventName: 'Food Bank Sort-a-thon', shiftRole: 'Sorter', date: '2024-06-20', status: 'Completed', avatar: 'https://picsum.photos/50/50?random=4' },
  { id: 'r5', volunteerName: 'David Wilson', volunteerEmail: 'david@example.com', eventName: 'Tech Literacy Workshop', shiftRole: 'Instructor', date: '2024-07-05', status: 'Confirmed', avatar: 'https://picsum.photos/50/50?random=5' },
];

export const VOLUNTEER_PROFILES: Record<string, any> = {
  'v1': {
    id: 'v1',
    name: 'John Doe',
    avatar: 'https://picsum.photos/50/50?random=1',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    signUpDate: '2024-06-01T10:30:00',
    status: 'Confirmed',
    totalHours: 28,
    skills: ['Leadership', 'Event Planning'],
    assignedTasks: [
      { eventId: 'e1', eventName: 'City Park Cleanup', shiftId: 's1', role: 'Team Leader', date: '2024-06-15', startTime: '08:00', endTime: '12:00', location: 'Central Park, Downtown' }
    ]
  },
  'v2': {
    id: 'v2',
    name: 'Jane Smith',
    avatar: 'https://picsum.photos/50/50?random=2',
    email: 'jane.smith@example.com',
    phone: '(555) 234-5678',
    signUpDate: '2024-06-02T14:15:00',
    status: 'Confirmed',
    totalHours: 35,
    skills: ['Organization', 'Communication'],
    assignedTasks: [
      { eventId: 'e1', eventName: 'City Park Cleanup', shiftId: 's1', role: 'Team Leader', date: '2024-06-15', startTime: '08:00', endTime: '12:00', location: 'Central Park, Downtown' }
    ]
  },
  'v3': {
    id: 'v3',
    name: 'Michael Brown',
    avatar: 'https://picsum.photos/50/50?random=3',
    email: 'michael.brown@example.com',
    phone: '(555) 345-6789',
    signUpDate: '2024-06-03T09:45:00',
    status: 'Pending',
    totalHours: 12,
    skills: ['Physical Labor', 'Teamwork'],
    assignedTasks: [
      { eventId: 'e1', eventName: 'City Park Cleanup', shiftId: 's2', role: 'General Cleanup', date: '2024-06-15', startTime: '09:00', endTime: '13:00', location: 'Central Park, Downtown' }
    ]
  }
};