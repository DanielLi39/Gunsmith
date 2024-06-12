'use client';

import BuildList from "./BuildList";
import GunBuilder from "./GunBuilder";
import { useState } from "react"
import loadGun from "../actions/loadGun";

export default function Builder( {session} ) {
    // data will hold the gun document data returned from the database
    /* data will hold the object: 
    {
        name: string,                       //Gun name
        type: string,                       //Gun type
        attachments: [
            {'named type': [                //E.g. 'Muzzle', 'Barrel', etc.
                {
                    name: string,           //Attachment name
                    blocking: boolean,      //Does attachment block other types?
                    blocks?: [string]       //blocks is specified only when blocking is true
                    aftermarket: boolean    //Is aftermarket part or not?
                }
            ]}
        ],
        conversion: boolean,                //Is it an aftermarket gun?
        base?: string,                      //Base gun's name if it is an aftermarket gun, specified only if conversion is true
        conversion_kit?: {                  //Conversion kit is specified only if conversion is true
            name: string,                   //Aftermarket part name
            blocking: boolean,              //Does attachment block other types?
            blocks?: [string]               //What types are blocked?
            aftermarket: boolean            //Is it an aftermarket part?
        },
        aftermarkets?: {                    //Base gun only - specifies the aftermarket kits available to the base gun
            conversion_kit: string          //A map linking the aftermarket names to the full name (e.g. JAK Harbinger -> JAK Harbinger M4)
        },
        actions: [string],                  //Array of fire actions available to the gun
        caliber: [string]                   //Array of calibers available to the gun
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

    // TO-DO: Author should be inherited from context once logged in
    // Parameters holds the attachment and blocked type lists, as well as the gunsmith's build details
    // All edits should be bundled into one
    const initialParameters = {
        id: undefined,
        name: '',
        author: session?.user.name,
        gunName: '',
        base: undefined,
        attachments: [],
        blocks: [],
        edit: false,
        public: false
    };

    const [parameters, setParameters] = useState(initialParameters);
    /*
     * queryGun will load in a base gun into the gun builder
     * @param gunName - The gun's name
    */
    async function queryGun(gunName) {
        const result = await loadGun(gunName);

        if (result.success) {
            var blockList = [];
            var newAttachments = [];

            if (result.data.conversion) {
                newAttachments.push([result.data.conversion_kit]);
                if (result.data.conversion_kit.blocking) {
                    blockList = [...result.data.conversion_kit.blocks]
                }
            }
            
            setData(result.data);
            //setAttachments([...newAttachments]);
            //setBlocks([...blockList]);
            setParameters({
                name: '',
                gunName: gunName,
                attachments: [...newAttachments],
                blocks: [...blockList],
                base: result.data.conversion ? result.data.base : undefined,
                edit: false,
                public: false
            });
        } else {
            console.log(result.error);
        }
    }

    /*
     * queryBuild will update the data, attachments, and blocks states to reflect a preloaded build
     * @param build - Object holding the build's id, gun name, name, author, attachments, privacy
    */
    async function queryBuild(build) {
        const result = await loadGun(build.gunName);

        if (result.success) {
            var blockList = [];
            var newAttachments = [];
            for (const key of Object.keys(result.data.attachments)) {
            
                const exist = result.data.attachments[key].find(attachment => build.attachments.indexOf(attachment.name) > -1);
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
            //setAttachments([...newAttachments]);
            //setBlocks([...blockList]);
            //setEdit([true, id]);
            //Fix to signed in user for author -TODO
            setParameters({
                id: build._id,
                name: build.name,
                author: session?.user.name,
                gunName: build.gunName,
                base: result.data.conversion ? result.data.base : undefined,
                attachments: [...newAttachments],
                blocks: [...blockList],
                edit: true,
                public: false
            });
        } else {
            console.log(result.error);
        }
    }

    /*
     * Wrapper function around loadGun to handle receiving the gun specifications from the database
     * @param gun - name of gun to look up
    */
    async function receiveData(gun) {
        if (gun === null) {
            //console.log("Gun name is null");
            setData(null);
        } else {
            const result = await loadGun(gun.name);
            
            if (result.success) {
                var newBlocks = [];
                if (result.data.conversion && result.data.conversion_kit.blocking) {
                    newBlocks = newBlocks.concat(result.data.conversion_kit.blocks);
                }

                console.log(result);
                setData(result.data);
                setParameters({...parameters, 
                    gunName: result.data.name,
                    base: (result.data.conversion ? result.data.base : undefined),
                    attachments: (result.data.conversion) ? [result.data.conversion_kit] : [],
                    blocks: newBlocks
                });
            } else {
                console.log(result);
            }
        }
    }

    /*
     * resetAttachments will reset attachments to the initial state of the gun
     * @param attachments - list of attachments to reset to
    */
    // function resetAttachments(attachments) {
    //     setAttachments([...attachments]);
    //     setParameters({...parameters, attachments: []});

    //     var newBlocks = [];
    //     for (const attachment of attachments) {
    //         if (attachment.blocking) {
    //             newBlocks = newBlocks.concat(attachment.blocks);
    //         }
    //     }
    //     setBlocks(newBlocks);
    // }

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
        //Replace the current type attachment with the new one if there is one
        const typeIndex = parameters.attachments.findIndex((element) => element.type === attachmentType);

        if ((typeIndex == -1 && parameters.attachments.length == 5) || parameters.blocks.indexOf(attachmentType) > -1) {
            console.log("Attachment list full or a current attachment would be blocked!");
            //Raise some error div and don't set any state
            return false;
        }

        if (newAttachment.blocking) {
            const blockingIndex = parameters.attachments.findIndex(attachment => newAttachment.blocks.indexOf(attachment.type) > -1);

            if (blockingIndex > -1) {
                console.log(`Attachment ${newAttachment.name} would block ${parameters.attachments[blockingIndex].name}!`);
                //Raise some error div and don't set any state
                return false;
            }
        }

        var newAttachments = [...parameters.attachments];
        var newBlocks = [...parameters.blocks];

        //If type already exists, remove the old attachment and blocked types
        if (typeIndex !== -1) {
            const attachment = data.attachments[attachmentType].find((element) => element.name === parameters.attachments[typeIndex].name);
            if (attachment === undefined) {
                //This should never happen unless the attachment state is out of sync with the database
                console.log("ERROR: THIS SHOULD NEVER HAPPEN?");
                return false;
            }
            console.log(`Attachment type already exists!! Replacing ${parameters.attachments[typeIndex].type} with ${newAttachment.name}`);
            
            
            newAttachments = newAttachments.filter(currentAttachment => currentAttachment.name !== attachment.name);
            if (attachment.blocking) {
                console.log(`Removing blocks: ${attachment.blocks} from ${newBlocks}`);
                for (const block of attachment.blocks) {
                    const place = newBlocks.indexOf(block);
                    if (place === -1) continue;
                    newBlocks.splice(place, 1);
                }
            }
        }

        console.log(newAttachments, newAttachment);
        console.log(newAttachment.blocking ? [...newBlocks, ...newAttachment.blocks] : [...newBlocks]);
        setParameters({...parameters,
            attachments: [...newAttachments, {name: newAttachment.name, type: attachmentType, aftermarket: newAttachment.aftermarket}],
            blocks: newAttachment.blocking ? [...newBlocks, ...newAttachment.blocks] : [...newBlocks]
        });
        return true;
    }

    /*
     * Remove an attachment, if it exists
     * Given the circumstances, should always exist
     * Remove its associated blocks as well
     * @param oldAttachment - an Object that should have the properties {name: string, blocking: boolean, blocks?: array of strings}
    */
    function removeAttachment (oldAttachment) {
        console.log(oldAttachment);
        var newAttachments = parameters.attachments.filter(currentAttachment => currentAttachment['name'] !== oldAttachment['name']);
        var newBlocks = [...parameters.blocks];

        if (oldAttachment.blocking) {
            for (const block of oldAttachment.blocks) {
                const place = newBlocks.indexOf(block);
                if (place === -1) continue;
                newBlocks.splice(place, 1);
            }
        }
        
        console.log(newBlocks);
        setParameters({...parameters, 
            attachments: newAttachments,
            blocks: newBlocks
        });
    }

    /*
     * addBlocks will concatenate blocks with block
     * @param blockList - an array of strings that specifies the blocked categories to add
    */
    // function addBlocks(blockList) {
    //     setBlocks([...blocks, ...blockList]);
    // }

    /*
     * removeBlocks will remove one instance of blockList from blocks
     * @param blockList - an array of strings that specifies the blocked categories to remove
    */
    // function removeBlocks(blockList) {
    //     console.log("Trying to remove", blockList);

    //     var newBlocks = [...blocks];
    //     for (const block of blockList) {
    //         const place = newBlocks.indexOf(block);
    //         if (place === -1) continue;
    //         newBlocks.splice(place, 1);
    //         console.log(newBlocks);
    //     }
    //     console.log(newBlocks);
    //     setBlocks(newBlocks);
    // }
    
    return (
        <>
        <GunBuilder data={data} parameters={parameters}
                    setParameters={setParameters} receiveData={receiveData}
                    addAttachment={addAttachment} removeAttachment={removeAttachment}/>
        <BuildList sendBuildToGunsmith={queryBuild} sendGunToGunsmith={queryGun} user={session?.user.name}/>
        </>
    );
}