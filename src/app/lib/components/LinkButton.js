export default function LinkButton( {link, text, text_details, button_details} ) {
    return (
        <button className={button_details}>
            <a href={link} className={text_details}>{text}</a>
        </button>
    )
}