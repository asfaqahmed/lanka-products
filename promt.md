You are a senior full-stack software architect and engineer.

Your task is to design and build a **production-ready ecommerce platform** for selling authentic Sri Lankan local products to international customers.

Project Name: **Lanka Products**

Goal:
Create a scalable ecommerce platform that sells curated Sri Lankan products to foreign customers mainly in:
- USA
- Canada
- Australia
- United Kingdom
- Netherlands

The platform must highlight **Sri Lankan culture, authenticity, and artisan craftsmanship.**

Tech Stack (MANDATORY)
Frontend:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI components

Backend:
- Supabase
  - PostgreSQL database
  - Supabase Auth
  - Supabase Storage
  - Supabase Edge Functions if necessary

Deployment:
- Vercel (frontend)
- Supabase (backend)

Payments:
- Payhere for  payments

Image storage:
- Supabase Storage

Email:
- Hostinger

Analytics:
- Plausible or Google Analytics

SEO:
- Next.js SEO best practices

------------------------------------------------

PRODUCT CATEGORIES

Design database and UI for the following product categories.

1. Sri Lankan Spices
- Ceylon Cinnamon
- Black Lemon
- Cloves
- Curry Powder
- Goraka
- Ceylon Black Pepper
- Cardamom
- Dried Chili

2. Artisan Handicrafts
- Wooden Elephant Carvings
- Coconut Shell Bowls
- Coconut Shell Spoons
- Palm Leaf Baskets
- Traditional Ambalangoda Mask Carvings

3. Vintage & Heritage Items
- Old Sri Lankan Coins
- Vintage Postcards of Ceylon
- Colonial Era Artifacts
- Traditional Calligraphy Art

4. Curated Gift Boxes

Create special product bundles:

Examples:

Spice Box
- Cinnamon
- Pepper
- Cloves

Tea Lover Box
- Ceylon tea
- Cinnamon
- Traditional tea spoon

Sri Lankan Heritage Box
- Ambalangoda mask
- Ceylon cinnamon
- Ceylon tea

Gift boxes must be configurable bundles.

------------------------------------------------

CORE FEATURES

Customer Features

- Browse products
- Filter by category
- Search products
- Product detail page
- Product reviews
- Add to cart
- Checkout
- Secure payment with Stripe
- Shipping address form
- Order tracking
- Customer account dashboard
- Wishlist

Admin Features

Admin dashboard must allow:

- Add/edit/delete products
- Upload product images
- Manage product categories
- Manage gift box bundles
- View orders
- Update order status
- Manage inventory
- Manage users
- Manage reviews
- Manage shipping costs by country

------------------------------------------------

DATABASE DESIGN

Design a proper relational schema in PostgreSQL.

Tables required:

users
products
categories
product_images
orders
order_items
reviews
wishlists
gift_boxes
gift_box_items
shipping_rates
inventory

Each table must include:

- primary keys
- timestamps
- foreign keys
- indexing where appropriate

------------------------------------------------

UI/UX DESIGN

Design a modern ecommerce UI.

Pages required:

Homepage
- Hero banner highlighting Sri Lankan culture
- Featured products
- Gift boxes section
- Cultural story section

Shop page
- product grid
- filters
- search

Product Page
- images
- description
- origin story
- reviews

Gift Boxes Page

Cart Page

Checkout Page

Customer Dashboard

Admin Dashboard

------------------------------------------------

SPECIAL BRANDING REQUIREMENT

The design must emphasize **Sri Lankan cultural identity**.

Use:

colors:
- Cinnamon brown
- Tea green
- Gold accents

Include storytelling elements such as:

"From the Gardens of Ceylon"
"Authentic Sri Lankan Craftsmanship"
"Handmade by Local Artisans"

------------------------------------------------

INTERNATIONAL SHIPPING

The system must support:

- international shipping
- shipping cost calculation
- estimated delivery time
- customs information section

------------------------------------------------

SECURITY REQUIREMENTS

- Use Supabase Auth
- Protect admin routes
- Secure API routes
- Prevent SQL injection
- Validate inputs

------------------------------------------------

PERFORMANCE

- Server Components where possible
- Image optimization
- Lazy loading
- Edge caching
- CDN via Vercel

------------------------------------------------

SEO REQUIREMENTS

Each product page must include:

- SEO meta tags
- OpenGraph tags
- structured data (JSON-LD for products)

------------------------------------------------

DELIVERABLES

Provide:

1. Full project folder structure
2. Database schema SQL
3. Supabase setup guide
4. Next.js project setup
5. Key API routes
6. Payhere payment integration
7. Admin dashboard architecture
8. Example UI components
9. Environment variable setup
10. Deployment instructions

All code must be **production ready, clean, modular, and scalable**.
