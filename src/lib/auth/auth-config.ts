import { NextAuthConfig, CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userService } from "./user-service";
import { tenantService } from "../tenant/tenant-service";

class InvalidDomainError extends CredentialsSignin {
  code = "INVALID_DOMAIN"
}
class DomainNotFoundError extends CredentialsSignin {
  code = "DOMAIN_NOT_FOUND"
}
class InvalidTenantError extends CredentialsSignin {
  code = "INVALID_TENANT"
}
class InvalidCredentialsError extends CredentialsSignin {
  code = "INVALID_CREDENTIALS"
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isMainDomain: { label: "Is Main Domain", type: "boolean" },
        domain: { label: "Domain", type: "text" },
      },
      async authorize(credentials) {
        // Validate credentials exist
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.isMainDomain ||
          !credentials?.domain
        ) {
          throw new InvalidCredentialsError("Email and password are required");
        }

        try {
          const user = await userService.getUserByEmail(
            credentials.email as string,
          );
          // Check if user exists and is active

          if (!user || user.status !== "active") {
            throw new InvalidCredentialsError();
          }
        
          if(credentials?.domain==="kalptree.xyz"){
            if(user?.role!="superadmin"){
              throw new InvalidDomainError();
            }
          }
          if(credentials?.domain!="kalptree.xyz"){
            if(user?.role=="superadmin"){
              throw new InvalidDomainError();
            }
          }
          let businessTenant;
          let tenantdetail;

          const gettenant = await tenantService.getTenantById(
            user.tenantId?.toString() as string,
          );

          const getWebsite = await tenantService.getWebsiteByDomain(
            credentials?.domain as string,
          );

          if (!getWebsite) {
            throw new DomainNotFoundError();
          }

          // if ( getWebsite?._id?.toString() !== user.tenantId?.toString()) {
          //       if(user?.role!="agent")
          //   throw new InvalidDomainError();
          // }

          if (!gettenant) {
            throw new InvalidTenantError();
          }
          tenantdetail = gettenant;
          if (getWebsite) {
            businessTenant = getWebsite;
          }

          // Verify password
          const isValid = await userService.verifyPassword(
            user,
            credentials.password as string,
          );
          if (!isValid) {
            throw new InvalidCredentialsError();
          }

          // Update last login (don't await to avoid blocking)
          userService.updateLastLogin(user._id).catch((err) => {
            console.error("Failed to update last login:", err);
          });

          // Return user object
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            tenantId: user.tenantId!.toString(),
            role: user.role,
            permissions: user.permissions,
            createdById: user.createdById?.toString(), // Handle optional createdById
            businessTenant: businessTenant,
            tenantdetail: tenantdetail,
          };
        } catch (error: any) {
          console.error("Authorization error:", error);
          if (error instanceof CredentialsSignin) throw error;
          throw new InvalidCredentialsError(error.message || "Sign-in failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name ?? undefined;
        token.tenantId = user?.tenantId as string;
        token.role = user.role;
        token.permissions = user.permissions;
        token.createdById = user.createdById; // Will be undefined if not present
        token.tenantdetail = user.tenantdetail;
      }

      // Handle token refresh/update
      if (trigger === "update") {
        // You can refresh user data here if needed
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.userId;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.tenantId = token.tenantId;
        session.user.createdById = token.createdById; // Will be undefined if not present
        session.user.tenantdetail = token.tenantdetail;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production" ? ".kalptree.xyz" : undefined,
      },
    },
  },
};
