import NavBar from '../components/NavBar'

export default function RootLayout({ children }) {
  const navbar_details = `flex bg-red-800 pt-4 pb-4 items-center justify-center space-x-5
                          hover:bg-gradient-to-t hover:from-red-800 hover:via-red-900 hover: via-20% hover:to-red-800`;
  return (
    <>
      <NavBar navbar_details={navbar_details}
              text_details='font-semibold text-black'
              button_details='rounded-lg shadow-lg bg-gray-400 hover:bg-gray-600 px-3 py-2'/>
      {children}
    </>
  )
}