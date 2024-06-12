import { auth } from "@/auth";
import Builder from "./components/Builder";

export default async function Page() {
    const session = await auth();
    
    return (
        <Builder session={session}/>
    )
}