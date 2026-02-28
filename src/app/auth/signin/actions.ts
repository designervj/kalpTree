"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

interface LoginState {
    error?: string;
    success?: boolean;
}

export async function loginAction(
    prevState: any,
    formData: FormData
): Promise<LoginState> {
    try {
        await signIn("credentials", formData);
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            console.log("Server Action AuthError:", error.type, (error as any).code);
            // For CredentialsSignin, error.code is what we threw (e.g. 'INVALID_DOMAIN')
            return { error: (error as any).code || "Sign-in failed" };
        }
        // Next.js redirect errors should be thrown normally
        throw error;
    }
}

export async function loginWithObject(data: any): Promise<LoginState> {
    try {
        // In v5, we can call signIn directly with objects in actions
        // But it's better to pass it through a hidden form or just handle it here
        await signIn("credentials", {
            ...data,
            redirect: false // Ensure we don't redirect here so we can catch the error
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: (error as any).code || "Sign-in failed" };
        }
        // If it's a redirect (success), Next.js throws a redirect error
        if (error && typeof error === 'object' && 'digest' in error && (error.digest as string).startsWith('NEXT_REDIRECT')) {
            return { success: true };
        }

        return { error: "Something went wrong" };
    }
}
