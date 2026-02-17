# AI Coding Instructions - Project Management Application

## Project Overview
Angular 20 project management application (Chef de Projet) with standalone components, client-side storage, and routing. Features authentication, CRUD operations for projects/followups, dashboard with stats, and responsive UI.

## Architecture Pattern: Component-Service Model

**Key Insight**: This is a **standalone component architecture** with **Signal-based state management** and **localStorage persistence** - no backend API.

### Service-Component Relationship
- **Services** (in `src/app/core/services/`) hold state using Angular `signal()` for reactivity
- **Components** (in `src/app/core/features/`) inject services with `inject()` and bind to signals
- **Shared Components** (in `src/app/shared/`) are reusable (Navbar)

### Data Flow
```
User Interaction → Component → Service.signal() updated → localStorage.setItem() → Component detects change
```

Example: `ProjectService.createProject()` → updates signal → saves to localStorage → bound templates auto-update

## Critical Files by Responsibility

| File | Purpose | When to Modify |
|------|---------|---|
| [src/app/core/services/auth.ts](src/app/core/services/auth.ts) | User auth state, login/logout, localStorage['user'] | Auth/session changes |
| [src/app/core/services/project.ts](src/app/core/services/project.ts) | Project CRUD, stats calculations, localStorage['projects'] | Project management features |
| [src/app/core/services/followup.ts](src/app/core/services/followup.ts) | Followup CRUD by projectId, localStorage['followups'] | Followup/tracking features |
| [src/app/app.routes.ts](src/app/app.routes.ts) | All route definitions and navigation | Adding new pages/features |
| [src/app/shared/navbar/navbar/](src/app/shared/navbar/navbar/) | Persistent navigation header | Global UI changes |

## Project-Specific Conventions

1. **Component Files**: Always create `.ts`, `.html`, `.css` triple for new components
   - Import/export pattern: `export class ComponentName implements OnInit`
   - Use `inject(ServiceName)` for DI, NOT constructor injection
   - Bind to service signals directly: `{{ projectService.getProjects() }}`

2. **Service Patterns**:
   - Always use `signal<T>()` for state, never plain properties
   - Load from localStorage in constructor
   - Call `saveToLocalStorage()` after mutations
   - Public getter methods return signal value: `getData(): Type { return this.data(); }`

3. **Route Parameters**: Access via `inject(ActivatedRoute).params['paramName']` (string routing)

4. **Interfaces Location**: Define in the service file where primarily used (e.g., `User` in auth.ts)

5. **CSS Classes**: Use kebab-case matching status values: `status-{{ project.status }}` maps to CSS class `status-en-cours`

6. **Status Values**: Projects/Followups use exact strings: `'En cours'`, `'Terminé'`, `'Planification'`, `'Suspendu'` (French, title-case)

## Development Commands

```bash
npm start          # Start dev server on http://localhost:4200 (ng serve)
npm test           # Run Jasmine unit tests (ng test)
npm run build      # Production build → dist/
npm run watch      # Build in watch mode
```

**Troubleshooting**: If port 4200 occupied: Kill via `Get-Process -Name "node" | Stop-Process -Force`

## Common Dev Patterns

### Adding a Feature (e.g., new project property)
1. Update interface in service: `export interface Project { ... newField: type; }`
2. Update service methods (`createProject`, `updateProject`) to handle new field
3. Update components' HTML templates to display/edit new field
4. Update localStorage serialization if non-primitive type (dates already handled)

### Form Validation Pattern
- Use Angular `FormsModule` with `[(ngModel)]` binding
- `<input required>` attributes
- Template error display: `{{ form.get('fieldName')?.errors?.['required'] ? 'error msg' : '' }}`

### Accessing Current Context
- **Current User**: `authService.getCurrentUser()`
- **Current Project**: `projectService.getCurrentProject()` + set via `projectService.setCurrentProject(p)`
- **Project Followups**: `followupService.getFollowupsByProject(projectId)`

## Testing Patterns

- Unit tests: `*.spec.ts` files (e.g., [src/app/app.spec.ts](src/app/app.spec.ts))
- Use Jasmine: `describe()`, `it()`, `expect()`
- Mock services with test data in constructor
- Run: `npm test` (Karma + Chrome browser)

## Type Safety Notes

- Dates stored as ISO strings in localStorage → parsed back in `loadData()` methods
- Project/Followup IDs generated as `Date.now().toString()` (string IDs)
- Role field exists in User: `'chef' | 'admin' | 'employee'` (currently hardcoded to 'chef')

## Navigation Routes

- `/login` → Login page (root redirects here)
- `/dashboard` → Chef dashboard with stats
- `/projects` → Project list
- `/projects/new` → Create project form
- `/projects/:id/edit` → Edit project form
- `/projects/:projectId/followups` → Followups for project
- `/projects/:projectId/followups/new` → Create followup
- `/projects/:projectId/followups/:followupId/edit` → Edit followup

## HTML/CSS Standards

- Use `CommonModule` for `*ngIf`, `*ngFor`, `@for`, etc.
- Bootstrap classes available via global styles
- Responsive breakpoints: Mobile-first (no specific breakpoint tokens in codebase)
- Color scheme: Status-based (En cours: blue, Terminé: green, Planification: orange, Suspendu: red expected)

## Edge Cases & Gotchas

- **localStorage limits**: ~5MB per domain—mock projects/followups are small, but plan if scaling
- **No backend validation**: All validation client-side only
- **Date handling**: Component templates use `| date` pipe for formatting
- **Route navigation**: Use `navigate()` with array syntax: `router.navigate(['/projects', id, 'edit'])`
- **Signal reactivity**: Signals auto-update templates; no manual change detection needed

## When Adding Tests

- Place in same directory as component: `component-name.spec.ts`
- Use `TestBed` for component testing
- Mock injected services with fake data
- Test signal updates via subscription or direct value reads
