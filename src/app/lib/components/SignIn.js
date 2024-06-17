'use server';

import { signIn } from "@/auth"

export async function SignInButton( {hide} ) {
    //console.log("Sign in button hidden: ", hide);
    return (
        <form className={hide ? 'hidden' : undefined} action={async () => {
            "use server";
            await signIn("google", {redirectTo: "/signup"})
        }}>
            <button type="submit">Sign In</button>
        </form>
    )
}