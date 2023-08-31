import React, { useRef, useState } from 'react'
import { PiMagnifyingGlass } from 'react-icons/pi'
import ContactItem from './contact/ContactItem'
import { MdClose, MdOutlineMobileScreenShare } from 'react-icons/md'
import { AiOutlineCheckSquare, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineUsergroupAdd } from 'react-icons/ai'

const NewGroup = ({onClose, onCreate}) => {

    const gNameRef = useRef(null);
    const [name, setName] = useState('');
    const [search, setSearch] = useState('');
    const [members, setMembers] = useState([2]);

    const handleAddMember = (memberId) => {
        setMembers(prev => [...prev, memberId]);
    }

    const handleRemoveMember = (memberId) => {
        setMembers(prev => prev.filter(member => member !== memberId));
    }

    const handleCreateGroup = () => {
        if (name.trim().length > 1) {

        } else if (members.length < 2) {

        } else {
            const data = {
                name: name,
                members: members
            }
            onCreate && onCreate(data);
        }
    }

    return (
        <div className='w-full max-w-xl bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md'>
            <div className="flex items-center justify-between pb-2 border-b border-gray-300 dark:border-gray-700">
                <h1 className='text-gray-700 dark:text-gray-200 flex gap-2'>
                    <AiOutlineUsergroupAdd className='w-6 h-6' />
                    Nouveau groupe
                </h1>
                <button className='text-gray-500 dark:hover:text-white hover:text-black'
                    onClick={() => onClose && onClose()}
                >
                    <MdClose className='w-6 h-6' />
                </button>
            </div>
            <div className="px-2">
                {/* Nom du groupe */}
                <div className="flex flex-col my-2">
                    <label htmlFor="group-name" className='text-black dark:text-white text-xs py-1'>Nom du groupe</label>
                    <input
                        onChange={e => setName(e.currentTarget.value)}
                        value={name}
                        type="text" id="group-name"
                        className='p-2 text-sm rounded-lg border text-black dark:text-white bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 outline-none focus:ring-1 focus:ring-emerald-500'
                        placeholder='Ecrivez le nom du groupe...'
                    />
                </div>
                <div className="flex flex-col my-2">
                    <label htmlFor="" className='text-black dark:text-white text-xs py-1'>Ajouter des membres</label>
                    <div className="p-2 rounded-lg border bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                        <div className="flex items-center p-2 gap-2">
                            <PiMagnifyingGlass className='flex-shrink-0 text-gray-500'/>
                            <input
                                type="search"
                                onChange={(e) => setSearch(e.currentTarget.value)}
                                className='text-sm text-black dark:text-white flex-grow bg-transparent outline-none'
                                placeholder='Chercher des membres...'
                            />
                        </div>
                        <div className="flex flex-col overflow-y-auto h-fit max-h-[230px] py-1">
                            {
                                Array.from({length: 10}, (_, i) => i + 1).map(id => (
                                    <div key={id}
                                        className='flex items-center gap-0 pr-3 hover:bg-indigo-200 dark:hover:bg-sky-950'
                                    >
                                        {/* <div className={`text-right ${members.indexOf(id) < 0 && 'opacity-0'}`}>
                                            <AiOutlineCheckSquare className={`w-6 h-6 text-emerald-500`}/>
                                        </div> */}

                                        <ContactItem />
                                        {
                                            members.indexOf(id) === -1 ?
                                            <button
                                                className='ml-auto flex items-center gap-2 text-xs font-semibold bg-indigo-600 dark:bg-indigo-900 text-gray-200 dark:text-white p-2 rounded-lg'
                                                onClick={() => handleAddMember(id)}
                                            >
                                                <AiOutlineUserAdd  className='w-6 h-6'/>
                                            </button> :
                                            <button
                                                className='ml-auto flex items-center gap-2 text-xs font-semibold bg-rose-600 dark:bg-rose-900 text-gray-200 dark:text-white p-2 rounded-lg'
                                                onClick={() => handleRemoveMember(id)}
                                            >
                                                <AiOutlineUserDelete  className='w-6 h-6'/>
                                            </button>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        <div className="bg-transparent p-1 px-2">
                            <h1 className='text-black dark:text-white text-sm'>{members.length} membre(s) ajouté(s)</h1>
                        </div>
                    </div>
                    <div className="w-full flex mt-2">
                        <button
                            className="p-2 text-white text-sm bg-emerald-600 rounded-md mx-auto disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={handleCreateGroup}
                            disabled={name.trim().length < 2 && members.length < 2}
                        >
                            Créer le groupe
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NewGroup