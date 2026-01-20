# Admin Feature Implementation Plan

## Overview
Create a complete Admin feature for managing Activities and Activity Types, following Angular 21.1.0 best practices and reusing existing design patterns.

## Assumptions
- No existing auth guard - will create simple `AuthService` and `AuthGuard`
- Supabase `activities` table has `is_published` boolean field
- Admin access controlled via simple role check (can be enhanced later)
- Repositories will be created in `core/data` as requested

## File Structure to Create

```
src/app/
├── core/
│   ├── data/                    # NEW
│   │   ├── activities.repository.ts
│   │   └── activity-types.repository.ts
│   ├── guards/                  # NEW
│   │   └── auth.guard.ts
│   └── services/
│       └── auth.service.ts      # NEW
└── features/
    └── admin/                   # NEW
        ├── admin.page.ts
        ├── admin.routes.ts
        ├── activities/
        │   ├── admin-activities.page.ts
        │   ├── admin-activities.form.ts
        │   └── admin-activities.service.ts
        └── activity-types/
            ├── admin-types.page.ts
            └── admin-types.service.ts
```

## Implementation Steps

### Step 1: Create Core Infrastructure
1. **AuthService** (`core/services/auth.service.ts`)
   - Simple service with `isAdmin()` signal
   - For now: check localStorage or hardcoded (can be replaced with real auth later)
   - Uses `inject()` pattern

2. **AuthGuard** (`core/guards/auth.guard.ts`)
   - Functional guard using `inject()`
   - Redirects to home if not admin
   - Uses `CanActivateFn` (Angular 21 pattern)

3. **Repositories** (`core/data/`)
   - `activities.repository.ts`: Direct Supabase calls for CRUD
   - `activity-types.repository.ts`: Direct Supabase calls for CRUD
   - Both use `inject()` and return Promises
   - Map snake_case to camelCase

### Step 2: Create Admin Feature Structure
1. **Admin Routes** (`features/admin/admin.routes.ts`)
   - Lazy-loaded routes for admin pages
   - Protected with `canActivate: [authGuard]`

2. **Admin Page** (`features/admin/admin.page.ts`)
   - Shell component with navigation
   - Reuses existing header/footer via app.component
   - Simple sidebar navigation (Activities, Activity Types)
   - Uses `<router-outlet>` for child routes

### Step 3: Activities CRUD
1. **AdminActivitiesService** (`features/admin/activities/admin-activities.service.ts`)
   - Uses `ActivitiesRepository`
   - Exposes signals: `activities`, `loading`, `error`
   - Methods: `loadAll()`, `create()`, `update()`, `delete()`

2. **AdminActivitiesPage** (`features/admin/activities/admin-activities.page.ts`)
   - Lists all activities (published + unpublished)
   - Reuses card UI pattern from `activity-card.component.ts`
   - Shows edit/delete buttons
   - "Create New" button
   - Uses `@for` for list rendering

3. **AdminActivitiesForm** (`features/admin/activities/admin-activities.form.ts`)
   - Reusable form component (create + edit modes)
   - Reactive form with validation
   - Fields: title, description, date, startTime, endTime, location, weekday, repeatBadge, typeId, isPublished
   - Uses existing form styling from `contact-form.component.ts`

### Step 4: Activity Types CRUD
1. **AdminTypesService** (`features/admin/activity-types/admin-types.service.ts`)
   - Uses `ActivityTypesRepository`
   - Exposes signals: `types`, `loading`, `error`
   - Methods: `loadAll()`, `create()`, `update()`, `delete()`

2. **AdminTypesPage** (`features/admin/activity-types/admin-types.page.ts`)
   - Simple list UI (reuses existing styles)
   - Inline edit/create (or modal - simple approach)
   - Shows slug, label, sortOrder
   - Delete confirmation

### Step 5: Update Main Routes
- Add `/admin` route to `app.routes.ts`
- Lazy load admin routes

## Design Patterns to Reuse

### UI Patterns
- Form styling: Reuse from `contact-form.component.ts`
  - `bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-12`
  - Input classes: `bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary`
  
- Card styling: Reuse from `activity-card.component.ts`
  - `bg-white dark:bg-[#1e293b]/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50`

- Button styling: Reuse existing patterns
  - Primary: `bg-primary hover:bg-amber-600 text-white px-5 py-2 rounded-full`
  - Danger: `bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full`

### Angular Patterns
- All components: `standalone: true`, `ChangeDetectionStrategy.OnPush`
- Use `inject()` instead of constructor injection
- Use Signals for state management
- Use `@if`, `@for` control flow
- Use `DestroyRef` + `takeUntilDestroyed` for subscriptions (if needed)

## Models to Extend

### Activity Model
Add `isPublished?: boolean` field

### ActivityType Model
Already has: `slug`, `label`, `sortOrder`

## Database Assumptions

### Activities Table
- `id` (uuid)
- `title` (text)
- `description` (text, nullable)
- `type_slug` (text, FK to activity_types)
- `date` (date, nullable)
- `weekday` (integer, nullable)
- `start_time` (time, nullable)
- `end_time` (time, nullable)
- `location` (text, nullable)
- `repeat_badge` (text: 'weekly'|'monthly'|'yearly', nullable)
- `is_published` (boolean, default false) - **ASSUMED**

### Activity Types Table
- `slug` (text, PK)
- `label` (text)
- `sort_order` (integer, nullable)

## Implementation Order

1. Core infrastructure (auth, repositories)
2. Admin routes and shell
3. Activity Types CRUD (simpler, start here)
4. Activities CRUD (more complex)
5. Integration and testing

## Notes
- All code follows Angular 21.1.0 patterns (not 24.12.0 - that version doesn't exist yet)
- Reuses existing Tailwind design tokens
- No new UI libraries or design systems
- Simple, functional admin UI
