import { SignUpForm } from "../lib/components/SignUp";
import { auth } from "@/auth";

export default async function Home() {
    const session = await auth();

    return (
        <>
        <SignUpForm email={session.user.email}/>
        </>
    );
}