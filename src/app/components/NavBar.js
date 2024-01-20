'use client';

import { SignOutButton, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import LinkButton from "./LinkButton"

export default function NavBar( {navbar_details, text_details, button_details} ) {
    return (
      <div className={`${navbar_details} relative`}>
        <LinkButton link='/home' text='Home' text_details={text_details} button_details={button_details}/>
        <LinkButton link='/builder' text='Gun Builder' text_details={text_details} button_details={button_details}/>
        <SignedIn>
          <div className="absolute right-2">
            <UserButton showName='true' afterSignOutUrl="/home" appearance={{
              elements: {
                userButtonOuterIdentifier: text_details
              }
            }}/>
          </div>
          
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" afterSignInUrl="/home">
            <button className={`absolute right-2 ${button_details} ${text_details}`}>Sign In</button>
          </SignInButton>
        </SignedOut>
      </div>  
    )
  }