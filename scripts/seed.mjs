import { readFileSync } from "fs";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

function loadEnvDotLocal() {
  try {
    // Try .env.local first, then fall back to .env
    let raw;
    try {
      raw = readFileSync(new URL("../.env.local", import.meta.url)).toString();
    } catch (e) {
      raw = readFileSync(new URL("../.env", import.meta.url)).toString();
    }
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) {
        const key = m[1];
        let val = m[2];
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
    }
  } catch (e) {
    // ignore if not present
  }
}

async function main() {
  loadEnvDotLocal();
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "KalpTree";
  if (!uri) throw new Error("Missing MONGODB_URI");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const tenants = db.collection("tenants");
  const users = db.collection("users");

  const now = new Date();
  const existingTenant = await tenants.findOne({ slug: "demo" });
  let tenantId;
  if (existingTenant) {
    tenantId = existingTenant._id;
  } else {
    const t = {
      slug: "demo",
      name: "Demo Tenant",
      email: "owner@demo.local",
      customDomainVerified: false,
      plan: "trial",
      subscriptionStatus: "active",
      branding: { primaryColor: "#3b82f6", secondaryColor: "#f4e04f" },
      paymentGateways: {},
      features: {
        websiteEnabled: true,
        ecommerceEnabled: true,
        blogEnabled: true,
        invoicesEnabled: true,
      },
      settings: { locale: "en-US", currency: "USD", timezone: "UTC" },
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    const r = await tenants.insertOne(t);
    tenantId = r.insertedId;
  }

  // Admin user
  const email = "admin@demo.local";
  const password = "Password123!";
  const existingUser = await users.findOne({
    tenantId: new ObjectId(tenantId),
    email,
  });
  let adminUserId;
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(password, 10);
    const u = await users.insertOne({
      tenantId: new ObjectId(tenantId),
      email,
      passwordHash,
      name: "Demo Admin",
      role: "owner",
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
    adminUserId = u.insertedId;
  } else {
    adminUserId = existingUser._id;
  }

  // Website: pages
  const pages = db.collection("pages");
  const existingHome = await pages.findOne({
    tenantId: new ObjectId(tenantId),
    slug: "/",
  });
  if (!existingHome) {
    await pages.insertMany([
      {
        tenantId: new ObjectId(tenantId),
        slug: "/",
        title: "Home",
        content: "<h1>Welcome to KalpTree Demo</h1>",
        seo: {},
        status: "published",
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      },
      {
        tenantId: new ObjectId(tenantId),
        slug: "/about",
        title: "About",
        content: "<p>About our demo tenant.</p>",
        seo: {},
        status: "published",
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      },
      {
        tenantId: new ObjectId(tenantId),
        slug: "/contact",
        title: "Contact",
        content: "<p>Contact us at contact@demo.local</p>",
        seo: {},
        status: "published",
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      },
    ]);
  }

  // Website: blog categories and tags
  const wCategories = db.collection("categories");
  const blogTags = db.collection("blog_tags");
  await wCategories.updateOne(
    { tenantId: new ObjectId(tenantId), slug: "news" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        name: "News",
        slug: "news",
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  await wCategories.updateOne(
    { tenantId: new ObjectId(tenantId), slug: "guides" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        name: "Guides",
        slug: "guides",
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  await blogTags.updateOne(
    { tenantId: new ObjectId(tenantId), slug: "welcome" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        slug: "welcome",
        name: "Welcome",
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );

  // Website: one blog post
  const posts = db.collection("posts");
  await posts.updateOne(
    { tenantId: new ObjectId(tenantId), slug: "getting-started" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        slug: "getting-started",
        title: "Getting Started with KalpTree",
        excerpt: "A quick intro to your new SaaS.",
        content: "<p>Welcome to KalpTree!</p>",
        categoryId: "guides",
        tags: ["welcome"],
        author: { userId: String(adminUserId), name: "Demo Admin" },
        seo: {},
        status: "published",
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      },
    },
    { upsert: true },
  );

  // Ecommerce: product categories
  const pCategories = db.collection("product_categories");
  const ec1 = await pCategories.updateOne(
    { tenantId: new ObjectId(tenantId), slug: "electronics" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        name: "Electronics",
        slug: "electronics",
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  const ec2 = await pCategories.updateOne(
    { tenantId: new ObjectId(tenantId), slug: "clothing" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        name: "Clothing",
        slug: "clothing",
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );

  // Ecommerce: products
  const products = db.collection("products");
  const prod1 = await products.updateOne(
    { tenantId: new ObjectId(tenantId), slug: "wireless-headphones" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        name: "Wireless Headphones",
        slug: "wireless-headphones",
        description: "Noise-cancelling over-ear wireless headphones.",
        productType: "physical",
        images: [],
        pricing: { basePrice: 99.99 },
        inventory: {
          trackStock: true,
          stockQuantity: 50,
          allowBackorder: false,
        },
        attributes: [],
        typeSpecific: { shipping: { requiresShipping: true } },
        categoryIds: ["electronics"],
        tags: ["audio", "wireless"],
        seo: {},
        status: "published",
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      },
    },
    { upsert: true },
  );

  const prod2 = await products.updateOne(
    { tenantId: new ObjectId(tenantId), slug: "t-shirt" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        name: "T-Shirt",
        slug: "t-shirt",
        description: "Comfy cotton t-shirt with multiple sizes and colors.",
        productType: "physical",
        images: [],
        pricing: { basePrice: 19.99 },
        inventory: {
          trackStock: true,
          stockQuantity: 200,
          allowBackorder: false,
        },
        attributes: [
          {
            name: "Size",
            type: "select",
            value: "M",
            options: ["S", "M", "L", "XL"],
          },
          {
            name: "Color",
            type: "select",
            value: "Black",
            options: ["Black", "White"],
          },
        ],
        typeSpecific: { shipping: { requiresShipping: true } },
        categoryIds: ["clothing"],
        tags: ["apparel"],
        seo: {},
        status: "published",
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      },
    },
    { upsert: true },
  );

  const prod3 = await products.updateOne(
    { tenantId: new ObjectId(tenantId), slug: "e-book" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        name: "E-Book: Build a SaaS",
        slug: "e-book",
        description: "Digital e-book download.",
        productType: "digital",
        images: [],
        pricing: { basePrice: 14.99 },
        attributes: [],
        typeSpecific: {
          downloadable: true,
          downloadLimit: 5,
          downloadExpiry: 30,
        },
        categoryIds: ["electronics"],
        tags: ["digital", "ebook"],
        seo: {},
        status: "published",
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      },
    },
    { upsert: true },
  );

  // Ecommerce: product variants for T-Shirt
  const productVariants = db.collection("product_variants");
  const tshirt = await products.findOne({
    tenantId: new ObjectId(tenantId),
    slug: "t-shirt",
  });
  if (tshirt) {
    await productVariants.updateOne(
      {
        tenantId: new ObjectId(tenantId),
        productId: tshirt._id,
        name: "Size L / Black",
      },
      {
        $set: {
          tenantId: new ObjectId(tenantId),
          productId: tshirt._id,
          name: "Size L / Black",
          options: { Size: "L", Color: "Black" },
          pricing: { basePrice: 21.99 },
          inventory: { stockQuantity: 40 },
          isDefault: false,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    );
  }

  // Orders + payments + invoices
  const orders = db.collection("orders");
  const payments = db.collection("payments");
  const invoices = db.collection("invoices");
  const orderNumber = "ORD-" + now.getFullYear() + "-0001";
  const orderRes = await orders.updateOne(
    { tenantId: new ObjectId(tenantId), orderNumber },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        orderNumber,
        customer: {
          userId: String(adminUserId),
          email: "admin@demo.local",
          name: "Demo Admin",
        },
        items: [
          {
            productId: String(tshirt?._id || ""),
            name: "T-Shirt",
            quantity: 2,
            price: 19.99,
          },
        ],
        totals: {
          subtotal: 39.98,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 39.98,
        },
        payment: {
          method: "stripe",
          status: "paid",
          transactionId: "txn_demo",
          paidAt: now,
        },
        fulfillment: { status: "completed" },
        status: "completed",
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );

  if (orderRes.upsertedId || orderRes.matchedCount) {
    const invNumber = "INV-" + now.getFullYear() + "-0001";
    await invoices.updateOne(
      { tenantId: new ObjectId(tenantId), invoiceNumber: invNumber },
      {
        $set: {
          tenantId: new ObjectId(tenantId),
          invoiceNumber: invNumber,
          orderNumber,
          amount: 39.98,
          currency: "USD",
          status: "issued",
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    );
    await payments.updateOne(
      {
        tenantId: new ObjectId(tenantId),
        orderId: orderRes.upsertedId?._id || orderRes.filter?._id || null,
      },
      {
        $set: {
          tenantId: new ObjectId(tenantId),
          orderId: orderRes.upsertedId?._id || orderRes.filter?._id || null,
          status: "paid",
          amount: 39.98,
          currency: "USD",
          method: "stripe",
          transactionId: "txn_demo",
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    );
  }

  // Subscriptions
  const subscriptions = db.collection("subscriptions");
  await subscriptions.updateOne(
    { tenantId: new ObjectId(tenantId) },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        plan: "trial",
        status: "active",
        startedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );

  // System: invitations and password reset tokens (with TTL)
  const invitations = db.collection("invitations");
  const expiresSoon = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  await invitations.updateOne(
    { tenantId: new ObjectId(tenantId), email: "invitee@demo.local" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        email: "invitee@demo.local",
        token: "invite-token-demo",
        role: "editor",
        createdAt: now,
        updatedAt: now,
        expiresAt: expiresSoon,
      },
    },
    { upsert: true },
  );
  const pwdTokens = db.collection("password_reset_tokens");
  const expiresPwd = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await pwdTokens.updateOne(
    { userId: String(adminUserId) },
    {
      $set: {
        userId: String(adminUserId),
        token: "reset-token-demo",
        createdAt: now,
        updatedAt: now,
        expiresAt: expiresPwd,
      },
    },
    { upsert: true },
  );

  // System: audit logs (with TTL) and activities
  const auditLogs = db.collection("audit_logs");
  const activities = db.collection("activities");
  const auditExpire = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
  await auditLogs.insertOne({
    tenantId: new ObjectId(tenantId),
    actorId: String(adminUserId),
    action: "seed",
    metadata: { note: "Initial seed" },
    createdAt: now,
    expiresAt: auditExpire,
  });
  await activities.insertOne({
    tenantId: new ObjectId(tenantId),
    userId: String(adminUserId),
    type: "login",
    createdAt: now,
  });

  // Media & folders
  const mediaFolders = db.collection("media_folders");
  const media = db.collection("media");
  const folder = await mediaFolders.updateOne(
    { tenantId: new ObjectId(tenantId), slug: "uploads" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        slug: "uploads",
        name: "Uploads",
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  await media.updateOne(
    { tenantId: new ObjectId(tenantId), filename: "welcome.png" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        filename: "welcome.png",
        originalName: "welcome.png",
        mimeType: "image/png",
        size: 1024,
        url: "/media/welcome.png",
        uploadedBy: String(adminUserId),
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );

  // Plugins
  const registry = db.collection("plugin_registry");
  const installs = db.collection("plugin_installations");
  await registry.updateOne(
    { key: "sample-plugin" },
    {
      $set: {
        key: "sample-plugin",
        name: "Sample Plugin",
        version: "1.0.0",
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );
  await installs.updateOne(
    { tenantId: new ObjectId(tenantId), pluginKey: "sample-plugin" },
    {
      $set: {
        tenantId: new ObjectId(tenantId),
        pluginKey: "sample-plugin",
        enabled: true,
        settings: {},
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true },
  );

  console.log("Seed complete. Login with:");
  console.log("tenant: demo");
  console.log("email: admin@demo.local");
  console.log("password: Password123!");

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
