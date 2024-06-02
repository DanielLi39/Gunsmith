'use client';

import { useState } from "react";
import queryBuilds from "../actions/queryBuilds";
import deleteBuild from "../actions/deleteBuild";

export default function BuildList( {sendToGunsmith} ) {
    //The author will be inherited from a context once logged in - TODO
    const initialParameters = {author: 'dummy', name: '', gun: '', attachments: '', all: true};
    const [builds, setBuilds] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    
    const [parameters, setParameters] = useState(initialParameters);

    async function searchBuild() {
        const result = await queryBuilds(parameters);
        console.log(result);
        if (result.success) {
            setBuilds(result.data);
            setIsOpen(true);
        }
    }

    async function listBuild() {
        const result = await queryBuilds(initialParameters);
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
            await searchBuild();
        }
    }

    //Default search: Return all builds made by user
    //Advanced search: Search by user, by name, by gun, by attachment list
    return (
        <div className="h-screen bg-neutral-900 text-white">
            <SearchUI parameters={parameters} setParameters={setParameters} searchBuild={searchBuild} listBuild={listBuild}/> 
            <table className={`${isOpen ? '' : 'hidden'}`}>
                <thead>
                    <tr className="py-2 border-2 border-white">
                        <td>Created By</td>
                        <td>Name</td>
                        <td>Gun</td>
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

function SearchUI( {parameters, setParameters, searchBuild, listBuild} ) {
    //SearchType is true to search for custom builds, false to search in established gun list
    const [searchType, setSearchType] = useState(true);

    return (
        <div>
            <div>
                <button onClick={() => setSearchType(true)}>Custom Builds</button>
                <button onClick={() => setSearchType(false)}>Guns</button>
            </div>
            <div className={`${searchType ? 'block' : 'hidden'}`}>
                <input className="text-black" value={parameters.author} onChange={(e) => setParameters({...parameters, author: e.target.value})}/>
                <input className="text-black" value={parameters.name} onChange={(e) => setParameters({...parameters, name: e.target.value})}/>
                <input className="text-black" value={parameters.gun} onChange={(e) => setParameters({...parameters, gun: e.target.value})}/>
                <input className="text-black" value={parameters.attachments} onChange={(e) => setParameters({...parameters, attachments: e.target.value})}/>
                <input type="checkbox" checked={parameters.all} onChange={(e) => setParameters({...parameters, all: e.target.checked})}/>
                <button type="button" onClick={() => searchBuild()}>Search builds</button>
                <button type="button" onClick={() => listBuild()}>List own builds</button>
                <button type="button" onClick={() => setParameters(initialParameters)}>Reset search</button>
            </div>
            <div className={`${searchType ? 'hidden' : 'block'}`}>
                Wtf
            </div>
        </div>
    )
}