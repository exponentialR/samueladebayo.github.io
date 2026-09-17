# Dr Samuel Adebayo — Academic Profile

Source for the academic profile at **https://academic.samueladebayo.com**.

This is Samuel Adebayo's academic site. It is intentionally lightweight and static, published with GitHub Pages, and presents research, publications, news, teaching, research software and links to longer-form technical writing at **https://samueladebayo.com**.

The repository name is independent of the future `exponentialR.github.io` portfolio site; this repository is published through the custom domain above.

## Purpose and editorial direction

The site should read as an academic profile first. Queen's University Belfast and Samuel's research trajectory should anchor the identity, while industry experience provides context and breadth rather than becoming the main story.

The writing should be factual and understated. Describe the research, contribution, result or event itself. Avoid copy that talks about the website, its sections or its curation. Do not pad sections with extra prose simply to balance a layout.

Use real research graphics from `assets/papers/` wherever possible. Do not recreate paper figures, invent geometry or substitute generic AI graphics when an original research asset is available.

The overall research narrative currently runs from visual cues and intention inference, through multimodal and temporal modelling, into robotic structural assembly, embodied intelligence and reliable agentic AI. New material should extend that story without implying that earlier research themes have been abandoned.

## Key files

- `index.html` — homepage and research trajectory
- `research.html` — research themes and projects
- `publications.html` — peer-reviewed publications and separate technical publications
- `news.html` — chronological research news and milestones
- `teaching.html` — teaching and supervision
- `software.html` — research software and data
- `check-your-inbox.html` — newsletter double-opt-in confirmation landing page; deliberately `noindex`
- `assets/styles.css` — base site styling
- `assets/layout-balance.css` — current layout refinements and large-screen behaviour
- `assets/site.js` — navigation, research-news carousel and newsletter popup behaviour
- `assets/papers/` — original figures and publication assets

The site uses a wide visual canvas on large displays while keeping prose at readable widths. Avoid reintroducing equal-height split cards where a tall image creates a large empty area beside shorter text.

## News and homepage updates

The homepage `Latest research` area is a rotating research spotlight. The full chronological record lives on `news.html`.

When adding a significant research update, normally consider whether both places need changing:

1. Add the full item to `news.html`.
2. If it is one of the most recent or important updates, add or replace an item in the homepage research spotlight.
3. Use an original paper/project visual when the update warrants one.
4. Keep dates, journal names, DOIs and project details exact. Do not invent missing bibliographic information.

Routine copy edits, layout changes and small profile updates do not belong in News.

## Research Updates newsletter

The newsletter is **Samuel Adebayo — Research Updates**, hosted by Beehiiv at **https://samueladebayo.beehiiv.com**.

The academic site is the canonical research profile. Beehiiv is used for subscriber management and email delivery; it should not become a duplicate version of the website.

### Current subscription flow

- An inline signup form appears on the homepage and News page.
- A restrained site-level popup appears after roughly **60% scroll**.
- Dismissing the popup suppresses it for **30 days** using local storage.
- The subscription form uses **double opt-in**.
- After submitting, Beehiiv redirects to `check-your-inbox.html`.
- Beehiiv should be configured to remove the email address from the redirect URL.
- Reaching `check-your-inbox.html` suppresses the popup for approximately one year on that browser.
- The current public Beehiiv form identifier is `150eba12-66e8-4e0a-9c39-d4f7b43f9f45`. It is used by the inline signup and the site-level popup.

The form identifier is **not a secret**. It is a public client-side identifier and is visible to anyone who inspects the rendered page. If Beehiiv ever behaves poorly when the same form is instantiated twice on one page, create a separate Beehiiv form for the popup and update the form ID used in `assets/site.js`.

### What sends an email

**Updating this repository does not automatically email subscribers.** Website deployment and newsletter delivery are separate.

Subscribers receive an email only when a Research Updates email/post is explicitly sent through Beehiiv, or if a future server-side/CI automation is deliberately added to do so.

A coding agent making a site update should therefore classify the update before finishing:

- **Newsletter-worthy:** a new paper, dataset or research-software release; a substantial research milestone; a journal cover or similar publication milestone; a conference/research announcement worth communicating; or a substantive technical note.
- **Normally not newsletter-worthy:** CSS/layout changes, typo fixes, navigation changes, routine biography/CV edits, SEO work or minor wording changes.

For a newsletter-worthy change, the agent should update the relevant website content and then **flag that a Research Updates email is appropriate and prepare a concise draft for review**. Do not automatically send the email unless Samuel explicitly asks for that action.

The intended newsletter style is occasional and useful, not scheduled for the sake of cadence. There is no fixed publishing schedule.

## Secrets and credentials

This repository is public. **Never commit credentials or secrets here.** This includes:

- Beehiiv API keys or account credentials
- passwords
- OAuth access/refresh tokens
- SMTP credentials
- GitHub personal access tokens
- session cookies
- private keys
- `.env` files containing credentials

The current Beehiiv integration does **not** require a secret in the browser. The loader URL and form UUID are public by design. No Beehiiv password or API key should ever be added to `index.html`, `news.html`, `assets/site.js` or any other client-side file.

If future automation uses the Beehiiv API, store the API key in **GitHub Actions Secrets** (for example `BEEHIIV_API_KEY`) or another server-side secret store. A secret used in CI must never be written into generated HTML/JavaScript or otherwise shipped to the browser.

If a real secret is ever committed, deleting it in a later commit is not sufficient: rotate/revoke the credential immediately and remove it from Git history if necessary.

## Deployment

The site deploys from the repository's default branch through GitHub Pages. The custom domain is defined by `CNAME`.

After changes, allow the Pages deployment to complete before evaluating the live site. Browser caching can occasionally retain CSS or JavaScript; when changing those assets, update the cache-busting query/version where appropriate and hard-refresh during testing.
