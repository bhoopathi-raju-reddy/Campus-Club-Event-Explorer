# Campus Club & Event Explorer

A responsive, vanilla HTML/CSS/JavaScript event explorer for Northstar University. Students can search and sort campus events, filter by category, save favorites, switch themes, and register without a page reload.

## Run locally

Because the app loads `data/events.json` with `fetch`, serve the project over HTTP from the repository root:

```powershell
npx --yes http-server -p 4173
```

Then open `http://localhost:4173`.

## Project structure

- `index.html` - semantic page structure, registration form, media, and accessible labels
- `css/styles.css` - responsive layout, grid/flex systems, selectors, transitions, and theme styles
- `js/data.js` - `CampusEvent` class and async JSON loader
- `js/storage.js` - `localStorage` and `sessionStorage` helpers
- `js/ui.js` - DOM rendering and debug output helpers
- `js/main.js` - filters, search, sorting, registration, theme, and saved-event interactions
- `data/events.json` - event records used by the Fetch API
