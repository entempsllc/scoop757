# Scoop 757 — static site for GitHub Pages

Plain HTML/CSS/JS. No build step.

## 1. Replace placeholders (find & replace across all files)

| Find | Replace with |
|---|---|
| `Scoop 757` / `Scoop<b>757</b>` | Your business name |
| `www.scoop757.com` | Your domain (or `USERNAME.github.io/REPO`) |
| `YOUR_EMAIL_HERE` | Email that should receive quote requests |

Also edit neighborhoods in the `#area` section and prices in `#pricing` if needed.

## 2. Deploy

```bash
cd scoop757
git init && git add . && git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

GitHub → repo → Settings → Pages → Source: **Deploy from a branch** → `main` / `(root)` → Save.

## 3. Custom domain (optional)

1. Settings → Pages → Custom domain → enter `www.yourdomain.com` → Save (this creates a `CNAME` file).
2. At your registrar:
   - `CNAME` record: `www` → `USERNAME.github.io`
   - `A` records for apex `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Tick **Enforce HTTPS** once the certificate is issued.

## 4. Stripe Payment Links (pricing buttons)

In Stripe → Product catalog, create a recurring monthly price for each plan ($79 / $95 / $110). Then Payment Links → New, one per plan:

- **Free trial:** 7 days (covers the free first visit)
- **Collect:** customer address + phone number
- **Custom field:** "Gate code / dog names" (text, optional)
- **After payment:** redirect to `https://YOURDOMAIN/thanks.html`

Paste each link URL in `index.html` in place of `STRIPE_LINK_1_DOG`, `STRIPE_LINK_2_DOGS`, `STRIPE_LINK_3_DOGS`.

Customers manage or cancel their plan through Stripe's customer portal (Settings → Billing → Customer portal). Refund anyone outside your service area.

## 5. Quote form

The form posts to FormSubmit (free, no account). After deploying, submit the form once yourself — FormSubmit emails you an activation link. Click it, and every later submission lands in your inbox. Submitters are redirected to `thanks.html`.

## Verify

- [ ] Site loads at your Pages URL
- [ ] Phone links dial on mobile
- [ ] Test form submission arrives in your inbox and redirects to the thanks page
- [ ] Submit `sitemap.xml` in Google Search Console
- [ ] Check https://search.google.com/test/rich-results for the LocalBusiness schema
