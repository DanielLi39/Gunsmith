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

    const option_details = "text-black";
    const build_table_details = "w-[1500px] table-fixed border-collapse border-2 border-white mx-auto";
    const gun_table_details = "w-[1000px] table-fixed border-collapse border-2 border-white mx-auto";
    const table_cell_details = "border-2 border-white p-2 text-left";
    //Default search: Return all builds made by user
    //Advanced search: Search by user, by name, by gun, by attachment list
    return (
        <div className="flex flex-col justify-items-center h-screen bg-neutral-900 text-white">
            <div className="flex flex-row justify-center">
                <button onClick={() => {
                    if (!searchType) {
                        setBuilds([]);
                    }
                    setSearchType(true);
                    setParameters(initialParameters);
                    setIsOpen(false);
                    }}>Custom Builds</button>
                <button onClick={() => {
                    if (searchType) {
                        setBuilds([]);
                    }
                    setSearchType(false);
                    setParameters(initialParameters);
                    setIsOpen(false);
                    }}>Guns</button>
            </div>
            <div className={`${searchType ? 'grid grid-cols-2 grid-rows-4' : 'hidden'}`}>
                <input className="text-black col-start-1 col-end-1" value={parameters.build.author} onChange={(e) => setParameters({...parameters, build: {...parameters.build, author: e.target.value}})}/>
                <input className="text-black col-start-1 col-end-1" value={parameters.build.name} onChange={(e) => setParameters({...parameters, build: {...parameters.build, name: e.target.value}})}/>
                <input className="text-black col-start-1 col-end-1" value={parameters.build.gun} onChange={(e) => setParameters({...parameters, build: {...parameters.build, gun: e.target.value}})}/>
                <div className="col-start-2 col-end-2 row-start-1 row-span-3">
                    <textarea className="text-black h-full w-full text-wrap" value={parameters.build.attachments} onChange={(e) => setParameters({...parameters, build: {...parameters.build, attachments: e.target.value}})}/>
                </div>
                <div className="col-start-1 col-end-2 row-start-4 row-end-4">
                    <button type="button" onClick={() => searchBuild()}>Search builds</button>
                    <button type="button" onClick={() => listBuild()}>List own builds</button>
                    <button type="button" onClick={() => setParameters(initialParameters)}>Reset search</button>
                    <input type="checkbox" checked={parameters.build.all} onChange={(e) => setParameters({...parameters, build: {...parameters.build, all: e.target.checked}})}/>
                </div>
            </div>
            <div className={`${searchType ? 'hidden' : 'grid'}`}>
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
            <div className="w-full overflow-x-auto">
                <table className={`${(isOpen && searchType) ? '' : 'hidden'} ${build_table_details}`}>
                    <thead>
                        <tr className="">
                            <th className={`${table_cell_details} w-[150px]`}>Created By</th>
                            <th className={`${table_cell_details} w-[225px]`}>Name</th>
                            <th className={`${table_cell_details} w-[150px]`}>Gun</th>
                            <th className={`${table_cell_details} w-[802px]`}>Attachments</th>
                            <th className={`${table_cell_details} w-[75px]`}>Click to load</th>
                            <th className={`${table_cell_details} w-[96px]`}>Click to delete build</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        <tr>
                            <td colSpan='6'>
                                <div className="block overflow-y-scroll h-96">
                                    <table className="w-[1477px] table-fixed">
                                    <thead>
                                        <tr className="">
                                            <th className={`w-[147px]`}></th>
                                            <th className={`w-[225px]`}></th>
                                            <th className={`w-[150px]`}></th>
                                            <th className={`w-[801px]`}></th>
                                            <th className={`w-[75px]`}></th>
                                            <th className={`w-[76px]`}></th>
                                        </tr>
                                    </thead>
                                        <tbody>
                                        {(searchType) ? builds.map(build => {
                                            return (
                                                <tr key={build._id}
                                                    className="">
                                                    <td className={`${table_cell_details}`}>{build.author}</td>
                                                    <td className={`${table_cell_details}`}>{build.name}</td>
                                                    <td className={`${table_cell_details}`}>{build.gunName}</td>
                                                    <td className={`${table_cell_details}`}>{build.attachments?.join(', ').trim()}</td>
                                                    <td className={`${table_cell_details} cursor-pointer`} onClick={() => sendToGunsmith(build.gunName, build.attachments)}>Load</td>
                                                    <td className={`${table_cell_details} cursor-pointer`} onClick={() => deleteItem(build._id)}>Delete</td>
                                                </tr>
                                            );
                                        }) : ''}
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
                                        {(!searchType) ? builds.map(build => {
                                            return (
                                                <tr key={build._id}
                                                    className="py-2 border-2 border-white">
                                                    <td className={`${table_cell_details}`}>{build.name}</td>
                                                    <td className={`${table_cell_details}`}>{build.type}</td>
                                                    <td className={`${table_cell_details}`}>{build.actions?.join(', ').trim()}</td>
                                                    <td className={`${table_cell_details}`}>{build.caliber?.join(', ').trim()}</td>
                                                    <td className={`${table_cell_details} cursor-pointer`}>
                                                        <select className="text-black w-full" onChange={(evt) => {(evt.target.value !== "Select gun") ? sendToGunsmith(evt.target.value, []) : ''}}>
                                                            <option className={option_details} value={"Select gun"}>Select gun</option>
                                                            <option className={option_details} value={build.name}>{build.name}</option>
                                                            {(build.hasOwnProperty('aftermarkets')) ? 
                                                            (build.aftermarkets.map((aftermarket, index) => {
                                                                return (
                                                                    <option className={option_details} key={index} value={aftermarket}>{aftermarket}</option>
                                                                );
                                                            })) : ""}
                                                        </select>
                                                    </td>
                                                </tr>
                                            );
                                        }) : ''}
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