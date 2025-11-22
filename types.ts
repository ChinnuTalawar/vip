export enum UserRole {
  ADMIN = 'ADMIN',
  VOLUNTEER = 'VOLUNTEER',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  skills?: string[];
  totalHours?: number;
}

export interface Shift {
  id: string;
  role: string;
  startTime: string;
  endTime: string;
  requiredCount: number;
  filledCount: number;
  assignedVolunteers?: AssignedVolunteer[];
}

export interface AssignedVolunteer {
  id: string;
  name: string;
  avatar: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  shifts: Shift[];
  category: 'Environment' | 'Education' | 'Community' | 'Health';
  status: 'Published' | 'Draft' | 'Completed' | 'Ongoing';
  volunteers?: number;
  totalSlots?: number;
}

export interface DashboardStats {
  totalHours: number;
  activeVolunteers: number;
  openShifts: number;
  upcomingEvents: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface RosterEntry {
  id: string;
  volunteerName: string;
  volunteerEmail: string;
  eventName: string;
  shiftRole: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'CheckIn' | 'Completed';
  avatar: string;
}

export interface CollegeInfo {
  id: string;
  collegeName: string;
  collegeAddress: string;
  collegeCity: string;
  collegeState: string;
  collegePincode: string;
  collegePhone?: string;
  collegeEmail?: string;
  collegeWebsite?: string;
  contactPersonName: string;
  contactPersonDesignation?: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  createdAt?: string;
  updatedAt?: string;
}