# Optimize Wood Cut App

An app to simplify planning and purchasing of lumber. The app helps you know which lengths of studs and boards are suitable for your project.

## Goal

The goal is to reduce waste and simplify the time at the hardware store by knowing exactly what dimensions and lengths to buy.

## Demo

[Lumber calculator](https://callebokedal.github.io/lumber-calculator/)

## Use cases

- The app starts with an overview listing all existing "Projects" (or empty list if no project has yet been created)
- The app also has a feature called Tags to create a custom taxonomy
- Information about Projects:
    - Each project has a name, description, create date and update date
    - Projects can be imported/exported as JSON-files.
    - One project can be loaded/activated at a time
- Information about tags:
    - Unique id
    - Name/Label (preferable short)
    - Description
    - Optional color (as a circle close to the name)

- Typical workflow for projects:
    - Create a project by name, description is optional. Create date and update date is updated.
    - Phase 1: All desired lumber dimension per desired length are added dynamically to the project
        - Desired width x height AND length is specified (e.g., "45x145 mm: 2,15 m")
        - Number of "studs" with this dimension and length that is needed (e.g., "5")
        - Optional type:
            - (Swe) Trall / Deck board (Eng)
            - (Swe) Regel / Joist (Eng)
            - (Swe) Stolpe / Post (Eng)
            - (Swe) Ramvirke / Rim joist (Eng)
    - Phase 2: For each dimension in width x height the user also creates a list of available lengths at the store
        (e.g., 2,4 m; 3,0 m; 3,6 m; 4,2 m; 4,8 m; 5,4 m;). Presets and checkboxes are probably good for the UI.
    - The app calculates the optimal lumbers to buy, to reduce waste and displays as a list
    - It should be easy to update available lengths at the store (if something is out, the app should be able to re-calculate)

- It is possible to switch UI language using a "Settings" page/view.
    - English and Swedish are currently supported (Swedish default)

- Data stored using localStorage items (in JSON format)

## Data model

### Project
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Project name |
| description | string | Optional description |
| createdAt | string (ISO date) | Creation timestamp |
| updatedAt | string (ISO date) | Last updated timestamp |
| items | LumberItem[] | Desired lumber pieces |
| tags | string[] | Tag ids associated with this project |

### LumberItem
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| width | number | Width in mm (e.g., 45) |
| height | number | Height in mm (e.g., 145) |
| length | number | Desired length in mm (e.g., 2150) |
| quantity | number | Number of pieces needed |
| type | string? | Optional: deck-board, joist, post, rim-joist |

### Tag
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Short label |
| description | string | Optional description |
| color | string? | Optional hex color |

## Pages

- Project overview (`/`)
    - List of projects
- Project details (`/projects/:id`)
    - Phase 1 - Planning: Where the user specifies all different dimensions and desired lengths
    - Phase 2 - Store: Where the user specifies available lengths per dimension at the store
    - Phase 3 - List of lengths to buy
- Settings (`/settings`)

## Project conventions

See [CLAUDE.md](./CLAUDE.md) for full coding conventions.

## Technical stack
- Container managed by Podman on MacOS
- React 18 with JavaScript
- Vite as build tool
- Tailwind CSS for styling
- React Query for server state (when/if needed)
- Zustand for client state
- React Router v6 for routing

## Roadmap

- Add 2D drawing of each dimension seen from above using react-konva
- For this: ability to specify space between deck boards

## Development build instructions

```sh
# Install dependencies (never run npm on the host machine directly)
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm install"

# Security audit
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm audit"
# -> Should return "found 0 vulnerabilities"

# Run in development mode
podman run --rm -p 5176:5176 -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm run dev -- --host 0.0.0.0"

# To build single page artifacts
# Note that GitHub can source pages from the `/docs` folder, but not `/dist` folder
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm run build -- --outDir docs"

```

## Initial setup (first time only)

```sh
# Create project with Vite
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine \
  sh -c "npm create vite@latest . -- --template react && npm install"

# Update dependencies
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine \
  sh -c "npm install -g npm-check-updates && ncu -u && npm install"
```
