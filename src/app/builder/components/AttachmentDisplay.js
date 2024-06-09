'use client';

import { guns } from "../actions/guns";

export default function AttachmentDisplay( { data, parameters, addAttachment, removeAttachment} ) {
  if (data !== null) {
    const entries = Object.entries(data);
    //THIS IS IMPORTANT - unique 'hash' function for the keys. 1000 is chosen so no guns will conflict
    //This is to ensure that the attachment category components
    //for each gun will stay alive after each re-render
    //but they will destroy and recreate themselves when the gun selected changes
    //It is guaranteed that the index will not change over the lifetime of these components (since it comes from the database)
    //console.log(parameters);
    //const gun = guns.find((gun) => gun.name === parameters.gunName);
    //var id = -1;
    //if (gun !== undefined) {
    //  id = gun.id;
    //}
    //console.log(gun, id, parameters.gunName);
    const id = guns.find((gun) => gun.name === parameters.gunName).id;
    return (
        <div className="flex flex-row justify-between items-center bg-neutral-900 h-1/6">
            {entries.map((entry, index) => {
                return (
                    <AttachmentCategory name={entry[0]} items={entry[1]} key={(1000 * id) + index} 
                                        first={index === 0} last={index === entries.length - 1}
                                        isBlocked={parameters.blocks.indexOf(entry[0]) > -1}
                                        addAttachment={addAttachment} removeAttachment={removeAttachment} 
                                        attachmentList={parameters.attachments}/>
                );
            })}
        </div>
    );
  } else {
    return (
      <div className="h-1/6 bg-neutral-900"/>
    );
  }
}

function AttachmentCategory( {name, items, isBlocked, addAttachment, removeAttachment, first, last, attachmentList} ) {
  var selection = attachmentList.find(attachment => attachment.type === name);
  
  if (selection === undefined) {
    selection = name;
  } else {
    selection = selection.name;
  }

  //Wrapper function to addAttachment
  //For some reason this lets the category update, so do not touch... even though addAttachment is more than enough
  //Unsure why category will not update without this
  function selectAttachment(attachment) {
    if (addAttachment(attachment, name)) {
      console.log(`${name} is now ${attachment.name}, previous state: ${selection}`);
    }
  }
  
  //Wrapper function to ensure right argument passed to removeAttachment
  function deleteAttachment(attachmentName) {
    var attachment = null;
    for (const item of items) {
      if (attachmentName === item['name']) {
        attachment = item;
      }
    }
    if (attachment === null) {
      console.log("ERROR! Attachment not found in list!");
      return;
    }
    removeAttachment(attachment);
  }

  //This is run during rendering to position the dropup div so that it does not overflow out of the screen
  var position = '-left-1/4';
  if (first && last) position = '-left-1/4';
  else if (first) position = '';
  else if (last) position = 'right-0';
  
  //Give keys using index, the data will not change during the lifetime of this component since it comes from the database
  return (
    <div className="text-white w-36 h-full border-2 border-white items-center relative inline-block overflow-visible group">
      <div className={`hidden ${isBlocked ? '' : 'group-hover:flex'} flex-col-reverse absolute ${position} bottom-full 
                       z-10 overflow-y-auto min-h-fit max-h-64 w-56 border-2 border-white
                       bg-gradient-to-t from-red-950/75 via-red-900/75 via-80% to-red-700/75`}>
        {items.map((item, index) => {
            return (
                <div key={index} onClick={() => selectAttachment(item)}
                     className="text-pretty text-red-100 font-semibold cursor-pointer pl-4 py-1 hover:bg-red-600/40">
                    {item['name']}
                </div>
            );
        })}
      </div>
      <div className={`text-red-500 ${isBlocked ? '' : 'hidden'}`}>
        BLOCKED.
      </div>
      <div className={`text-red-500 text-center items-center absolute hidden z-10 w-full h-full peer ${selection !== name ? 'group-hover:block': ''}`}
           onClick={() => deleteAttachment(selection)}>
        REMOVE.
      </div>
      <div className={`flex justify-center items-center w-full h-full ${isBlocked ? 'hidden' : 'peer-hover:hidden'}`}>
        {selection}
      </div>
      
    </div>
  )
}