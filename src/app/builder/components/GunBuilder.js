'use client';

import GunSelection from "./GunSelection";
import GunDisplay from "./GunDisplay";
import AttachmentDisplay from "./AttachmentDisplay";

export default function GunBuilder( {data, parameters, setParameters, receiveData, addAttachment, removeAttachment, setErr} ) {
    const background_details = "flex flex-col bg-gradient-to-t from-neutral-900 via-80% via-neutral-700 to-red-800 h-5/6";

    return (
        <div className="h-[48rem] overflow-hidden">
            <div className={background_details}>
                <h1 className="text-center py-3 text-xl text-neutral-950 font-bold underline">Call of Duty: Modern Warfare 3 Gunsmith</h1>
                <GunSelection details="flex flex-col justify-center items-center" onSelection={receiveData}/>
                <GunDisplay isOpen={data !== null} parameters={parameters} setParameters={setParameters} setErr={setErr}/>  
            </div>
            <AttachmentDisplay data={(data === null || data === undefined) ? null : data.attachments} parameters={parameters}
                            addAttachment={addAttachment} removeAttachment={removeAttachment}/>
        </div>
    );
}