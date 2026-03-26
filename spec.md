# Developer Portfolio

## Current State
Empty project with no backend or frontend code.

## Requested Changes (Diff)

### Add
- Full-stack premium portfolio website for a web developer
- Backend: projects CRUD, likes, comments, visitor tracking, admin authentication
- Frontend: dark luxury theme, glassmorphism UI, smooth animations, subtle 3D effects
- Hero section with name, tagline, CTA
- Projects section with interactive cards (thumbnail, title, description, Visit/Like/Comment buttons)
- Real-time like system per project
- Comment section per project (add/view feedback)
- Visitor tracking (total visitors, interactions)
- Secure admin panel: add/edit/delete projects, moderate comments, view analytics
- About Me, Skills, Contact Form, Social Links sections
- Fully responsive, SEO-friendly

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Select `authorization` and `blob-storage` components
2. Generate Motoko backend with:
   - Project management (CRUD: id, title, description, url, imageUrl, createdAt)
   - Like system (likeProject, unlikeProject, getLikes per project)
   - Comment system (addComment, deleteComment, getComments per project, admin moderation)
   - Visitor tracking (recordVisit, getVisitorStats, getTotalVisitors)
   - Admin-only operations gated by authorization
3. Frontend:
   - Dark luxury theme with glassmorphism cards
   - Framer Motion / CSS animations for smooth transitions
   - Hero section (full-screen, name, tagline, CTA)
   - Projects grid with interactive cards
   - Like/comment interactions
   - Visitor counter display
   - Admin dashboard (protected route) for project CRUD, comment moderation, analytics
   - About, Skills, Contact, Social sections
   - Mobile-responsive layout
