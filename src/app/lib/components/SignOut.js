import { signOut } from "@/auth"
 
export function SignOutButton( {hide} ) {
  //console.log("Sign out button hidden: ", hide);
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