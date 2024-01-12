'use client';

import { useState } from "react";
import queryBuilds from "../server_actions/queryBuilds";

export default function BuildSearch( {sendToGunsmith} ) {
    const [builds, setBuilds] = useState([]);

    async function receiveCursor() {
        //Change later
        const result = await queryBuilds('Lexwomy');
        console.log(result);
        if (result.success) {
            setBuilds(result.data);
        }
    }

    return (
        <div className="h-screen bg-neutral-900 text-white">
            <input type="text"/>
            <button type="button" onClick={receiveCursor}>Load builds</button>
            <table>
                <tbody>
                    {builds.map(build => {
                        return (
                            <tr key={build._id} onClick={() => sendToGunsmith(build.gunName, build.attachments)}>
                                <td>{build.author}</td>
                                <td>{build.name}</td>
                                <td>{build.gunName}</td>
                                <td colSpan="5">{build.attachments.toString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
        </div>
    );
}

function BuildList( {cursor} ) {
    
    return (
        <div>
              {}
        </div>
    );
}