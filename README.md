# Altaris Growth Partners — Website

Built with [Eleventy](https://www.11ty.dev/) (static site generator) and
[Sveltia CMS](https://github.com/sveltia/sveltia-cms) (content editor for
FAQ, Insights, and Open Roles).

## Setup

```bash
npm install
npm start        # local preview at http://localhost:8080
npm run build    # builds the site into _site/
```

## Deploying

1. Push this whole folder to a new GitHub repository.
2. In Netlify: "Add new site" → "Import an existing project" → connect
   the GitHub repo. Netlify will detect `netlify.toml` automatically —
   build command and publish folder are already configured, nothing to
   fill in manually.
3. Once live, connect your custom domain (altarisgrowth.com) under
   Site configuration → Domain management.

## Editing content (no code required)

Once deployed, go to `https://yoursite.com/admin/` and log in with GitHub.
You'll see three collections:

- **FAQ** — add/edit/reorder questions shown on the FAQ page
- **Insights** — add/edit blog posts (each gets its own page automatically)
- **Open Roles** — add/edit roles shown on the Join Us page; toggle "Open"
  off instead of deleting a role once it's filled

Every save commits directly to GitHub, which triggers a new Netlify build
automatically — changes go live within a minute or two, no developer
needed.

**Before this works**, edit `src/admin/config.yml` and replace
`your-org/altaris-site` on the `repo:` line with your actual GitHub repo
path (e.g. `sharathvenna/altaris-site`).

## Contact form

The contact form uses Netlify Forms — no external service or API key
needed. After deploying, go to Site configuration → Forms →
Notifications, and turn on an email notification so submissions land in
your inbox. Submissions are also stored in the Netlify dashboard
indefinitely and exportable as CSV.

## Structure

```
src/
  _includes/       # layout.njk (shared head/nav/footer), post.njk (blog layout)
  _data/           # site.json — global values like the assessment URL
  content/
    faq/           # one .md file per FAQ entry
    insights/      # one .md file per blog post
    roles/         # one .md file per open role
  admin/           # Sveltia CMS config + entry point (served at /admin/)
  assets/          # styles.css, script.js, logo images
  *.njk            # the 9 main pages
```
