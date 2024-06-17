import { auth } from "@/auth";
import Builder from "./components/Builder";
import queryUser from "../lib/actions/queryUser";

export default async function Page() {
    const session = await auth();

    //console.log(session);

    const username = await queryUser(session.user.email);
    if (!username) {
        redirect('/signup');
    }

    return (
        <Builder username={username}/>
    )
}