# pallavipatil1111.github.io

My portfolio website: projects, skills, education and contact details, live at
**https://pallavipatil1111.github.io**.

It's plain HTML, CSS and JavaScript with no framework or build step, tested end to end with
Playwright and deployed to GitHub Pages by GitHub Actions.

## Features

- **Responsive layout** using CSS Grid and Flexbox, tested at desktop and phone sizes
- **Light and dark themes** that follow the system setting, with a toggle that's remembered in `localStorage`
- **Projects loaded from [`data/projects.json`](data/projects.json)**, so adding a project means adding one entry, not new HTML
- **Filter projects by technology** (Java, Python, SQL, Testing)
- **Contact form with validation** that opens the visitor's email app with the message filled in, so no backend is needed
- **Accessible**: semantic HTML, a skip link, visible keyboard focus, labelled form fields with error messages linked to them

## Tests

[`tests/site.spec.ts`](tests/site.spec.ts) runs 8 Playwright tests (TypeScript) on a desktop and a
mobile viewport (16 runs in total):

| Test | What it checks |
|---|---|
| Name, role and title | The page loads with the right heading and title |
| Projects load | All projects render from `projects.json` |
| Project filters | Each filter shows the right projects and marks the active button |
| Theme toggle | Switching theme works and survives a reload |
| Form errors | Empty fields show clear error messages and focus moves to the first one |
| Valid form | Correct input shows no errors |
| Resume download | The resume link returns a real PDF |
| No sideways scroll | The page never overflows horizontally |

Run them locally:

```bash
npm install
npx playwright install chromium
npx playwright test
```

## Deployment

Every push to `main` runs the tests in [GitHub Actions](.github/workflows/deploy.yml). If they pass,
the site is deployed to GitHub Pages.

One-time setup: in the repository, go to **Settings → Pages → Build and deployment** and set
**Source** to **GitHub Actions**.

## Preview locally

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

(Opening `index.html` directly from disk won't load the projects, because browsers block `fetch`
on `file://` pages.)

## Adding a project

Add an entry to `data/projects.json`:

```json
{
  "id": "my-project",
  "title": "My Project",
  "status": "done",
  "summary": "One sentence on what it does.",
  "highlights": ["What you built", "A result or number", "How it's tested or deployed"],
  "tags": ["Java"],
  "stack": ["Java", "Spring Boot", "MySQL"],
  "repo": "https://github.com/pallavipatil1111/my-project",
  "demo": ""
}
```

`tags` drive the filter buttons. Leave `repo` or `demo` empty to hide that link.

## Structure

```
├── index.html
├── css/styles.css
├── js/main.js
├── data/projects.json
├── assets/                 # resume PDF and favicon
├── tests/site.spec.ts      # Playwright tests
├── playwright.config.ts
└── .github/workflows/deploy.yml
```
