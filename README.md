# Timeless Repaints

A static website for showcasing MSFS2024 and X-Plane 12 liveries — deployed on **GitHub Pages**. No server, no backend, just static files.

## Features

- 🏠 **Home page** with Timeless Repaints logo and simulator categories
- 🖼️ **Gallery** — browse liveries with filtering by simulator (MSFS 2024 / X-Plane 12) and sorting
- 🔍 **Livery detail modal** — preview, details, and direct download
- 🔧 **Admin page** (`admin.html`) — upload liveries directly to GitHub via the GitHub API
- 🔐 **Login page** (`login.html`) — protects the admin area with a GitHub Personal Access Token
- 📱 Fully responsive, dark aviation-themed design

## How It Works

Since GitHub Pages only hosts static files, there is no server to handle uploads. Instead:

1. The admin logs in at `login.html` with a GitHub Personal Access Token
2. The admin page (`admin.html`) pushes livery files and the database directly to your GitHub repo using the GitHub API
3. GitHub Pages automatically rebuilds and deploys the site (usually under a minute)

## Setup

### 1. Add your logo

Place the logo image at:
```
public/assets/logo.png
```

If missing, a CSS text-based "TIMELESS REPAINTS" logo shows instead.

### 2. Create a GitHub Personal Access Token

The admin needs a token with `repo` scope:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select the `repo` scope (full control of repositories)
4. Copy the token

### 3. Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `timeless-repaints`)
2. Push this folder to the `main` branch
3. In the repo settings, go to **Pages** → set source to **GitHub Actions**
4. Push to `main` — the `.github/workflows/deploy.yml` will build and deploy automatically
5. Your site will be live at `https://yourusername.github.io/timeless-repaints/`

### 4. Uploading a Livery (Admin Workflow)

1. Go to `login.html` on your deployed site
2. Enter your GitHub username/org, repository name, and Personal Access Token
3. Click **Login** — you'll be redirected to `admin.html`
4. Fill in the livery form: title, simulator, aircraft, version, author, description
5. Select the livery file (ZIP/RAR recommended) and optional thumbnail
6. Click **Upload to GitHub**

The livery file is uploaded to `public/uploads/` and `public/liveries.json` is updated automatically via the GitHub API. GitHub Pages will redeploy within about a minute.

## File Structure

```
Timeless-Repaints/
├── index.html              # Home + Gallery (public)
├── admin.html              # Admin upload page (login required)
├── login.html              # Admin login page
├── public/
│   ├── css/style.css       # Styles
│   ├── js/app.js           # Gallery logic
│   ├── js/admin.js         # Admin logic (inline in admin.html)
│   ├── js/auth.js          # Auth helper
│   ├── js/github.js        # GitHub API helper
│   ├── js/login.js         # Login logic
│   ├── assets/logo.png     # Your logo (add this)
│   ├── liveries.json       # Livery database
│   └── uploads/            # Livery files + thumbnails
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
├── .gitignore
└── README.md
```

## Customizing

- **Accent color:** Edit `--accent` in `public/css/style.css` (default: `#00d4ff`)
- **Logo:** Replace `public/assets/logo.png`
- **Simulators:** Edit `SIM_LABELS` in `public/js/app.js`

## Security Note

The GitHub Personal Access Token is stored in `localStorage` in the admin's browser only. It is sent directly to GitHub's API — never to a third-party server. Make sure to use HTTPS when accessing the deployed site.

## License

MIT