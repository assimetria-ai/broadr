# Broadr Custom Features Migration Plan

Generated: 2026-02-26 22:56  
Status: Analysis complete, ready for implementation

## Overview
This document maps all custom features from legacy Broadr to the new product-template-based structure.  
ALL custom code MUST go in `@custom/` directories only. NEVER modify `@system/` files.

**Broadr Product Mission:** The social media API that replaces everything. Multi-channel broadcasting, scheduling, and analytics.

---

## Backend Custom Features

### Database Repositories (@custom/repos)
Legacy location: `legacy/broadr/server/src/db/repos/@custom/`

**Required repos:**
1. **BrandRepo.js** - Brand management (core feature)
2. **UserRepo.js** - Extended user functionality beyond auth
3. **ErrorEventRepo.js** - Error tracking persistence + search support
4. **CollaboratorRepo.js** - Team collaboration features
5. **ApiKeyRepo.js** - API key generation and management

### Database Migrations (@custom/migrations)
Legacy location: `legacy/broadr/server/src/db/migrations/@custom/`

**Required migrations (in order):**
1. `001_error_events.js` - Error tracking table
2. `002_brands.js` - Brand management
3. `002_collaborators.js` - Team collaboration
4. `002_users_custom.js` - User extensions
5. `003_api_keys.js` - API key storage
6. `003_invitation_tokens.js` - Invite system
7. `003_full_text_search.js` - Search optimization (GIN indexes for FTS)
8. **`004_channels_posts.js`** - **IMPORTANT:** Channels and posts tables (currently in 001_initial.sql - needs extraction)

### SQL Schemas (@custom/schemas)
Legacy location: `legacy/broadr/server/src/db/schemas/@custom/`

**Required schemas:**
1. `error_events.sql` - Error event structure
2. `brands.sql` - Brand structure
3. `collaborators.sql` - Collaborator structure
4. `users_custom.sql` - User extensions
5. `api_keys.sql` - API key structure
6. `invitation_tokens.sql` - Invite tokens
7. `full_text_search.sql` - FTS indexes
8. **`channels.sql`** - Social media channels (extract from 001_initial.sql)
9. **`posts.sql`** - Social posts (extract from 001_initial.sql)

### API Endpoints (@custom/api)
Legacy location: `legacy/broadr/server/src/api/@custom/`

**Required endpoints (248 LOC total):**

1. **`search/index.js`** (60 LOC)
   - `GET /api/search?q=term[&types=users,brands,collaborators,errors][&limit=20]`
   - Full-text search across multiple entities
   - Requires admin auth
   - Parallel searches with aggregated results

2. **`errors/index.js`** (91 LOC)
   - `GET /api/errors/stats` - Error statistics by environment
   - `GET /api/errors` - List errors with filters (status, level, env)
   - `GET /api/errors/:id` - Get single error event
   - `POST /api/errors` - Ingest error events (DSN-authenticated)
   - `PATCH /api/errors/:id/status` - Update error status (unresolved/resolved/ignored)

3. **`channels/index.js`** (97 LOC) - **BROADR CORE FEATURE**
   - `GET /api/channels` - List user's connected social channels
   - `POST /api/channels` - Connect new channel (platform, handle, access_token)
   - `DELETE /api/channels/:id` - Disconnect channel
   - `POST /api/channels/publish` - Publish/schedule post to multiple channels
   - `GET /api/channels/posts` - List recent posts with pagination
   - `GET /api/channels/stats` - Dashboard stats (connected channels, posts today, scheduled)

### Workers (@custom/workers)
Legacy location: `legacy/broadr/server/src/workers/@custom/`

**Status:** Empty placeholder file (no custom workers yet)
**Future:** May need post scheduler worker for scheduled_at posts

### Configuration
- `server/src/config/@custom/index.js` - Product config (name, URL, description)
- `server/src/scheduler/tasks/@custom/index.js` - Scheduled jobs (placeholder)
- `server/src/lib/@custom/index.js` - Custom utilities (placeholder)

---

## Frontend Custom Features

### Pages (@custom/pages)
Legacy location: `legacy/broadr/client/src/app/pages/app/@custom/`

**Required pages:**
1. **ErrorTrackingPage.tsx** - Error monitoring dashboard
2. **BroadrDashboardPage.tsx** - **CORE FEATURE:** Main channels dashboard
   - Channel connection management (Twitter, Instagram, LinkedIn)
   - Quick compose + multi-channel selector
   - Stats cards (connected channels, posts today, total reach, scheduled posts)
   - Recent posts table with status (published/scheduled/failed)
   - Channel status badges (connected/disconnected)
   - Platform icons (Twitter, Instagram, LinkedIn)

### Routes (@custom/routes)
Legacy location: `legacy/broadr/client/src/app/routes/@custom/`

**Required routes:**
- `/app/channels` → BroadrDashboardPage

### Integrations
- **Sentry** (`app/lib/@custom/sentry.ts`) - Error monitoring integration

### Configuration
- `config/@custom/info.ts` - Product metadata
  - Name: "Broadr"
  - Tagline: "The social media API that replaces everything."
  - URL: broadr.com
  - Support email: support@broadr.com

### API Layer (@custom/api)
- `app/api/@custom/index.ts` - Custom API client functions (currently empty, needs implementation)
  - Should add: `getChannels()`, `connectChannel()`, `publishPost()`, etc.

---

## Key Differences from Nestora

### 1. **Channels Feature (Broadr-specific)**
Broadr's core differentiator - social media channel management:
- Multi-platform integration (Twitter, Instagram, LinkedIn, TikTok, Facebook)
- OAuth token storage (access_token, refresh_token)
- Channel metadata (handle, followers_count, status)
- Connected/disconnected state management

### 2. **Posts Management (Broadr-specific)**
Social post creation and scheduling:
- Multi-channel broadcasting (channel_ids array)
- Post scheduling (scheduled_at, published_at)
- Post status tracking (published/scheduled/failed/draft)
- Engagement metrics (reach, likes, shares)

### 3. **SQL Schemas Directory**
Unlike Nestora (migrations only), Broadr has explicit SQL schema files:
- Location: `server/src/db/schemas/@custom/*.sql`
- Pure DDL definitions (CREATE TABLE, CREATE INDEX)
- Referenced by migrations for clean separation

### 4. **Search API**
Comprehensive FTS search endpoint:
- Searches across users, brands, collaborators, errors
- Grouped results per entity type
- GIN indexes for performance
- Admin-only access

---

## Implementation Priority

### Phase 1: Core Data Model (P0)
- [ ] Extract channels/posts tables from 001_initial.sql → create 004_channels_posts migration
- [ ] Create all 9 SQL schema files in `server/src/db/schemas/@custom/`
- [ ] Migrate all 8 database migrations to new structure (in order!)
- [ ] Implement all 5 @custom repos with search methods
- [ ] Test database initialization: `npm run db:reset`

### Phase 2: Backend Logic (P1)
- [ ] Implement search API endpoint (`/api/search`)
- [ ] Implement errors API endpoints (5 routes)
- [ ] Implement channels API endpoints (6 routes) - **CRITICAL PATH**
- [ ] Custom config (`config/@custom/index.js`)
- [ ] Test all API routes with Postman/curl

### Phase 3: Frontend (P1)
- [ ] BroadrDashboardPage.tsx - main channels UI
- [ ] ErrorTrackingPage.tsx
- [ ] Custom routes (`/app/channels`)
- [ ] Product info config
- [ ] Sentry integration
- [ ] API client functions (`app/api/@custom/index.ts`)

### Phase 4: Testing & Polish (P2)
- [ ] Unit tests for repos (especially channel/post repos)
- [ ] API integration tests (all 11 custom endpoints)
- [ ] E2E tests for channels page
- [ ] Test multi-channel publishing flow
- [ ] Test post scheduling logic
- [ ] Verify FTS search across all entities

### Phase 5: Future Enhancements (P3)
- [ ] Post scheduler worker (process scheduled_at posts)
- [ ] OAuth callback handlers for channel connections
- [ ] Webhook endpoints for platform notifications
- [ ] Analytics API for engagement metrics

---

## Acceptance Criteria

1. ✅ All custom features work exactly as in legacy version
2. ✅ Zero modifications to @system files
3. ✅ All tests pass
4. ✅ Dev server runs without errors (`npm run dev` in both server + client)
5. ✅ Database migrations execute cleanly (`npm run db:migrate`)
6. ✅ Channels page renders and connects to backend
7. ✅ Can publish a post to multiple channels
8. ✅ Search API returns results across all entity types
9. ✅ Error tracking ingests and displays events

---

## Migration Checklist

### Database Layer
- [ ] `server/src/db/schemas/@custom/error_events.sql`
- [ ] `server/src/db/schemas/@custom/brands.sql`
- [ ] `server/src/db/schemas/@custom/collaborators.sql`
- [ ] `server/src/db/schemas/@custom/users_custom.sql`
- [ ] `server/src/db/schemas/@custom/api_keys.sql`
- [ ] `server/src/db/schemas/@custom/invitation_tokens.sql`
- [ ] `server/src/db/schemas/@custom/full_text_search.sql`
- [ ] `server/src/db/schemas/@custom/channels.sql` ⚡ NEW
- [ ] `server/src/db/schemas/@custom/posts.sql` ⚡ NEW
- [ ] `server/src/db/migrations/@custom/001_error_events.js`
- [ ] `server/src/db/migrations/@custom/002_brands.js`
- [ ] `server/src/db/migrations/@custom/002_collaborators.js`
- [ ] `server/src/db/migrations/@custom/002_users_custom.js`
- [ ] `server/src/db/migrations/@custom/003_api_keys.js`
- [ ] `server/src/db/migrations/@custom/003_invitation_tokens.js`
- [ ] `server/src/db/migrations/@custom/003_full_text_search.js`
- [ ] `server/src/db/migrations/@custom/004_channels_posts.js` ⚡ NEW
- [ ] `server/src/db/repos/@custom/BrandRepo.js`
- [ ] `server/src/db/repos/@custom/UserRepo.js`
- [ ] `server/src/db/repos/@custom/ErrorEventRepo.js`
- [ ] `server/src/db/repos/@custom/CollaboratorRepo.js`
- [ ] `server/src/db/repos/@custom/ApiKeyRepo.js`
- [ ] `server/src/db/repos/@custom/ChannelRepo.js` ⚡ NEW (needed for API)
- [ ] `server/src/db/repos/@custom/PostRepo.js` ⚡ NEW (needed for API)
- [ ] `server/src/db/repos/@custom/index.js` (export all repos)

### Backend API
- [ ] `server/src/api/@custom/search/index.js` (60 LOC)
- [ ] `server/src/api/@custom/errors/index.js` (91 LOC)
- [ ] `server/src/api/@custom/channels/index.js` (97 LOC) ⚡ CORE
- [ ] `server/src/routes/@custom/index.js` (mount custom routes)
- [ ] `server/src/config/@custom/index.js`
- [ ] `server/src/lib/@custom/index.js`
- [ ] `server/src/scheduler/tasks/@custom/index.js`
- [ ] `server/src/workers/@custom/index.js`

### Frontend
- [ ] `client/src/app/pages/app/@custom/ErrorTrackingPage.tsx`
- [ ] `client/src/app/pages/app/@custom/BroadrDashboardPage.tsx` ⚡ CORE (300+ LOC)
- [ ] `client/src/app/routes/@custom/index.tsx`
- [ ] `client/src/app/api/@custom/index.ts` (implement API client)
- [ ] `client/src/app/lib/@custom/sentry.ts`
- [ ] `client/src/config/@custom/info.ts`
- [ ] `client/src/app/components/@custom/index.tsx` (if needed)

---

## Critical Implementation Notes

### 1. Channels Table Migration
**Problem:** channels + posts tables are currently in `001_initial.sql` (system migration)  
**Solution:** Extract to new migration `004_channels_posts.js` in @custom  
**Why:** Template upgrades will overwrite 001_initial.sql - custom tables MUST be in @custom migrations

### 2. Missing Repos
Legacy code references ChannelRepo and PostRepo but they don't exist yet:
- **ChannelRepo.js** - CRUD operations for channels table
- **PostRepo.js** - CRUD operations for posts table + scheduling logic
- Both need implementation based on API endpoint usage patterns

### 3. Frontend API Client
`app/api/@custom/index.ts` is empty but BroadrDashboardPage expects:
- `api.get('/channels')` → `GET /api/channels`
- `api.post('/posts', data)` → `POST /api/channels/publish`
- `api.get('/stats/today')` → `GET /api/channels/stats`

These need to be implemented using the @system apiRequest utility.

### 4. Platform Icons
BroadrDashboardPage uses lucide-react icons (Twitter, Instagram, Linkedin).  
Verify these are included in client dependencies.

### 5. OAuth Integration (Future)
Current implementation stores tokens but no OAuth callback handlers.  
Phase 5 should add OAuth flows for each platform (Twitter OAuth 2.0, Instagram Basic Display, LinkedIn API).

---

## Notes

- **Legacy code location:** `/Users/ruipedro/.openclaw/workspace-assimetria/legacy/broadr/`
- **New structure:** `/Users/ruipedro/.openclaw/workspace-assimetria/broadr/`
- **Total custom files:** 35 (excluding .gitkeep)
- **Backend LOC:** ~248 (API endpoints only)
- **Frontend LOC:** ~300+ (BroadrDashboardPage alone)
- **Reference legacy files directly when implementing**
- **DO NOT copy-paste blindly** - adapt to new template structure
- **Test incrementally** - migrate one phase at a time

---

## Risk Assessment

**High Risk:**
- Channels/posts migration extraction - touching 001_initial.sql
- Missing ChannelRepo/PostRepo - need to be created from scratch

**Medium Risk:**
- OAuth token refresh logic not implemented
- Post scheduler worker missing (scheduled posts won't publish)

**Low Risk:**
- Search API (straightforward port)
- Error tracking (similar to Nestora)
- Frontend pages (mostly UI, data fetching already working with seed data)

---

**Status:** Ready for implementation. Start with Phase 1 (database layer).
