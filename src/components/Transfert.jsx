import React, { useEffect, useState } from 'react'
import { AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import { MdClose } from 'react-icons/md';
import { PiMagnifyingGlass, PiShareFatLight } from 'react-icons/pi'
import ContactItem from './contact/ContactItem';
import { BsCheck, BsCheckLg } from 'react-icons/bs';
import { getChatData } from '../utils/tools';

const Transfert = ({ data, onClose, onTransfert, theme }) => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);

    // Select people
    const handleAddContact = (contact) => {
        setSelectedContacts(prev => [...prev, contact]);
    }

    // Remove selected
    const handleRemoveContact = (contactId) => {
        setSelectedContacts(prev => prev.filter(Id => Id !== contactId));
    }

    const handleTransfertMessage = () => {
        onTransfert && onTransfert({
            people: selectedContacts,
            data: data
        });
    }

    const filter = (data) => {
        const key = search.toLowerCase();
        return data.filter(item => {
            const fullName = `${item.firstname} ${item.lastname}`;
            return fullName.toLowerCase().includes(key);
        });
    }
    
    useEffect(() => {
        setContacts(getChatData.users)
    }, []);

    return (
        <div className={`${theme} w-full max-w-lg p-[0px] rounded-lg`}>
            <div className=' bg-white dark:bg-slate-800 p-4 shadow-md rounded-lg'>
                <div className="flex items-center justify-between pb-2 border-b border-gray-300 dark:border-gray-700">
                    <h1 className='text-gray-700 dark:text-gray-200 flex gap-2'>
                        <PiShareFatLight className='w-6 h-6' />
                        Transferer ce message à:
                    </h1>
                    <button className='text-gray-500 dark:hover:text-white hover:text-black'
                        onClick={() => onClose && onClose()}
                    >
                        <MdClose className='w-6 h-6' />
                    </button>
                </div>
                <div className="px-2">
                    <div className="flex flex-col my-2">
                        <label htmlFor="search" className='text-black dark:text-white text-xs py-1'>
                            <li className="list-disc">Séléctionner des contacts ou des groupes</li>
                        </label>
                        <div className="p-2 rounded-lg border bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                            <div className="flex items-center p-2 gap-2">
                                <PiMagnifyingGlass className='flex-shrink-0 text-gray-400'/>
                                <input
                                    id='search'
                                    type="search"
                                    onChange={(e) => setSearch(e.currentTarget.value)}
                                    className='text-sm text-black dark:text-white flex-grow bg-transparent outline-none'
                                    placeholder='Chercher...'
                                    autoComplete='new-password'
                                />
                            </div>
                            <div className="flex flex-col overflow-y-auto h-fit max-h-[230px] py-1">
                                {
                                    filter(contacts).map((contact, id) => (
                                        <div key={id}
                                            className='flex items-center gap-0 pr-3 hover:bg-indigo-200 dark:hover:bg-sky-950'
                                        >
                                            {/* <div className={`text-right ${members.indexOf(id) < 0 && 'opacity-0'}`}>
                                                <AiOutlineCheckSquare className={`w-6 h-6 text-emerald-500`}/>
                                            </div> */}

                                            <ContactItem data={contact} />
                                            {
                                                selectedContacts.indexOf(contact.id) === -1 ?
                                                <button
                                                    className='ml-auto flex items-center gap-2 text-xs font-semibold border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-900 text-gray-200 dark:text-white p-2 rounded-lg'
                                                    onClick={() => handleAddContact(contact.id)}
                                                >
                                                    <BsCheck  className='w-6 h-6 opacity-0'/>
                                                </button> :
                                                <button
                                                    className={`ml-auto flex items-center gap-2 text-xs font-semibold ${theme} p-2 rounded-lg text-white`}
                                                    onClick={() => handleRemoveContact(contact.id)}
                                                >
                                                    <BsCheckLg  className='w-6 h-6'/>
                                                </button>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="w-full flex mt-2">
                            <button
                                className={`p-3 px-4 text-white text-sm ${theme} rounded-md mx-auto`}
                                onClick={handleTransfertMessage}
                            >
                                Transérer ce message
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Transfert