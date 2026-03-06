'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  Palette,
  UserPlus,
  BarChart3,
  Shield,
  Eye,
  Edit,
  Briefcase,
  UserCheck
} from 'lucide-react';
import { NavigationItem, UserRole } from '@/types';
import { RoleManager } from '@/lib/rbac/roles';

interface RoleBasedNavigationProps {
  className?: string;
}

const ROLE_NAVIGATION: Record<UserRole, NavigationItem[]> = {
  // Admin - Full access
  A: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      href: '/admin',
      permissions: ['dashboard:view'],
      roles: ['A', 'F', 'B', 'C', 'D', 'E', 'G'],
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      href: '/admin/users',
      permissions: ['users:read'],
      roles: ['A', 'F', 'B'],
    },
    {
      id: 'tenants',
      label: 'Tenant Management',
      icon: 'Building2',
      href: '/admin/tenants',
      permissions: ['tenants:read'],
      roles: ['A'],
    },
    {
      id: 'products',
      label: 'Products',
      icon: 'Package',
      href: '/admin/products',
      permissions: ['products:read'],
      roles: ['A', 'F', 'B', 'D', 'E'],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: 'ShoppingCart',
      href: '/admin/orders',
      permissions: ['orders:read'],
      roles: ['A', 'F', 'B', 'C', 'E'],
    },
    {
      id: 'content',
      label: 'Content',
      icon: 'FileText',
      href: '/admin/content',
      permissions: ['content:read'],
      roles: ['A', 'F', 'D', 'E', 'G'],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      href: '/admin/analytics',
      permissions: ['analytics:view'],
      roles: ['A', 'F', 'B'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      href: '/admin/settings',
      permissions: ['settings:read'],
      roles: ['A', 'F', 'D'],
      children: [
        {
          id: 'branding',
          label: 'Branding',
          icon: 'Palette',
          href: '/admin/settings/branding',
          permissions: ['settings:branding'],
          roles: ['A', 'F', 'D'],
        },
      ],
    },
  ],

  // Franchise - Client management and white-labeling
  F: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      href: '/admin',
      permissions: ['dashboard:view'],
      roles: ['F'],
    },
    {
      id: 'clients',
      label: 'Client Management',
      icon: 'UserPlus',
      href: '/admin/franchise/clients',
      permissions: ['franchise:manage_clients'],
      roles: ['F'],
    },
    {
      id: 'users',
      label: 'Team Management',
      icon: 'Users',
      href: '/admin/users',
      permissions: ['users:read'],
      roles: ['F'],
    },
    {
      id: 'products',
      label: 'Products',
      icon: 'Package',
      href: '/admin/products',
      permissions: ['products:read'],
      roles: ['F'],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: 'ShoppingCart',
      href: '/admin/orders',
      permissions: ['orders:read'],
      roles: ['F'],
    },
    {
      id: 'content',
      label: 'Content',
      icon: 'FileText',
      href: '/admin/content',
      permissions: ['content:read'],
      roles: ['F'],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      href: '/admin/analytics',
      permissions: ['analytics:view'],
      roles: ['F'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      href: '/admin/settings',
      permissions: ['settings:read'],
      roles: ['F'],
      children: [
        {
          id: 'branding',
          label: 'White-labeling',
          icon: 'Palette',
          href: '/admin/settings/branding',
          permissions: ['settings:branding'],
          roles: ['F'],
        },
      ],
    },
  ],

  // Business - Operations focused
  B: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      href: '/admin',
      permissions: ['dashboard:view'],
      roles: ['B'],
    },
    {
      id: 'products',
      label: 'Inventory',
      icon: 'Package',
      href: '/admin/products',
      permissions: ['products:read'],
      roles: ['B'],
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: 'ShoppingCart',
      href: '/admin/orders',
      permissions: ['orders:read'],
      roles: ['B'],
    },
    {
      id: 'analytics',
      label: 'Reports',
      icon: 'BarChart3',
      href: '/admin/analytics',
      permissions: ['analytics:view'],
      roles: ['B'],
    },
    {
      id: 'users',
      label: 'Team',
      icon: 'Users',
      href: '/admin/users',
      permissions: ['users:read'],
      roles: ['B'],
    },
  ],

  // Client - Limited access
  C: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      href: '/admin',
      permissions: ['dashboard:view'],
      roles: ['C'],
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: 'ShoppingCart',
      href: '/admin/orders',
      permissions: ['orders:read'],
      roles: ['C'],
    },
    {
      id: 'products',
      label: 'Catalog',
      icon: 'Package',
      href: '/admin/products',
      permissions: ['products:read'],
      roles: ['C'],
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'UserCheck',
      href: '/admin/profile',
      permissions: ['client:edit_profile'],
      roles: ['C'],
    },
  ],

  // Designer - Content and design focused
  D: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      href: '/admin',
      permissions: ['dashboard:view'],
      roles: ['D'],
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: 'FileText',
      href: '/admin/content',
      permissions: ['content:read'],
      roles: ['D'],
    },
    {
      id: 'products',
      label: 'Product Design',
      icon: 'Package',
      href: '/admin/products',
      permissions: ['products:read'],
      roles: ['D'],
    },
    {
      id: 'branding',
      label: 'Branding',
      icon: 'Palette',
      href: '/admin/settings/branding',
      permissions: ['settings:branding'],
      roles: ['D'],
    },
  ],

  // Editor - Content editing
  E: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      href: '/admin',
      permissions: ['dashboard:view'],
      roles: ['E'],
    },
    {
      id: 'content',
      label: 'Content Editor',
      icon: 'Edit',
      href: '/admin/content',
      permissions: ['content:read'],
      roles: ['E'],
    },
    {
      id: 'products',
      label: 'Product Content',
      icon: 'Package',
      href: '/admin/products',
      permissions: ['products:read'],
      roles: ['E'],
    },
    {
      id: 'orders',
      label: 'Order Status',
      icon: 'ShoppingCart',
      href: '/admin/orders',
      permissions: ['orders:read'],
      roles: ['E'],
    },
  ],

  // Guest - Read-only access
  G: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'Eye',
      href: '/admin',
      permissions: ['dashboard:view'],
      roles: ['G'],
    },
    {
      id: 'content',
      label: 'View Content',
      icon: 'FileText',
      href: '/admin/content',
      permissions: ['content:read'],
      roles: ['G'],
    },
    {
      id: 'products',
      label: 'View Products',
      icon: 'Package',
      href: '/admin/products',
      permissions: ['products:read'],
      roles: ['G'],
    },
  ],
};

const ICON_MAP = {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  Palette,
  UserPlus,
  BarChart3,
  Shield,
  Eye,
  Edit,
  Briefcase,
  UserCheck,
};

export default function RoleBasedNavigation({ className }: RoleBasedNavigationProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);

  useEffect(() => {
    if (session?.user?.role) {
      const userRole = session.user.role as UserRole;
      const items = ROLE_NAVIGATION[userRole] || [];

      // Filter items based on user's actual permissions
      const filteredItems = items.filter(item => {
        // Check if user's role is in the allowed roles for this item
        return item.roles.includes(userRole);
      });

      setNavigationItems(filteredItems);
    }
  }, [session]);

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
    const isActive = pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className={`ml-${level * 4}`}>
        <Link
          href={item.href || '#'}
          className={`
            flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
            ${isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }
          `}
        >
          {IconComponent && <IconComponent className="mr-3 h-4 w-4" />}
          {item.label}
        </Link>

        {hasChildren && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!session?.user?.role) {
    return null;
  }

  return (
    <nav className={`space-y-1 ${className}`}>
      {navigationItems.map(item => renderNavigationItem(item))}
    </nav>
  );
}