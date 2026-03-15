What was created
Project Structure

lanka-products/
├── app/
│   ├── page.tsx                    # Homepage (Server Component)
│   ├── layout.tsx                  # Root layout + providers
│   ├── globals.css                 # Brand CSS variables
│   ├── shop/page.tsx               # Shop with filters + search
│   ├── products/[slug]/page.tsx    # Product detail + JSON-LD SEO
│   ├── gift-boxes/page.tsx         # Gift box bundles
│   ├── cart/page.tsx               # Cart with quantity controls
│   ├── checkout/page.tsx           # Checkout + Payhere
│   ├── checkout/success/page.tsx   # Order confirmation
│   ├── dashboard/page.tsx          # Customer dashboard
│   ├── about/page.tsx              # About / culture page
│   ├── auth/login/                 # Auth pages
│   ├── auth/register/
│   ├── admin/
│   │   ├── layout.tsx              # Admin guard + sidebar
│   │   ├── page.tsx                # Stats dashboard
│   │   ├── products/page.tsx       # Product CRUD
│   │   └── orders/page.tsx         # Order management
│   └── api/
│       ├── orders/route.ts         # Create orders
│       ├── payhere/notify/route.ts # IPN webhook
│       └── shipping/route.ts       # Shipping rates
├── components/
│   ├── layout/Navbar.tsx + Footer.tsx
│   ├── home/Hero, Featured, GiftBoxes, CulturalStory, Newsletter
│   ├── products/ProductCard, ReviewSection, AddToCartSection
│   ├── shop/ShopClient.tsx
│   ├── admin/ProductForm.tsx
│   ├── checkout/PayhereButton.tsx
│   └── ui/button, toast, toaster
├── lib/
│   ├── supabase/client.ts + server.ts + types.ts
│   ├── store/cart.ts               # Zustand + localStorage
│   ├── payhere.ts                  # MD5 hash + config builder
│   ├── email.ts                    # Hostinger SMTP templates
│   └── utils.ts
├── supabase/schema.sql             # Full DB schema + RLS + seed
├── middleware.ts                   # Route protection
└── .env.example
Next Steps to go live
1. Install dependencies


npm install
2. Set up Supabase

Create project at supabase.com
Run supabase/schema.sql in the SQL editor
Create a product-images storage bucket (public)
Copy URL + anon key to .env.local
3. Configure .env.local


cp .env.example .env.local
# Fill in Supabase URL, anon key, Payhere merchant ID/secret, SMTP creds
4. Set first admin user


UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
5. Run locally


npm run dev
6. Deploy to Vercel


vercel --prod
# Add all env vars in Vercel dashboard
Payhere Integration
Payhere uses a form-POST flow (not a JS SDK). The PayhereButton component builds a hidden <form> with all required fields including the MD5 hash, then submits to https://sandbox.payhere.lk/pay/checkout (swap to production URL for live). The IPN webhook at /api/payhere/notify verifies the hash and updates order status in Supabase.

Let me save the memory files directly.

Write C:\Users\Mr Pc\.claude\projects\c--Users-Mr-Pc-Documents-GitHub-lanka-products\memory\project_lanka_products.md
22 lines
Write C:\Users\Mr Pc\.claude\projects\c--Users-Mr-Pc-Documents-GitHub-lanka-products\memory\MEMORY.md
5 lines
Memory saved. The project context will be available in future conversations.