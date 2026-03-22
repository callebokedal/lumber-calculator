# CLAUDE.md – Project Conventions for React Mindmap App

## Language
- All code, comments, variable names, function names, and documentation must be written in **English**
- UI text (labels, placeholders, messages) should also be in English/Swedish unless otherwise specified

## UI
- The app should be for mobile use first, but also working on other dimensions - like desktop.
- Tailwind should have support for this.

## Technical Stack
- **React 18** with **JavaScript** (no TypeScript)
- **Vite** as build tool
- **React Flow** for the information flow diagram editor
- **Tailwind CSS** for styling (utility classes only, no custom CSS files unless necessary)
  - **UI style** should be based on https://ui.shadcn.com/docs/components style
- **React Query (TanStack Query v5)** for server state management
- **Zustand** for client/local state management
- **React Router v6** for routing

## Container-First Development
- The application runs inside a **Podman** container
    - Only suggest up-to-date, secure and stable images and containers
- No direct dependency on the host Node.js or npm installation
- All development commands are run via `podman-compose` or `podman` directly
- The `Containerfile` (not `Dockerfile`) is the source of truth for the runtime environment

## Project Structure
```
src/
  assets/          # Static assets (icons, images)
  components/      # Reusable UI components (not page-specific)
    common/        # Generic components (Button, Modal, Badge, Markers etc.)
    layout/        # Layout components (Sidebar, Header, Panes, etc.)
  features/        # Feature-based modules, one folder per domain
    diagram/       # React Flow diagram code
    settings/      # User settings
  hooks/           # Shared custom hooks
  pages/           # Route-level page components (thin, delegate to features)
  services/        # Data access layer (import/export, local storage, API)
  store/           # Zustand store definitions
  types/           # JSDoc type definitions and shared constants
  utils/           # Pure utility/helper functions
```

## Data model
Project
  id, name, description, createdDate, updatedDate
  layoutMode: 'mindmap-organic' | 'mindmap-cluster' | 'tree-lr' | 'tree-td'
  nodes: Node[]
  connectors: Connector[]

TODO

## Functionality
TODO

## Code Conventions
- **Functional components only** – never class components
- **Named exports** – never default exports (except for pages used by React Router)
- **One component per file**
- **No inline styles** – use Tailwind classes exclusively
- Props must be documented with JSDoc `@param` comments for complex components
- Avoid deeply nested ternaries – extract to variables or helper functions

## State Management
- **React Query** for anything fetched from an external source or that needs caching/sync
- **Zustand** for UI state and local app state (e.g., selected node in diagram, current assessment)
- **Local component state** (`useState`) for purely local UI state (e.g., open/closed modal)
- Do not put server state into Zustand

## File Naming
- Component files: `PascalCase.jsx`
- Hook files: `camelCase.js`, prefixed with `use` 
- Store files: `camelCase.store.js` (e.g., `diagram.store.js`)
- Service files: `camelCase.service.js` (e.g., `project.service.js`)
- Utility files: `camelCase.js`

## What to Avoid
- No TypeScript (use JSDoc for type hints if needed)
- No Redux or MobX
- No CSS Modules or styled-components – Tailwind only
- No class components
- No default exports (except route-level pages)
- No host-level `npm install` – always run inside container