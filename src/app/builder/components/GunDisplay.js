'use client';

import Image from "next/image";
import writeBuild from "../actions/writeBuild";
import { useFormStatus } from "react-dom";

export default function GunDisplay( {isOpen, gunName, baseName, attachmentList} ) {
    const display_details = 'grow';
    const attachmentNames = attachmentList.map(attachment => attachment.name);
    const imagePath = `/guns/${gunName === '' ? 'blank' : gunName.replaceAll(' ', '_')}.png`;
    const input_details = `bg-stone-600 rounded-md min-w-72 text-pretty border-2 border-neutral-950 text-semibold text-red-100 placeholder-red-100
                           focus:text-neutral-800 focus:placeholder-neutral-800 focus:outline-none focus:bg-red-100`;

    return (
        <div className={`${display_details} ${isOpen ? '' : 'hidden'} justify-center`}>
            <div className="mt-5 flex flex-col items-center justify-center">
                <div className="relative w-52 h-28">
                <AttachmentCounter attachmentList={attachmentList}/>
                <Image src={imagePath} alt="" width="230" height="100" style={{position: 'absolute', right: '0px', top: '1.75rem', zIndex: 0}}/>
                </div>
            </div>
            <div className="mt-5">
                <form className="flex flex-col justify-center items-center space-y-2" action={writeBuild}>
                    <div className="flex flex-row justify-center space-x-2">
                        <input className={input_details} placeholder="Gun Build Name" name="name"/>
                        <input className={input_details} placeholder="Author" name="author"/>
                        <input type="hidden" name="gunName" value={baseName}/>
                        <input type="hidden" name="attachments" value={attachmentNames}/>
                    </div>
                    <button type="submit" 
                            className="rounded-md py-1 px-3 bg-red-800/75 border-2 border-white w-32 text-red-100 text-semibold">
                        Save Build
                    </button>
                </form>
            </div>
        </div>
    );
}

function AttachmentCounter( {attachmentList} ) {
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