'use client';

import GunSelection from "./components/GunSelection"
import GunDisplay from "./components/GunDisplay";
import AttachmentDisplay from "./components/AttachmentDisplay";
import BuildList from "./components/BuildList";
import GunBuilder from "./components/GunBuilder";
import { useState } from "react"
import { queryGun } from "./server_actions/queryGun";

export default function Builder() {
    // data will hold the gun document data returned from the database
    const [data, setData] = useState(null);

    // attachments will track the current attachments
    // each attachment will consist of {name: string, type: string, aftermarket: boolean}
    const [attachments, setAttachments] = useState([]);

    // blocks will track the current blocked attachment categories
    // each block will be a string
    const [blocks, setBlocks] = useState([]);

    async function loadGun(gunName, attachmentList) {
        const result = await queryGun(gunName);

        if (result.success) {
            var blockList = [];
            var newAttachments = [];
            for (const key of Object.keys(result.data.attachments)) {
                const exist = result.data.attachments[key].find(attachment => attachmentList.indexOf(attachment.name) > -1);
                if (exist === undefined) {
                    console.log(`Attachment could not be found in category ${key}`);
                    continue;
                }
                newAttachments.push({name: exist.name, type: key, aftermarket: exist.aftermarket});
                if (exist.blocking) {
                    blockList = [...blockList, ...exist.blocks];
                }
            }
            
            setData(result.data);
            setAttachments([...newAttachments]);
            setBlocks([...blockList]);
        } else {
            console.log(result.error);
        }
    }

    // Clear everything to initial state
    function resetAttachments(attachments) {
        setAttachments([...attachments]);
        var newBlocks = [];
        for (const attachment of attachments) {
            if (attachment.blocking) {
                newBlocks = newBlocks.concat(attachment.blocks);
            }
        }
        setBlocks(newBlocks);
    }

    /*
     * Attempt to add the attachment to the attachmentList
     * Cannot add attachment if: 
     *  attachmentList.length = 5
     *  the type (name) is on the blockList
     *  the new attachment's blocking list would block current attachments
     * If the type exists on the attachmentList, remove and replace the old one
     * The function will return true if the addition was successful, false if not
     * @param newAttachment - Object with properties {name: string, blocking: boolean, blocks?: array of strings, aftermarket: boolean}
     * @param attachmentType - type of attachment as string
     * @return boolean - true if addition was successful, false if not
    */
    function addAttachment (newAttachment, attachmentType) {
        //Check if the attachment list is full, if the current block list would not permit the new attachment,
        //or if any current attachments would be blocked by the new attachment's block list
        if (attachments.length == 5 || blocks.indexOf(attachmentType) > -1) {
            console.log("Attachment list full or a current attachment would be blocked!");
            //Raise some error div and don't set any state
            return false;
        }

        if (newAttachment.blocking) {
            const blocksToAdd = newAttachment.blocks;
            const blockingIndex = attachments.findIndex(attachment => blocksToAdd.indexOf(attachment.type) > -1);

            if (blockingIndex > -1) {
                console.log(`Attachment ${newAttachment.name} would block ${attachments[blockingIndex].name}!`);
                //Raise some error div and don't set any state
                return false;
            }
        }

        //Replace the current type attachment with the new one if there is one
        const typeIndex = attachments.findIndex((element) => element.type === attachmentType);
        if (typeIndex !== -1) {
            const attachment = data.attachments[attachmentType].find((element) => element.name === attachments[typeIndex].name);
            if (attachment === undefined) {
                //This should never happen unless the attachment state is out of sync with the database
                console.log("ERROR: THIS SHOULD NEVER HAPPEN?");
                return false;
            }
            console.log(`Attachment type already exists!! Replacing ${attachments[typeIndex].type} with ${newAttachment.name}`);
            
            var newAttachments = [...attachments];
            var newBlocks = [...blocks];
            
            //Remove the old attachments and blocks
            newAttachments = newAttachments.filter(currentAttachment => currentAttachment.name !== attachment.name);
            if (attachment.blocking) {
                for (const block of attachment.blocks) {
                    const place = newBlocks.indexOf(block);
                    if (place === -1) continue;
                    newBlocks.splice(place, 1);
                    console.log(newBlocks);
                }
            }

            //Add the new attachment and update the state at once
            setAttachments([...newAttachments, {name: newAttachment.name, type: attachmentType, aftermarket: newAttachment.aftermarket}]);
            newAttachment.blocking ? setBlocks([...newBlocks, ...newAttachment.blocks]) : setBlocks([...newBlocks]);
            return true;
        } else {
            //Add all blocking types to the block list (duplicates allowed)
            if (newAttachment.blocking) {
                addBlocks(newAttachment.blocks);
            }
            setAttachments([...attachments, {name: newAttachment.name, type: attachmentType, aftermarket: newAttachment.aftermarket}]);
            return true;
        }
    }

    /*
     * Remove an attachment, if it exists
     * Given the circumstances, should always exist
     * Remove its associated blocks as well
     * @param oldAttachment - an Object that should have the properties {name: string, blocking: boolean, blocks?: array of strings}
    */
    function removeAttachment (oldAttachment) {
        setAttachments(attachments.filter(currentAttachment => currentAttachment['name'] !== oldAttachment['name']));
        if (oldAttachment['blocking']) {
            removeBlocks(oldAttachment['blocks']);
        }
    }

    /*
     * addBlocks will concatenate blocks with block
     * @param blockList - an array of strings that specifies the blocked categories to add
    */
    function addBlocks(blockList) {
        setBlocks([...blocks, ...blockList]);
    }

    /*
     * removeBlocks will remove one instance of blockList from blocks
     * @param blockList - an array of strings that specifies the blocked categories to remove
    */
    function removeBlocks(blockList) {
        console.log("Trying to remove", blockList);

        var newBlocks = [...blocks];
        for (const block of blockList) {
            const place = newBlocks.indexOf(block);
            if (place === -1) continue;
            newBlocks.splice(place, 1);
            console.log(newBlocks);
        }
        console.log(newBlocks);
        setBlocks(newBlocks);
    }

    //Fix this to have proper error handling later
    async function receiveData(gun) {
        if (gun === null) {
            //console.log("Gun name is null");
            setData(null);
        } else {
            const result = await queryGun(gun['name']);
            
            if (result.success) {
                console.log(result);
                setData(result.data);
                if (result.data.conversion) {
                    resetAttachments([result.data.conversion_kit]);
                } else {
                    resetAttachments([]);
                }
            } else {
                console.log(result);
            }
        }
    }
    
    return (
        <>
        <GunBuilder data={data} attachments={attachments} blocks={blocks} 
                    receiveData={receiveData} resetAttachments={resetAttachments}
                    addAttachment={addAttachment} removeAttachment={removeAttachment}/>
        <BuildList sendToGunsmith={loadGun}/>
        </>
    );
}