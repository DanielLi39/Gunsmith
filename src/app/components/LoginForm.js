'use client';

import { authenticate } from "../auth_actions/authenticate";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginForm() {
    return (
        <div className="bg-neutral-200">
            <form className="flex flex-col justify-center" action={authenticate}>
                <input id="username" name="username" placeholder="Enter in username"/>
                <input id="password" name="password" placeholder="Enter in password"/>
                <button type="submit">Log in</button>
            </form>
        </div>
    );
}