# Web Photobooth Application Specification

## 1. Project Overview

- **Project Name**: Web Photobooth
- **Type**: Web Application (React + Tailwind CSS)
- **Core Functionality**: A real-time photobooth application with live camera preview, countdown timer, photo capture, preview, and local storage for session history
- **Target Users**: Event organizers, party hosts, casual users wanting to take and share photos

## 2. Tech Stack

- **Frontend**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma ORM)
- **Camera**: WebRTC (getUserMedia API)
- **State Management**: React useState/useReducer

## 3. UI/UX Specification

### Layout Structure

```
┌─────────────────────────────────────────┐
│              Header                     │
├─────────────────────────────────────────┤
│                                         │
│         Camera Preview Area            │
│         (Large Video Display)           │
│                                         │
├─────────────────────────────────────────┤
│         Controls & Buttons              │
├─────────────────────────────────────────┤
│         Photo History Grid             │
└─────────────────────────────────────────┘
```

### Responsive Breakpoints

- Mobile: < 640px (single column, stacked layout)
- Tablet: 640px - 1024px (adjusted spacing)
- Desktop: > 1024px (full layout with side panel potential)

### Visual Design

#### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background Dark | Slate 900 | #0f172a |
| Background Card | Slate 800 | #1e293b |
| Primary | Violet 500 | #8b5cf6 |
| Primary Hover | Violet 600 | #7c3aed |
| Accent | Rose 500 | #f43f5e |
| Text Primary | Slate 50 | #f8fafc |
| Text Secondary | Slate 400 | #94a3b8 |
| Success | Emerald 500 | #10b981 |
| Countdown | Orange 500 | #f97316 |

#### Typography

- **Font Family**: "Outfit" (Google Fonts) with fallback to system sans-serif
- **Heading (H1)**: 2.5rem (40px), font-weight: 700
- **Heading (H2)**: 1.5rem (24px), font-weight: 600
- **Body**: 1rem (16px), font-weight: 400
- **Button**: 0.875rem (14px), font-weight: 600, uppercase tracking-wide

#### Spacing System

- Base unit: 4px
- Component padding: 16px (4 units)
- Section gaps: 24px (6 units)
- Container max-width: 1280px

#### Visual Effects

- **Card shadows**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **Glow effect**: `0 0 20px rgba(139, 92, 246, 0.5)` on primary buttons
- **Border radius**: 12px for cards, 8px for buttons, full for avatars
- **Transitions**: 200ms ease-in-out for all interactive elements
- **Countdown animation**: Scale pulse effect (1.0 → 1.2 → 1.0) each second

### Components

#### 1. Header
- App title "Photobooth" with logo icon
- Clean, minimal navigation (history toggle button)
- Dark theme consistent with app

#### 2. Camera Preview
- 16:9 aspect ratio container
- Live video feed from WebRTC
- Rounded corners (16px)
- Subtle border glow when active
- Fallback placeholder when camera inactive

#### 3. Countdown Overlay
- Large centered number (8rem)
- Orange color with pulse animation
- Appears over camera feed
- Hides after countdown completes

#### 4. Control Buttons
- Primary: "Ambil Foto" - Violet background, white text
- Secondary: "Retake", "Simpan", "Unduh" - Outlined variants
- Interactive hover states with scale transform (1.02)
- Disabled state with reduced opacity (0.5)

#### 5. Photo Preview Modal/Lightbox
- Full captured image display
- Frame overlay option selector
- Filter selection grid
- Action buttons row

#### 6. Session History Panel
- Grid of thumbnail images
- Hover effect with delete option
- Timestamp display
- Scrollable container

#### 7. Filter Selector
- Visual filter previews
- Label for each filter type
- Active state indicator

## 4. Functionality Specification

### Core Features

#### F1: Live Camera Feed
- Request camera permission on mount
- Display video stream in real-time
- Handle permission denied gracefully
- Support front camera preference
- Clean up stream on unmount

#### F2: Countdown Timer
- 3-second countdown before capture
- Visual countdown display (3, 2, 1)
- Audio beep optional (future)
- Cancel option during countdown
- Disable capture button during countdown

#### F3: Photo Capture
- Capture frame from video stream using canvas
- Convert to base64/png format
- Generate unique filename with timestamp
- Store in app's public directory

#### F4: Photo Preview
- Display captured photo in modal/overlay
- Show frame overlay preview
- Filter preview with selected filter
- Options: Retake, Simpan, Unduh

#### F5: Session History (SQLite/Prisma)
- Store session metadata:
  - id: String (UUID)
  - filename: String
  - capturedAt: DateTime
  - filter: String? (nullable)
  - frame: String? (nullable)
- List all sessions in history panel
- Delete individual sessions
- View full-size from history

#### F6: Frame Overlay
- Load PNG frame files from /frames directory
- Composite frame over captured photo
- Support multiple frame options
- Return composited image data

#### F7: AI API Integration
- Boilerplate fetch function for AI image processing
- Configurable endpoint URL
- Support for different AI operations:
  - Style transfer (cartoon effect)
  - Image enhancement (sharpness)
- Handle loading and error states

#### F8: CSS Filters
- Grayscale: `filter: grayscale(100%)`
- Sepia: `filter: sepia(100%)`
- Brightness: `filter: brightness(150%)`
- Combination support
- Real-time preview before save

### User Interactions

| Action | Trigger | Response |
|--------|---------|----------|
| Start Camera | Page Load | Request permission, show stream |
| Click Ambil Foto | Button Click | Start 3s countdown |
| Countdown Complete | Timer reaches 0 | Capture photo, show preview |
| Select Frame | Frame Thumbnail Click | Apply frame to preview |
| Select Filter | Filter Button Click | Apply CSS filter |
| Click Simpan | Button Click | Save to history (DB) |
| Click Unduh | Button Click | Download as PNG |
| Click Retake | Button Click | Discard, return to camera |
| View History | Toggle Button | Show/hide history panel |
| Delete from History | Delete Icon Click | Remove from DB, update UI |

### Edge Cases

- Camera permission denied: Show fallback with instructions
- No sessions in history: Show empty state message
- Storage full: Alert user, prevent save
- Frame file missing: Skip frame, notify user
- AI API timeout: Show error, allow retry

## 5. File Structure

```
Photobooth/
├── public/
│   └── frames/           # PNG frame files
├── src/
│   ├── components/
│   │   ├── Camera.tsx
│   │   ├── Countdown.tsx
│   │   ├── PhotoPreview.tsx
│   │   ├── FrameSelector.tsx
│   │   ├── FilterSelector.tsx
│   │   ├── SessionHistory.tsx
│   │   └── Controls.tsx
│   ├── hooks/
│   │   ├── useCamera.ts
│   │   └── usePhotoCapture.ts
│   ├── utils/
│   │   ├── imageProcessor.ts    # Frame overlay
│   │   ├── aiApi.ts             # AI API integration
│   │   └── filters.ts           # CSS filter utilities
│   ├── lib/
│   │   └── db.ts               # Prisma client
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── prisma/
│   └── schema.prisma           # Database schema
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 6. Acceptance Criteria

### Visual Checkpoints

- [ ] App loads without console errors
- [ ] Camera feed displays in 16:9 container
- [ ] Countdown numbers animate with pulse effect
- [ ] Captured photo displays in preview modal
- [ ] Frame overlays correctly on photo
- [ ] Filters visually change photo appearance
- [ ] History shows saved session thumbnails
- [ ] UI is responsive at all breakpoints

### Functional Checkpoints

- [ ] Camera permission requested on load
- [ ] Countdown starts when button clicked
- [ ] Photo captured after countdown ends
- [ ] Photo can be previewed with frame
- [ ] Photo can be previewed with filter
- [ ] Photo saves to SQLite database
- [ ] Session appears in history
- [ ] Session can be deleted
- [ ] Photo can be downloaded
- [ ] AI API boilerplate function exists

### Performance Criteria

- [ ] Initial load < 3 seconds
- [ ] Camera stream runs at 30fps minimum
- [ ] Photo capture < 500ms
- [ ] No memory leaks on repeated captures