# Role-Based Access Control (RBAC) System

## Overview

This document describes the comprehensive Role-Based Access Control (RBAC) system implemented for the KalpTree admin dashboard. The system provides dynamic user management, franchise white-labeling capabilities, and granular permission control across multiple tenant levels.

## Role Hierarchy

The system implements a 7-tier role hierarchy with specific permissions and capabilities:

### A - Admin (Platform Super Admin)

- **Level**: 1 (Highest Authority)
- **Description**: Platform administrator with full system access
- **Capabilities**:
  - Full CRUD operations on all resources
  - User and tenant management
  - System configuration and settings
  - Analytics and reporting
  - Platform-wide oversight

### F - Franchise (Sub-admin with White-labeling)

- **Level**: 2
- **Description**: Franchise owner with client management and white-labeling capabilities
- **Capabilities**:
  - Create and manage client tenants
  - White-label admin panel customization
  - Team management within franchise
  - Client relationship management
  - Franchise-level analytics
  - Custom branding and theming

### B - Business (Operations Manager)

- **Level**: 3
- **Description**: Business operations manager with inventory and order management
- **Capabilities**:
  - Inventory management
  - Order processing and fulfillment
  - Business reports and analytics
  - Team coordination
  - Operational oversight

### C - Client (Customer)

- **Level**: 4
- **Description**: Client with access to own data and order placement
- **Capabilities**:
  - View own orders and data
  - Place new orders
  - Edit personal profile
  - Access client-specific features
  - Limited dashboard access

### D - Designer (Content and Design)

- **Level**: 4
- **Description**: Designer with content creation and branding capabilities
- **Capabilities**:
  - Content creation and management
  - Product design and presentation
  - Branding customization
  - Visual asset management
  - Design system maintenance

### E - Editor (Content Management)

- **Level**: 5
- **Description**: Content editor with publishing capabilities
- **Capabilities**:
  - Content editing and publishing
  - Product content management
  - Blog and page management
  - SEO optimization
  - Content workflow management

### G - Guest (Read-only Access)

- **Level**: 6 (Lowest Authority)
- **Description**: Guest user with read-only access
- **Capabilities**:
  - View dashboard
  - Read-only access to content
  - Browse product catalog
  - Limited system interaction

## Permission System

### Core Permissions

The system uses a resource-action based permission model:

```typescript
interface Permission {
  resource: string; // e.g., 'users', 'products', 'orders'
  actions: string[]; // e.g., ['create', 'read', 'update', 'delete']
  conditions?: {
    own?: boolean; // Can only access own resources
    tenantLevel?: boolean; // Can access tenant-level resources
    franchiseLevel?: boolean; // Can access franchise-level resources
  };
}
```

### Permission Categories

1. **Dashboard Permissions**: `dashboard:view`
2. **User Management**: `users:create`, `users:read`, `users:update`, `users:delete`
3. **Tenant Management**: `tenants:create`, `tenants:read`, `tenants:update`, `tenants:delete`
4. **Product Management**: `products:create`, `products:read`, `products:update`, `products:delete`
5. **Order Management**: `orders:create`, `orders:read`, `orders:update`, `orders:process`
6. **Content Management**: `content:create`, `content:read`, `content:update`, `content:publish`
7. **Settings**: `settings:read`, `settings:update`, `settings:branding`
8. **Franchise-specific**: `franchise:create_clients`, `franchise:manage_clients`, `franchise:white_label`
9. **Analytics**: `analytics:view`, `analytics:export`

## White-labeling System

### Branding Customization

Franchises can customize their admin panel appearance through:

#### Color Schemes

- Primary, secondary, and accent colors
- Background and foreground colors
- Border and input styling
- Muted colors for subtle elements

#### Logo Management

- Logo upload and configuration
- Dimension control (50-500px width, 20-200px height)
- Format support: PNG, SVG, JPG

#### Typography

- Heading font selection
- Body font selection
- Custom font integration

#### Advanced Customization

- Custom CSS injection
- CSS variable system
- Safety validation for malicious code

### Branding Presets

Pre-configured themes for quick setup:

- **Default**: Blue-based professional theme
- **Dark**: Dark mode with blue accents
- **Green**: Nature-inspired green theme
- **Purple**: Royal purple theme
- **Red**: Bold red theme

## Franchise Management

### Client Creation Flow

Franchises can create client tenants with:

1. **Business Information**
   - Company name and contact details
   - Subdomain configuration
   - Custom domain support

2. **Admin User Setup**
   - Admin user creation
   - Temporary password assignment
   - Role assignment (typically 'C' for clients)

3. **Relationship Configuration**
   - Relationship type (direct, referral, partnership)
   - Commission rate settings
   - Access permissions

4. **Feature Configuration**
   - Direct access permissions
   - Analytics sharing
   - Custom branding allowance

### Client Management Features

- Client listing and monitoring
- Relationship status tracking
- Commission management
- Access control configuration
- Analytics sharing controls

## API Endpoints

### User Management

- `GET /api/admin/users` - List manageable users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### Branding Management

- `GET /api/admin/branding` - Get branding settings
- `PUT /api/admin/branding` - Update branding settings
- `POST /api/admin/branding/presets` - Apply branding preset
- `POST /api/admin/branding/logo` - Upload logo

### Franchise Management

- `GET /api/admin/franchise/clients` - List franchise clients
- `POST /api/admin/franchise/clients` - Create new client
- `PUT /api/admin/franchise/clients/[id]` - Update client
- `DELETE /api/admin/franchise/clients/[id]` - Remove client

## Middleware System

### RBAC Middleware

```typescript
withRBAC({
  resource: "users",
  action: "create",
  requireTenantAccess: true,
  allowSuperAdmin: true,
});
```

### Tenant Isolation

Ensures data isolation between tenants:

- Automatic tenant filtering
- Cross-tenant access prevention
- Hierarchical access for franchises

### Resource Ownership

Validates resource ownership for user-specific data:

- Own resource access validation
- Ownership-based permissions
- Secure resource isolation

## Security Features

### Permission Validation

- Hierarchical role checking
- Context-aware permissions
- Tenant-level isolation
- Resource ownership validation

### Audit Logging

- Activity tracking for all actions
- User action logging
- Resource change tracking
- Security event monitoring

### Data Protection

- Tenant data isolation
- Encrypted sensitive data
- Secure password handling
- Input validation and sanitization

## Usage Examples

### Checking Permissions

```typescript
import { RoleManager } from "@/lib/rbac/roles";

// Check if user can create users
const canCreate = RoleManager.hasPermission("F", "users", "create", {});

// Check role hierarchy
const canManage = RoleManager.canManageRole("F", "C");

// Get manageable roles
const manageableRoles = RoleManager.getManageableRoles("F");
```

### Using Middleware

```typescript
import { withRBAC } from "@/middleware/rbac";

export const GET = withRBAC({
  resource: "users",
  action: "read",
  requireTenantAccess: true,
})(async (request, { user, tenantId }) => {
  // Handler with validated access
});
```

### Branding Customization

```typescript
import { BrandingService } from "@/lib/branding/branding-service";

// Update branding
await BrandingService.updateBrandingSettings(
  tenantId,
  {
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
    },
  },
  userId,
);

// Apply preset
await BrandingService.applyBrandingPreset(tenantId, "dark", userId);
```

## Database Schema

### Users Collection

```typescript
interface User {
  _id: ObjectId;
  tenantId: ObjectId;
  email: string;
  name: string;
  role: UserRole;
  permissions: UserPermissions;
  status: "active" | "invited" | "suspended";
  metadata?: UserMetadata;
}
```

### Tenants Collection

```typescript
interface Tenant {
  _id: ObjectId;
  slug: string;
  name: string;
  type: "platform" | "franchise" | "business" | "client";
  parentTenantId?: ObjectId;
  branding: BrandingSettings;
  features: FeatureFlags;
  status: "active" | "suspended" | "pending";
}
```

### Franchise-Client Relationships

```typescript
interface FranchiseClient {
  _id: ObjectId;
  tenantId: ObjectId;
  franchiseId: ObjectId;
  clientTenantId: ObjectId;
  relationshipType: "direct" | "referral" | "partnership";
  status: "active" | "suspended" | "terminated";
  settings: RelationshipSettings;
}
```

## Testing

The system includes comprehensive tests covering:

- Role permission validation
- Hierarchy enforcement
- Security boundary testing
- Branding system validation
- Performance testing
- Error handling
- Integration testing

Run tests with:

```bash
npm test src/tests/rbac-system.test.ts
```

## Performance Considerations

- Permission checks are optimized for sub-millisecond response
- CSS generation is cached and efficient
- Database queries use proper indexing
- Middleware overhead is minimal
- Role definitions are cached in memory

## Migration Guide

### From Basic Roles to RBAC

1. **Update User Schema**: Add new role field and permissions
2. **Migrate Existing Users**: Map old roles to new role system
3. **Update API Endpoints**: Implement RBAC middleware
4. **Update UI Components**: Use role-based navigation
5. **Test Thoroughly**: Validate all permission scenarios

### Database Migration Script

```typescript
// Migration script to update existing users
async function migrateToRBAC() {
  const users = await db.collection("users").find({}).toArray();

  for (const user of users) {
    const newRole = mapOldRoleToNew(user.role);
    const permissions = DEFAULT_USER_PERMISSIONS[newRole];

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          role: newRole,
          permissions,
        },
      },
    );
  }
}
```

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check user role and permissions
   - Verify tenant access
   - Validate resource ownership

2. **Branding Not Applied**
   - Check CSS generation
   - Verify tenant branding settings
   - Clear browser cache

3. **Client Creation Fails**
   - Validate franchise permissions
   - Check slug uniqueness
   - Verify admin user data

### Debug Tools

- Activity logs for audit trail
- Permission checker utility
- Role hierarchy validator
- Branding preview system

## Future Enhancements

- Dynamic permission assignment
- Role templates and inheritance
- Advanced branding options
- Multi-language support
- Enhanced analytics dashboard
- API rate limiting per role
- Advanced audit reporting

## Support

For questions or issues with the RBAC system:

1. Check the test suite for examples
2. Review the API documentation
3. Examine the middleware implementation
4. Consult the role definitions
5. Test with the provided mock data

The system is designed to be extensible and maintainable, with clear separation of concerns and comprehensive documentation.
