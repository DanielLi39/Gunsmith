import NavBar from '../components/NavBar'

export default function RootLayout({ children }) {
  return (
    <>
      <NavBar navbar_details='flex bg-sky-100 pt-4 pb-4 items-center justify-center space-x-5 hover:bg-blue-100'
              text_details='font-semibold text-sky-950'
              button_details='rounded-lg shadow-lg bg-violet-100 hover:bg-violet-200 px-3 py-2'/>
      {children}
    </>
  )
}