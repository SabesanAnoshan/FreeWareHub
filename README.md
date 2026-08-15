# FreeWare Hub

A simple 2020-style legal free/open-source software directory.

## Structure
- HTML pages: homepage, categories, search, details, download and legal pages
- `css/`: base and responsive styles
- `js/app.js`: data loading, search, filters, details and download flow
- `data/software.json`: software database
- `assets/`: reserved for local assets

## Run locally
Because the site loads JSON with `fetch()`, serve it through a local HTTP server rather than opening `index.html` directly.

Example with Python:
`python -m http.server 8000`

Then open `http://localhost:8000`.

## Legal
The included entries point to official developer pages. Verify URLs, licenses, trademark use and redistribution permissions before publishing. Do not add copyrighted installers unless you have permission.

## Security recommendations before production
Use HTTPS, Content-Security-Policy, Referrer-Policy, X-Content-Type-Options, frame-ancestors/X-Frame-Options, secure server configuration, input validation and rate limiting if a backend is added. Never put secrets or passwords in frontend files.
