# UAP Alumni Connect - API Documentation

Base URL: `http://localhost:4000`

## Authentication

All endpoints require authentication using Firebase Auth token in the Authorization header:
```
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

## API Endpoints

### Profiles

#### Get All Profiles
```
GET /api/profiles
```
Returns list of all alumni profiles.

#### Get Profile by ID
```
GET /api/profiles/:id
```

#### Create Profile
```
POST /api/profiles
Body: {
  full_name: string (required)
  graduation_year: number
  department: string
  degree: string
  current_company: string
  current_position: string
  bio: string
  profile_picture_url: string
  linkedin_url: string
  github_url: string
  location: string
  phone: string
}
```

#### Update Profile
```
PUT /api/profiles/:id
Body: Same as create
```

#### Search Alumni
```
GET /api/profiles/search/alumni?year=2020&department=CSE&company=Google
Query params:
  - year: graduation year
  - department: department name
  - company: company name (partial match)
```

---

### Events

#### Get All Events
```
GET /api/events?status=upcoming
Query params:
  - status: upcoming | ongoing | completed | cancelled
```

#### Get Event by ID
```
GET /api/events/:id
```
Returns event with organizer details and list of registrations.

#### Create Event
```
POST /api/events
Body: {
  title: string (required)
  description: string
  event_date: timestamp (required)
  location: string
  event_type: string (reunion | workshop | seminar | meetup)
  max_attendees: number
  image_url: string
  is_online: boolean
  meeting_link: string
}
```

#### Update Event
```
PUT /api/events/:id
Body: Same as create
```
Only event organizer can update.

#### Delete Event
```
DELETE /api/events/:id
```
Only event organizer can delete.

#### Register for Event
```
POST /api/events/:id/register
```

#### Cancel Event Registration
```
DELETE /api/events/:id/register
```

---

### Jobs

#### Get All Jobs
```
GET /api/jobs?status=active&job_type=full-time&is_remote=true
Query params:
  - status: active | closed | filled
  - job_type: full-time | part-time | contract | internship
  - is_remote: true | false
```

#### Get Job by ID
```
GET /api/jobs/:id
```

#### Post Job
```
POST /api/jobs
Body: {
  title: string (required)
  company: string (required)
  description: string
  job_type: string (full-time | part-time | contract | internship)
  location: string
  is_remote: boolean
  salary_range: string
  requirements: string
  application_url: string
  application_email: string
  expires_at: timestamp
}
```

#### Update Job
```
PUT /api/jobs/:id
Body: Same as create
```
Only job poster can update.

#### Delete Job
```
DELETE /api/jobs/:id
```
Only job poster can delete.

---

### Posts (Social Feed)

#### Get All Posts
```
GET /api/posts?post_type=update
Query params:
  - post_type: update | achievement | question | announcement
```

#### Get Post by ID
```
GET /api/posts/:id
```
Returns post with author details and comments.

#### Create Post
```
POST /api/posts
Body: {
  content: string (required)
  image_url: string
  post_type: string (update | achievement | question | announcement)
}
```

#### Update Post
```
PUT /api/posts/:id
Body: Same as create
```
Only post author can update.

#### Delete Post
```
DELETE /api/posts/:id
```
Only post author can delete.

#### Like Post
```
POST /api/posts/:id/like
```

#### Unlike Post
```
DELETE /api/posts/:id/like
```

#### Get Post Comments
```
GET /api/posts/:id/comments
```

#### Add Comment
```
POST /api/posts/:id/comments
Body: {
  content: string (required)
}
```

---

### Dashboard (Admin Only)

All dashboard endpoints require admin or super_admin role.

#### Get Dashboard Statistics
```
GET /api/dashboard/stats
Authorization: Bearer YOUR_FIREBASE_TOKEN (Admin required)
```
Returns overall platform statistics including user counts, events, jobs, posts, and reports.

#### Get User Growth Statistics
```
GET /api/dashboard/user-growth
Authorization: Bearer YOUR_FIREBASE_TOKEN (Admin required)
```
Returns monthly user growth data for the last 12 months.

#### Get Recent Activity
```
GET /api/dashboard/recent-activity?limit=50
Authorization: Bearer YOUR_FIREBASE_TOKEN (Admin required)
Query params:
  - limit: number of activities to return (default: 50)
```
Returns recent user activities across the platform.

#### Get All Users (Paginated)
```
GET /api/dashboard/users?page=1&limit=20&role=user&is_active=true
Authorization: Bearer YOUR_FIREBASE_TOKEN (Admin required)
Query params:
  - page: page number (default: 1)
  - limit: items per page (default: 20)
  - role: filter by role (user | admin | super_admin)
  - is_active: filter by active status (true | false)
  - is_verified: filter by verification status (true | false)
```

#### Update User Role
```
PUT /api/dashboard/users/:id/role
Authorization: Bearer YOUR_FIREBASE_TOKEN (Super Admin required)
Body: {
  role: string (user | admin | super_admin)
}
```
Only super admins can change user roles.

#### Update User Status
```
PUT /api/dashboard/users/:id/status
Authorization: Bearer YOUR_FIREBASE_TOKEN (Admin required)
Body: {
  is_active: boolean
  is_verified: boolean
}
```
Admins can activate/deactivate users and verify profiles.

#### Get Reports
```
GET /api/dashboard/reports?status=pending&report_type=spam
Authorization: Bearer YOUR_FIREBASE_TOKEN (Admin required)
Query params:
  - status: pending | resolved | rejected
  - report_type: spam | inappropriate | harassment | other
```
View all user reports for moderation.

#### Create Report
```
POST /api/dashboard/reports
Authorization: Bearer YOUR_FIREBASE_TOKEN
Body: {
  report_type: string (required)
  target_type: string (required) - post | event | job | user
  target_id: uuid (required)
  reason: string (required)
  description: string
}
```
Any authenticated user can report content.

#### Update Report Status
```
PUT /api/dashboard/reports/:id
Authorization: Bearer YOUR_FIREBASE_TOKEN (Admin required)
Body: {
  status: string (pending | resolved | rejected)
}
```
Admins can resolve or reject reports.

#### Get Events Analytics
```
GET /api/dashboard/events/analytics
Authorization: Bearer YOUR_FIREBASE_TOKEN (Admin required)
```
Returns analytics on events by status, type, and total registrations.

#### Get Jobs Analytics
```
GET /api/dashboard/jobs/analytics
Authorization: Bearer YOUR_FIREBASE_TOKEN (Admin required)
```
Returns analytics on jobs by status, type, and remote vs onsite distribution.

#### Get Posts Analytics
```
GET /api/dashboard/posts/analytics
Authorization: Bearer YOUR_FIREBASE_TOKEN (Admin required)
```
Returns analytics on posts including engagement metrics, posts by type, and recent activity.

#### Log User Activity
```
POST /api/dashboard/activity
Authorization: Bearer YOUR_FIREBASE_TOKEN
Body: {
  activity_type: string (required)
  activity_details: object (optional)
}
```
Log custom user activities for analytics tracking.

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## User Roles

The platform supports three user roles:

- **user**: Default role for all alumni. Can view content, create posts, register for events, and apply to jobs.
- **admin**: Can access dashboard analytics, manage user statuses, moderate content, and resolve reports.
- **super_admin**: Full access including the ability to promote users to admin role.

## Database Schema

### Tables
- **profiles**: Extended user information with role and activity tracking
- **events**: Alumni events and meetups
- **event_registrations**: Event registration tracking
- **jobs**: Job postings
- **posts**: Social feed posts
- **post_likes**: Post likes tracking
- **post_comments**: Post comments
- **user_activity**: Activity logs for analytics
- **platform_stats**: Cached platform statistics
- **reports**: User-generated content reports

All tables have Row Level Security (RLS) enabled with appropriate policies.
