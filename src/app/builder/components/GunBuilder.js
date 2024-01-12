'use client';

import GunSelection from "./GunSelection";
import GunDisplay from "./GunDisplay";
import AttachmentDisplay from "./AttachmentDisplay";

export default function GunBuilder( {data, attachments, blocks, receiveData, resetAttachments, addAttachment, removeAttachment} ) {
    const background_details = "flex flex-col bg-gradient-to-t from-neutral-900 via-80% via-neutral-700 to-red-800 h-5/6";

    return (
        <div className="h-[48rem] overflow-hidden">
            <div className={background_details}>
                <h1 className="text-center py-3 text-xl text-neutral-950 font-bold underline">Call of Duty: Modern Warfare 3 Gunsmith</h1>
                <GunSelection details="flex flex-col justify-center items-center" onSelection={receiveData} resetAttachments={resetAttachments}/>
                <GunDisplay isOpen={data !== null} gunName={data === null ? '' : data.name} 
                            baseName={data === null ? '' : (data.conversion ? data.base : data.name)} 
                            attachmentList={attachments}/>  
            </div>
            <AttachmentDisplay gunName={(data === null || data === undefined) ? null : data.name} 
                                blockList={blocks} data={(data === null || data === undefined) ? null : data.attachments}
                            addAttachment={addAttachment} removeAttachment={removeAttachment} attachmentList={attachments}/>
        </div>
    );
}