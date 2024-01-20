import { SignUp } from "@clerk/nextjs";

export default function RegisterForm() {
    return (
        <div className="h-screen w-screen flex justify-center items-center bg-neutral-300">
            <SignUp/>
        </div>
    );
}