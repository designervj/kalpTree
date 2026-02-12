src/
├── app/                         # Next.js App Router entrypoint and all routes
│   ├── layout.tsx               # Root layout: Redux, themes, global styles, GrapesJS CSS
│   ├── kalptree-favicon.svg
│   │
│   ├── (frontend)/              # Public + client‑facing website routes
│   │   ├── (clientpages)/       # Group: tenant-specific client pages
│   │   │   └── [lang]/          # Language / locale code, e.g. en, fr
│   │   │       ├── page.tsx                     # Homepage for that locale
│   │   │       ├── [slug]/page.tsx              # Generic content page
│   │   │       ├── [slug]/builder/page.tsx      # Builder-rendered view of a page
│   │   │       ├── [slug]/comingsoon/page.tsx   # Coming soon page variant
│   │   │       ├── product/[slug]/page.tsx      # Product detail page
│   │   │       └── product-category/            # Category listing & nested slugs
│   │   │           ├── page.tsx
│   │   │           └── [...slug]/page.tsx
│   │   └── (localpages)/        # Extra static/localized pages (e.g. homee/...)
│   │
│   ├── admin/                   # Admin dashboard (multi‑tenant)
│   │   ├── page.tsx             # Admin overview / landing
│   │   ├── users/               # User management UI
│   │   ├── agencies/            # Agency-level management
│   │   ├── business/            # Business / tenant management
│   │   ├── products/            # Global product catalog admin
│   │   │   └── styles/page.tsx  # Global product style config
│   │   ├── ecommerce/           # Global ecommerce configuration
│   │   ├── services/            # Service management (e.g. bookings, LLM, etc.)
│   │   │   └── general/page.tsx
│   │   ├── settings/            # Global admin settings
│   │   │   ├── general/page.tsx            # General account / org settings
│   │   │   └── global-styles/page.tsx      # Global style configuration entry
│   │   │
│   │   └── websites/            # Per‑website admin surfaces
│   │       └── [website]/       # Website/tenant identifier
│   │           ├── overview/                # Overview dashboard for that website
│   │           ├── branding/               # Branding & typography
│   │           │   └── typography/page.tsx
│   │           ├── domain/                 # Custom domain configuration
│   │           ├── ecommerce/              # Ecommerce config for this website
│   │           │   └── settings/page.tsx
│   │           ├── bookings/               # Booking/calendar config
│   │           ├── marketing/              # Marketing: banners, proposals, etc.
│   │           ├── products/               # Website‑scoped products
│   │           │   └── styles/page.tsx
│   │           ├── website/                # Website structure & sections
│   │           │   ├── header/             # Header management
│   │           │   │   └── [id]/page.tsx   # Edit specific header
│   │           │   ├── footer/             # Footer management
│   │           │   └── navigation/         # Navigation/menu items
│   │           ├── users/                  # Users specific to this website
│   │           ├── settings/               # Website-level settings
│   │           └── [entity]/               # Dynamic entity admin views
│   │               └── EntityModalForImport.tsx
│   │
│   ├── builder/                 # GrapesJS builder app
│   │   └── [id]/page.tsx        # Builder UI for a specific page/template
│   │
│   ├── auth/                    # Auth & onboarding flows
│   │   └── signin/page.tsx      # Login page
│   │
│   └── api/                     # Next.js route handlers (backend)
│       ├── auth/
│       │   └── [...nextauth]/route.ts      # NextAuth credentials + JWT
│       │
│       ├── admin/                           # Admin APIs
│       │   ├── [entity]/route.ts           # Dynamic entity CRUD
│       │   ├── product/route.ts
│       │   ├── categories/route.ts
│       │   ├── branding/route.ts
│       │   ├── business/route.ts
│       │   ├── agency/route.ts
│       │   ├── llmSetting/route.ts
│       │   ├── bookings/
│       │   │   └── calender/route.ts
│       │   ├── globalStyle/route.ts
│       │   └── bulk/route.ts               # Bulk import/export
│       │
│       ├── public/                          # Public content & onboarding APIs
│       │   ├── onboarding/route.ts
│       │   └── onboarding/final.json
│       │
│       ├── domain/                          # Domain & tenant resolution
│       │   ├── [host]/route.ts
│       │   ├── website/route.ts
│       │   └── current/
│       │       ├── route.ts
│       │       └── branding/route.ts
│       │
│       ├── public/                          # Public content APIs
│       │   ├── pages/[slug]/route.ts
│       │   ├── posts/[slug]/route.ts
│       │   └── products/[slug]/route.ts
│       │
│       ├── pages/route.ts                   # Generic pages listing
│       ├── pages/[id]/route.ts              # Single page
│       ├── posts/route.ts                   # Posts listing
│       │
│       ├── product/route.ts                 # Products CRUD
│       ├── product_categories/route.ts
│       ├── product_variants/route.ts
│       │
│       ├── media/                           # Media management
│       │   ├── route.ts
│       │   ├── [id]/route.ts
│       │   └── s3upload/route.ts
│       │
│       ├── template/route.ts                # Templates listing/CRUD
│       │
│       ├── subscription/route.ts            # Billing/subscription APIs
│       │
│       └── dev/                             # Internal diagnostics
│           ├── health/route.ts
│           └── verify-db/route.ts
│
├── components/                 # Reusable UI and feature components
│   ├── admin/                  # Admin‑only components
│   │   ├── AppShell.tsx        # Main admin layout shell (sidebar + header)
│   │   ├── Sidebar/
│   │   │   └── highlevelsidebar.tsx
│   │   ├── users/
│   │   │   ├── usercomp.tsx
│   │   │   └── PrimaryDomain.tsx
│   │   ├── header/
│   │   │   ├── AddHeader.tsx
│   │   │   ├── HeaderEdit.tsx
│   │   │   └── ShowCurrentHeader.tsx
│   │   ├── product/
│   │   │   ├── Cart/
│   │   │   │   ├── Cart.tsx
│   │   │   │   ├── Products.tsx
│   │   │   │   └── SingleProduct.tsx
│   │   │   ├── createproduct/
│   │   │   │   ├── CreateProduct.tsx
│   │   │   │   └── RightColumn.tsx
│   │   │   └── ImportData.tsx
│   │   ├── category/
│   │   │   └── listCategory/GetAllcategory.tsx
│   │   ├── templates/
│   │   │   ├── showTemplate/
│   │   │   │   ├── ShowTemplate.tsx
│   │   │   │   └── TemplateFrom.tsx
│   │   │   └── editTemplate/EditTemplate.tsx
│   │   ├── accountsharing/
│   │   │   └── accountsharing.tsx
│   │   ├── settings/
│   │   │   └── global-styles/
│   │   │       ├── GlobalHome.tsx
│   │   │       ├── GetGlobalStyle.tsx
│   │   │       ├── GlobalStyleModal.ts
│   │   │       ├── util/ColorFunction.ts
│   │   │       └── showStyle/
│   │   │           ├── ShowStyle.tsx
│   │   │           ├── ColorControl.tsx
│   │   │           ├── PreviewHeader.tsx
│   │   │           ├── BrandGalleryPreview.tsx
│   │   │           ├── ButtonsPreview.tsx
│   │   │           ├── BodyPreview.tsx
│   │   │           ├── HeadingsPreview.tsx
│   │   │           ├── HeadingControl.tsx
│   │   │           ├── HexInput.tsx
│   │   │           └── Pill.tsx
│   │   └── DataTableExt.tsx    # Shared data table wrapper for admin lists
│   │
│   ├── editor/                 # Page builder (GrapesJS) & related tools
│   │   ├── index.tsx           # Entry for editor layout
│   │   ├── GrapesJSEditor/
│   │   │   ├── sidebar/
│   │   │   │   ├── PropertiesSidebar.tsx
│   │   │   │   └── PageLayer.tsx
│   │   │   └── toolbars/
│   │   │       └── BottomToolbar.tsx
│   │   ├── sectionEdit/
│   │   │   ├── EditSection.tsx
│   │   │   └── CurrentForm.tsx
│   │   ├── editForm/EditForm.tsx
│   │   ├── forms-manager/
│   │   │   ├── FormsPage.tsx
│   │   │   ├── General.tsx
│   │   │   ├── AnimationCard.tsx
│   │   │   ├── IconRadio.tsx
│   │   │   ├── SettingRow.tsx
│   │   │   ├── PillTabs.tsx
│   │   │   ├── TabHeader.tsx
│   │   │   ├── constants.ts
│   │   │   └── types.ts
│   │   ├── template-manager/
│   │   │   └── template-manager.tsx
│   │   ├── pages-builder/pages.tsx
│   │   ├── style-editor/
│   │   │   ├── style-editor.tsx
│   │   │   ├── GlobalStyle.tsx
│   │   │   └── GlobalStyelModel.ts
│   │   ├── productgallery/
│   │   │   ├── ProductGalleryPage.tsx
│   │   │   ├── ProductGallerySettings.tsx
│   │   │   ├── SelectGalleryModal.tsx
│   │   │   └── util/
│   │   │       ├── GenerateHtml.ts
│   │   │       └── ParseGalleryHtml.ts
│   │   ├── code-editor/
│   │   │   └── code-editor.tsx
│   │   └── utils/
│   │       ├── InsertionUtils.ts
│   │       └── ApplyHoverableRestriction.ts
│   │
│   ├── websiteBuilder/
│   │   └── WebsiteBuilder.tsx  # High‑level website builder shell
│   │
│   └── (shared UI components, design system, etc. – buttons, inputs, modals, etc.)
│
├── hooks/                      # React hooks + Redux slices
│   ├── use-editor.ts           # Editor‑specific hook (GrapesJS, selection, etc.)
│   └── slices/                 # Redux Toolkit slices
│       ├── header/
│       │   └── HeaderSlice.ts
│       ├── footer/
│       │   └── FooterSlice.ts
│       ├── websites/
│       │   └── WebsiteSlice.ts
│       └── setting/
│           └── globalStyle/
│               ├── GlobalStyleSlice.ts
│               └── GlobalStyleThunk.ts
│
├── lib/                        # Domain services & cross‑cutting logic
│   ├── auth/                   # Auth & session helpers
│   │   ├── auth-config.ts
│   │   ├── user-service.ts
│   │   ├── session.ts
│   │   └── index.ts
│   ├── rbac/                   # RBAC and permissions
│   │   ├── rbac-service.ts
│   │   └── roles.ts
│   ├── tenant/                 # Tenant and hierarchy management
│   │   └── tenant-service.ts
│   ├── websites/
│   │   └── website-service.ts  # Website lookup, host→website mapping
│   ├── entities/
│   │   └── entityConfig.ts     # Dynamic entity CRUD config
│   ├── material/               # Ecommerce domain operations
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── product_brand.ts
│   │   ├── product_attribute.ts
│   │   ├── attributessets.ts
│   │   ├── product_type.ts
│   │   └── product_type_category.ts
│   ├── templates/
│   │   └── template-service.ts
│   ├── billing/
│   │   └── subscription-service.ts
│   └── utils.ts                # General helpers
│
├── modules/                    # Higher‑level feature modules (e.g. website)
│   └── website/                # Website/content domain
│       └── ... (page/post/nav management, builders, etc.)
│
├── models/                     # MongoDB models / schema definitions
│   └── ... (user, tenant, website, page, product, etc.)
│
├── store/
│   └── store.ts                # Redux store configuration (slices, middleware)
│
└── (optionally) utils/, types/, config/… depending on your actual repo