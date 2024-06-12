'use server';

import { signIn } from "@/auth"

export async function SignInButton( {hide} ) {
    return (
        <form className={hide ? 'hidden' : undefined} action={async () => {
            "use server";
            await signIn("google")
        }}>
            <button type="submit">Sign In</button>
        </form>
    )
}