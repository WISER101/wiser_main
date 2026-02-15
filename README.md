# Wiser — Learn Smarter, Teach Better

A modern learning management platform frontend built with **pure HTML, CSS, and JavaScript** — 43 fully-designed pages across student, teacher, and admin segments with responsive layouts, interactive UI components, and polished design.

| Tech | Details |
|------|---------|
| Frontend | Static HTML / CSS / JS (zero frameworks, zero build tools) |
| Pages | 43 HTML pages (12 student, 9 teacher, 6 admin, 3 auth, 13 public) |
| Font | Inter (Google Fonts, 300–800) |
| Colors | Green gradient (`#163300`, `#3d8b1c`, `#9fe870`, `#5ab82e`) |
| CSS | 6 stylesheets: `base.css`, `app.css`, `student.css`, `teacher.css`, `admin.css`, `landing.css` |
| Status | Frontend complete — backend integration in progress |

---

## Getting Started

### Prerequisites
- A modern browser (Chrome, Firefox, Safari, Edge)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/WISER101/wiser_main.git
   cd wiser_main
   ```

2. **Open `index.html`** in any browser or serve with a local dev server (e.g., VS Code Live Server).

---

## Landing Page — `index.html`

The public-facing marketing page with 12 distinct sections:

| Section | Description |
|---------|-------------|
| **Navbar** | Desktop links (Courses, Schools, Features, How It Works, Reviews, Pricing) + Log In + "Get Started Free" CTA + hamburger mobile drawer |
| **Hero** | Typed text animation cycling taglines, 3 floating stat badges (50K+ learners, 1,200+ courses, 4.9 rating), 2 CTAs, browser mockup with floating cards |
| **Why Choose Us** | Timeline of 4 animated counters (scroll-triggered): 500+ learners, 800+ courses, 1,000+ certified students, 100+ enrolls |
| **How It Works** | Tabbed view (Students / Teachers), each with 3-step process and visual connectors |
| **Features** | 6 feature cards: AI-Powered Learning, Interactive Courses, Learning Analytics, Vibrant Community, Schools & Marketplace, Certificates & Rewards |
| **Popular Courses** | Dynamic grid from `WiserData.courses` (top 6 by students) — thumbnail image, price, discount %, instructor, category, level, rating, lessons, students |
| **Popular Schools** | Dynamic grid from `WiserData.schools` (6 schools) — logo image, name, description, tags, rating, stats, price, featured badge |
| **Live Demo** | 3 tabbed interactive mockups: Student Dashboard, Course Player, Teacher Analytics |
| **Teacher Promo** | Earnings showcase ($3.2K avg monthly, 85% revenue share, 2hr setup) + "Start Teaching" CTA |
| **Testimonials** | Two-row infinite marquee of testimonial cards scrolling left & right |
| **Pricing** | Student/Teacher toggle + Monthly/Yearly toggle (Save 20%), 4 plans |
| **Footer** | 5-column grid: Brand + social links, For Students, For Teachers, Company, Support + © 2026 |

---

## Authentication (2 Pages)

### Login — `auth/login.html`
- Split layout: gradient left panel with feature bullets, form on the right
- Email + Password fields with icons, password visibility toggle
- "Remember me" checkbox, "Forgot password" link
- Social login buttons (Google, GitHub)
- Role-based redirect on success (student → student dashboard, teacher → teacher dashboard, admin → admin dashboard)

### Register — `auth/register.html`
- Matching split layout
- Role selector: Student ("I want to learn") / Teacher ("I want to teach") toggle cards
- Form: First Name, Last Name, Email, Password (with 4-level strength meter), Terms checkbox
- Social signup buttons (Google, GitHub)
- Redirects to the appropriate dashboard based on selected role

---

## Student Segment (12 Pages)

All student pages share a common layout:
- **Top navbar** — Home, Courses, Dashboard, Schools, Learning Hub + Search, Notifications (badge), Cart (badge), "Enroll Now" CTA
- **Profile banner** — Cover photo (`Cover-Photo/2.png`), profile photo (`Teacher-Student/3.png`), name "Jordan Rivera", stats
- **Left sidebar** — Dashboard, My Profile, Enrolled Courses, Wishlist, Reviews, My Quiz Attempts, Order History | Settings, Logout
- **Footer** — 4-column layout: Brand + social, Useful Links, Our Company, Get in Touch (phone, email, newsletter) + © 2026

---

### 1. Dashboard — `student/dashboard.html`

| Component | Details |
|-----------|---------|
| Streak Widget | Current streak counter with 7-day history dots |
| Stats Grid | Courses Enrolled, Completed (8), Study Time (246h), XP Earned (12,450) — dynamic from `WiserData.studentProfile` |
| Weekly Study Hours | CSS bar chart from `WiserData.studyHoursWeekly` (Mon–Sun) |
| Recommended for You | 3 course cards from `WiserData.recommendedCourses` with AI reason badge, thumbnail image, rating, students, level |
| Continue Learning | In-progress courses with progress bar and percentage |
| Daily Tasks | 5 tasks from `WiserData.dailyTasks` (check off, XP rewards) |

---

### 2. Explore — `student/explore.html`

| Component | Details |
|-----------|---------|
| Category Pills | All, Web Dev, Data Science, Design, Mobile, Marketing, Finance, Creative — filters both videos and courses |
| Trending Videos | Grid from `WiserData.exploreVideos` (9 videos) — thumbnail, teacher avatar photo, follow/unfollow, like, save, free badges |
| Browse Courses | Grid from `WiserData.courses` (12 courses) — thumbnail image, bookmark, price, rating, level |
| AI Picks | 3 cards from `WiserData.recommendedCourses` — AI reason badge, instructor, price |
| Search | Real-time filtering of videos and courses |

---

### 3. Enrolled Courses — `student/enrolled-courses.html`
- **3 tabs**: All Enrolled, Active (in-progress), Completed
- Course cards with thumbnail images, progress bars, percentage
- Certificate download button for completed courses (canvas-generated PNG with gradient, borders, student name, course title, date, instructor)

### 4. Wishlist — `student/wishlist.html`
- Wishlist grid (up to 6 non-enrolled courses) with thumbnail images
- Bookmark toggle with Toast notification on removal
- Price display with original price strikethrough

### 5. Learning Hub — `student/learning-hub.html`

| Component | Details |
|-----------|---------|
| Stats Grid | Courses Active, Avg Quiz Score, Total Study Time, Certificates |
| Weekly Study Hours | Chart from `WiserData.studyHoursWeekly` |
| Recent Quiz Results | Color-coded scores from `WiserData.quizResults` |
| Topics to Review | AI-identified weak areas from `WiserData.weakTopics` |
| Learning Goals | Tracker from `WiserData.learningGoals` (5 goals with progress) |
| Course Progress | Table with thumbnail, instructor, progress bar, status pills |
| Upcoming Tests | Grid from `WiserData.upcomingTests` (4 tests) — date, time, questions, duration, difficulty, Set Reminder |
| Revision Reminders | Spaced repetition from `WiserData.revisionReminders` — retention %, urgency, Review Now |
| Suggested Next Course | AI-powered recommendation from `WiserData.recommendedCourses` |

---

### 6. Course Player — `student/course-player.html`

| Component | Details |
|-----------|---------|
| Video Player | Play/pause, prev/next, speed (0.5x–2x), volume, subtitles toggle (12 cues), fullscreen |
| Actions | Bookmark, Complete, Share buttons |
| Notes tab | Timestamped notes from `WiserData.notes` with add/delete |
| Q&A tab | Questions from `WiserData.qna` with answers |
| Comments tab | Comments from `WiserData.comments` with student avatar photo |
| Lesson Sidebar | Collapsible sections from `WiserData.curriculum` (4 sections, 19 lessons) |
| Completion Modal | Confetti animation, +500 XP, badge unlock, certificate preview, 5-star instructor rating, share to LinkedIn, next course suggestion |

---

### 7. Schools — `student/schools.html`
- Category pills (All, Technology, Design, Business, Creative)
- Featured School banner (AI & ML Academy)
- Schools grid from `WiserData.schools` — logo image, banner image, name, tags, rating, stats, trending badge
- Sort dropdown (Default, Trending, Rating, Most Students, Most Courses)
- **School Detail Modal** — tabs: Teachers, Reviews, Free Lessons, Courses
- **Compare feature** — FAB button, select schools, comparison grid modal

### 8. My Profile — `student/my-profile.html`
- Read-only profile display: Registration Date, First/Last Name, Username, Email, Phone, Skill/Occupation, Biography

### 9. Settings — `student/settings.html`
- **5 tabs**: Profile (cover/avatar upload, form), Password (change password, 2FA toggle, Delete Account with confirmation), Social Share (6 platform URLs), Notifications (6 email toggles), Preferences

### 10. Order History — `student/order-history.html`
- Table: Order ID, Course Name, Date, Price, Status (Completed / Pending / Refunded)
- 7 orders with color-coded status badges

### 11. Reviews — `student/reviews.html`
- Table: Course Name, Rating (stars), Review text, Date, Actions
- 5 reviews with inline edit (textarea) and delete (Toast notification)

### 12. Quiz Attempts — `student/quiz-attempts.html`
- Table: Date, Quiz Title, Questions, Total Marks, Correct Answers, Result, Actions
- 7 quiz attempts with View Details modal (score %, progress bar, correct/wrong counts) and Delete

---

## Teacher Segment (9 Pages)

All teacher pages share a common layout:
- **Top navbar** — Dashboard, Schools, My Courses, Analytics, Community, Payout + "Create a New Course" button
- **Cover banner** — Gradient background with instructor branding
- **Profile bar** — Avatar photo, name "Sarah Chen", 5-star rating, 35 reviews
- **Left sidebar** — Dashboard, Schools, Analytics, Payout | My Courses, Course Builder, Community, Store Manager | Settings, Logout
- **Footer** — 4-column layout with brand, links (Invite Teachers → schools.html), company info, newsletter

---

### 1. Dashboard — `teacher/dashboard.html`

| Component | Details |
|-----------|---------|
| Stat cards | Total Revenue ($48,250 ▲ 18%), Total Students (18,420 ▲ 12%), Active Courses (6 ▲ 2), Avg Rating (4.8 ★) |
| My Courses table | Course name, enrolled count, star rating from `WiserData.teacherCourses` (5 courses) |
| Revenue Overview | CSS bar chart with time range selector (7 days, 30 days, 90 days, This year) |
| Recent Activity | 5 items: new enrollment, 5-star review, payout processed, Q&A question, milestone reached |
| Quick Actions | 4 cards: Create Course, View Analytics, Community, Payout |

---

### 2. Schools — `teacher/schools.html`

- **My Schools** — Create School button + owned school cards from `WiserData.teacherSchools` (2 schools). Each card: logo, name, description, 6 stats, 4 action buttons (View Profile, Hire Teachers, Edit, Delete)
- **Joined Schools** — Schools applied to from `WiserData.schoolApplications` (3 applications). Status badges (accepted / pending / rejected)
- **Browse Schools** — 6 discoverable schools with "Apply to Join" buttons
- **6 Modals**: Create/Edit School, Hire Teacher (8 available), Teacher Profile, Assign Course, Apply to Join, Share Course

---

### 3. Creator Hub — `teacher/creator-hub.html`
- Tab filters: All Courses, Published, Pending, Draft
- Course cards from `WiserData.teacherCourses` — thumbnail, status badge, rating, title, lessons, students, price, Edit, Bookmark
- Content Overview: 5 stat cards (Total Lessons, Videos, Quizzes, Assignments, Resources)

### 4. Analytics — `teacher/analytics.html`

| Component | Details |
|-----------|---------|
| Stat cards | Total Students (18,420 ▲ 12%), Total Revenue ($48,250 ▲ 18%), Courses Sold (892 ▲ 5%), Avg Rating (4.8 ▲ 0.2) |
| Revenue Over Time | CSS bar chart (7 months), Week/Month/Year toggle |
| Sales by Category | Horizontal bars — Web Dev 42%, Data Science 28%, Design 18%, Mobile 12% |
| Student Retention | Vertical bar chart — Week 1 (100%) → Week 8 (45%) |
| Recent Reviews | Student name, stars, review text, course, time ago |
| Top Lessons | Table from curriculum data |
| Extra Stats | Completion Rate (72%), Watch Time (12,450 hrs), Active Students (1,256) |

### 5. Community — `teacher/community.html`
- Post composer with photo/document upload
- Posts feed from `WiserData.communityPosts` (3 posts) — avatar, author, badge, timestamp, Like/Reply/Share
- Own post controls (Edit/Delete on Sarah Chen's posts)

### 6. Payout — `teacher/payout.html`

| Component | Details |
|-----------|---------|
| Earnings | Available Balance ($2,890 + Withdraw), Total Earned, This Month |
| Payment Methods | Stripe (Primary), Bank Transfer (Chase ••••4821), Payoneer + Add Method |
| Schedule | Frequency dropdown, Minimum Threshold, Next payout date |
| Tax Info | W-9 (Submitted ✓), Tax ID, Filing Status, Country, YTD ($48,250), Download 1099 |
| History | Table from `WiserData.payoutHistory` (6 entries) |

### 7. Store Manager — `teacher/store-manager.html`
- 4 theme cards (Classic Orange, Midnight Pro, Ocean Blue, Royal Purple)
- Store customization (name, tagline, bio, brand color, custom domain)
- Store stats (visitors, conversion, products sold, bounce rate)
- Live-updating preview card
- Digital products from `WiserData.storeProducts` (4 products) + Add Product
- Discount coupons table (4 coupons) + Create Coupon

### 8. Course Builder — `teacher/course-builder.html`
- **Left column**: Title, Description, Category (13 options), Level (3), Price, Thumbnail upload (drag-and-drop), Tags
- **Right column**: Collapsible sections from `WiserData.curriculum` (4 sections, 19 lessons), type selector (video/quiz/assignment/resource), drag-and-drop reorder
- AI Course Assistant (topic input + simulated generation)
- Save Draft / Publish Course buttons

### 9. Settings — `teacher/settings.html`
- **4 tabs**: Profile (cover/avatar upload, name, email, bio, location, speciality, website, social links), Account (password change, 2FA, connected accounts, Danger Zone), Notifications (6 email + 2 push toggles), Privacy (visibility toggles, analytics tracking, data export)

---

## Admin Segment (6 Pages)

All admin pages share a common layout:
- **Sidebar** — Logo (links to dashboard), Dashboard, Users | Courses, Reports | Revenue | Settings + Admin avatar (Super Admin)
- **Top bar** — Search, Notification bell (badge), Profile dropdown

---

### 1. Dashboard — `admin/dashboard.html`

| Component | Details |
|-----------|---------|
| Welcome Banner | Greeting with current date |
| KPI Stats | Total Users (52,847), Active Courses (1,284), Monthly Revenue ($284,590), Platform Uptime (94%) |
| Revenue Chart | Canvas bar chart with 7d/30d/90d toggle |
| User Growth Chart | Canvas chart, Students vs Teachers legend |
| Recent Users | Table: User, Role, Joined, Status |
| Top Courses | Table: Course, Instructor, Students, Revenue |
| Quick Actions | Add User, Review Course, Announcement, Export Report |
| Recent Activity | Feed with timestamps |
| Pending Approvals | Badge count (5) |
| **3 Modals** | Add User (name/email/role), Review Course (ID/decision/notes), Send Announcement (audience/title/message) |

---

### 2. Users — `admin/users.html`
- Stats: Total Users (52,847), Students (48,210), Teachers (4,584), Admins (53)
- Search + Filters (role, status)
- Users table: Checkbox, Avatar+Name, Email, Role badge, Joined, Status pill, Actions (Edit/Suspend)
- Edit User modal (name/email/role/status), toggle suspend/reactivate, select-all checkbox
- Pagination (1–20 of 52,847)

### 3. Courses — `admin/courses.html`
- Stats: Total Courses (1,284), Published (1,041), Pending Review (87), Draft (156)
- Search + Filters (category, status)
- Course table: Checkbox, Course, Instructor, Category, Students, Rating, Revenue, Status, Actions
- Add Course modal (title/instructor/category/price/description), inline approve/suspend
- Pagination (1–10 of 87)

### 4. Revenue — `admin/revenue.html`
- KPI: Monthly Revenue ($284,590), Annual ($3,241,820), Avg Order ($47), Refund Requests (1,847)
- Revenue chart (canvas, 12-month bars, Revenue vs Expenses legend)
- Revenue by Source: Course Sales 70%, Subscriptions 19%, Certificates 8%, Sponsorships 3%
- Payout Summary (5 instructors)
- Recent Transactions table (8 transactions) + Export CSV

### 5. Reports — `admin/reports.html`
- Date range selector (7d / 30d / 90d / Year)
- KPI: New Registrations (6,842), Course Completions (3,219), Avg Session (42 min), Avg Course Rating (4.7)
- Enrollment Trends chart (14-week bars)
- Completion Rate chart (14-week area)
- Top Categories: Development 38%, Data Science 24%, Design 18%, Business 12%, Marketing 8%
- User Demographics: US 32%, India 21%, UK 14%, Brazil 9%, Germany 7%, Others 17%
- Course Engagement Report table (7 courses) + Export CSV

### 6. Settings — `admin/settings.html`
- **5 tabs**: General (name, tagline, email, language, timezone, maintenance mode), Email (SMTP config, 4 notification toggles, test email), Payments (gateway selection, Stripe keys, commission split 20/80, min payout, auto payouts), Security (2FA, strong passwords, session timeout, max login attempts, IP whitelisting, audit logging), API (API key copy/regenerate, webhook URL, connected services: Mailchimp, Analytics, Slack, Vimeo)

---

## Data Layer

Pages currently use static/mock data for UI demonstration. Backend integration is in progress.

---

## Assets

```
assets/
  Courses/         1.png – 4.png    Course thumbnail images
  Teacher-Student/ 1.png – 3.png    Profile photos (teacher & student avatars)
  Cover-Photo/     1.png – 3.png    Banner/cover photos
```

---

## Project Structure

```
index.html                  Landing page (12 sections)
auth/
  login.html                Login form
  register.html             Registration form (role selector)
student/                    12 pages
  dashboard.html            Stats, streaks, recommended, continue learning, daily tasks
  explore.html              Video feed, course browse, AI picks, category filters
  enrolled-courses.html     Enrolled/active/completed tabs, certificate download
  wishlist.html             Saved courses grid
  learning-hub.html         Analytics, quizzes, goals, tests, revision, suggestions
  course-player.html        Video player, notes, Q&A, comments, curriculum sidebar
  schools.html              Browse schools, detail modal, compare feature
  my-profile.html           Read-only profile display
  settings.html             Profile, password, social, notifications, preferences
  order-history.html        Order table with status badges
  reviews.html              Review table with inline edit/delete
  quiz-attempts.html        Quiz table with detail modal
teacher/                    9 pages
  dashboard.html            Stats, revenue chart, activity, quick actions
  schools.html              Own/joined/browse schools, 6 modals
  creator-hub.html          Course management, tab filters
  analytics.html            Charts, retention, reviews, top lessons
  community.html            Post feed, compose, like/reply/share
  payout.html               Earnings, methods, tax, history
  store-manager.html        Themes, products, coupons, live preview
  course-builder.html       Curriculum editor, AI assistant, drag-and-drop
  settings.html             Profile, account, notifications, privacy
admin/                      6 pages
  dashboard.html            KPI stats, charts, tables, 3 modals
  users.html                User management, search/filter, edit modal
  courses.html              Course management, approve/suspend
  revenue.html              Revenue charts, payouts, transactions
  reports.html              Enrollment trends, demographics, engagement
  settings.html             General, email, payments, security, API
css/
  base.css                  CSS variables, reset, design tokens
  landing.css               Landing page styles
  app.css                   Shared component styles (teacher + student)
  student.css               Student-specific styles + responsive breakpoints
  teacher.css               Teacher-specific styles
  admin.css                 Admin panel styles
js/
  app.js                    Shared utilities (Toast, UI components, rendering)
  landing.js                Landing page rendering logic
  admin.js                  Admin panel logic
assets/
  Courses/                  Course thumbnail images (4)
  Teacher-Student/          Profile photos (3)
  Cover-Photo/              Banner images (3)
```

---

## Architecture

```
Browser (Static HTML/CSS/JS)
    │
    ├── HTML Pages (43 pages across 4 segments)
    ├── CSS Stylesheets (6 files — responsive design)
    ├── JavaScript (UI logic, rendering, interactions)
    └── Assets (images, logos, thumbnails)
```

Backend integration is currently in progress.

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). No polyfills required. Fully responsive from 320px to 3840px+ (4K) via CSS media queries at 480px, 768px, 1024px, 1200px, 1440px, 1920px, 2560px, and 3840px breakpoints.

---

## License

All rights reserved. This project is proprietary.
