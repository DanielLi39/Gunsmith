import { signOut } from "@/auth"
 
export function SignOutButton( {hide} ) {
  return (
    <form className={hide ? 'hidden' : undefined}
      action={async () => {
        "use server"
        await signOut({ redirectTo: "/"})
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  )
}