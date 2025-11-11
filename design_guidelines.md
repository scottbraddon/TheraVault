# Design Guidelines: Local-First Counselling CRM

## Design Approach

**System-Based Approach** using productivity and healthcare design patterns inspired by Linear, Notion, and professional EMR systems. This application prioritizes trust, clarity, and efficient workflows for sensitive counselling data management.

## Core Design Principles

1. **Trust Through Clarity**: Clean, uncluttered interfaces that communicate security and professionalism
2. **Information Hierarchy**: Clear visual distinction between client data, session notes, and AI-generated content
3. **Efficient Workflows**: Minimal clicks to common tasks (create session, view notes, start transcription)
4. **Offline-First Indicators**: Persistent visual cues showing local-only operation (no cloud sync anxiety)

## Typography

**Font Families** (Google Fonts via CDN):
- Primary: Inter (400, 500, 600) - UI elements, body text
- Monospace: JetBrains Mono (400) - timestamps, technical data, file paths

**Hierarchy**:
- Page Headers: text-2xl font-semibold (Inter 600)
- Section Headers: text-lg font-medium (Inter 500)
- Body Text: text-base font-normal (Inter 400)
- Labels/Meta: text-sm font-medium (Inter 500)
- Timestamps: text-xs font-mono (JetBrains Mono)

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**
- Component padding: p-4, p-6
- Section spacing: space-y-6, space-y-8
- Card gaps: gap-4
- Page margins: p-8, p-12

**Grid Structure**:
- Sidebar navigation: w-64 (fixed width)
- Main content area: flex-1 with max-w-6xl container
- Dashboard cards: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

## Component Library

### Navigation
**Sidebar (Fixed Left)**:
- Dashboard, Clients, Sessions, Settings sections
- Offline status indicator at bottom (green dot + "Local Mode")
- Current workspace name with lock icon
- Collapsed state on mobile (hamburger menu)

### Dashboard Layout
**Top Stats Bar**: 3-column grid showing:
- Total active clients (number + label)
- Sessions this week (number + label)  
- Pending transcriptions (number + badge)

**Recent Activity Section**:
- Timeline-style list of recent sessions
- Each item: client name, session date, note status, action buttons
- Hover state reveals quick actions (view, edit, transcribe)

### Client Management
**Client List View**:
- Data table with columns: Name, Last Session, Total Sessions, Status
- Search bar with icon (Heroicons magnifying glass)
- "New Client" button (top right)
- Row click navigates to client detail

**Client Detail Page**:
- Header: client name, edit icon, archive button
- Tabs: Sessions, Notes, Profile
- Session timeline (reverse chronological)

### Session Interface
**Session Editor**:
- Two-column layout (lg:grid-cols-2)
- Left: Session metadata form (date, duration, type)
- Right: Notes editor (rich text area)
- AI-generated notes appear in bordered section with distinct background
- Audio upload zone (dashed border, upload icon from Heroicons)

**Transcription Panel**:
- Collapsible section showing transcription status
- Progress indicator during processing
- Completed transcription in scrollable text area
- "Generate Notes" button when complete

### Forms & Inputs
**Consistent Input Styling**:
- All inputs: rounded-lg border focus:ring-2 focus:ring-offset-2
- Labels above inputs (text-sm font-medium mb-2)
- Helper text below (text-xs)
- Error states: red border + error message
- Disabled state: reduced opacity (opacity-50)

### Data Display
**Cards**:
- Rounded corners (rounded-xl)
- Subtle border (border)
- Padding p-6
- Shadow on hover (hover:shadow-lg transition-shadow)

**Tables**:
- Alternating row backgrounds for readability
- Fixed header when scrolling
- Sortable columns (click header, show arrow icon)
- Compact spacing (py-2 px-4)

### Security Indicators
**Trust Elements**:
- Lock icon (Heroicons) next to sensitive data fields
- "Encrypted" badge on database status
- "No internet required" message in settings
- Green dot indicator for "Local Mode Active"

## Icons
Use **Heroicons** (outline style) via CDN for all interface icons:
- Navigation: home, users, calendar, cog
- Actions: plus, pencil, trash, arrow-right
- Status: lock-closed, check-circle, exclamation-triangle
- Media: microphone, document-text, cloud-upload

## Animations
**Minimal, Purposeful Motion**:
- Page transitions: Simple opacity fade (150ms)
- Button clicks: Subtle scale (active:scale-95)
- Loading states: Spinning icon for async operations
- No scroll-triggered animations

## Images
**No hero images** - this is a working application, not a marketing site.

**Placeholder for missing client photos**: Use initials in circular avatar (w-10 h-10 rounded-full bg-gray-200 centered text)

**Icons only**: All visual elements are functional icons from Heroicons, no decorative imagery.

## Accessibility
- WCAG AA contrast ratios minimum
- Focus indicators visible on all interactive elements (focus:ring-2)
- Semantic HTML (nav, main, article, aside)
- ARIA labels for icon-only buttons
- Keyboard navigation support (tab order, Esc to close modals)
- Screen reader announcements for async operations ("Transcription complete")

## Professional Medical Software Feel
- Clean white/neutral backgrounds for content areas
- Subtle dividers between sections (border-gray-200)
- Ample whitespace (no cramped interfaces)
- Professional blue accent for primary actions
- Reserved red only for destructive actions (delete, archive)
- Muted status badges (gray for pending, green for complete)