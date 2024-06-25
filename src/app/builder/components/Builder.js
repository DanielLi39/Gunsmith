'use client';

import BuildList from "./BuildList";
import GunBuilder from "./GunBuilder";
import { useState, createContext } from "react";
import loadGun from "../actions/loadGun";
import NoteDisplay from "./NotificationDisplay";

export const UserContext = createContext(null);

export default function Builder( {username} ) {
    // data will hold the gun document data returned from the database
    /* data will hold the object: 
    {
        name: string,                                   //Gun name
        type: string,                                   //Gun type
        attachments: [
            {'named type': [                            //E.g. 'Muzzle', 'Barrel', etc.
                {
                    name: string,                       //Attachment name
                    incompatible?: {string: [string]},  //Specifies a list of attachment names and their types that this attachment is incompatible with
                    aftermarket: boolean                //Is aftermarket part or not?
                }
            ]}
        ],
        conversion: boolean,                            //Is it an aftermarket gun?
        base?: string,                                  //Base gun's name if it is an aftermarket gun, specified only if conversion is true
        conversion_kit?: {                              //Conversion kit is specified only if conversion is true
            name: string,                               //Aftermarket part name
            incompatible?: [string],                    //Specifies a list of attachments that this attachment is incompatible with
            aftermarket: boolean                        //Is it an aftermarket part?
        },
        aftermarkets?: [string].                        //Base gun only - a list of aftermarket parts available to the gun
        actions: [string],                              //Array of fire actions available to the gun
        caliber: [string],                              //Array of calibers available to the gun
        incompatible?: {string: [string]}               //Base gun's incompatibilities, same format as attachment object
    }
    */
    const [data, setData] = useState(null);

    // attachments will track the current attachments
    // each attachment will be an object with properties:
    /*
    {
        name: string, 
        type: string, 
        aftermarket: boolean
    }
    */
    //const [attachments, setAttachments] = useState([]);

    // blocks will track the current blocked attachment categories
    // blocks is an array of strings, where each string corresponds to one blocked type
    //const [blocks, setBlocks] = useState([]);

    // Controls whether the gun builder will feature an edit build button or not
    // Only activated when a build is to be displayed
    //const [edit, setEdit] = useState([false, undefined]);

    // Parameters holds the attachment and blocked type lists, as well as the gunsmith's build details
    // All edits should be bundled into one
    const initialParameters = {
        id: undefined,
        name: '',
        gunName: '',
        author: username,
        camo: '',
        base: undefined,
        attachments: [],        //An array of attachment objects: [{name: string, type: string, aftermarket: boolean, incompatible: [string]}]
        blocks: {},             //Formatted as an object {type: [string]}, key holds the category, and the value is the blacklisted attachments
        edit: false,
        public: false
    };

    //const [builds, setBuilds] = useState([]);

    const [parameters, setParameters] = useState(initialParameters);

    //Used to toggle error modals when something goes wrong
    const [err, setErr] = useState({error: false, message: ''});

    /*
     * queryGun will load in a base gun into the gun builder
     * @param gunName - The gun's name
    */
    async function queryGun(gunName) {
        const result = await loadGun(gunName);

        if (result.success) {
            var blockList = {};
            var newAttachments = [];
            
            //Load in conversion's incompatibilities, or factory part incompatibilities
            if (result.data.conversion) {
                newAttachments.push({...result.data.conversion_kit, type: 'Aftermarket'});

                if (result.data.conversion_kit.hasOwnProperty('incompatible')) {
                    for (const [type, incompatibilities] of Object.entries(result.data.conversion_kit.incompatible)) {
                        blockList[type] = [...incompatibilities];
                    }
                }
            } else if (result.data.hasOwnProperty("incompatible")) {
                //No need for redundancy checking if the data is clean (which it should be)
                for (const [type, incompatibilities] of Object.entries(result.data.incompatible)) {
                    blockList[type] = [...incompatibilities];
                }
            }
            
            setData(result.data);
            setParameters({
                ...parameters,
                name: '',
                gunName: gunName,
                camo: '',
                attachments: [...newAttachments],
                blocks: {...blockList},
                base: result.data.conversion ? result.data.base : undefined,
                edit: false,
                public: false
            });
        } else {
            setErr({error: true, message: result.error});
        }
    }

    /*
     * queryBuild will update the data, attachments, and blocks states to reflect a preloaded build
     * @param build - Object holding the build's id, gun name, name, author, attachments, privacy
    */
    async function queryBuild(build) {
        const result = await loadGun(build.gunName);

        if (result.success) {
            var blockList = {};
            var newAttachments = [];

            //Add aftermarket incompatibilities initially if aftermarket gun
            if (result.data.conversion) {
                if (result.data.conversion_kit.hasOwnProperty('incompatible')) {
                    for (const [type, incompatibilities] of Object.entries(result.data.conversion_kit.incompatible)) {
                        blockList[type] = [...incompatibilities];
                    }
                }
                newAttachments.push({...result.data.conversion_kit.name, type: 'Aftermarket'});
            }

            //Iterate through all 
            for (const key of Object.keys(result.data.attachments)) {

                const exist = result.data.attachments[key].find(attachment => build.attachments.indexOf(attachment.name) > -1);
                if (exist === undefined) {
                    console.log(`Attachment could not be found in category ${key}`);
                    continue;
                }
                console.log(exist);
                newAttachments.push({...exist, type: key});
                if (exist.hasOwnProperty('incompatible')) {
                    for (const [type, incompatibilities] of Object.entries(exist.incompatible)) {
                        blockList[type] = blockList.hasOwnProperty(type) ? [...blockList[type], ...incompatibilities] : [...incompatibilities];
                    }
                }
            }

            if (result.data.hasOwnProperty('incompatible')) {
                //Check for any 0 length or nonexistent block types and add factory incompatibilities on there
                for (const [type, incompatibilities] of Object.entries(result.data.conversion_kit.incompatible)) {
                    if (!(blockList[type]?.length)) {
                        blockList[type] = [...incompatibilities];
                    }
                }
            }
            
            console.log(blockList);

            setData(result.data);
            setParameters({
                ...parameters,
                id: build._id,
                name: build.name,
                gunName: build.gunName,
                camo: !build.camo ? '' : build.camo,
                base: result.data.conversion ? result.data.base : undefined,
                attachments: newAttachments,
                blocks: blockList,
                edit: true,
                public: false
            });
        } else {
            setErr({error: true, message: result.error});
        }
    }

    /*
     * Wrapper function around loadGun to handle receiving the gun specifications from the database
     * @param gun - name of gun to look up
    */
    async function receiveData(gun) {
        if (gun === null) {
            setErr({error: true, message: "Could not find gun in database! Missing entry in database."});
            setData(null);
        } else {
            const result = await loadGun(gun.name);
            
            if (result.success) {
                var newBlocks = {};
                if (result.data.conversion) {
                    if (result.data.conversion_kit.hasOwnProperty('incompatible')) {
                        for (const [type, incompatibilities] of Object.entries(result.data.conversion_kit.incompatible)) {
                            console.log(type, incompatibilities);
                            newBlocks[type] = [...incompatibilities];
                        }
                    }
                } else if (result.data.hasOwnProperty("incompatible")) {
                    //No need for redundancy checking if the data is clean (which it should be)
                    for (const [type, incompatibilities] of Object.entries(result.data.incompatible)) {
                        newBlocks[type] = [...incompatibilities];
                    }
                }

                console.log(result);
                setData(result.data);
                setParameters({...parameters, 
                    gunName: result.data.name,
                    base: (result.data.conversion ? result.data.base : undefined),
                    attachments: (result.data.conversion) ? [{...result.data.conversion_kit, type: 'Aftermarket'}] : [],
                    blocks: newBlocks
                });
            } else {
                setErr({error: true, message: result.error});
            }
        }
    }

    /*
     * Attempt to add the attachment to the attachmentList
     * Cannot add attachment if: 
     *  attachmentList.length = 5
     *  the type (name) is on the blockList
     *  the new attachment's blocking list would block current attachments
     * If the type exists on the attachmentList, remove and replace the old one
     * The function will return true if the addition was successful, false if not
     * @param newAttachment - Object with properties {name: string, incompatible?: array of strings, aftermarket: boolean}
     * @param attachmentType - type of attachment as string
     * @return boolean - true if addition was successful, false if not
    */
    function addAttachment (newAttachment, attachmentType) {
        //Check if the attachment list is full,
        //or if any current attachments would be blocked by the new attachment's block list
        //If block list has all 'type', should not have an attachment - do not need to consider this case
        //Thus filter current attachment list by new incompatible list - if length difference, then incompatible
        //Replace the current type attachment with the new one if there is one
        const typeIndex = parameters.attachments.findIndex((element) => element.type === attachmentType);

        //Check for full attachment slots
        if (typeIndex == -1 && parameters.attachments.length == 5) {
            setErr({error: true, message: "Attachments full!"});
            return false;
        }

        if (newAttachment.hasOwnProperty('incompatible')) {
            const blockingIndex = parameters.attachments.findIndex(attachment => newAttachment.incompatible.hasOwnProperty(attachment.type) && 
                                                                                 (newAttachment.incompatible[attachment.type].includes(attachment.name) ||
                                                                                  newAttachment.incompatible[attachment.type].includes(`all ${attachment.type}`)));

            if (blockingIndex > -1) {
                setErr({error: true, message: `New attachment ${newAttachment.name} would block ${parameters.attachments[blockingIndex].name}!`});
                return false;
            }
        }

        var newAttachments = [...parameters.attachments];
        var newBlocks = {...parameters.blocks};

        //If type already exists, remove the old attachment and blocked types
        if (typeIndex !== -1) {
            console.log(`Attachment type already exists!! Replacing ${parameters.attachments[typeIndex].name} with ${newAttachment.name}`);
            
            newAttachments = newAttachments.filter(currentAttachment => currentAttachment.name !== parameters.attachments[typeIndex].name);

            //Remove old attachment incompatibilities
            if (parameters.attachments[typeIndex].hasOwnProperty('incompatible')) {
                console.log(`Removing blocks: ${parameters.attachments[typeIndex].incompatible} from ${newBlocks}`);
                for (const [type, incompatibilities] of Object.entries(newAttachment.incompatible)) {
                    for (const block of incompatibilities) {
                        const place = newBlocks[type].indexOf(block);
                        if (place === -1) continue;
                        newBlocks[type].splice(place, 1);
                    }
                }
            }
        }

        //Add any new attachment incompatibilities
        if (newAttachment.hasOwnProperty('incompatible')) {
            console.log(`Adding new attachment's incompatibilities: ${newAttachment.incompatible}`);
            for (const [type, incompatibilities] of Object.entries(newAttachment.incompatible)) {
                if (newBlocks.hasOwnProperty(type)) {
                    newBlocks[type] = newBlocks[type].concat(incompatibilities);
                } else {
                    newBlocks[type] = [...incompatibilities];
                }
            }
        }

        console.log(newAttachments, newAttachment);
        console.log(newBlocks);
        setParameters({...parameters,
            attachments: [...newAttachments, {...newAttachment, type: attachmentType}],
            blocks: newBlocks
        });
        return true;
    }

    /*
     * Remove an attachment, if it exists
     * Given the circumstances, should always exist
     * Remove its associated blocks as well
     * @param oldAttachment - an Object that should have the properties {name: string, incompatible?: array of strings, aftermarket: boolean}
     * @param type - a string holding the attachment's type, used to reinstate factory incompatibilities or consistency check
    */
    function removeAttachment (oldAttachment) {
        console.log(oldAttachment);
        var newAttachments = parameters.attachments.filter(currentAttachment => currentAttachment['name'] !== oldAttachment['name']);
        var newBlocks = {...parameters.blocks};

        //Remove only one instance of the old attachment's incompatibilities
        if (oldAttachment.hasOwnProperty('incompatible')) {
            console.log(`Removing blocks: ${oldAttachment.incompatible} from ${newBlocks}`);
            for (const [type, incompatibilities] of Object.entries(oldAttachment.incompatible)) {
                for (const block of incompatibilities) {
                    const place = newBlocks[type].indexOf(block);
                    if (place === -1) continue;
                    newBlocks[type].splice(place, 1);
                }
            }
        }
        
        console.log(newBlocks);

        //Reinstate factory incompatibilities
        if (data.hasOwnProperty('incompatible')) {
            for (const type of Object.keys(data.incompatible)) {
                //If blocking array is 0 or doesn't exist and corresponding incompatibility type exists in gun, reinstate factory
                console.log("Checking type", type);
                if (!newBlocks[type]?.length && !!(data.incompatible?.hasOwnProperty(type))) {
                    console.log(`Factory parts reinstated for type ${type}: ${data.incompatible[type]}`);
                    newBlocks[type] = [...data.incompatible[type]];
                }
            }
        }
        

        setParameters({...parameters, 
            attachments: newAttachments,
            blocks: newBlocks
        });
    }
    
    return (
        <UserContext.Provider value={username}>
            <NoteDisplay err={err} setErr={setErr}/>
            <GunBuilder data={data} parameters={parameters}
                        setParameters={setParameters} receiveData={receiveData} setErr={setErr}
                        addAttachment={addAttachment} removeAttachment={removeAttachment}/>
            <BuildList sendBuildToGunsmith={queryBuild} sendGunToGunsmith={queryGun}/>
        </UserContext.Provider>
    );
}