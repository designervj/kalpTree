import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db/mongodb';
import { User, UserRole, UIConfiguration, ActivityLog, FranchiseClient } from '@/types';
import { RoleManager, DEFAULT_USER_PERMISSIONS } from './roles';

export class RBACService {
  private static db = getDb();

  // User role management
  static async updateUserRole(userId: ObjectId, newRole: UserRole, updatedBy: ObjectId): Promise<void> {
    const db = await this.db;

    // Get default permissions for the new role
    const defaultPermissions = DEFAULT_USER_PERMISSIONS[newRole];

    await db.collection('users').updateOne(
      { _id: userId },
      {
        $set: {
          role: newRole,
          permissions: defaultPermissions,
          updatedAt: new Date(),
        },
      }
    );

    // Log the role change
    await this.logActivity(userId, updatedBy, 'role_change', 'user', userId, {
      newRole,
      timestamp: new Date(),
    });
  }

  // Permission checking
  static async hasPermission(
    userId: ObjectId,
    resource: string,
    action: string,
    context?: {
      resourceId?: ObjectId;
      tenantId?: ObjectId;
      isOwn?: boolean;
    }
  ): Promise<boolean> {
    const db = await this.db;
    const user = await db.collection('users').findOne({ _id: userId }) as User | null;

    if (!user) return false;

    // Ensure role exists on the user object
    if (!user.role) return false;

    // Check role-based permissions
    const hasRolePermission = RoleManager.hasPermission(
      user.role,
      resource,
      action,
      {
        isOwn: context?.isOwn,
        isTenantLevel: context?.tenantId?.equals(user.tenantId),
        isFranchiseLevel: await this.isFranchiseLevel(user?.tenantId, context?.tenantId),
      }
    );

    if (!hasRolePermission) return false;

    // Check user-specific permissions
    const userPermissions = user.permissions;
    if (!userPermissions) return false;

    // Check if user has the specific permission
    const resourcePermissions = userPermissions[resource as keyof typeof userPermissions];
    if (Array.isArray(resourcePermissions)) {
      return resourcePermissions.includes(action);
    }

    if (typeof resourcePermissions === 'boolean') {
      return resourcePermissions;
    }

    if (typeof resourcePermissions === 'object' && resourcePermissions !== null) {
      return (resourcePermissions as any)[action] === true;
    }

    return false;
  }

  // Check if a tenant is at franchise level relative to another tenant
  private static async isFranchiseLevel(userTenantId: ObjectId, targetTenantId?: ObjectId): Promise<boolean> {
    if (!targetTenantId) return false;

    const db = await this.db;
    const targetTenant = await db.collection('tenants').findOne({ _id: targetTenantId });

    return targetTenant?.parentTenantId?.equals(userTenantId) || false;
  }

  // UI Configuration management
  static async getUIConfiguration(tenantId: ObjectId, role: UserRole): Promise<UIConfiguration | null> {
    const db = await this.db;
    return await db.collection('ui_configurations').findOne({
      tenantId,
      role,
    }) as UIConfiguration | null;
  }

  static async updateUIConfiguration(config: Partial<UIConfiguration>): Promise<void> {
    const db = await this.db;
    await db.collection('ui_configurations').updateOne(
      { tenantId: config.tenantId, role: config.role },
      {
        $set: {
          ...config,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  // Franchise-Client relationship management
  static async createFranchiseClientRelationship(
    franchiseId: ObjectId,
    clientTenantId: ObjectId,
    relationshipData: Partial<FranchiseClient>
  ): Promise<ObjectId> {
    const db = await this.db;

    const relationship: Omit<FranchiseClient, '_id'> = {
      tenantId: franchiseId, // The franchise tenant
      franchiseId,
      clientTenantId,
      relationshipType: relationshipData.relationshipType || 'direct',
      commissionRate: relationshipData.commissionRate,
      status: 'active',
      settings: relationshipData.settings || {
        allowDirectAccess: true,
        shareAnalytics: false,
        customBranding: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('franchise_clients').insertOne(relationship);
    return result.insertedId;
  }

  static async getFranchiseClients(franchiseId: ObjectId): Promise<FranchiseClient[]> {
    const db = await this.db;
    return await db.collection('franchise_clients')
      .find({ franchiseId, status: 'active' })
      .toArray() as FranchiseClient[];
  }

  static async updateFranchiseClientRelationship(
    relationshipId: ObjectId,
    updates: Partial<FranchiseClient>
  ): Promise<void> {
    const db = await this.db;
    await db.collection('franchise_clients').updateOne(
      { _id: relationshipId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );
  }

  // Activity logging
  static async logActivity(
    tenantId: ObjectId,
    userId: ObjectId,
    action: string,
    resource: string,
    resourceId?: ObjectId,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const db = await this.db;

    const log: Omit<ActivityLog, '_id'> = {
      tenantId,
      userId,
      action,
      resource,
      resourceId,
      details: {
        metadata: details,
      },
      ipAddress,
      userAgent,
      createdAt: new Date(),
    };

    await db.collection('activity_logs').insertOne(log);
  }

  // Get activity logs with filtering
  static async getActivityLogs(
    tenantId: ObjectId,
    filters?: {
      userId?: ObjectId;
      resource?: string;
      action?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      skip?: number;
    }
  ): Promise<ActivityLog[]> {
    const db = await this.db;

    const query: any = { tenantId };

    if (filters?.userId) query.userId = filters.userId;
    if (filters?.resource) query.resource = filters.resource;
    if (filters?.action) query.action = filters.action;
    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    return await db.collection('activity_logs')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(filters?.limit || 100)
      .skip(filters?.skip || 0)
      .toArray() as ActivityLog[];
  }

  // User management with role restrictions
  static async canUserManageUser(managerId: ObjectId, targetUserId: ObjectId): Promise<boolean> {
    const db = await this.db;

    const [manager, target] = await Promise.all([
      db.collection('users').findOne({ _id: managerId }) as Promise<User | null>,
      db.collection('users').findOne({ _id: targetUserId }) as Promise<User | null>,
    ]);

    if (!manager || !target) return false;

    // Check if manager can manage the target user's role
    return RoleManager.canManageRole(manager.role, target.role);
  }

  // Get users that a role can manage
  static async getManageableUsers(managerId: ObjectId, tenantId: ObjectId): Promise<User[]> {
    const db = await this.db;

    const manager = await db.collection('users').findOne({ _id: managerId }) as User | null;
    if (!manager) return [];

    const manageableRoles = RoleManager.getManageableRoles(manager.role);

    return await db.collection('users')
      .find({
        tenantId,
        role: { $in: manageableRoles },
        status: 'active',
      })
      .toArray() as User[];
  }

  // Tenant hierarchy management
  static async canAccessTenant(userId: ObjectId, targetTenantId: ObjectId): Promise<boolean> {
    const db = await this.db;

    const user = await db.collection('users').findOne({ _id: userId }) as User | null;
    if (!user) return false;

    // Admin can access all tenants
    if (user.role === 'A') return true;

    // User can access their own tenant
    if (user.tenantId.equals(targetTenantId)) return true;

    // Franchise can access their client tenants
    if (user.role === 'F') {
      const relationship = await db.collection('franchise_clients').findOne({
        franchiseId: user.tenantId,
        clientTenantId: targetTenantId,
        status: 'active',
      });
      return !!relationship;
    }

    return false;
  }

  // Get accessible tenants for a user
  static async getAccessibleTenants(userId: ObjectId): Promise<ObjectId[]> {
    const db = await this.db;

    const user = await db.collection('users').findOne({ _id: userId }) as User | null;
    if (!user) return [];

    const accessibleTenants = [user.tenantId];

    // Admin can access all tenants
    if (user.role === 'A') {
      const allTenants = await db.collection('tenants').find({}, { projection: { _id: 1 } }).toArray();
      return allTenants.map(t => t._id);
    }

    // Franchise can access their client tenants
    if (user.role === 'F') {
      const relationships = await db.collection('franchise_clients')
        .find({ franchiseId: user.tenantId, status: 'active' })
        .toArray() as FranchiseClient[];

      relationships.forEach(rel => {
        accessibleTenants.push(rel.clientTenantId);
      });
    }

    return accessibleTenants;
  }
}