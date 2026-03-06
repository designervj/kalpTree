# Quick Start: Adding a New Entity

## 🚀 5-Minute Guide

Want to add a new entity like "product", "order", or "customer"? Follow these simple steps:

---

## ✅ Checklist

- [ ] Step 1: Create database operations
- [ ] Step 2: Add to entity config
- [ ] Step 3: Create UI component
- [ ] Step 4: Register component
- [ ] Step 5: Test it out!

---

## Step 1: Create Database Operations (5 minutes)

Create file: `src/lib/material/product.ts`

```typescript
import { getDb } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function createProduct(data: any) {
  const db = await getDb();
  const result = await db.collection("products").insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
}

export async function listProducts(websiteId: string) {
  const db = await getDb();
  const query = websiteId ? { websiteId } : {};
  return await db.collection("products").find(query).toArray();
}

export async function getProductById(id: string) {
  const db = await getDb();
  return await db.collection("products").findOne({ _id: new ObjectId(id) });
}

export async function updateProduct(id: string, data: any) {
  const db = await getDb();
  const { _id, ...updateData } = data;
  const result = await db
    .collection("products")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: "after" },
    );
  return result;
}

export async function deleteProduct(id: string) {
  const db = await getDb();
  const result = await db
    .collection("products")
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
```

**✅ Done!** You now have all CRUD operations.

---

## Step 2: Add to Entity Config (1 minute)

Edit: `src/lib/entities/entityConfig.ts`

```typescript
// Add this import at the top
import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/material/product";

// Add this to entityConfig object
export const entityConfig: Record<string, EntityOperations> = {
  category: {
    /* existing */
  },
  brand: {
    /* existing */
  },
  attribute: {
    /* existing */
  },

  // 👇 Add your new entity here
  product: {
    create: createProduct,
    list: listProducts,
    getById: getProductById,
    update: updateProduct,
    delete: deleteProduct,
  },
};
```

**✅ Done!** API routes now work for `/api/admin/product`

---

## Step 3: Create UI Component (3 minutes)

Create folder: `src/components/admin/product/`

Create file: `src/components/admin/product/ProductHome.tsx`

```typescript
"use client"
import React from "react";
import GetAllProduct from "./productList/GetAllProduct";
import ProductTable from "./productList/ProductTable";

const ProductHome = () => {
  return (
    <>
      <GetAllProduct />
      <ProductTable />
    </>
  );
};

export default ProductHome;
```

Create file: `src/components/admin/product/productList/GetAllProduct.tsx`

```typescript
"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
// import your Redux actions here

const GetAllProduct = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch products
    // dispatch(fetchProducts());
  }, [dispatch]);

  return null;
};

export default GetAllProduct;
```

Create file: `src/components/admin/product/productList/ProductTable.tsx`

```typescript
"use client"
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ProductTable = () => {
  // const products = useSelector((state: RootState) => state.product.list);

  return (
    <div>
      <h2>Products</h2>
      {/* Your table component here */}
    </div>
  );
};

export default ProductTable;
```

**✅ Done!** You have the basic UI structure.

---

## Step 4: Register Component (30 seconds)

Edit: `src/components/admin/EntityRegistry.tsx`

```typescript
// Add import
import ProductHome from "./product/ProductHome";

// Add to entityComponents
export const entityComponents: Record<string, React.ComponentType> = {
  category: CategoryHome,
  brand: BrandHome,
  attribute: AttributeHome,

  // 👇 Add your new entity here
  product: ProductHome,
};
```

**✅ Done!** The page now renders your component.

---

## Step 5: Test It Out! (1 minute)

### Test the Frontend

Open your browser:

```
http://localhost:3000/admin/product
```

You should see your ProductHome component!

### Test the API

**Create a product:**

```bash
curl -X POST http://localhost:3000/api/admin/product \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "websiteId": "your-website-id"
  }'
```

**Get all products:**

```bash
curl http://localhost:3000/api/admin/product?websiteId=your-website-id
```

**Get single product:**

```bash
curl http://localhost:3000/api/admin/product?id=product-id
```

**Update a product:**

```bash
curl -X PATCH http://localhost:3000/api/admin/product \
  -H "Content-Type: application/json" \
  -d '{
    "id": "product-id",
    "name": "Updated Product",
    "price": 149.99
  }'
```

**Delete a product:**

```bash
curl -X DELETE http://localhost:3000/api/admin/product?id=product-id
```

---

## 🎉 Congratulations!

You've successfully added a new entity! The system now:

- ✅ Has API endpoints for all CRUD operations
- ✅ Renders your UI component at `/admin/product`
- ✅ Validates requests automatically
- ✅ Handles errors gracefully

---

## 📝 Optional: Add Type Safety

Create file: `src/components/admin/product/types/productModel.ts`

```typescript
import { ObjectId } from "mongodb";

export interface Product {
  _id?: string | ObjectId;
  id?: number | string | ObjectId;
  websiteId?: string | ObjectId;
  tenantId?: string | ObjectId;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stock?: number;
  images?: string[];
  category_id?: string | ObjectId;
  brand_id?: string | ObjectId;
  attributes?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
```

---

## 🐛 Troubleshooting

### Entity not found error

- ✅ Check spelling in entityConfig.ts and EntityRegistry.tsx
- ✅ Make sure imports are correct
- ✅ Restart your dev server

### API returns 400 error

- ✅ Verify entity is in entityConfig
- ✅ Check that all 5 operations are defined (create, list, getById, update, delete)

### Component not rendering

- ✅ Verify component is in EntityRegistry
- ✅ Check that component exports default
- ✅ Look for errors in browser console

---

## 💡 Pro Tips

### 1. Copy Existing Entity

The fastest way is to copy an existing entity:

```bash
# Copy category to product
cp -r src/components/admin/category src/components/admin/product
cp src/lib/material/category.ts src/lib/material/product.ts

# Then find/replace "category" → "product"
```

### 2. Use Code Snippets

Create VS Code snippets for faster entity creation:

```json
{
  "New Entity Operations": {
    "prefix": "entity-ops",
    "body": [
      "export async function create${1:Entity}(data: any) {",
      "  const db = await getDb();",
      "  return await db.collection('${2:entities}').insertOne(data);",
      "}",
      "",
      "export async function list${1:Entity}s(websiteId: string) {",
      "  const db = await getDb();",
      "  return await db.collection('${2:entities}').find({ websiteId }).toArray();",
      "}",
      "// ... rest of CRUD operations"
    ]
  }
}
```

### 3. Test As You Go

Don't wait until the end to test. Test each step:

1. Create operations → Test with curl
2. Add to config → Test API endpoint
3. Create component → Check /admin/entity
4. Register component → Verify everything works

---

## 📚 Next Steps

1. **Add Redux/State Management**
   - Create slice for your entity
   - Add actions and reducers
   - Connect to components

2. **Add Form Validation**
   - Use Zod or Yup for schemas
   - Add to entityConfig

3. **Add Permissions**
   - Check user roles before operations
   - Use RBAC system

4. **Enhance UI**
   - Add DataTable with sorting/filtering
   - Add form modals
   - Add delete confirmations

---

## 🆘 Need Help?

- Check `DYNAMIC_ENTITY_SYSTEM.md` for detailed documentation
- Check `ARCHITECTURE.md` for system architecture
- Check `REFACTORING_SUMMARY.md` for before/after comparison
- Look at existing entities (category, brand, attribute) as examples

---

**Happy coding! 🚀**
