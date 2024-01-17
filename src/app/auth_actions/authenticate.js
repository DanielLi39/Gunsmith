'use server';

import { signIn } from "../../../auth";
import { AuthError } from "next-auth";

export async function authenticate(formData) {
    try {
        const creds = {
            username: formData.get("username"),
            password: formData.get("password")
        }
        
        await signIn('credentials', creds);
        
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid Credentials';
                default:
                    return 'Something went wrong';
            }
        }
        throw error;
    }
}