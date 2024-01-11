import LinkButton from "./LinkButton"

export default function NavBar( {navbar_details, text_details, button_details} ) {
    return (
      <div className={navbar_details}>
        <LinkButton link='/home' text='Home' text_details={text_details} button_details={button_details}/>
        <LinkButton link='/builder' text='Gun Builder' text_details={text_details} button_details={button_details}/>
      </div>  
    )
  }