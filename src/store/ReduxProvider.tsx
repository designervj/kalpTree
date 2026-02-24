"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useEffect } from "react";
import { getSession, SessionProvider } from "next-auth/react";
import { setUser } from "@/hooks/slices/user/userSlice";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // On client mount, try to rehydrate user from NextAuth session or from
    // sessionStorage/localStorage if a serialized user object is present.
    (async () => {
      try {
        const session = await getSession();

        if (session?.user) {
          const mappedUser = {
            email: session.user.email,
            name: session.user.name,
            ...(session.user as any),
          };
          store.dispatch(setUser(mappedUser));
          return;
        }

        // Fallback checks for common storage keys where a serialized user
        // object might be present. Adjust keys if your app uses different names.
        const keysToCheck = ["user", "currentUser", "authUser"];
        for (const key of keysToCheck) {
          const raw = sessionStorage.getItem(key) ?? localStorage.getItem(key);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              // Basic sanity: parsed should be an object with at least an email or name
              if (parsed && (parsed.email || parsed.name)) {
                store.dispatch(setUser(parsed));
                break;
              }
            } catch (e) {
              // not JSON, ignore
            }
          }
        }
      } catch (e) {
        // swallow; failing to rehydrate shouldn't break the app
        // console.warn("Failed to rehydrate user into redux:", e);
      }
    })();
  }, []);

  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
