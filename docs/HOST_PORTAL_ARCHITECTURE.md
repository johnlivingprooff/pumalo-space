# Host Portal, Inquiry System & Trust Workflow — Architecture

**Pumalo Space** | May 2026

---

## Overview

This document covers the full design for:

- Dynamic listing CTA system (property-type-aware)
- Inquiry & contact modal (structured, trust-first)
- Host verification workflow (badge system)
- Host portal navigation & pages
- Inquiry/opportunity management (lightweight CRM)
- Notification system (in-app + email)
- Database schema additions
- Frontend/backend architecture

The guiding principle: **communication is the core product**. People aren't just browsing properties — they're negotiating, validating trust, and exploring opportunities. Every design decision optimises for that.

---

## 1. Database Schema Additions

### 1.1 New Enums

```prisma
enum VerificationStatus {
  PENDING
  UNDER_REVIEW
  VERIFIED
  REJECTED
  NEEDS_RESUBMISSION
}

enum InquiryType {
  OFFER        // BUY listings
  RENTAL       // RENT listings
  AVAILABILITY // LODGE listings
  QUESTION     // Any listing
  VIEWING      // Any listing
}

enum InquiryStatus {
  NEW
  VIEWED
  RESPONDED
  NEGOTIATING
  INTERESTED
  CLOSED
  ARCHIVED
}

enum NotificationType {
  NEW_INQUIRY
  NEW_MESSAGE
  LISTING_APPROVED
  VERIFICATION_UPDATE
  DRAFT_REMINDER
  INQUIRY_RESPONSE
}

enum NotificationChannel {
  IN_APP
  EMAIL
}
```

### 1.2 HostProfile — Add Verification Fields

```prisma
model HostProfile {
  id                  String             @id @default(cuid())
  userId              String             @unique
  user                User               @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Existing onboarding fields
  idType              String
  idNumber            String
  paymentMethod       String
  accountDetails      String

  // NEW: Verification workflow
  verificationStatus  VerificationStatus @default(PENDING)
  verifiedAt          DateTime?
  rejectionReason     String?            @db.Text
  resubmissionNote    String?            @db.Text

  // NEW: Contact details (revealed post-inquiry)
  publicPhone         String?
  publicEmail         String?
  whatsappNumber      String?

  // NEW: Response metrics (future-ready)
  responseRate        Float?             // 0.0 - 1.0
  avgResponseHours    Float?

  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt

  inquiries           Inquiry[]

  @@map("host_profiles")
}
```

### 1.3 Inquiry Model

```prisma
model Inquiry {
  id              String        @id @default(cuid())

  // Type determines the CTA that triggered this
  type            InquiryType
  status          InquiryStatus @default(NEW)

  // Content
  message         String        @db.Text
  offerAmount     Float?        // BUY inquiries only
  requestedDates  Json?         // LODGE: { checkIn, checkOut }

  // Flags
  requestViewing  Boolean       @default(false)
  isRead          Boolean       @default(false)

  // Relations
  propertyId      String
  property        Property      @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  senderId        String
  sender          User          @relation("SentInquiries", fields: [senderId], references: [id], onDelete: Cascade)

  hostId          String
  host            HostProfile   @relation(fields: [hostId], references: [id], onDelete: Cascade)

  // Host response
  hostReply       String?       @db.Text
  repliedAt       DateTime?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([propertyId])
  @@index([senderId])
  @@index([hostId])
  @@index([status])
  @@index([type])
  @@index([hostId, status])
  @@index([hostId, createdAt])
  @@map("inquiries")
}
```

### 1.4 Notification Model

```prisma
model Notification {
  id          String              @id @default(cuid())
  userId      String
  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  type        NotificationType
  channel     NotificationChannel @default(IN_APP)
  title       String
  body        String              @db.Text
  isRead      Boolean             @default(false)
  readAt      DateTime?

  // Optional deep-link context
  entityType  String?             // "inquiry" | "listing" | "verification"
  entityId    String?

  createdAt   DateTime            @default(now())

  @@index([userId])
  @@index([userId, isRead])
  @@index([userId, createdAt])
  @@map("notifications")
}
```

### 1.5 Property — Add Inquiry Relation

```prisma
// Add to Property model:
inquiries   Inquiry[]
```

### 1.6 User — Add Relations

```prisma
// Add to User model:
sentInquiries    Inquiry[]      @relation("SentInquiries")
notifications    Notification[]
```

---

## 2. Dynamic CTA System

### 2.1 CTA Logic by Property Type

| PropertyType | CTA Label | Inquiry Type | Modal Title |
|---|---|---|---|
| `BUY` | Make an Offer | `OFFER` | Make an Offer |
| `RENT` | Request Rental | `RENTAL` | Request Rental |
| `LODGE` | Check Availability | `AVAILABILITY` | Check Availability |

### 2.2 CTA Component

**File:** `src/components/properties/PropertyCTA.tsx`

```tsx
// Minimal interface — full implementation in separate task
interface PropertyCTAProps {
  propertyType: "BUY" | "RENT" | "LODGE";
  propertyId: string;
  propertyTitle: string;
  host: HostInfo;
}

const CTA_CONFIG = {
  BUY:   { label: "Make an Offer",     inquiryType: "OFFER" },
  RENT:  { label: "Request Rental",    inquiryType: "RENTAL" },
  LODGE: { label: "Check Availability", inquiryType: "AVAILABILITY" },
} as const;
```

The CTA button renders on the property detail page. On click, it opens the `InquiryModal` with the correct context pre-loaded.

### 2.3 Secondary CTA

A secondary "Contact Host" link always appears below the primary CTA. This opens the same modal but defaults to the `QUESTION` inquiry type — a lower-commitment entry point.

---

## 3. Inquiry Modal Architecture

### 3.1 Modal Structure

The modal is a two-panel experience:

**Left panel — Host Trust Card:**
- Avatar + name
- Verification badge (if `VERIFIED`)
- Response rate (future-ready placeholder)
- "Verified by Pumalo Space" label

**Right panel — Inquiry Form:**
- Dynamic fields based on `InquiryType`
- Contact reveal section (shown after submission)

### 3.2 Form Fields by Inquiry Type

**OFFER (BUY):**
```
- Offer amount (number input, currency KSH)
- Message (textarea, "Tell the host about yourself and your offer")
- Request viewing (checkbox)
```

**RENTAL (RENT):**
```
- Message (textarea, "Introduce yourself and your rental needs")
- Request viewing (checkbox)
- Move-in timeline (optional select: "ASAP", "1 month", "3 months", "Flexible")
```

**AVAILABILITY (LODGE):**
```
- Check-in date (date picker)
- Check-out date (date picker)
- Number of guests (number input)
- Message (textarea, optional)
```

**QUESTION (any):**
```
- Message (textarea, "What would you like to know?")
```

### 3.3 Contact Reveal Flow

Contact details are **not shown upfront**. After the inquiry is submitted:

1. Modal transitions to a "Sent!" confirmation state
2. Host contact details are revealed:
   - Phone number (click to call)
   - Email (click to compose)
   - WhatsApp link (if available)
3. Message: *"You can now reach [Host Name] directly. They'll also receive your inquiry and respond shortly."*

This makes contact feel earned and intentional — not a public directory.

### 3.4 Auth Gate

If the user is not logged in when they click the CTA:
- Show a lightweight sign-in prompt inside the modal
- After auth, return to the inquiry form with context preserved

### 3.5 File: `src/components/contact/InquiryModal.tsx`

Replaces/extends the existing `ContactHostModal.tsx`. The existing modal can be kept for simple "contact only" use cases (e.g., from the host profile page), while `InquiryModal` handles the full structured flow from property listings.

---

## 4. Host Verification Workflow

### 4.1 Status Flow

```
[Not Started]
      ↓  (host submits documents)
  PENDING
      ↓  (admin picks up)
UNDER_REVIEW
      ↓
  ┌───────────────────────────────┐
  │                               │
VERIFIED                      REJECTED
  │                               │
  │                    NEEDS_RESUBMISSION
  │                               │
  └───────────────────────────────┘
                  ↑
           (host resubmits)
```

### 4.2 Document Upload

Hosts upload via the existing Google Drive integration (`/api/drive/upload`). The `VerificationDocument` model already exists. The new `verificationStatus` field on `HostProfile` tracks the overall state.

Supported document types (mapped to `VerificationType` enum):
- `ID` — National ID, Passport
- `TITLE_DEED` — Property ownership proof
- `OTHER` — Business registration, utility bills, etc.

### 4.3 Verification Badge

Once `verificationStatus === "VERIFIED"`:

- A blue checkmark badge (`✓ Verified`) appears:
  - On property cards (small badge, top-right of host avatar)
  - In the inquiry modal (host trust card)
  - On the host's public profile
  - In the host portal sidebar (next to host name)

**Badge component:** `src/components/ui/VerifiedBadge.tsx`

```tsx
// Variants: "sm" (property card), "md" (modal), "lg" (profile)
interface VerifiedBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
}
```

### 4.4 Verification Page in Host Portal

**Route:** `/host/verification`

Sections:
1. **Current Status** — Status pill with explanation text
2. **Document Upload** — Upload/manage verification documents (reuses DriveUploader)
3. **Status History** — Timeline of status changes with dates
4. **What Verification Unlocks** — Trust badge, higher visibility, contact reveal

Status-specific messaging:
- `PENDING`: "Your documents are queued for review. This usually takes 1-2 business days."
- `UNDER_REVIEW`: "Our team is reviewing your documents. We'll notify you shortly."
- `VERIFIED`: "You're verified! Your badge is now visible on all your listings."
- `REJECTED`: "Verification was unsuccessful. Reason: [rejectionReason]"
- `NEEDS_RESUBMISSION`: "Please resubmit: [resubmissionNote]"

---

## 5. Host Portal Navigation & Pages

### 5.1 Navigation Structure

```
/host
├── /host/dashboard          ← NEW
├── /host/listings           ← EXISTS (extend)
│   └── /host/listings/[id]  ← EXISTS
│       └── /host/listings/[id]/edit ← EXISTS
├── /host/inquiries          ← NEW
├── /host/messages           ← NEW (wraps existing Message model)
├── /host/verification       ← NEW
├── /host/analytics          ← NEW (stub, future-ready)
├── /host/settings           ← NEW
├── /host/drafts             ← EXISTS
├── /host/create-listing     ← EXISTS
└── /host/onboarding         ← EXISTS
```

### 5.2 Shared Host Layout

**File:** `src/app/host/layout.tsx`

A persistent sidebar layout wrapping all `/host/*` routes:

```
┌─────────────────────────────────────────────────────┐
│  [Logo]                              [Notifications] │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  Host Name   │                                      │
│  ✓ Verified  │         Page Content                 │
│              │                                      │
│  Dashboard   │                                      │
│  Listings    │                                      │
│  Inquiries ● │                                      │
│  Messages    │                                      │
│  Verification│                                      │
│  Analytics   │                                      │
│  Settings    │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

The `●` badge on Inquiries shows unread count. The sidebar collapses to icons on mobile.

### 5.3 Dashboard Page (`/host/dashboard`)

**Sections:**
- Welcome header with host name + verification status
- Quick stats row: Active Listings | New Inquiries | Unread Messages | Total Views (future)
- Recent Inquiries (last 5, with status pills)
- Recent Messages (last 3)
- Listing health (any drafts? any unpublished?)
- Verification CTA (if not verified)

### 5.4 Inquiries Page (`/host/inquiries`)

**Layout:** Table/list with filters

**Filters:**
- Status: All | New | Responded | Negotiating | Closed
- Type: All | Offers | Rentals | Availability | Questions
- Listing: All | [dropdown of host's listings]

**Inquiry Row:**
```
[Sender Avatar] [Sender Name]          [Property Title]    [Type Badge]  [Status]  [Time]
                "Hi, I'd like to make an offer..."
```

**Inquiry Detail (slide-over or modal):**
- Full message
- Offer amount (if applicable)
- Requested dates (if applicable)
- Viewing request flag
- Reply textarea
- Action buttons: Reply | Mark Interested | Close | Archive

**Host Actions:**
- Reply (sends message + updates status to RESPONDED)
- Accept inquiry (status → INTERESTED)
- Reject inquiry (status → CLOSED)
- Mark unavailable (marks property, status → CLOSED)
- Archive (status → ARCHIVED)

### 5.5 Messages Page (`/host/messages`)

Wraps the existing `Message` model. Simple thread list + message view. Not a real-time chat — polling or optimistic updates are sufficient for now.

### 5.6 Verification Page (`/host/verification`)

Described in Section 4.4 above.

### 5.7 Analytics Page (`/host/analytics`)

**Stub for now.** Placeholder UI with:
- "Analytics coming soon" message
- Metrics that will be tracked: Views, Inquiry rate, Response rate, Conversion rate

### 5.8 Settings Page (`/host/settings`)

- Contact details (phone, email, WhatsApp — these are the ones revealed post-inquiry)
- Notification preferences (email on/off per notification type)
- Profile bio and avatar
- Account settings link (delegates to Stack Auth)

---

## 6. Notification System

### 6.1 Notification Types & Triggers

| Type | Trigger | Channels |
|---|---|---|
| `NEW_INQUIRY` | Inquiry submitted for host's property | In-app + Email |
| `NEW_MESSAGE` | Message received | In-app + Email |
| `LISTING_APPROVED` | Property published (future admin flow) | In-app + Email |
| `VERIFICATION_UPDATE` | `verificationStatus` changes | In-app + Email |
| `DRAFT_REMINDER` | Draft not updated in 7 days | In-app + Email |
| `INQUIRY_RESPONSE` | Host replies to inquiry (to sender) | In-app + Email |

### 6.2 In-App Notifications

**Bell icon** in the host portal header. Clicking opens a dropdown:

```
┌─────────────────────────────────┐
│  Notifications              [×] │
├─────────────────────────────────┤
│ ● New inquiry on "2BR Westlands" │
│   John D. wants to make an offer │
│   2 minutes ago                  │
├─────────────────────────────────┤
│   Verification approved!         │
│   Your badge is now live         │
│   Yesterday                      │
└─────────────────────────────────┘
```

Unread notifications have a blue dot. Clicking a notification navigates to the relevant entity and marks it read.

**API Routes:**
- `GET /api/notifications` — list for current user (paginated)
- `PATCH /api/notifications/[id]/read` — mark single read
- `PATCH /api/notifications/read-all` — mark all read

### 6.3 Email Notifications

Use a simple email utility (no new dependency needed — can use a transactional email service like Resend or Nodemailer). Email templates are plain HTML strings for now.

**Email for `NEW_INQUIRY`:**
```
Subject: New inquiry on "[Property Title]"

Hi [Host Name],

[Sender Name] has sent you a new inquiry about "[Property Title]".

Type: [Make an Offer / Request Rental / Check Availability]
Message: "[inquiry message]"

View and respond: [link to /host/inquiries/[id]]

— Pumalo Space
```

### 6.4 Notification Creation Helper

**File:** `src/lib/notifications.ts`

```ts
// Creates a Notification record and optionally sends email
async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
  sendEmail?: boolean;
}): Promise<void>
```

Called from API route handlers after relevant actions (inquiry submission, verification status change, etc.).

---

## 7. API Routes

### 7.1 New Routes

```
POST   /api/inquiries                    ← Submit inquiry (from property page)
GET    /api/inquiries                    ← List inquiries for current host
GET    /api/inquiries/[id]               ← Get single inquiry
PATCH  /api/inquiries/[id]               ← Update status / add reply
GET    /api/notifications                ← List notifications for current user
PATCH  /api/notifications/[id]/read      ← Mark read
PATCH  /api/notifications/read-all       ← Mark all read
GET    /api/host/verification            ← Get verification status
PATCH  /api/host/verification            ← Update verification status (admin only)
GET    /api/host/dashboard               ← Dashboard stats
```

### 7.2 Inquiry Submission Flow

```
User clicks CTA
  → InquiryModal opens
  → User fills form
  → POST /api/inquiries
      → Create Inquiry record
      → Create Notification for host (NEW_INQUIRY)
      → Send email to host
      → Return { inquiry, hostContact }
  → Modal shows confirmation + reveals host contact
```

### 7.3 Host Reply Flow

```
Host opens /host/inquiries/[id]
  → PATCH /api/inquiries/[id] { hostReply, status: "RESPONDED" }
      → Update Inquiry record
      → Create Notification for sender (INQUIRY_RESPONSE)
      → Send email to sender
```

---

## 8. Frontend Component Map

```
src/
├── components/
│   ├── contact/
│   │   ├── ContactHostModal.tsx     ← EXISTS (keep for simple contact)
│   │   ├── InquiryModal.tsx         ← NEW (full structured flow)
│   │   ├── HostTrustCard.tsx        ← NEW (host info + badge)
│   │   └── ContactReveal.tsx        ← NEW (post-inquiry contact reveal)
│   ├── properties/
│   │   ├── PropertyCTA.tsx          ← NEW (dynamic CTA button)
│   │   └── FavoriteButton.tsx       ← EXISTS
│   ├── host/
│   │   ├── HostSidebar.tsx          ← NEW
│   │   ├── InquiryRow.tsx           ← NEW
│   │   ├── InquiryDetail.tsx        ← NEW
│   │   ├── DashboardStats.tsx       ← NEW
│   │   ├── NotificationBell.tsx     ← NEW
│   │   └── DriveUploader.tsx        ← EXISTS
│   └── ui/
│       ├── VerifiedBadge.tsx        ← NEW
│       ├── StatusPill.tsx           ← NEW (reusable status badge)
│       └── Modal.tsx                ← EXISTS
│
├── app/
│   └── host/
│       ├── layout.tsx               ← NEW (sidebar layout)
│       ├── dashboard/page.tsx       ← NEW
│       ├── inquiries/
│       │   ├── page.tsx             ← NEW
│       │   └── [id]/page.tsx        ← NEW
│       ├── messages/page.tsx        ← NEW
│       ├── verification/page.tsx    ← NEW
│       ├── analytics/page.tsx       ← NEW (stub)
│       ├── settings/page.tsx        ← NEW
│       ├── listings/                ← EXISTS
│       ├── drafts/                  ← EXISTS
│       ├── create-listing/          ← EXISTS
│       └── onboarding/              ← EXISTS
│
└── app/api/
    ├── inquiries/
    │   ├── route.ts                 ← NEW
    │   └── [id]/route.ts            ← NEW
    ├── notifications/
    │   ├── route.ts                 ← NEW
    │   ├── [id]/read/route.ts       ← NEW
    │   └── read-all/route.ts        ← NEW
    └── host/
        ├── dashboard/route.ts       ← NEW
        └── verification/route.ts    ← NEW
```

---

## 9. Prisma Schema Migration Summary

The following changes need to be applied to `prisma/schema.prisma`:

1. Add enums: `VerificationStatus`, `InquiryType`, `InquiryStatus`, `NotificationType`, `NotificationChannel`
2. Extend `HostProfile`: add `verificationStatus`, `verifiedAt`, `rejectionReason`, `resubmissionNote`, `publicPhone`, `publicEmail`, `whatsappNumber`, `responseRate`, `avgResponseHours`, `inquiries` relation
3. Add `Inquiry` model
4. Add `Notification` model
5. Add `inquiries` relation to `Property`
6. Add `sentInquiries`, `notifications` relations to `User`

Run after schema update:
```bash
npm run db:generate
npm run db:push
```

---

## 10. UX Principles Applied

**Lightweight, not bureaucratic:**
- Inquiry form is max 3 fields. No multi-step wizards.
- Contact reveal happens immediately after submission — no waiting.
- Host reply is a single textarea, not a ticket system.

**Trust-first:**
- Verification badge is prominent and consistent across all surfaces.
- Contact details are gated behind inquiry intent — not a public directory.
- "Verified by Pumalo Space" label in the modal builds platform credibility.

**Property-type aware:**
- BUY: language around offers, amounts, negotiation
- RENT: language around applications, move-in, viewing
- LODGE: language around dates, availability, guests
- Never mix these contexts in the same UI

**Human, not corporate:**
- Notification copy is conversational: "John wants to make an offer on your listing"
- Status labels are plain English: "New", "Responded", "Interested"
- Empty states have helpful prompts, not just "No data"

---

## 11. Out of Scope (This Phase)

- Online payments / escrow
- Legal contracts
- Real-time WebSocket chat
- Admin moderation dashboard
- SMS notifications
- Push notifications
- Advanced analytics (views, conversion funnels)
- Scheduling / calendar integration for viewings

These are designed to be addable without breaking the current architecture. The `Inquiry` model's `requestedDates` JSON field and `requestViewing` boolean are forward-compatible with a future scheduling system.

---

## 12. Implementation Order

Recommended build sequence:

1. **Schema migration** — Add all new models and enums, run `db:push`
2. **VerifiedBadge + StatusPill** — Reusable UI primitives
3. **PropertyCTA** — Dynamic CTA button on property detail page
4. **InquiryModal** — Full inquiry flow (replaces ContactHostModal on listings)
5. **POST /api/inquiries** — Inquiry submission API
6. **Host portal layout** — Sidebar + navigation
7. **Dashboard page** — Stats + recent activity
8. **Inquiries page** — List + detail + reply
9. **Verification page** — Status display + document upload
10. **Notification system** — In-app bell + email
11. **Messages page** — Thread list (wraps existing Message model)
12. **Settings page** — Contact details + notification prefs
13. **Analytics stub** — Placeholder page
