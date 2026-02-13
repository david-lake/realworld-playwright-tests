# Playwright Test Framework Setup

## What Was Done

### Framework Structure
- Installed `@playwright/test` with Chromium browser
- Configured path aliases in `tsconfig.json`:
  - `@data/*` → `tests/data/*`
  - `@actions/*` → `tests/actions/*`
  - `@fixtures/*` → `tests/fixtures/*`
  - `@utils/*` → `tests/utils/*`

### Test Files Created
- `tests/data/users.ts` - Test data generators
- `tests/actions/auth.actions.ts` - Auth page actions
- `tests/actions/app.ts` - App coordinator
- `tests/fixtures/app.fixture.ts` - Playwright test fixture
- `tests/utils/db.ts` - Prisma DB helpers for test setup
- `tests/auth.spec.ts` - Login test

### Database Setup
- Changed Prisma schema from MySQL to SQLite for testing
- Created `createTestUser()` helper that inserts users directly into DB with bcrypt-hashed passwords

### Configuration
- `playwright.config.ts` with Chromium project
- Base URL set to `http://localhost:3001` (app runs on 3001)

## Why This Approach

**Direct DB Setup Over UI Registration:**
- Tests should be isolated and independent
- No need to test registration flow when testing login
- Faster execution (no form submission, navigation)
- More reliable (no race conditions with UI)

## Known Issues / Blockers

### The Auth State Problem
**Issue:** After successful login, the app doesn't recognize the user as logged in on subsequent page loads.

**What Works:**
- ✅ DB user creation works
- ✅ Login API returns 200 + JWT token
- ✅ Token stored in localStorage correctly
- ✅ Token persists across page reloads

**What Doesn't Work:**
- ❌ After login + reload, `CurrentUser` GraphQL query is NOT made
- ❌ Header still shows "Sign in" instead of "Settings"

**Root Cause:**
The app uses `useLocalStorage` hook from `usehooks-ts`. This hook has a hydration timing issue:
1. On first render, `token` is empty (localStorage read hasn't completed)
2. `useCurrentUser` checks `if (token)` - it's falsy, so no query
3. Token eventually loads from localStorage, but effect doesn't re-trigger

**Tried:**
- Setting token manually in localStorage
- Multiple `page.reload()` calls
- Playwright's `storageState`
- New browser contexts
- Waiting for token with `page.waitForFunction()`

None resolved the React hook timing issue.

## Workaround Options

1. **Modify app code** (not ideal): Change `useCurrentUser` to always fetch on mount if token exists in localStorage
2. **Use GraphQL directly**: Skip UI login, call the login mutation directly and inject the token into Apollo Client cache
3. **Use a longer timeout**: Wait for the app to re-render after token is read (unreliable)

## Testing the Framework

To run the test (it will fail on the auth state assertion):
```bash
npm run dev  # In one terminal
npx playwright test tests/auth.spec.ts --project=chromium
```

## Next Steps

Need to resolve the auth state hydration issue. Possible approaches:
1. Look at how the app initializes Apollo Client auth context
2. Consider using `beforeEach` to set up authenticated state via GraphQL API directly
3. Or modify the test to wait for a specific UI signal that auth is ready
