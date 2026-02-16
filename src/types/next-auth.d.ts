import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    tenantId: string;
    role: string;
    permissions: string[];
    name?: string; // Made optional
    email: string;
    createdById?: string; // Made optional
    tenantdetail?: any;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string; // Made optional
      tenantId: string;
      role: string;
      permissions: string[];
      createdById?: string;
      tenantdetail?: any; // Made optional
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    email: string;
    tenantId: string;
    role: string;
    permissions: string[];
    name?: string; // Made optional
    createdById?: string; // Made optional
    tenantdetail?: any;
  }
}
