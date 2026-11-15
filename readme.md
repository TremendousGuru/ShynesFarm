# SHYNE LIVESTOCK FARMS VENTURE Website

This is the official, production-ready website for **SHYNE LIVESTOCK FARMS VENTURE**, a premier Nigerian agricultural business supplying quality farm produce, livestock products, grains, and comprehensive agricultural solutions. 

The website is designed to serve a diverse range of customers, including:
- Households and individual consumers
- Restaurants and hotels
- Supermarkets and retailers
- Wholesalers and distributors
- Food processors and manufacturers
- Institutions and organizations
- International agricultural buyers

---

# Project Overview

The primary purpose of this website is to establish a strong, trustworthy digital presence for SHYNE LIVESTOCK FARMS VENTURE. 

**Key Objectives:**
- **Business Goals:** Showcase the breadth of agricultural products and supply capabilities, positioning the company as a reliable B2B and B2C partner.
- **Customer Trust:** Build confidence through transparent processes, professional presentation, and clear communication of quality handling and sourcing practices.
- **SEO Visibility:** Maximize discoverability in search engines for agricultural supply queries within Nigeria and beyond.
- **Conversion Goals:** Drive qualified inquiries and supply requests through strategically placed calls-to-action (CTAs) and an optimized contact workflow.

---

# Technology Stack

This project is built using a lightweight, high-performance static architecture:
- **HTML5:** Semantic, accessible markup.
- **CSS3:** Custom styling using CSS variables for a consistent design system.
- **Vanilla JavaScript:** Lightweight, dependency-free interactivity and animations.
- **JSON-LD:** Structured data for enhanced search engine understanding.
- **Netlify:** Static site hosting and deployment.
- **Formspree:** Secure, serverless contact form handling.

---

# Website Structure

The project follows a clean, organized directory structure:

```text
/
├── index.html                  # Homepage
├── sitemap.xml                 # XML sitemap for search engines
├── robots.txt                  # Crawler directives
├── schema.json                 # Centralized structured data reference
├── package.json                # Node.js dependencies and scripts
├── netlify.toml                # Netlify deployment and header configurations
├── README.md                   # Project documentation
│
├── /pages/                     # Main informational pages
│   ├── about.html
│   ├── contact.html
│   ├── products.html
│   ├── industries.html
│   └── process.html
│
├── /products/                  # Individual product landing pages
│   ├── catfish.html
│   ├── coconut.html
│   ├── maize.html
│   ├── millet.html
│   ├── palm-oil.html
│   ├── snails.html
│   ├── soya-beans.html
│   ├── vegetables.html
│   └── yam.html
│
├── /Industries/                # Industry-specific supply solutions (Note: Capital 'I')
│   ├── food-processors.html
│   ├── hotels-restaurants.html
│   ├── institutions.html
│   ├── international-buyers.html
│   ├── supermarkets-retailers.html
│   └── wholesalers-distributors.html
│
└── /assets/                    # Static resources
    ├── images/                 # Optimized WebP, JPG, PNG images
    ├── icons/                  # SVG icons and favicons
    ├── css/                    # Stylesheets (main.css, page-specific CSS)
    └── js/                     # JavaScript files (main.js, animations.js, etc.)
```

---

# SEO Implementation

The website is heavily optimized for search engine discoverability and rich results:
- **Sitemap & Robots:** `sitemap.xml` and `robots.txt` are configured to guide search engine crawlers efficiently.
- **Structured Data:** Comprehensive JSON-LD schema markup implementing both `AgriculturalBusiness` and `LocalBusiness` types.
- **Product Schema:** Individual product pages include structured `Product` and `Offer` data.
- **Semantic HTML:** Proper use of heading hierarchies (`<h1>` to `<h6>`), `<article>`, `<section>`, and `aria` attributes for accessibility and SEO.
- **Metadata:** Unique, keyword-optimized `<title>`, `<meta description>`, and Open Graph/Twitter Card tags on every page.

---

# Contact Form

Lead generation and customer inquiries are handled via **Formspree**, ensuring reliable delivery without requiring a backend server.

- **Approved Endpoint:** `https://formspree.io/f/mwvzegog`
- All contact forms across the website submit to this endpoint.
- Form submissions include validation and provide user feedback upon success or failure.

---

# Deployment

The website is hosted on **Netlify** as a static site.

- **Publish Directory:** The root directory (`.`) is set as the publish folder in `netlify.toml`.
- **Build Command:** None required (`echo 'No build command required for static site'`), as the site consists of pre-built static files.
- **Configuration:** The `netlify.toml` file manages production security headers (CSP, X-Frame-Options, etc.) and aggressive browser caching rules for static assets.
- **Workflow:** Pushing changes to the main branch triggers an automatic, zero-downtime deployment on Netlify.

---

# Local Development

While the site is purely static and can be opened directly in any modern web browser, a local development server is recommended for testing form submissions and relative paths.

**Requirements:**
- Node.js installed on your machine.

**Commands:**
```bash
# Install the local development server dependency
npm install

# Start the local development server
npm run dev
```
*Alternatively, you can simply double-click `index.html` to view the site in your browser, though some features (like Formspree) require a live server context.*

---

# Performance Optimization

The architecture prioritizes speed and efficiency:
- **Asset Caching:** `netlify.toml` enforces long-term caching (`max-age=31536000`) for images, CSS, JS, and fonts.
- **Image Optimization:** All images are served in modern formats (`.webp`) with responsive `<picture>` elements for mobile and desktop.
- **Security Headers:** Strict Content Security Policy (CSP), X-Content-Type-Options, and Referrer-Policy headers are applied globally.
- **Lightweight Architecture:** Zero heavy frameworks or unnecessary third-party scripts ensure rapid First Contentful Paint (FCP) and Time to Interactive (TTI).

---

# Maintenance Guidelines

To ensure the website remains secure, performant, and SEO-friendly, adhere to the following practices:
1. **Preserve File Paths:** Do not rename or move existing files without updating all internal links and the `sitemap.xml`.
2. **Update SEO Assets:** Whenever a new product or page is added, update `sitemap.xml` and `schema.json` accordingly.
3. **Optimize Media:** Compress and convert all new images to `.webp` format before uploading to the `/assets/images/` directory.
4. **Maintain Metadata:** Ensure every new HTML file includes unique, relevant `<title>` and `<meta description>` tags.
5. **Test Responsiveness:** Always verify mobile and tablet layouts before deploying changes to production.

---

# Business Information

- **Business Name:** SHYNE LIVESTOCK FARMS VENTURE
- **Website:** https://shynelivestockfarms.com
- **Location:** Lagos, Nigeria
- **Industry:** Agriculture and Food Supply

---

# License

This website, its source code, and all associated content are the exclusive property of **SHYNE LIVESTOCK FARMS VENTURE**. Unauthorized reproduction, distribution, or modification is strictly prohibited.