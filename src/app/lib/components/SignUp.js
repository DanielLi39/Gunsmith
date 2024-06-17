'use client';

import createUsername from "../actions/createUsername";
import { useFormState } from "react-dom";

export function SignUpForm( {email} ) {
    const [message, signUp] = useFormState(createUsername, null);

    return (
        <form action={signUp}>
            <label>
                Choose a username:
                <input type="text" name="username"/>
            </label>
            <input type="hidden" name="email" value={email}/>
            <button type="submit">Submit</button>
            <p>
                {(!!message && !message.success) && message.error}
            </p>
        </form>
    );
}