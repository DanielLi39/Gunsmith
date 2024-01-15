'use client';

import { register } from "../auth_actions/register";

export default function RegisterForm() {
    return (
        <div className="bg-neutral-300">
            <form action={register}>
                <input name="username"/>
                <input name="password"/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}