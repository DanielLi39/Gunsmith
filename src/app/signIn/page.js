import { SignIn } from "@clerk/nextjs";

export default function LoginForm() {
    return (
        <div className="h-screen w-screen flex justify-center items-center bg-neutral-300">
            <SignIn/>
        </div>
    );
}