import LinkButton from "./LinkButton"
import { SignInButton } from "./SignIn"
import { SignOutButton } from "./SignOut"

export default function NavBar( {navbar_details, text_details, button_details, unauth} ) {
    return (
      <div className={navbar_details}>
        <LinkButton link='/home' text='Home' text_details={text_details} button_details={button_details}/>
        <LinkButton link='/builder' text='Gun Builder' text_details={text_details} button_details={button_details}/>
        <SignInButton hide={!unauth}/>
        <SignOutButton hide={unauth}/>
      </div>  
    )
  }