'use client';

import Image from "next/image";
import writeBuild from "../actions/writeBuild";
import editBuild from "../actions/editBuild";
import { UserContext } from "./Builder";
import { useContext, useState } from "react";

export default function GunDisplay( {isOpen, parameters, setParameters, setErr} ) {
    const username = useContext(UserContext);
    const display_details = 'grow';
    //const attachmentNames = parameters.attachments.map(attachment => attachment.name);
    const imagePath = `/guns/${parameters.gunName === '' ? 'blank' : parameters.gunName.replaceAll(' ', '_')}.png`;
    const input_details = `bg-stone-600 rounded-md min-w-72 text-pretty border-2 border-neutral-950 text-semibold text-red-100 placeholder-red-100
                           focus:text-neutral-800 focus:placeholder-neutral-800 focus:outline-none focus:bg-red-100`;

    const [enable, setEnable] = useState(true);

    async function createBuild() {
        if (enable) {
            setEnable(false);
        } else {
            return;
        }
        //Check for a name
        if (parameters.name === '') {
            setErr({error: true, message: "Please type a name for the build!"});
        } else {
            
            const result = await writeBuild(parameters);
            console.log(result);

            if (result.success) {
                setErr({alert: true, message: `Build saved as ${parameters.name}!`});
            } else {
                setErr({error: true, message: result.error});
            }

            setTimeout(() => {
                console.log("Timed out!");
                setEnable(true);
            }, 7500);
        }
    }

    async function updateBuild() {
        const result = await editBuild(parameters);

        if (result.success) {
            setErr({alert: true, message: 'Build successfully edited!'});
        } else {
            setErr({error: true, message: result.error});
        }
    }

    return (
        <div className={`${display_details} ${isOpen ? '' : 'hidden'} justify-center`}>
            <div className="mt-5 flex flex-col items-center justify-center">
                <div className="relative w-52 h-28">
                <AttachmentCounter attachmentList={parameters.attachments}/>
                <Image src={imagePath} alt="" width="230" height="100" style={{position: 'absolute', right: '0px', top: '1.75rem', zIndex: 0}}/>
                </div>
            </div>
            <div className="mt-5">
                <div className="flex flex-col justify-center items-center space-y-2">
                    <div className="flex flex-row justify-center space-x-2">
                        <input className={input_details} placeholder="Gun Build Name" name="name" 
                                value={parameters.name} onChange={(evt) => setParameters({...parameters, name: evt.target.value})} autoComplete="off"/>
                        <input className={input_details} placeholder="Camo" name="camo"
                                value={parameters.camo} onChange={(evt) => setParameters({...parameters, camo: evt.target.value})} autoComplete="off"/>
                        <input type="hidden" name="gunName" value={parameters.gunName}/>
                        <input type="hidden" name="attachments" value={parameters.attachments}/>
                    </div>
                    <input className={`bg-stone-600 rounded-md min-w-72 text-pretty text-center border-2 border-neutral-950 text-semibold text-red-100 placeholder-red-100
                                           cursor-not-allowed`}
                                name="author" value={username} disabled={true}/>
                    <label className="text-red-100 flex flex-row items-center">
                            Save as public build:
                            <input type="checkbox" name="public" checked={parameters.public} onChange={(e) => setParameters({...parameters, public: e.target.checked})}/>
                        </label>
                    <div className="flex flex-row justify-center">
                        <button type="button" onClick={() => createBuild()} disabled={!enable}
                                className={`${!enable && 'cursor-not-allowed'} rounded-md py-1 px-3 bg-red-800/75 border-2 border-white w-32 text-red-100 text-semibold`}>
                            Save build
                        </button>
                        <button type="button" onClick={() => updateBuild()}
                                className={`${!parameters.edit && 'hidden'} rounded-md py-1 px-3 bg-red-800/75 border-2 border-white w-32 text-red-100 text-semibold`}>
                            Edit build
                        </button>
                    </div> 
                </div>
            </div>
        </div>
    );
}

function AttachmentCounter( {attachmentList} ) {
    //Algorithm to sort attachment list:
    //Fill up the given attachmentList with nulls until the length of array is 5
    //Sort the array such that aftermarket parts are first, normal parts are second, and null parts are third
    //Map the appropriate image for each part so that the attachment counter appears sorted in the website (similar to the real gunsmith)
    const modifiableAttachmentList = [...attachmentList];
    for (let i = modifiableAttachmentList.length; i < 5; i++) {
        modifiableAttachmentList.push({name: null});
    }
    modifiableAttachmentList.sort((first, second) => {
        //Null check
        if (first.name === second.name) {
            return 0;
        } else if (first.name === null) {
            return 1;
        } else if (second.name === null) {
            return -1;
        }

        //Aftermarkets come before normal parts
        if (first.aftermarket === second.aftermarket) {
            return 0;
        } else if (first.aftermarket) {
            return -1;
        } else {
            return 1;
        }
    });

    //Unfortunately no key optimization because this list changes so frequently
    return (
        <div className="flex flex-row space-x-2 absolute right-0 z-0">
            {modifiableAttachmentList.map((attachment, index) => {
                var imageType = "/attachments/empty_attachment.png";
                if (attachment.name !== null && attachment.aftermarket) {
                    imageType = "/attachments/aftermarket_attachment.png";
                } else if (attachment.name !== null && !attachment.aftermarket) {
                    imageType = "/attachments/filled_attachment.png";
                }
                return (
                    <Image src={imageType} alt="" width="24" height="24" key={index}/>
                );
            })}
        </div>
    );
}