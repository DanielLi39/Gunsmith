import LinkButton from "../lib/components/LinkButton";
import { SignOutButton } from "../lib/components/SignOut";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import queryUser from "../lib/actions/queryUser";

export default async function RootLayout({ children }) {
    const session = await auth();
    
    if (!session) {
      redirect('/signin');
    }

    const exists = await queryUser(session.user.email);

    if (exists) {
      redirect('/');
    }
    
    return (
      <>
        <div className='flex bg-sky-100 pt-4 pb-4 items-center justify-center space-x-5 hover:bg-blue-100'>
        <LinkButton link='/home' text='Home' text_details='font-semibold text-sky-950' button_details='rounded-lg shadow-lg bg-violet-100 hover:bg-violet-200 px-3 py-2'/>
        <SignOutButton hide={false}/>
      </div>  
        {children}
      </>
    )
  }