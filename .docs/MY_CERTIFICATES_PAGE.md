# My Certificates Page - Complete Feature Documentation

## Overview
The **My Certificates** page is a comprehensive dashboard for volunteers to view, search, filter, and download their earned certificates from completed volunteer events.

## Features Implemented

### 1. **Statistics Dashboard**
Three key metric cards displayed at the top:

#### Total Certificates
- **Icon**: Award icon in indigo
- **Display**: Total number of certificates earned
- **Background**: Gradient from indigo-50 to indigo-100

#### Total Hours
- **Icon**: Clock icon in green
- **Display**: Sum of all volunteer hours across all events
- **Background**: Gradient from green-50 to green-100

#### Average Hours/Event
- **Icon**: Calendar icon in amber
- **Display**: Average hours per event (calculated dynamically)
- **Background**: Gradient from amber-50 to amber-100

### 2. **Search and Filter System**

#### Search Functionality
- **Search Bar**: Full-width input with search icon
- **Search Fields**: Searches across:
  - Event name
  - Role/position
- **Real-time**: Updates results as you type
- **Case-insensitive**: Matches regardless of letter case

#### Filter Options
Three filter buttons:
1. **All**: Shows all certificates (default)
2. **Recent**: Sorts certificates by most recent date first
3. **Oldest**: Sorts certificates by oldest date first

### 3. **Certificate Cards**
Each certificate is displayed in an enhanced card with:

#### Visual Elements
- **Award Icon**: Large indigo award icon with hover effect
- **Completion Badge**: Green "100% Complete" badge
- **Event Name**: Bold, large title (line-clamped to 2 lines)
- **Date**: Formatted as "Month Day, Year" with calendar icon
- **Role**: Displayed in styled info box
- **Hours**: Displayed in styled info box with clock icon

#### Interactive Features
- **Hover Effects**: 
  - Card shadow increases on hover
  - Award icon background changes
  - Download button scales up
- **Download Button**:
  - Full-width indigo button
  - Download icon + "Download Certificate" text
  - Scale animation on hover/click
  - Generates PDF with 100% progress

### 4. **Empty States**

#### No Certificates at All
- Large gradient icon background
- Bold heading: "No Certificates Yet"
- Descriptive message
- Step-by-step guide:
  - Join volunteer events
  - Complete your shifts
  - Download your certificates

#### No Search Results
- Search icon in gray circle
- "No certificates found" message
- "Clear Filters" button to reset search/filter

### 5. **Loading State**
- Centered spinning loader
- Indigo color matching theme
- Displays while fetching data

## Technical Implementation

### Data Flow
```typescript
1. Component mounts → useEffect triggers
2. Fetch user's completed events from Supabase
3. Calculate hours from shift start/end times
4. Set certificates state
5. Apply search/filter → update filteredCertificates
6. Render cards from filteredCertificates
```

### State Management
```typescript
- certificates: Certificate[]        // All certificates from database
- filteredCertificates: Certificate[] // After search/filter applied
- loading: boolean                    // Loading state
- searchQuery: string                 // Search input value
- selectedFilter: 'all'|'recent'|'oldest' // Active filter
```

### Certificate Data Structure
```typescript
interface Certificate {
    id: string;          // Unique identifier
    eventName: string;   // Name of the event
    date: string;        // Event date (ISO format)
    role: string;        // Volunteer's role
    hours: number;       // Hours contributed (calculated)
}
```

### PDF Generation
When download button is clicked:
```typescript
generateCertificate({
    eventName: cert.eventName,
    date: cert.date,
    role: cert.role,
    hours: cert.hours,
    volunteerName: user?.name || user?.email || 'Volunteer',
    progress: 100 // All completed events are 100%
});
```

## UI/UX Features

### Responsive Design
- **Mobile (< 768px)**: Single column grid
- **Tablet (768px - 1024px)**: 2 columns
- **Desktop (> 1024px)**: 3 columns

### Dark Mode Support
- All colors have dark mode variants
- Proper contrast ratios maintained
- Gradient backgrounds adapted for dark theme

### Animations
- **Card Hover**: Shadow transition (300ms)
- **Button Hover**: Scale transform (200ms)
- **Button Active**: Scale down effect
- **Icon Hover**: Background color transition

### Accessibility
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Focus states on interactive elements
- High contrast text

## Statistics Calculation

### Total Hours
```typescript
const totalHours = certificates.reduce((sum, cert) => sum + cert.hours, 0);
```

### Total Events
```typescript
const totalEvents = certificates.length;
```

### Average Hours
```typescript
const averageHours = totalEvents > 0 
    ? (totalHours / totalEvents).toFixed(1) 
    : '0';
```

## Search Algorithm
```typescript
filtered = certificates.filter(cert =>
    cert.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.role.toLowerCase().includes(searchQuery.toLowerCase())
);
```

## Sort Algorithm

### Recent First
```typescript
filtered.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
);
```

### Oldest First
```typescript
filtered.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
);
```

## Color Scheme

### Statistics Cards
- **Indigo Card**: `from-indigo-50 to-indigo-100` (light) / `from-indigo-900/20 to-indigo-800/20` (dark)
- **Green Card**: `from-green-50 to-green-100` (light) / `from-green-900/20 to-green-800/20` (dark)
- **Amber Card**: `from-amber-50 to-amber-100` (light) / `from-amber-900/20 to-amber-800/20` (dark)

### Certificate Cards
- **Border**: Left border in indigo-500 (4px)
- **Award Icon Background**: indigo-50 (light) / indigo-900/30 (dark)
- **Completion Badge**: green-100 background, green-700 text
- **Download Button**: indigo-600 background, white text

## File Structure
```
pages/volunteer/MyCertificates.tsx
├── Imports
├── Interface Definition (Certificate)
├── Component Definition
│   ├── State Management
│   ├── Data Fetching (useEffect)
│   ├── Search/Filter Logic (useEffect)
│   ├── Download Handler
│   ├── Statistics Calculation
│   ├── Loading State
│   └── Render
│       ├── Header
│       ├── Statistics Cards
│       ├── Search & Filter Bar
│       ├── Certificates Grid
│       └── Empty States
└── Export
```

## Dependencies
- **React**: Core framework
- **Card Component**: Custom UI component
- **Icons**: Custom icon components (Download, FileText, Search, Award, Clock, Calendar)
- **AuthContext**: User authentication
- **supabaseService**: Data fetching (getUserCompletedEvents)
- **certificateGenerator**: PDF generation utility

## Integration Points

### Database Query
```sql
SELECT 
    roster_entries.id,
    shifts.role,
    shifts.start_time,
    shifts.end_time,
    events.name,
    events.date
FROM roster_entries
JOIN shifts ON roster_entries.shift_id = shifts.id
JOIN events ON shifts.event_id = events.id
WHERE roster_entries.user_id = ? 
AND roster_entries.status = 'Completed'
```

### Certificate Generator
- Uses jsPDF library
- Generates landscape A4 PDF
- Includes all volunteer and event details
- Shows 100% completion for all certificates
- Auto-downloads with formatted filename

## Performance Optimizations
- Memoized filter/search logic with useEffect dependencies
- Efficient array operations
- Minimal re-renders
- Lazy loading of certificate data

## Future Enhancements (Potential)
- [ ] Certificate preview modal before download
- [ ] Bulk download all certificates
- [ ] Share certificate via email
- [ ] Print certificate directly
- [ ] Export statistics as CSV
- [ ] Certificate verification QR code
- [ ] Social media sharing
- [ ] Certificate templates selection
- [ ] Multi-language support
- [ ] Certificate expiry dates
- [ ] Renewal notifications

## Testing Scenarios

### Happy Path
1. User has completed events → Statistics display correctly
2. User searches for event → Correct results shown
3. User filters by recent → Sorted correctly
4. User downloads certificate → PDF generated successfully

### Edge Cases
1. No completed events → Empty state shown
2. Search returns no results → "No certificates found" state
3. Very long event names → Text truncated with ellipsis
4. User has 100+ certificates → Grid layout maintains
5. Slow network → Loading spinner displays

## Browser Compatibility
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Compliance
- WCAG 2.1 Level AA compliant
- Screen reader friendly
- Keyboard navigation
- Sufficient color contrast
- Focus indicators
- Alt text for icons (via title attributes)
