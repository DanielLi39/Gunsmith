'use client';

import { guns } from "../server_actions/guns";

export default function GunList( {isOpen, curQuery, selectOption} ) {
    function filterGuns() {
        return guns.filter((gun) => {
            return gun['name'].toLowerCase().indexOf(curQuery.toLowerCase()) > -1;
        });
    }
    /* Just for clarity's sake */
    const gunlist = filterGuns();
    const gunlist_details = "border-2 border-neutral-800 bg-gradient-to-b from-red-950/75 via-red-900/75 via-80% to-red-700/75 overflow-y-auto h-52 z-10";
    
    return (
        <div className={`absolute w-full ${isOpen ? gunlist_details : "hidden"}`}>
            {gunlist.map((gun) => {
                return (
                    <div className="text-pretty text-red-100 font-semibold cursor-pointer pl-4 py-1 hover:bg-red-600/40" 
                         onClick={() => selectOption(gun)} key={`${gun['id']}`}>
                        {gun['name']}
                    </div>
                );
            })}
        </div>
    );
};