'use client';

import { guns } from "../server_actions/guns";

export default function AttachmentDisplay( { gunName, blockList, data, addAttachment, removeAttachment, attachmentList} ) {
  if (data !== null) {
    const entries = Object.entries(data);
    //THIS IS IMPORTANT - unique 'hash' function for the keys. 1000 is chosen so no guns will conflict
    //This is to ensure that the attachment category components
    //for each gun will stay alive after each re-render
    //but they will destroy and recreate themselves when the gun selected changes
    //It is guaranteed that the index will not change over the lifetime of these components (since it comes from the database)
    const id = guns.find((gun) => gun.name === gunName).id;
    console.log(attachmentList);
    return (
        <div className="flex flex-row justify-between items-center bg-neutral-900 h-1/6">
            {entries.map((entry, index) => {
                return (
                    <AttachmentCategory name={entry[0]} items={entry[1]} key={(1000 * id) + index} 
                                        first={index === 0} last={index === entries.length - 1}
                                        isBlocked={blockList.indexOf(entry[0]) > -1}
                                        addAttachment={addAttachment} removeAttachment={removeAttachment} 
                                        attachmentList={attachmentList}/>
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
  console.log(`Is ${name}?`);
  console.log(attachmentList);
  var selection = attachmentList.find(attachment => {console.log(attachment); return attachment.type === name});
  
  if (selection === undefined) {
    selection = name;
  } else {
    selection = selection.name;
  }

  function selectAttachment(attachment) {
    //Add the attachment to the attachment list
    //Update the state to display the attachment name in the box
    if (addAttachment(attachment, name)) {
      console.log(`${attachment.name}, previous state: ${selection}`);
    }
  }
  
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