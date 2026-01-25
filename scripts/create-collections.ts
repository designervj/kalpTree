import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI or DATABASE_URL not found in environment variables');
  process.exit(1);
}

async function createCollections() {
  const client = new MongoClient(MONGODB_URI!);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    // Use 'KalpTree' database explicitly
    const db = client.db('KalpTree');
    console.log('📂 Using database: KalpTree');

    // List of all collections to create
    const collections = [
      // Core Collections
      'tenants',
      'users',
      'custom_roles',
      'ui_configurations',
      'franchise_clients',

      // Website Collections
      'websites',
      'pages',
      'posts',

      'blog_tags',

      // Media Collections
      'media',
      'media_folders',

      // E-commerce Collections
      'products',
      'product_categories',
      'product_variants',
      'orders',
      'carts',

      // Billing Collections
      'invoices',
      'payments',
      'subscriptions',

      // System/Admin Collections
      'audit_logs',
      'activities',
      'activity_logs',
      'invitations',
      'password_reset_tokens',

      // Branding Collections
      'tenant_styles',

      // Plugin Collections
      'plugin_registry',
      'plugin_installations',
    ];

    console.log('\n📦 Creating collections...\n');

    // Get existing collections
    const existingCollections = await db.listCollections().toArray();
    const existingNames = existingCollections.map(c => c.name);

    let created = 0;
    let skipped = 0;

    for (const collectionName of collections) {
      if (existingNames.includes(collectionName)) {
        console.log(`⏭️  ${collectionName} - Already exists`);
        skipped++;
      } else {
        await db.createCollection(collectionName);
        console.log(`✅ ${collectionName} - Created`);
        created++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${collections.length}`);

    // Create indexes
    console.log('\n🔧 Creating indexes...\n');

    const indexes: Array<{ collection: string; index: any; options: any }> = [
      // Core
      { collection: 'tenants', index: { slug: 1 }, options: { unique: false, name: 'uniq_tenants_slug' } },
      { collection: 'users', index: { tenantId: 1, email: 1 }, options: { unique: true, name: 'uniq_users_tenant_email' } },
      { collection: 'users', index: { tenantId: 1, role: 1 }, options: { name: 'users_tenant_role' } },
      { collection: 'custom_roles', index: { tenantId: 1, name: 1 }, options: { unique: true, name: 'uniq_custom_roles_tenant_name' } },

      // Websites
      { collection: 'websites', index: { websiteId: 1 }, options: { unique: true, name: 'uniq_websites_id' } },
      { collection: 'websites', index: { tenantId: 1, createdAt: -1 }, options: { name: 'websites_tenant_createdAt' } },
      // { collection: 'websites', index: { systemSubdomain: 1 }, options: { unique: true, name: 'uniq_websites_sys_sub' } },
      // { collection: 'websites', index: { primaryDomain: 1 }, options: { unique: true, sparse: true, name: 'uniq_websites_primary_domain' } },

      // Website Content
      // { collection: 'pages', index: { tenantId: 1, websiteId: 1, slug: 1 }, options: { unique: true, name: 'uniq_pages_tenant_website_slug' } },
      { collection: 'posts', index: { tenantId: 1, websiteId: 1, slug: 1 }, options: { unique: true, name: 'uniq_posts_tenant_website_slug' } },
      { collection: 'categories', index: { tenantId: 1, websiteId: 1, slug: 1 }, options: { unique: true, name: 'uniq_categories_tenant_website_slug' } },
      { collection: 'blog_tags', index: { tenantId: 1, websiteId: 1, slug: 1 }, options: { unique: true, name: 'uniq_blog_tags_tenant_website_slug' } },
      { collection: 'media', index: { tenantId: 1, filename: 1 }, options: { name: 'media_tenant_filename' } },
      { collection: 'media_folders', index: { tenantId: 1, slug: 1 }, options: { unique: true, name: 'uniq_media_folders_tenant_slug' } },

      // Ecommerce
      { collection: 'products', index: { tenantId: 1, websiteId: 1, slug: 1 }, options: { unique: true, name: 'uniq_products_tenant_website_slug' } },
      { collection: 'products', index: { tenantId: 1, websiteId: 1, status: 1 }, options: { name: 'products_tenant_website_status' } },
      { collection: 'product_categories', index: { tenantId: 1, websiteId: 1, slug: 1 }, options: { unique: true, name: 'uniq_product_categories_tenant_website_slug' } },
      { collection: 'product_variants', index: { tenantId: 1, websiteId: 1, productId: 1, name: 1 }, options: { unique: true, name: 'uniq_variants_tenant_website_product_name' } },

      { collection: 'orders', index: { tenantId: 1, orderNumber: 1 }, options: { unique: true, name: 'uniq_orders_tenant_number' } },
      { collection: 'carts', index: { tenantId: 1, sessionId: 1 }, options: { name: 'carts_tenant_session' } },
      { collection: 'carts', index: { expiresAt: 1 }, options: { name: 'ttl_carts_expiry', expireAfterSeconds: 0 } },

      // Billing
      { collection: 'invoices', index: { tenantId: 1, invoiceNumber: 1 }, options: { unique: true, name: 'uniq_invoices_tenant_number' } },
      { collection: 'payments', index: { tenantId: 1, orderId: 1, status: 1 }, options: { name: 'payments_tenant_order_status' } },
      { collection: 'subscriptions', index: { tenantId: 1, status: 1 }, options: { name: 'subscriptions_tenant_status' } },

      // System
      { collection: 'audit_logs', index: { tenantId: 1, createdAt: -1 }, options: { name: 'audit_logs_tenant_createdAt' } },
      { collection: 'audit_logs', index: { expiresAt: 1 }, options: { name: 'ttl_audit_logs_expiry', expireAfterSeconds: 0 } },
      { collection: 'activities', index: { tenantId: 1, userId: 1, createdAt: -1 }, options: { name: 'activities_tenant_user_createdAt' } },
      { collection: 'invitations', index: { tenantId: 1, email: 1 }, options: { name: 'invitations_tenant_email' } },
      { collection: 'invitations', index: { expiresAt: 1 }, options: { name: 'ttl_invitations_expiry', expireAfterSeconds: 0 } },
      { collection: 'password_reset_tokens', index: { userId: 1, createdAt: -1 }, options: { name: 'pwd_reset_user_createdAt' } },
      { collection: 'password_reset_tokens', index: { expiresAt: 1 }, options: { name: 'ttl_password_reset_expiry', expireAfterSeconds: 0 } },

      // Plugins
      { collection: 'plugin_registry', index: { key: 1 }, options: { unique: true, name: 'uniq_plugin_registry_key' } },
      { collection: 'plugin_installations', index: { tenantId: 1, pluginKey: 1 }, options: { unique: true, name: 'uniq_plugin_install_tenant_plugin' } },
    ];

    let indexCreated = 0;
    let indexSkipped = 0;

    for (const { collection, index, options } of indexes) {
      try {
        await db.collection(collection).createIndex(index, options);
        console.log(`✅ ${collection}.${options.name}`);
        indexCreated++;
      } catch (error: any) {
        if (error.code === 85 || error.codeName === 'IndexOptionsConflict' || error.code === 86) {
          console.log(`⏭️  ${collection}.${options.name} - Already exists`);
          indexSkipped++;
        } else {
          console.log(`⚠️  ${collection}.${options.name} - Error: ${error.message}`);
        }
      }
    }

    console.log(`\n📊 Index Summary:`);
    console.log(`   Created: ${indexCreated}`);
    console.log(`   Skipped: ${indexSkipped}`);

    // Create text index for products separately (only one text index allowed per collection)
    try {
      await db.collection('products').createIndex({ name: 'text', description: 'text', tags: 'text' }, { name: 'text_index_products' });
      console.log('\n✅ Text index created for products');
    } catch (error: any) {
      if (error.code === 85 || error.codeName === 'IndexOptionsConflict') {
        console.log('\n⏭️  Text index for products already exists');
      } else {
        console.log('\n⚠️  Could not create text index for products:', error.message);
      }
    }

    console.log('\n✅ All indexes processed successfully\n');

    // Show final collection list
    console.log('📋 Final collection list:');
    const finalCollections = await db.listCollections().toArray();
    finalCollections.forEach(col => {
      if (collections.includes(col.name)) {
        console.log(`   ✓ ${col.name}`);
      }
    });

    console.log('\n✨ Database setup complete!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createCollections();
