'use client';

import { useState } from "react";
import queryBuilds from "../actions/queryBuilds";
import deleteBuild from "../actions/deleteBuild";
import { useUser } from "@clerk/nextjs";

export default function BuildList( {sendToGunsmith} ) {
    const [builds, setBuilds] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();

    async function receiveCursor() {
        //Change later
        console.log(user.username);
        const result = await queryBuilds(user.username);
        console.log(result);
        if (result.success) {
            setBuilds(result.data);
            setIsOpen(true);
        }
    }

    async function deleteItem(id) {
        const result = await deleteBuild(id);
        console.log(result);
        if (result.success) {
            await receiveCursor();
        }
    }

    return (
        <div className="h-screen bg-neutral-900 text-white">
            <input type="text"/>
            <button type="button" onClick={receiveCursor}>Load builds</button>
            <table className={`${isOpen ? '' : 'hidden'}`}>
                <thead>
                    <tr className="py-2 border-2 border-white">
                        <td>Created By</td>
                        <td>Name</td>
                        <td>Gun</td>
                        <td>Camo</td>
                        <td>Attachments</td>
                    </tr>
                </thead>
                <tbody className="">
                    {builds.map(build => {
                        return (
                            <tr key={build._id}
                                className="py-2 border-2 border-white">
                                <td>{build.author}</td>
                                <td>{build.name}</td>
                                <td>{build.gunName}</td>
                                <td>{build.camo}</td>
                                <td colSpan="5">{build.attachments.toString()}</td>
                                <td className="cursor-pointer" onClick={() => sendToGunsmith(build.gunName, build.attachments)}>Load</td>
                                <td className="cursor-pointer" onClick={() => deleteItem(build._id)}>Delete</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
        </div>
    );
}