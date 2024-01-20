import { SignInButton } from "@clerk/nextjs";
import NavBar from "../components/NavBar";

function Header({title}) {
  return <h1>{title}</h1>;
}

export default function Home() {
  return (
    <>
    <Header title='What the zuck'/>
    <SignInButton mode="modal" afterSignInUrl="/home">
      <button>Sign In lol</button>
    </SignInButton>
    </>
  )
}
