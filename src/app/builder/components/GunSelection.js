'use client';
import { useState, useEffect, useRef, useTransition } from "react";
import GunList from "./GunList";

/*
 * @param details - styling arguments using Tailwind
 * @param valueHandler - an external state change handler to store the complete query
*/
export default function GunSelection( {details, onSelection} ) {
    /*
     * Initialize states for the dropdown
     * isOpen tracks if the dropdown is open or not
     * query tracks the current query of the input text
     * ref is initialized to null and will point at the input text element through current
     * isPending holds the state of the server query
    */
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef(null);

    /* 
     * @param evt - Event object
     * toggle will set isOpen to true if the event target is on the dropdown menu
    */
    function toggle(evt) {
        //console.log(evt.type, evt.target, evt.currentTarget);
        setIsOpen(evt && evt.target === inputRef.current);
    }

    /*
     * @param evt - Event object
     * updateValue will update the query state
    */
    function updateValue(evt) {
        setQuery(evt.target.value);
    }

    /*
     * @param gun - an object containing { name: 'string' }
     * Upon selection the dropdown should close
     * and the external value is updated to signal a complete query
    */
    async function selectOption(gun) {
        
        setQuery(gun['name']);
        setIsOpen(false);
        //the external state change is marked as non-urgent,
        //during which the input text will be disabled until
        //the server has returned a value
        startTransition(() => {
            onSelection(gun);
        });
    }

    /* Adds a listener that checks for a click 
     * The callback passed will check if the click 
     * is on the dropdown box, which will trigger the dropdown to open
    */
    useEffect(() => {
        const ele = document.getElementById("gunSearch");
        document.addEventListener("click", toggle);
        ele.addEventListener("select", toggle);
        /*Clean up function*/
        return () => {
            document.removeEventListener("click", toggle);
            ele.removeEventListener("select", toggle);
        }
    }, []);

    const input_details = `min-w-72 text-pretty border-2 border-neutral-950 text-semibold text-red-100 placeholder-red-100
                           focus:text-neutral-800 focus:placeholder-neutral-800 focus:outline-none`;

    return (
        <div className={details}>
            <div className="relative">{/*Dropdown div */}
                <div className={`${isOpen ? '' : 'py-1'}`}>{/*Search control div */}
                    <input id="gunSearch" ref={inputRef} type="text" name="gunName" placeholder="Type in gun name..." disabled={isPending}
                        value={query} autoComplete="off"
                        className={`${input_details} 
                                    ${isOpen ? "bg-red-100 px-3 py-1" : "bg-stone-500 pl-1 rounded-md text-center"} 
                                    ${isPending ? "cursor-not-allowed" : "cursor-auto"}`}
                        onChange={updateValue}/>
                </div>
                <GunList isOpen={isOpen} curQuery={query} selectOption={selectOption}/>
            </div>
        </div>
    )
}