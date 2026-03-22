# Optimize Wood Cut App

A app to simplify planning and purchasing of lumber. The app helps you know which lengths of studs and boards are suitable for your project.

## Goal

The goal is to reduce waste and simplify the time at the hardware store by knowing exactly what dimensions and lengths to buy.

## Use cases

- The app starts with an overview listing all existing "Projects" (or empty list if no project has yet been created)
- The app also has a feature called Tags to create a custom taxonomy
- Information about Projects:
    - Each project has a name, description, create date and update date
    - Projects can be imported/exported as JSON-files.
    - One project can be loaded/activated at a time
    - The projects caters for 
- Information about tags:
    - Unique id
    - Name/Label (prefereable short)
    - Description
    - Optional color (as a circle close to the name)

- Typical workflow for projects:
    - Create a project by name, description is optional. Create date and update date is updated.
    - Phase 1: All desired lumber dimension per desired length are added dynamically to the project
        - Desired width x height AND length is specified (e.g., "45x145 mm: 2,15 m") 
        - Number of "studs" with this dimension and length that is needed (e.g., "5")
        - Optional type: 
            - (Swe) Trall / Deck board (Eng)
            - (Swe) Reglel / Joist (Eng)
            - (Swe) Stolpe / Post (Eng)
            - (Swe) Ramvirke / Rim joist (Eng)
    - Phase 2: For each dimension in width x length the user also create a list of avaialiable length's at the store
        (e.g., 2,4 m; 3,0 m; 3,6 m; 4,2 m; 4,8 m; 5,4 m;). These presets and checkboxes are problably good for the UI.
    - The app calculates the optimal lumbers to buy, to reduce spill and displays as a list
    - It should be easy to update available lengths at the store (if something is out, the app should be able to re-calculate)

- It is possible to switch UI languange using a "Settings" page/view.
    - English and Swedish is currently to be supported (Swedish default)

- Data stored using localstorage items (preferably in JSON format)

## Data model

## Pages

- Project overview
    - List of projects
- Project details
    - Phase 1 - Planning: Where the user specifies all different dimensions and desireds length's 
    - Phase 2 - Store: Where the user specifies avaialable lengths per dimension at the store
    - Phase 3 - List of lengths to buy

## Roadmap for the app

- I'm thinking about adding drawing of each dimension seen from above (2D) using react-konva.
- For this I need to be able to specify space between deck boards for example.

## Project conventions

## Technical stack
- Based on container managed by podman on MacOS
- React 18 med JavaScript
- React Flow for editing information flow
- Vite as build tool
- Tailwind CSS för styling
- React Query för server state (when/if needed)
- Zustand för client state (when/if needed)

## Development build instructions
```sh

# To install dependencies but without using npm on the host machine (by design)
# New dependencies can also be installed this way, after updating package.json
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm install"

# Security Audit can be executed using
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm audit"
# -> Should return with "found 0 vulnerabilities", or else -> evaulate and try to fix

# To run the application (development environment):
podman run --rm -p 5174:5174 -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm run dev -- --host 0.0.0.0"

# ---- Not "fully" verified commands below

# To update?
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine \
  sh -c "npm install -g npm-check-updates && ncu -u && npm install"

podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm update"

# First time
# Create project with Vite
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine \
  sh -c "npm create vite@latest . -- --template react && npm install"

# Build image and start (not tested yet)
podman-compose up --build

# Or, without compose (tested ok)
podman build -t mindmap-app-dev .
podman run -p 5174:5173 -v ./src:/app/src:z mindmap-app-dev
```