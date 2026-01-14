# PR Review Command for Dashboard

Review this pull request against the dashboard coding standards, Unix design philosophy, and web interface guidelines. Provide a structured review with specific feedback.

## Review Checklist

### 1. General Coding Principles

- [ ] **Early Returns**: Functions use early returns to reduce nesting
- [ ] **Conditional Logic**: No complex logic wrapped in nested if/else blocks
- [ ] **Exhaustive Checks**: Switch statements use `assertNever` for enums
- [ ] **Type Safety**: No use of `any`; minimal type casting with `as`
- [ ] **Async Handling**: All async functions are properly awaited
- [ ] **Component Nesting**: No custom React components nested inline
- [ ] **Overflow Styles**: Any use of `overflow` has been discussed and approved

### 2. Unix Design Philosophy

- [ ] **Single Responsibility**: Each function/module does one thing well
- [ ] **Composability**: Functions return values suitable for composition
- [ ] **Clarity**: Code prioritizes readability over cleverness
- [ ] **Focused Interfaces**: APIs are minimal and clear
- [ ] **Logging**: Functions don't log unless explicitly required
- [ ] **Simplicity**: No over-abstraction or unnecessary complexity

### 3. React & API Patterns

#### Queries & Mutations

- [ ] All API calls use `useQuery` or `useMutation` from TanStack Query
- [ ] Proper destructuring with renamed variables (e.g., `{ mutate: addMemory, isPending: isAddingMemory }`)
- [ ] Use of `onSuccess`, `onError`, `onSettled` callbacks
- [ ] API hooks contain ONLY API calls and related state
- [ ] No API definitions wrapped inside other function calls

#### Components

- [ ] Standard UI components from `@/shared/components/ui` are used
- [ ] Component variations used for styling, not inline styles
- [ ] Forms use `react-hook-form` with `Controller` and `useForm` (except TipTap editor)

#### Code Style

- [ ] Arrow functions preferred over function declarations
- [ ] `const` used over `let` where possible
- [ ] Semantic color variables from `global.css` used instead of Tailwind color classes

### 4. API Routes (if applicable)

- [ ] Routes use `wrapRouteHandler` wrapper
- [ ] Standard error handling with `BadRequestError`, `ServiceError`, `UnknownServerError`
- [ ] Proper folder structure: `route.ts`, `service.ts`, `supabase.ts`, `types.ts`
- [ ] Conditional logic in service file, not supabase file
- [ ] All Supabase calls include `.eq('organisation_id', organisationId)`
- [ ] Database types properly typed using `Pick<Database['public']['Tables'][...]>`

### 5. File Structure & Organization

- [ ] Feature-oriented folder structure maintained
- [ ] Public APIs exported through `index.ts`
- [ ] No deep imports from feature internals
- [ ] Files named in kebab-case (`.ts`, `.tsx`, `.js`)
- [ ] Python files use snake_case
- [ ] Components/Types use PascalCase
- [ ] Variables/functions use camelCase

### 6. State Management

- [ ] Appropriate state management level chosen (component → hook → context → Redux)
- [ ] Redux only used when truly needed (cross-feature, persistence, middleware)
- [ ] No over-engineering with Redux for simple local state

### 7. Documentation

- [ ] New files include description at top explaining purpose
- [ ] API files explain each endpoint
- [ ] File descriptions updated if purpose changed
- [ ] Documentation updated for new features or changed functionality

### 8. Web Interface Guidelines

#### Accessibility

- [ ] Full keyboard support implemented
- [ ] Visible focus rings using `:focus-visible`
- [ ] Hit targets ≥24px (mobile ≥44px)
- [ ] Mobile inputs font-size ≥16px
- [ ] Proper `aria-label` for icon-only buttons
- [ ] Color contrast meets APCA/WCAG standards
- [ ] No color-only status indicators (redundant cues present)

#### Forms & Inputs

- [ ] Enter key submits text inputs (Ctrl/Cmd+Enter for textareas)
- [ ] Paste not blocked in inputs
- [ ] Loading buttons show spinner and keep label
- [ ] Errors displayed inline next to fields
- [ ] Proper `autocomplete`, `name`, `type`, and `inputmode` attributes
- [ ] No dead zones on checkboxes/radios
- [ ] Warning on unsaved changes before navigation

#### Performance

- [ ] Re-renders minimized and tracked
- [ ] Large lists virtualized
- [ ] Images have explicit dimensions to prevent CLS
- [ ] Above-fold images preloaded, rest lazy-loaded
- [ ] Uncontrolled inputs preferred where possible

#### Animation

- [ ] `prefers-reduced-motion` honored
- [ ] Compositor-friendly props used (`transform`, `opacity`)
- [ ] Correct `transform-origin` set
- [ ] Animations are interruptible

#### Layout & UX

- [ ] URL reflects state (filters/tabs/pagination)
- [ ] Back/Forward restores scroll
- [ ] Links use `<a>` or `<Link>` (not `onClick`)
- [ ] Destructive actions have confirmation or undo
- [ ] Empty/error/loading states designed
- [ ] Responsive across mobile/laptop/ultra-wide

### 9. Test Files

- [ ] No test files created unless explicitly requested

## Review Format

Provide feedback in this structure:

### ✅ Strengths

- List what was done well
- Highlight good patterns followed

### ⚠️ Issues Found

#### Critical

- Items that MUST be fixed before merge
- Include file path, line number, and specific issue

#### Suggestions

- Nice-to-have improvements
- Best practice recommendations

#### Questions

- Unclear code that needs explanation
- Potential issues that need clarification

### 📝 Summary

- Overall assessment
- Approve/Request Changes/Comment
- Key action items

---

**Instructions**: Review all changed files in the PR systematically using this checklist. Focus on specific, actionable feedback with file paths and line numbers.
