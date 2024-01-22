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
        } else {
            //Some error thing
        }
    }

    async function buildQuery(formData) {
        for (const pair of formData.entries()) {
            console.log(pair);
        }
    }

    //Load all builds associated with this account
    async function loadAccountBuilds() {
        const result = await queryBuilds(user.username);
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
        } else {
            //Some error thing
        }
    }

    return (
        <div className="h-screen bg-gradient-to-b from-neutral-900 via-neutral-800 via-60% to-red-800 text-white">
            <div className="pt-5 overflow-clip flex flex-col justify-center">
                <QueryBuilder buildQuery={buildQuery} loadAccountBuilds={loadAccountBuilds}/>
                <table className={`${!isOpen && 'hidden'} w-[1075px] m-auto`}>
                    <thead>
                        <tr className="py-2 border-2 border-white bg-neutral-700">
                            <td className="w-[100px]">Created By</td>
                            <td className="w-[100px] bg-neutral-500">Name</td>
                            <td className="w-[100px]">Gun</td>
                            <td className="w-[100px] bg-neutral-500">Camo</td>
                            <td className="w-[500px]">Attachments</td>
                            <td className="w-[75px] bg-neutral-500"></td>
                            <td className="w-[100px] bg-neutral-400"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-2 border-white">
                            <td colSpan="7">
                                <div className="h-[500px] block overflow-y-auto overflow-x-auto bg-neutral-700">
                                    <table>
                                        <tbody>
                                            {builds.map(build => {
                                                return (
                                                    <tr key={build._id}
                                                        >
                                                        <td className="w-[97px]">{build.author}</td>
                                                        <td className="w-[100px] bg-neutral-500">{build.name}</td>
                                                        <td className="w-[100px]">{build.gunName}</td>
                                                        <td className="w-[100px] bg-neutral-500">{build.camo}</td>
                                                        <td className="w-[499px]">{build.attachments.toString()}</td>
                                                        <td className="cursor-pointer w-[75px] bg-neutral-500" onClick={() => sendToGunsmith(build.gunName, build.attachments)}>Load</td>
                                                        <td className="cursor-pointer w-[80px] bg-neutral-400" onClick={() => deleteItem(build._id)}>Delete</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function QueryBuilder( {buildQuery, loadAccountBuilds} ) {
    const [queries, setQueries] = useState([]);

    function addParameter() {
        const buildForm = document.getElementById("buildForm");
        const newInput = document.createElement("input")
        buildForm.appendChild()
    }
    return (
        <div className="flex flex-col justify-center items-center">
            <button type="button" onClick={addParameter}>Add Parameter</button>
            <form action={buildQuery} className="table justify-center w-[400px]" id="buildForm">
                <div className="table-row w-[400px]">
                    <label htmlFor="gunName" className="w-[100px] table-cell">Gun name:</label>
                    <input type="text" name="gunName" placeholder="Leave blank to exclude from search" className="w-[300px] table-cell"/>
                </div>
            </form>
            <button type="submit" form="buildForm" disabled={queries.length === 1}>Find builds</button>
            <p>Or...</p>
            <button type="button" onClick={loadAccountBuilds}>Display saved builds</button>
        </div>
    );
}