'use client';

import { useState, useRef } from "react";
import queryBuilds from "../actions/queryBuilds";
import deleteBuild from "../actions/deleteBuild";

export default function BuildList( {sendToGunsmith} ) {
    const [builds, setBuilds] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    //The author will be inherited from a context once logged in
    const [parameters, setParameters] = useState({author: 'dummy', name: '', gun: '', attachments: ''});

    async function searchBuild() {
        var attachmentList = [];
        var words = parameters.attachments.split(',');
        if (parameters.attachments !== '') {
            words.forEach((val) => attachmentList.push(val.trim()));
        }
        console.log(parameters.attachments, attachmentList);
        const result = await queryBuilds(parameters.author, parameters.name, parameters.gun, attachmentList);
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
            <SearchUI parameters={parameters} setParameters={setParameters}/>
            <div>{parameters.author}</div>
            <button type="button" onClick={() => searchBuild()}>Search builds</button>
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

function SearchUI( {parameters, setParameters} ) {

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
                <p>Attachments</p>
                <div id="attachmentList">

                </div>
            </div>
            <div className={`${searchType ? 'hidden' : 'block'}`}>
                Wtf
            </div>
        </div>
    )
}