# Eisenhower Matrix

A simple, fast task manager based on the Eisenhower Decision Matrix — sort your tasks into four quadrants by urgency and importance, and keep your list in one focused view.

**Live app:** _add your Vercel link here once deployed_

## What it does

- Add tasks and assign them to one of four categories
- Check off tasks as complete
- Delete tasks you no longer need
- Tasks persist automatically in the browser (localStorage) — close the tab and they're still there when you come back
- Responsive layout — works on both desktop and mobile screens

## Quadrants

| Quadrant | Meaning |
|---|---|
| Urgent and Important | Do these now |
| Urgent, not Important | Do quickly, or delegate |
| Important, not Urgent | Schedule time for these |
| Habit | Recurring, ongoing items |

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/) — dev server and build tool
- Plain CSS (no framework)
- Browser `localStorage` for persistence

## Getting started

Clone the repo and install dependencies:

```bash
git clone <your-repo-url>
cd <your-repo-folder>
npm install
```

Run the dev server:

```bash
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:5173`).

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local dev server with hot reload |
| `npm run build` | Builds a production-ready bundle into `dist/` |
| `npm run preview` | Serves the production build locally, for a final check before deploying |
| `npm run lint` | Runs ESLint over the project |

## Project structure

```
src/
  App.jsx      # All components: Header, Task form, Matrix, Card, List
  App.css      # Styling for the matrix, cards, tasks, and form
  main.jsx     # React entry point
  index.css    # Global resets
```

## How it works

- All tasks live in a single array in `App`, the top-level component (state is "lifted up" so every part of the UI reads from one source of truth).
- Adding a task builds an object with a unique `id`, its name, its category, and a `completed` flag, then hands it up to `App` via a callback prop.
- Each quadrant (`Card`) filters that shared array down to just its own category — nothing is stored per-quadrant, it's all derived from the one list.
- A `useEffect` watches the tasks array and writes it to `localStorage` any time it changes, which is what makes tasks survive a page refresh.

## Roadmap

- [ ] Drag-and-drop tasks between quadrants
- [ ] Accounts + sync across devices (Supabase)
- [ ] Google Calendar integration
- [ ] "Add to Home Screen" support for a native-app feel on mobile

## License

Not yet decided.
