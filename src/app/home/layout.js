import NavBar from '../lib/components/NavBar'
import { auth } from '@/auth';

export default async function RootLayout({ children }) {
  const session = await auth();

  //console.log(session, !session);
  return (
    <>
      <NavBar navbar_details='flex bg-sky-100 pt-4 pb-4 items-center justify-center space-x-5 hover:bg-blue-100'
              text_details='font-semibold text-sky-950'
              button_details='rounded-lg shadow-lg bg-violet-100 hover:bg-violet-200 px-3 py-2'
              unauth={!session}/>
      {children}
    </>
  )
}