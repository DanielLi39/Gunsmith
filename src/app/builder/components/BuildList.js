'use client';

import { useState } from "react";
import queryBuilds from "../actions/queryBuilds";
import deleteBuild from "../actions/deleteBuild";
import queryGuns from "../actions/queryGuns";

export default function BuildList( {sendToGunsmith} ) {
    //The author will be inherited from a context once logged in - TODO
    const initialParameters = 
    {
        build: 
        {
            author: 'dummy', 
            name: '', 
            gun: '', 
            attachments: '', 
            all: true
        },
        gun: 
        {
            name: '', 
            type: '', 
            attachments: '', 
            attachments_all: true, 
            action: '', 
            action_all: true,
            caliber: '',
            caliber_all: true
        }
    };

    const [builds, setBuilds] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    //SearchType is true to search for custom builds, false to search in established gun list
    const [searchType, setSearchType] = useState(true);
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

    async function searchGun() {
        const result = await queryGuns(parameters);
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
            <SearchUI parameters={parameters} setParameters={setParameters} searchBuild={searchBuild} listBuild={listBuild} searchGun={searchGun} 
                      initialParameters={initialParameters} searchType={searchType} setSearchType={setSearchType}/> 
            <table className={`${(isOpen && searchType) ? '' : 'hidden'}`}>
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
            <table className={`${(isOpen && !searchType) ? '' : 'hidden'}`}>
                <thead>
                    <tr className="py-2 border-2 border-white">
                        <td>Gun name</td>
                        <td>Type</td>
                        <td>Actions</td>
                        <td>Caliber</td>
                        <td>Display Gun</td>
                    </tr>
                </thead>
                <tbody className="">
                    {builds.map(build => {
                        return (
                            <tr key={build._id}
                                className="py-2 border-2 border-white">
                                <td>{build.name}</td>
                                <td>{build.type}</td>
                                <td>{build.actions?.join(', ').trim()}</td>
                                <td>{build.caliber?.join(', ').trim()}</td>
                                <td className="cursor-pointer" onClick={() => sendToGunsmith(build.gunName, build.attachments)}>Load</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function SearchUI( {parameters, setParameters, searchBuild, listBuild, searchGun, initialParameters, searchType, setSearchType} ) {
    return (
        <div>
            <div>
                <button onClick={() => {
                    setSearchType(true);
                    setParameters(initialParameters);
                    }}>Custom Builds</button>
                <button onClick={() => {
                    setSearchType(false);
                    setParameters(initialParameters);
                    }}>Guns</button>
            </div>
            <div className={`${searchType ? 'block' : 'hidden'}`}>
                <input className="text-black" value={parameters.build.author} onChange={(e) => setParameters({...parameters, build: {...parameters.build, author: e.target.value}})}/>
                <input className="text-black" value={parameters.build.name} onChange={(e) => setParameters({...parameters, build: {...parameters.build, name: e.target.value}})}/>
                <input className="text-black" value={parameters.build.gun} onChange={(e) => setParameters({...parameters, build: {...parameters.build, gun: e.target.value}})}/>
                <input className="text-black" value={parameters.build.attachments} onChange={(e) => setParameters({...parameters, build: {...parameters.build, attachments: e.target.value}})}/>
                <input type="checkbox" checked={parameters.build.all} onChange={(e) => setParameters({...parameters, build: {...parameters.build, all: e.target.checked}})}/>
                <button type="button" onClick={() => searchBuild()}>Search builds</button>
                <button type="button" onClick={() => listBuild()}>List own builds</button>
                <button type="button" onClick={() => setParameters(initialParameters)}>Reset search</button>
            </div>
            <div className={`${searchType ? 'hidden' : 'block'}`}>
                <input className="text-black" value={parameters.gun.name} onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, name: e.target.value}})}/>
                <input className="text-black" value={parameters.gun.type} onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, type: e.target.value}})}/>
                <input className="text-black" value={parameters.gun.attachments} onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, attachments: e.target.value}})}/>
                <input className="text-black" value={parameters.gun.action} onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, action: e.target.value}})}/>
                <input className="text-black" value={parameters.gun.caliber} onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, caliber: e.target.value}})}/>
                <input type="checkbox" checked={parameters.gun.attachments_all} onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, attachments_all: e.target.checked}})}/>
                <input type="checkbox" checked={parameters.gun.action_all} onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, action_all: e.target.checked}})}/>
                <input type="checkbox" checked={parameters.gun.caliber_all} onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, caliber_all: e.target.checked}})}/>
                <button type="button" onClick={() => searchGun()}>Search Guns</button>
                <button type="button" onClick={() => setParameters(initialParameters)}>Reset search</button>
            </div>
        </div>
    )
}