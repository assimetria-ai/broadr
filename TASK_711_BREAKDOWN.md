# Task 711: Rebuild Broadr from Product-Template - Subtask Breakdown

**Parent Task:** #678 (Rebuild all products from product-template)  
**Product:** Broadr  
**Status:** Decomposition Complete - Ready for Execution  
**Created:** 2026-02-27

---

## 🎯 Task Overview

Rebuild Broadr SaaS product using the product-template architecture, ensuring clean separation between `@system/` (template code) and `@custom/` (product-specific code).

**Broadr Core Value:** Multi-channel social media broadcasting API. Single endpoint to publish to Twitter, LinkedIn, Instagram, TikTok, Facebook, and YouTube.

---

## 📋 Subtask Breakdown

### Phase 1: Setup & Infrastructure

#### Subtask 1.1: Archive Legacy Code
**ID:** `711-setup-archive`  
**Description:** Archive existing broadr code to legacy directory  
**Steps:**
1. Verify current broadr code location
2. Create `/legacy/broadr/` directory if not exists
3. Copy all existing broadr code to legacy
4. Verify archive integrity
5. Document archive location in MIGRATION.md

**Acceptance Criteria:**
- [ ] Legacy code exists at `/Users/ruipedro/.openclaw/workspace-assimetria/legacy/broadr/`
- [ ] All files preserved (client, server, configs)
- [ ] Archive is read-only reference

**Estimated Time:** 5 minutes

---

#### Subtask 1.2: Fork Product-Template
**ID:** `711-setup-fork`  
**Description:** Copy product-template into broadr workspace  
**Steps:**
1. Navigate to template: `/Users/ruipedro/.openclaw/workspace-frederico/product-template/`
2. Copy entire template to: `/Users/ruipedro/.openclaw/workspace-assimetria/broadr/`
3. Verify `@system/` directories present (server/client)
4. Verify `@custom/` directories present
5. Initialize git repository

**Acceptance Criteria:**
- [ ] Product-template structure copied to broadr/
- [ ] `@system/` directories intact (server/src/api/@system, client/src/app/@system, etc.)
- [ ] `@custom/` directories present (empty or with placeholders)
- [ ] `.github/workflows/` present (CI/CD)
- [ ] `package.json`, `Dockerfile`, `docker-compose.yml` present

**Estimated Time:** 5 minutes

---

#### Subtask 1.3: Configure Product Branding
**ID:** `711-setup-config`  
**Description:** Configure Broadr-specific branding and metadata  
**Steps:**
1. Update `client/src/config/@custom/info.ts`:
   - name: "Broadr"
   - description: "The social media API that replaces everything."
   - tagline: "Multi-channel broadcasting made simple."
2. Update `server/src/config/@custom/index.js`:
   - productName: "Broadr"
   - branding colors, logos
3. Update `package.json` name and description
4. Update `README.md` with Broadr-specific content

**Acceptance Criteria:**
- [ ] Product name appears as "Broadr" in app
- [ ] Tagline/description reflects Broadr's mission
- [ ] Branding colors configured

**Estimated Time:** 10 minutes

---

### Phase 2: Backend Migration

#### Subtask 2.1: Database Migrations
**ID:** `711-backend-migrations`  
**Description:** Migrate all custom database migrations from legacy  
**Steps:**
1. Copy from `legacy/broadr/server/src/db/migrations/@custom/`:
   - `001_error_events.js`
   - `002_brands.js`
   - `002_collaborators.js`
   - `002_users_custom.js`
   - `003_api_keys.js`
   - `003_invitation_tokens.js`
   - `003_full_text_search.js`
   - `004_channels_posts.js` (⚠️ CRITICAL - extract from 001_initial.sql if needed)
2. Copy SQL schemas to `server/src/db/schemas/@custom/`:
   - `channels.sql` (⚠️ extract from 001_initial.sql)
   - `posts.sql` (⚠️ extract from 001_initial.sql)
   - `error_events.sql`
   - `brands.sql`, `collaborators.sql`, etc.
3. Verify migration order (001 → 002 → 003 → 004)
4. Test migrations: `npm run db:migrate`

**Acceptance Criteria:**
- [ ] All 8+ migrations in `@custom/migrations/`
- [ ] Channels + Posts tables properly extracted (not in @system)
- [ ] Migrations run successfully
- [ ] Foreign keys and indexes preserved

**Estimated Time:** 30 minutes  
**Complexity:** High (channels/posts extraction critical)

---

#### Subtask 2.2: Database Repositories
**ID:** `711-backend-repos`  
**Description:** Migrate repository pattern for data access  
**Steps:**
1. Copy from `legacy/broadr/server/src/db/repos/@custom/`:
   - `BrandRepo.js`
   - `UserRepo.js`
   - `ErrorEventRepo.js`
   - `CollaboratorRepo.js`
   - `ApiKeyRepo.js`
   - `ChannelRepo.js` (⚠️ CRITICAL - Broadr core)
   - `PostRepo.js` (⚠️ CRITICAL - Broadr core)
2. Update imports to use new structure
3. Register repos in `@custom/repos/index.js`
4. Test repo methods (unit tests)

**Acceptance Criteria:**
- [ ] 7+ repos in `@custom/repos/`
- [ ] ChannelRepo + PostRepo present (core features)
- [ ] All repos export correctly
- [ ] Repo methods use db connection properly

**Estimated Time:** 20 minutes

---

#### Subtask 2.3: API Endpoints - Core Features
**ID:** `711-backend-api-core`  
**Description:** Migrate Broadr core API endpoints (channels + posts)  
**Steps:**
1. Copy `legacy/broadr/server/src/api/@custom/channels/index.js` (97 LOC)
   - Endpoints:
     - `GET /api/channels` - List connected channels
     - `POST /api/channels` - Connect channel
     - `DELETE /api/channels/:id` - Disconnect
     - `POST /api/channels/publish` - Publish to multiple channels
     - `GET /api/channels/posts` - List posts
     - `GET /api/channels/stats` - Dashboard stats
2. Verify ChannelRepo + PostRepo usage
3. Test OAuth flows for each platform (Twitter, LinkedIn, Instagram, TikTok, Facebook, YouTube)
4. Register routes in `server/src/routes/@custom/index.js`

**Acceptance Criteria:**
- [ ] 6 channel endpoints working
- [ ] Multi-channel publishing tested
- [ ] OAuth integration works for at least 2 platforms
- [ ] Routes registered

**Estimated Time:** 45 minutes  
**Complexity:** High (OAuth complexity)

---

#### Subtask 2.4: API Endpoints - Supporting Features
**ID:** `711-backend-api-support`  
**Description:** Migrate supporting API endpoints (errors, search)  
**Steps:**
1. Copy `api/@custom/errors/index.js` (91 LOC)
   - 5 endpoints for error tracking
2. Copy `api/@custom/search/index.js` (60 LOC)
   - Full-text search endpoint
3. Register routes
4. Test error ingestion
5. Test search functionality

**Acceptance Criteria:**
- [ ] Error tracking endpoints working
- [ ] Search endpoint working
- [ ] All endpoints authenticated

**Estimated Time:** 25 minutes

---

#### Subtask 2.5: Background Workers
**ID:** `711-backend-workers`  
**Description:** Migrate background job workers  
**Steps:**
1. Copy `workers/@custom/PostSchedulerWorker.js`
   - Polls scheduled_posts table
   - Publishes to platforms at scheduled time
2. Copy `workers/@custom/AnalyticsWorker.js`
   - Fetches engagement metrics from platforms
3. Register workers in `scheduler/tasks/@custom/index.js`
4. Test worker execution

**Acceptance Criteria:**
- [ ] PostSchedulerWorker runs on schedule
- [ ] AnalyticsWorker fetches metrics
- [ ] Workers registered

**Estimated Time:** 20 minutes

---

#### Subtask 2.6: External Integrations
**ID:** `711-backend-integrations`  
**Description:** Migrate OAuth + platform SDK integrations  
**Steps:**
1. Copy `lib/@custom/TwitterClient.js`
2. Copy `lib/@custom/LinkedInClient.js`
3. Copy `lib/@custom/InstagramClient.js`
4. Copy `lib/@custom/TikTokClient.js`
5. Copy `lib/@custom/FacebookClient.js`
6. Copy `lib/@custom/YouTubeClient.js`
7. Configure OAuth callbacks in `config/@custom/oauth.js`
8. Test OAuth flow for each platform

**Acceptance Criteria:**
- [ ] 6 platform SDK clients present
- [ ] OAuth callbacks configured
- [ ] At least 2 platforms tested end-to-end

**Estimated Time:** 60 minutes  
**Complexity:** High (6 different OAuth flows)

---

### Phase 3: Frontend Migration

#### Subtask 3.1: Dashboard Page
**ID:** `711-frontend-dashboard`  
**Description:** Migrate Broadr main dashboard page  
**Steps:**
1. Copy `client/src/app/pages/app/@custom/BroadrDashboardPage.tsx`
2. Implement UI:
   - Connected channels grid (6 platform cards)
   - Recent posts feed
   - Publishing stats (posts today, scheduled, total reach)
   - Quick publish form
3. Connect to API endpoints
4. Register route: `/app/dashboard` or `/app/channels`

**Acceptance Criteria:**
- [ ] Dashboard shows connected channels
- [ ] Stats display correctly
- [ ] Quick publish works
- [ ] Route registered

**Estimated Time:** 40 minutes

---

#### Subtask 3.2: Channel Management Pages
**ID:** `711-frontend-channels`  
**Description:** Migrate channel connection and management UI  
**Steps:**
1. Copy `pages/app/@custom/ConnectChannelPage.tsx`
   - OAuth flow for each platform
   - Platform selection grid
2. Copy `pages/app/@custom/ChannelDetailPage.tsx`
   - Individual channel settings
   - Post history for that channel
   - Disconnect button
3. Register routes

**Acceptance Criteria:**
- [ ] Connect page shows 6 platforms
- [ ] OAuth flow works for each platform
- [ ] Detail page shows channel-specific posts
- [ ] Routes registered

**Estimated Time:** 35 minutes

---

#### Subtask 3.3: Post Publishing Interface
**ID:** `711-frontend-publish`  
**Description:** Migrate post creation and publishing UI  
**Steps:**
1. Copy `pages/app/@custom/CreatePostPage.tsx`
   - Rich text editor for post content
   - Platform selector (multi-select)
   - Media upload (images, videos)
   - Scheduling options (now, schedule)
   - Preview for each platform (character limits, formatting)
2. Connect to `POST /api/channels/publish`
3. Register route

**Acceptance Criteria:**
- [ ] Post creation form works
- [ ] Multi-platform selection
- [ ] Media upload works
- [ ] Scheduling UI functional
- [ ] Platform previews show correctly

**Estimated Time:** 50 minutes  
**Complexity:** High (rich editor + previews)

---

#### Subtask 3.4: Analytics Dashboard
**ID:** `711-frontend-analytics`  
**Description:** Migrate analytics and engagement tracking UI  
**Steps:**
1. Copy `pages/app/@custom/AnalyticsPage.tsx`
   - Engagement charts (likes, shares, comments)
   - Best performing posts
   - Audience growth
   - Platform comparison
2. Integrate chart library (recharts or similar)
3. Connect to analytics API endpoints
4. Register route

**Acceptance Criteria:**
- [ ] Charts display engagement metrics
- [ ] Data fetches from API
- [ ] Platform comparison works
- [ ] Route registered

**Estimated Time:** 40 minutes

---

#### Subtask 3.5: Custom Components
**ID:** `711-frontend-components`  
**Description:** Migrate reusable UI components  
**Steps:**
1. Copy `components/@custom/ChannelCard.tsx` - Social platform card
2. Copy `components/@custom/PostCard.tsx` - Post preview card
3. Copy `components/@custom/PlatformIcon.tsx` - Platform logos
4. Copy `components/@custom/PostScheduler.tsx` - Scheduling widget
5. Register components in `@custom/index.tsx`

**Acceptance Criteria:**
- [ ] All 4+ components present
- [ ] Components render correctly
- [ ] Reusable across pages

**Estimated Time:** 25 minutes

---

#### Subtask 3.6: Routes Registration
**ID:** `711-frontend-routes`  
**Description:** Register all custom routes  
**Steps:**
1. Update `client/src/app/routes/@custom/index.tsx`
2. Add routes:
   - `/app/channels` or `/app` - Dashboard
   - `/app/channels/connect` - Connect channel
   - `/app/channels/:id` - Channel detail
   - `/app/posts/create` - Create post
   - `/app/analytics` - Analytics
3. Add route guards (authentication)
4. Test navigation

**Acceptance Criteria:**
- [ ] All 5 routes registered
- [ ] Navigation works
- [ ] Auth guards present

**Estimated Time:** 15 minutes

---

### Phase 4: Testing & Quality Assurance

#### Subtask 4.1: Build Verification
**ID:** `711-test-build`  
**Description:** Verify frontend and backend build successfully  
**Steps:**
1. Run `cd client && npm run build`
2. Check for build errors
3. Verify bundle size reasonable (<500KB main bundle)
4. Run `cd server && npm test` (if tests exist)
5. Fix any TypeScript errors
6. Fix any ESLint errors

**Acceptance Criteria:**
- [ ] Frontend builds successfully
- [ ] Backend builds successfully
- [ ] No critical errors or warnings
- [ ] Bundle size acceptable

**Estimated Time:** 20 minutes

---

#### Subtask 4.2: Database Migration Testing
**ID:** `711-test-migrations`  
**Description:** Verify all migrations run successfully  
**Steps:**
1. Start fresh PostgreSQL database
2. Run `npm run db:migrate` from server directory
3. Verify all tables created:
   - users, sessions (system)
   - channels, posts (custom - core)
   - error_events, brands, collaborators, api_keys (custom - supporting)
4. Check indexes and foreign keys
5. Test rollback if supported

**Acceptance Criteria:**
- [ ] All migrations run without errors
- [ ] Channels + posts tables exist
- [ ] Foreign keys valid
- [ ] Indexes created

**Estimated Time:** 15 minutes

---

#### Subtask 4.3: API Integration Testing
**ID:** `711-test-api`  
**Description:** Test core API endpoints end-to-end  
**Steps:**
1. Start local dev server
2. Test authentication flow (register, login)
3. Test channel connection (at least 1 platform)
4. Test post publishing
5. Test post scheduling
6. Test analytics fetch
7. Document any API issues

**Acceptance Criteria:**
- [ ] Auth flow works
- [ ] Can connect at least 1 channel
- [ ] Can publish a post
- [ ] Can schedule a post
- [ ] Analytics data fetches

**Estimated Time:** 30 minutes  
**Note:** May require test OAuth credentials

---

#### Subtask 4.4: UI/UX Testing
**ID:** `711-test-ui`  
**Description:** Test frontend user flows  
**Steps:**
1. Complete user journey: Register → Connect channel → Create post → View analytics
2. Test responsive design (mobile, tablet, desktop)
3. Test error states (failed publish, OAuth error, etc.)
4. Verify loading states
5. Check accessibility (keyboard navigation, screen reader support)

**Acceptance Criteria:**
- [ ] End-to-end flow works
- [ ] Mobile responsive
- [ ] Error states display correctly
- [ ] Loading states present

**Estimated Time:** 25 minutes

---

### Phase 5: Documentation & Deployment

#### Subtask 5.1: Update Documentation
**ID:** `711-docs-update`  
**Description:** Document migration and setup instructions  
**Steps:**
1. Update `README.md`:
   - Broadr-specific setup instructions
   - OAuth configuration for 6 platforms
   - Environment variables needed
2. Create `BROADR_SETUP.md`:
   - How to connect each platform
   - OAuth app creation guides
   - Testing instructions
3. Update `CUSTOM_FEATURES_MIGRATION.md` status to "Complete"
4. Create `TASK_711_COMPLETE.md` summary

**Acceptance Criteria:**
- [ ] README updated
- [ ] Setup guide created
- [ ] Migration doc marked complete
- [ ] Completion report created

**Estimated Time:** 30 minutes

---

#### Subtask 5.2: Git Commit & Push
**ID:** `711-deploy-commit`  
**Description:** Commit all changes and push to GitHub  
**Steps:**
1. `git add -A`
2. `git commit -m "feat(broadr): work on task 711 - Rebuild from product-template"`
3. Verify commit includes all custom files
4. `git push origin main`
5. Verify GitHub Actions CI passes

**Acceptance Criteria:**
- [ ] All files committed
- [ ] Pushed to GitHub successfully
- [ ] CI/CD workflow runs
- [ ] No merge conflicts

**Estimated Time:** 10 minutes

---

#### Subtask 5.3: Railway Deployment
**ID:** `711-deploy-railway`  
**Description:** Deploy to Railway and verify production deployment  
**Steps:**
1. Verify Railway project exists
2. Configure environment variables:
   - DATABASE_URL
   - JWT_SECRET
   - OAuth credentials for each platform
3. Trigger deployment (auto from GitHub or manual)
4. Wait for deployment to complete
5. Verify app is live (not nginx placeholder)
6. Test core functionality in production

**Acceptance Criteria:**
- [ ] App deployed to Railway
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] App accessible (real app, not nginx)
- [ ] Core features work in production

**Estimated Time:** 30 minutes  
**Note:** May require GitHub secrets configuration

---

## 📊 Summary

**Total Subtasks:** 23  
**Estimated Total Time:** 7-8 hours  
**Critical Path:** Phase 2 (Backend) → Phase 3 (Frontend) → Phase 4 (Testing)

**Complexity Breakdown:**
- **High Complexity (4 tasks):** OAuth integrations, channels/posts extraction, publishing UI, API core
- **Medium Complexity (12 tasks):** Most backend and frontend tasks
- **Low Complexity (7 tasks):** Setup, config, docs, deployment

**Critical Dependencies:**
1. **Channels + Posts tables** must be extracted from `@system/001_initial.sql` to `@custom/004_channels_posts.js`
2. **OAuth credentials** needed for platform integrations (at least Twitter + LinkedIn for testing)
3. **ChannelRepo + PostRepo** are core - everything else depends on them

---

## ✅ Execution Checklist

Use this checklist to track progress:

### Phase 1: Setup
- [ ] 1.1: Archive legacy code
- [ ] 1.2: Fork product-template
- [ ] 1.3: Configure branding

### Phase 2: Backend
- [ ] 2.1: Migrate migrations
- [ ] 2.2: Migrate repos
- [ ] 2.3: Migrate API core (channels)
- [ ] 2.4: Migrate API support (errors, search)
- [ ] 2.5: Migrate workers
- [ ] 2.6: Migrate OAuth integrations

### Phase 3: Frontend
- [ ] 3.1: Dashboard page
- [ ] 3.2: Channel management pages
- [ ] 3.3: Post publishing UI
- [ ] 3.4: Analytics dashboard
- [ ] 3.5: Custom components
- [ ] 3.6: Routes registration

### Phase 4: Testing
- [ ] 4.1: Build verification
- [ ] 4.2: Migration testing
- [ ] 4.3: API integration testing
- [ ] 4.4: UI/UX testing

### Phase 5: Docs & Deploy
- [ ] 5.1: Update documentation
- [ ] 5.2: Git commit & push
- [ ] 5.3: Railway deployment

---

## 🚨 Critical Risks

1. **OAuth Complexity:** 6 different OAuth flows (Twitter, LinkedIn, Instagram, TikTok, Facebook, YouTube) - each has unique requirements
2. **Channels Table Extraction:** Currently in `@system/001_initial.sql` - must be moved to `@custom/`
3. **Platform API Changes:** Social media APIs change frequently - legacy code may need updates
4. **Rate Limits:** Each platform has different rate limits for posting
5. **Media Upload:** Different platforms have different image/video requirements

---

## 📝 Notes

- **Similar to Nestora:** Follow the same pattern used in task #710 (Nestora rebuild)
- **Reference:** `/Users/ruipedro/.openclaw/workspace-assimetria/nestora/TASK_710_COMPLETE.md`
- **Legacy Location:** `/Users/ruipedro/.openclaw/workspace-assimetria/legacy/broadr/`
- **Template Source:** `/Users/ruipedro/.openclaw/workspace-frederico/product-template/`

---

**Task #711 Breakdown: ✅ COMPLETE**  
**Ready for Execution:** YES  
**Next Step:** Begin Phase 1, Subtask 1.1 (Archive Legacy Code)
