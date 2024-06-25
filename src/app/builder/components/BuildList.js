'use client';

import { useRef, useState, useContext } from "react";
import queryBuilds from "../actions/queryBuilds";
import deleteBuild from "../actions/deleteBuild";
import queryGuns from "../actions/queryGuns";
import { UserContext } from "./Builder";

export default function BuildList( {sendBuildToGunsmith, sendGunToGunsmith} ) {
    const user = useContext(UserContext);
    //The author will be inherited from a context once logged in - TODO
    const initialParameters = 
    {
        build: 
        {
            author: user, 
            name: '', 
            gun: '', 
            camo: '',
            attachments: '', 
            all: true,
            show_private: false
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

    const previousQuery = useRef(initialParameters);
    
    const [builds, setBuilds] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    //SearchType is true to search for custom builds, false to search in established gun list
    const [searchType, setSearchType] = useState(true);
    const [parameters, setParameters] = useState(initialParameters);

    async function searchBuild() {
        previousQuery.current = structuredClone(parameters);
        const result = await queryBuilds(parameters);
        console.log(result);
        if (result.success) {
            setBuilds(result.data);
            setIsOpen(true);
        }
    }

    async function listBuild() {
        const list_own = structuredClone(initialParameters);
        list_own.show_private = true;
        previousQuery.current = structuredClone(list_own);
        const result = await queryBuilds(list_own);
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
            const res = await queryBuilds(previousQuery.current);
            console.log(result);
            if (result.success) {
                setBuilds(res.data);
                setIsOpen(true);
            }
        }
    }

    const option_details = "text-black";
    const build_table_details = "w-[1500px] table-fixed border-collapse border-2 border-white mx-auto";
    const gun_table_details = "w-[1000px] table-fixed border-collapse border-2 border-white mx-auto";
    const table_cell_details = "border-2 border-white p-2 text-left";
    const build_input_details = "text-black";
    //Default search: Return all builds made by user
    //Advanced search: Search by user, by name, by gun, by attachment list
    return (
        <div className="flex flex-col justify-items-center h-screen bg-neutral-900 text-white">
            {/* Search option selection - controls the two buttons to switch between different search options*/}
            <div className="flex flex-row justify-center">
                <button onClick={() => {
                    if (!searchType) {
                        setBuilds([]);
                    }
                    setSearchType(true);
                    setParameters(initialParameters);
                    setIsOpen(false);
                    previousQuery.current = initialParameters;
                    }}>Custom Builds</button>
                <button onClick={() => {
                    if (searchType) {
                        setBuilds([]);
                    }
                    setSearchType(false);
                    setParameters(initialParameters);
                    setIsOpen(false);
                    previousQuery.current = initialParameters;
                    }}>Guns</button>
            </div>
            <div className={`${searchType ? 'grid grid-cols-2 grid-rows-5 mx-auto' : 'hidden'}`}>
                <label className="flex flex-col col-start-1 row-start-1">
                    Author
                    <input className={build_input_details} value={parameters.build.author} autoComplete="off"
                        onChange={(e) => setParameters({...parameters, build: {...parameters.build, author: e.target.value}})}/>
                </label>
                <label className="flex flex-col col-start-1 row-start-2">
                    Name
                    <input className={build_input_details} value={parameters.build.name} autoComplete="off"
                        onChange={(e) => setParameters({...parameters, build: {...parameters.build, name: e.target.value}})}/>
                </label>
                <label className="flex flex-col col-start-1 row-start-3">
                    Gun
                    <input className={build_input_details} value={parameters.build.gun} autoComplete="off" 
                        onChange={(e) => setParameters({...parameters, build: {...parameters.build, gun: e.target.value}})}/>
                </label>
                <label className="flex flex-col col-start-1 row-start-4">
                    Camo
                    <input className={build_input_details} value={parameters.build.camo} autoComplete="off" 
                        onChange={(e) => setParameters({...parameters, build: {...parameters.build, camo: e.target.value}})}/>
                </label>
                <label className="flex flex-col col-start-2 row-start-1 row-span-4">
                    Attachments (comma separated):
                    <textarea className={`${build_input_details} h-full w-full text-wrap`} value={parameters.build.attachments} autoComplete="off"
                        onChange={(e) => setParameters({...parameters, build: {...parameters.build, attachments: e.target.value}})}/>
                </label>
                <div className="flex flex-row justify-center col-start-1 col-end-3 row-start-5">
                    <button type="button" onClick={() => searchBuild()}>Search public builds</button>
                    <button type="button" onClick={() => listBuild()}>List own builds</button>
                    <button type="button" onClick={() => setParameters(initialParameters)}>Reset search</button>
                    <label className="flex flex-row items-center">
                        Match all attachments:
                        <input type="checkbox" checked={parameters.build.all} onChange={(e) => setParameters({...parameters, build: {...parameters.build, all: e.target.checked}})}/>
                    </label>
                </div>
            </div>
            <div className={`${searchType ? 'hidden' : 'grid grid-cols-2 mx-auto'}`}>
                <label className="flex flex-col col-start-1">
                    Name
                    <input className={build_input_details} value={parameters.gun.name} autoComplete="off"
                        onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, name: e.target.value}})}/>
                </label>
                <label className="flex flex-col col-start-2">
                    Type
                    <input className={build_input_details} value={parameters.gun.type} autoComplete="off"
                        onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, type: e.target.value}})}/>
                </label>
                <label className="flex flex-col col-start-2 row-start-2">
                    Attachments (comma separated):
                    <textarea className={build_input_details} value={parameters.gun.attachments} autoComplete="off"
                        onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, attachments: e.target.value}})}/>
                </label>
                <label className="flex flex-col col-start-1 row-start-2">
                    Fire action
                    <textarea className={build_input_details} value={parameters.gun.action} autoComplete="off"
                        onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, action: e.target.value}})}/>
                </label>
                <label className="flex flex-col col-start-1 row-start-3">
                    Caliber
                    <textarea className={build_input_details} value={parameters.gun.caliber} autoComplete="off"
                        onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, caliber: e.target.value}})}/>
                </label>
                <div className="grid grid-cols-2 grid-rows-2 col-start-2 row-start-3">
                    <label className="flex flex-row items-center justify-center">
                        Match all attachments:
                        <input type="checkbox" checked={parameters.gun.attachments_all} 
                            onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, attachments_all: e.target.checked}})}/>
                    </label>
                    <label className="flex flex-row items-center justify-center">
                        Match all fire actions:
                        <input type="checkbox" checked={parameters.gun.action_all} 
                            onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, action_all: e.target.checked}})}/>
                    </label>
                    <label className="col-start-1 col-end-3 flex flex-row justify-center items-center">
                        Match all calibers:
                        <input type="checkbox" checked={parameters.gun.caliber_all} 
                            onChange={(e) => setParameters({...parameters, gun: {...parameters.gun, caliber_all: e.target.checked}})}/>
                    </label>
                </div>
                <div className="flex flex-row justify-center col-start-1 col-end-3">
                    <button type="button" onClick={() => searchGun()}>Search Guns</button>
                    <button type="button" onClick={() => setParameters(initialParameters)}>Reset search</button>
                </div>
            </div>
            <div className="w-full overflow-x-auto">
                <table className={`${(isOpen && searchType) ? '' : 'hidden'} ${build_table_details}`}>
                    <thead>
                        <tr className="">
                            <th className={`${table_cell_details} w-[150px]`}>Created By</th>
                            <th className={`${table_cell_details} w-[225px]`}>Name</th>
                            <th className={`${table_cell_details} w-[150px]`}>Gun</th>
                            <th className={`${table_cell_details} w-[150px]`}>Camo</th>
                            <th className={`${table_cell_details} w-[652px]`}>Attachments</th>
                            <th className={`${table_cell_details} w-[75px]`}>Click to load</th>
                            <th className={`${table_cell_details} w-[96px]`}>Click to delete build</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        <tr>
                            <td colSpan='7'>
                                <div className="block overflow-y-scroll h-96">
                                    <table className="w-[1477px] table-fixed">
                                    <thead>
                                        <tr className="">
                                            <th className={`w-[147px]`}></th>
                                            <th className={`w-[225px]`}></th>
                                            <th className={`w-[150px]`}></th>
                                            <th className={`w-[150px]`}></th>
                                            <th className={`w-[651px]`}></th>
                                            <th className={`w-[75px]`}></th>
                                            <th className={`w-[76px]`}></th>
                                        </tr>
                                    </thead>
                                        <tbody>
                                        {(searchType) && builds.map(build => {
                                            return (
                                                <tr key={build._id}
                                                    className="">
                                                    <td className={`${table_cell_details}`}>{build.author}</td>
                                                    <td className={`${table_cell_details}`}>{build.name}</td>
                                                    <td className={`${table_cell_details}`}>{build.gunName}</td>
                                                    <td className={`${table_cell_details}`}>{build.camo}</td>
                                                    <td className={`${table_cell_details}`}>{build.attachments?.join(', ').trim()}</td>
                                                    <td className={`${table_cell_details} cursor-pointer`} onClick={() => sendBuildToGunsmith(build)}>Load</td>
                                                    <td className={`${table_cell_details} ${user === build.author ? 'cursor-pointer' : 'cursor-not-allowed'}`} onClick={() => user === build.author ? deleteItem(build._id) : undefined}>Delete</td>
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
                <table className={`${(isOpen && !searchType) ? '' : 'hidden'} ${gun_table_details}`}>
                    <thead>
                        <tr className="py-2 border-2 border-white">
                            <th className={`${table_cell_details} w-[150px]`}>Gun name</th>
                            <th className={`${table_cell_details} w-[100px]`}>Type</th>
                            <th className={`${table_cell_details} w-[200px]`}>Actions</th>
                            <th className={`${table_cell_details} w-[200px]`}>Caliber</th>
                            <th className={`${table_cell_details} w-[350px]`}>Display Gun</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        <tr>
                            <td colSpan='5'>
                                <div className="block overflow-y-scroll h-96">
                                    <table className="w-[977px] table-fixed">
                                        <thead>
                                            <tr>
                                                <th className='w-[147px]'></th>
                                                <th className='w-[100px]'></th>
                                                <th className='w-[200px]'></th>
                                                <th className='w-[200px]'></th>
                                                <th className='w-[330px]'></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {(!searchType) && builds.map(build => {
                                            return (
                                                <tr key={build._id}
                                                    className="py-2 border-2 border-white">
                                                    <td className={`${table_cell_details}`}>{build.name}</td>
                                                    <td className={`${table_cell_details}`}>{build.type}</td>
                                                    <td className={`${table_cell_details}`}>{build.actions?.join(', ').trim()}</td>
                                                    <td className={`${table_cell_details}`}>{build.caliber?.join(', ').trim()}</td>
                                                    <td className={`${table_cell_details} cursor-pointer`}>
                                                        <select className="text-black w-full" onChange={(evt) => {(evt.target.value !== "Select gun") ? sendGunToGunsmith(evt.target.value) : ''}}>
                                                            <option className={option_details} value={"Select gun"}>Select gun</option>
                                                            <option className={option_details} value={build.name}>{build.name}</option>
                                                            {(build.hasOwnProperty('aftermarkets')) &&
                                                            (build.aftermarkets.map((aftermarket, index) => {
                                                                return (
                                                                    <option className={option_details} key={index} value={aftermarket}>{aftermarket}</option>
                                                                );
                                                            }))}
                                                        </select>
                                                    </td>
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