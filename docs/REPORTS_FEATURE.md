# Event Reports Feature Documentation

## Overview
The Event Reports feature allows administrators to generate comprehensive, AI-powered reports for completed volunteer events. Reports include detailed analysis, insights, and recommendations, and can be exported as professional PDF documents.

## Features

### 1. AI-Powered Report Generation
- Uses Google Gemini AI to analyze event data
- Generates comprehensive insights automatically
- Provides actionable recommendations

### 2. Report Sections
Each generated report includes:

#### Executive Summary
- 2-3 sentence overview of the event's success
- High-level outcomes and impact

#### Key Highlights
- 3-5 bullet points of major achievements
- Significant milestones reached
- Notable successes

#### Participant Insights
- Analysis of volunteer engagement
- Demographic information
- Participation patterns

#### Impact Analysis
- Community impact assessment
- Outcomes achieved
- Beneficiaries served

#### Lessons Learned
- 2-3 key takeaways from the event
- Areas for improvement
- Challenges overcome

#### Recommendations
- 2-3 suggestions for future events
- Best practices identified
- Optimization opportunities

### 3. PDF Export
Professional PDF documents with:
- Branded purple header
- Event details table
- All report sections
- Automatic pagination
- Page numbers
- Clean, professional formatting

## How to Use

### Step 1: Navigate to Reports
1. Log in as an administrator
2. Click "Reports" in the sidebar navigation

### Step 2: Select an Event
1. Choose a completed event from the dropdown menu
2. Only events with status "Completed" will appear

### Step 3: Generate Report
1. Click "Generate AI Report" button
2. Wait for Gemini AI to analyze the event (typically 3-5 seconds)
3. Report will appear in the preview panel

### Step 4: Export to PDF
1. Review the generated report
2. Click "Export PDF" button in the report header
3. PDF will automatically download to your device
4. Filename format: `EventName_Report_YYYY-MM-DD.pdf`

## Technical Details

### Files Modified/Created

#### New Files:
- `pages/admin/Reports.tsx` - Main reports page component
- `types/jspdf-autotable.d.ts` - TypeScript declarations

#### Modified Files:
- `services/geminiService.ts` - Added `generateEventReport()` function
- `contexts/EventsContext.tsx` - Added completed events and 'Ongoing' status
- `pages/admin/EventManager.tsx` - Added 'Ongoing' status option
- `App.tsx` - Reports route already configured

### Dependencies
```json
{
  "jspdf": "^2.x.x",
  "jspdf-autotable": "^3.x.x"
}
```

### API Integration

#### Gemini AI Service
```typescript
interface EventReportData {
  eventName: string;
  eventDate: string;
  location: string;
  description: string;
  totalVolunteers: number;
  totalSlots: number;
  attendanceRate: number;
}

interface GeneratedReport {
  executiveSummary: string;
  keyHighlights: string[];
  participantInsights: string;
  impactAnalysis: string;
  lessonsLearned: string[];
  recommendations: string[];
}

generateEventReport(eventData: EventReportData): Promise<GeneratedReport>
```

### PDF Generation
Uses `jsPDF` with `jspdf-autotable` for:
- Table formatting (event details)
- Text wrapping and pagination
- Custom styling and branding
- Multi-page support

## Sample Events

Two completed events are included for testing:

### 1. Spring Community Garden Project
- Date: May 10, 2024
- Location: Downtown Community Garden
- Volunteers: 35/40 (87.5% attendance)
- Shifts: 3

### 2. Winter Coat Drive
- Date: January 15, 2024
- Location: City Hall
- Volunteers: 28/30 (93.3% attendance)
- Shifts: 2

## Event Status Types

The system now supports four event statuses:
1. **Draft** - Event is being planned
2. **Published** - Event is live and accepting volunteers
3. **Ongoing** - Event is currently in progress
4. **Completed** - Event has finished (eligible for reports)

## Error Handling

### AI Service Unavailable
If Gemini AI is unavailable:
- Fallback report with generic messages
- User is notified of the issue
- Can retry generation

### No Completed Events
If no completed events exist:
- Helpful message displayed
- Instructions to complete an event first

### PDF Export Errors
If PDF generation fails:
- Error logged to console
- User can retry export

## Future Enhancements

Potential improvements:
1. Email report delivery
2. Scheduled report generation
3. Custom report templates
4. Comparison reports (multiple events)
5. Charts and graphs
6. Export to other formats (Excel, Word)
7. Report sharing with stakeholders
8. Historical report archive

## Best Practices

### For Accurate Reports
1. Ensure event details are complete and accurate
2. Update volunteer counts before marking as completed
3. Add detailed event descriptions
4. Set correct attendance numbers

### For Professional PDFs
1. Review AI-generated content before exporting
2. Ensure event images are high quality
3. Verify all event details are correct
4. Use descriptive event names

## Troubleshooting

### Report Not Generating
- Check internet connection
- Verify Gemini API key is configured
- Check browser console for errors
- Try selecting a different event

### PDF Not Downloading
- Check browser download settings
- Disable popup blockers
- Try a different browser
- Check available disk space

### Missing Events in Dropdown
- Verify event status is "Completed"
- Check EventsContext for event data
- Refresh the page

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure API keys are configured
4. Review this documentation

---

**Version**: 1.0.0  
**Last Updated**: November 22, 2024  
**Author**: Volunteer Management System Team
