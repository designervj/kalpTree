import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userService } from "./user-service";
import { tenantService } from "../tenant/tenant-service";

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
          throw new Error("Email and password are required");
        }

        try {
          // const getWebsite = await websiteService.getByHost(
          //   credentials.domain as string,
          // );

          // if (!getWebsite) {
          //   throw new Error("Invalid domain");
          // }

          // const tenantdetail = await tenantService.getTenantById(
          //   getWebsite?.tenantId?.toString() as string,
          // );

          // console.log("tenantdetail====", tenantdetail);
          const user = await userService.getUserByEmail(
            credentials.email as string,
          );
          // Check if user exists and is active

          if (!user || user.status !== "active") {
            throw new Error("Invalid credentials ");
          }
          // if (user.role != "superadmin") {
          //   throw new Error("Invalid domain");
          // }
          // Convert isMainDomain from string to boolean (NextAuth passes credentials as strings)
          // const isMainDomain =
          //   credentials.isMainDomain === "true" ||
          //   credentials.isMainDomain === true;
          // // const getTenantId =
          // //   user.role == "agency"
          // //     ? tenantdetail?.tenantId?.toString()
          // //     : tenantdetail?._id?.toString();
          // // console.log("userTenatId====", user.tenantId?.toString());
          // // console.log("getTenantId====", getTenantId);
          // if (
          //   !isMainDomain &&
          //  // user.tenantId?.toString() !== getTenantId &&
          //   user.role !== "superadmin"
          // ) {
          //   throw new Error("Invalid domain");
          // }

          // Verify password
          const isValid = await userService.verifyPassword(
            user,
            credentials.password as string,
          );
          // console.log("isValid=====", isValid);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          // Update last login (don't await to avoid blocking)
          userService.updateLastLogin(user._id).catch((err) => {
            console.error("Failed to update last login:", err);
          });

          const finaltenant = await tenantService.getTenantById(
            user.tenantId?.toString() as string,
          );

          // Return user object
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            tenantId: user.tenantId!.toString(),
            role: user.role,
            permissions: user.permissions,
            createdById: user.createdById?.toString(), // Handle optional createdById
            tenantdetail: {
              _id: finaltenant?._id.toString(),
              type: finaltenant?.type,
            },
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
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
        // const refreshedUser = await userService.getUserById(token.userId);
        // Update token with fresh data
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
  // cookies: {
  //   sessionToken: {
  //     name:
  //       process.env.NODE_ENV === "production"
  //         ? "__Secure-authjs.session-token"
  //         : "authjs.session-token",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //       domain:
  //         process.env.NODE_ENV === "production"
  //           ? ".kalptree.xyz" // 👈 FIXES www vs non-www
  //           : undefined,
  //     },
  //   },
  // },
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
