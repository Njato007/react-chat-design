import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { BiConversation, BiGroup, BiSearch } from 'react-icons/bi';
import { RxMagnifyingGlass } from 'react-icons/rx';
import ChatItem from './ChatItem';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import NewGroup from '../NewGroup';
import { RandomConversations, getChatData, sortByLastUpdate } from '../../utils/tools';
import { v1 } from 'uuid';
import { createChat, getChats, getUsers, session } from '../../utils/func';
import useSession from '../../hooks/useSession';
import { BsChatRightDots, BsChatSquareDots } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import ContactItem from '../contact/ContactItem';

const Conversations = ({ visible, onOpenChat, onCloseChat }) => {
    const initialSearch = {
      focus: false,
      value: ''
    }
    const [search, setSearch] = useState(initialSearch);
    const [activeChatId, setActiveChatId] = useState(null);
    const [contactKey, setContactKey] = useState('');
    const [contactsFound, setContactsFound] = useState([]);
    const [showGroupForm, setShowGroupForm] = useState(false);
    const [startConversation, setStartConversation] = useState(false);
    const [chats, setChats] = useState([]);
    const {session} = useSession();

    const handleOpenChat = (chat) => {
        setActiveChatId(chat.id);
        onOpenChat({state: true, chat: chat})
    }

    const handleCreateGroup = (data) => {
        createChat(session.token, {
            users: JSON.stringify(data.members),
            name: data.name
        }).then(res => {
            if (res.status === 200) {
                setShowGroupForm(false);
                setChats(prev => [...prev, res.data]);
            }
        });
    }

    const filter = (data) => {
        return search.value.length === 0 ? [] : data.filter(prev => prev.name.match(search.value));
    }
    
    // Fetch contact to start conversation
    const controller = new AbortController();
    useEffect(() => {
        if (session) {
            if (contactKey !== '') {
                getUsers(session.token, contactKey, controller.signal).then(res => {
                    if (res.status === 200) {
                        setContactsFound(res.data);
                    }
                });
            }
        }
        return () => {
            controller.abort();
        }
    }, [contactKey]);
    
    // Fetch chat
    useEffect(() => {
        if (session) {
            getChats(session.token).then(res => {
                if (res.status === 200) {
                    setChats(res.data);
                    console.log(res.data)
                }
            })
        }
    }, [session]);

    const handleStartConversation = (contact) => {

        console.log(contact)

    }


    if (!visible) return <></>;

    return (
    <>
        {/* search contacts */}
        {
            startConversation ?
                <div className='w-full flex flex-grow p-4'>
                    <div className='w-full max-h-full overflow-y-auto p-2 flex-grow relative rounded-lg bg-gray-100'>
                        <button className="absolute top-0 right-0 p-2 text-gray-700 dark:text-gray-400"
                            onClick={() => setStartConversation(false)}
                        >
                            <IoMdClose className='w-4 h-4' />
                        </button>
                        <div className="search mt-6">
                            <input type="search"
                                className='w-full py-1 px-1 text-xs text-black dark:text-white flex-grow bg-transparent placeholder:text-slate-600 dark:placeholder:text-gray-500 outline-none focus:text-slate-800'
                                placeholder='Chercher un contact'
                                onChange={e => setContactKey(e.target.value)}
                            />
                        </div>
                        <div className="w-full grid grid-cols-1 gap-1">
                            {
                                contactsFound.map(contact => (
                                    <ContactItem
                                        key={contact._id}
                                        contactId={contact._id}
                                        data={contact}
                                        openChat={handleStartConversation}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            :
            <>
                <div className="px-2 my-2">
                    <div className="flex items-center gap-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full p-2 cursor-pointer group">
                        <RxMagnifyingGlass className='text-slate-600 dark:text-gray-500 group-hover:text-indigo-500' />
                        <input type="search"
                            placeholder='Contacts, groupes'
                            className='py-1 px-1 text-xs text-black dark:text-white flex-grow bg-transparent placeholder:text-slate-600 dark:placeholder:text-gray-500 outline-none focus:text-slate-800'
                            onFocus={() => setSearch(prev => ({ ...prev, focus: true }))}
                            onBlur={() => setSearch(prev => ({ ...prev, focus: false }))}
                            onChange={(e) => setSearch(prev => ({ ...prev, value: e.target.value }))}
                        />
                    </div>
                </div>
                {/* New groups */}
                <div className="flex justify-end gap-1 px-4">
                    <button className='text-gray-500 dark:text-gray-400 text-xs font-semibold p-2 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded flex gap-2 items-center justify-start text-left'
                        onClick={() => setStartConversation(true)}
                    >
                        <BsChatRightDots className='w-4 h-4 flex-shrink-0' />
                        {/* <span className='text-xxs'>Démarrer la conversation</span> */}
                    </button>
                    <button className='text-gray-500 dark:text-gray-400 text-xs font-semibold p-2 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 rounded flex gap-2 items-center justify-start text-left'
                        onClick={() => setShowGroupForm(true)}
                    >
                        <AiOutlineUsergroupAdd className='w-5 h-5 flex-shrink-0' />
                        {/* <span className='text-xxs'>Créer un groupe</span> */}
                    </button>
                </div>
        
                {/* Chats */}
                <div className="chats px-2 flex-grow scrollbox scrollbox_delayed w-full">
                    {/* Search results */}
                    <motion.div className="scrollbox-content w-full py-1"
                        initial={{ x: '-100%' }}
                        animate={{
                            x: search.focus || search.value.length > 0 ? '0' : '-100%',
                            height: search.focus || search.value.length > 0 ? 'auto' : '0',
                            opacity: search.focus || search.value.length > 0 ? '1' : '0',
                        }}
                    >
                        <div className="w-full">
                            <fieldset className='border-t border-gray-300 dark:border-gray-600'>
                                <legend className='text-sm font-bold text-gray-700 dark:text-gray-400 my-2 flex items-center gap-1 px-1 ml-2'>
                                    <BiSearch className='h-4 w-4' />
                                    <span>Résultats de recherche</span>
                                </legend>
                            </fieldset>
                            <div className="flex flex-col gap-1 pb-2 py-2 bg-gray-200 dark:bg-gray-950">
                                {
                                    filter(chats).length <= 0 ?
                                        <p className='text-sm text-gray-600 dark:text-gray-400 px-2 text-center'>Aucunes conversations trouvées</p>
                                    : filter(chats).map((chat, i) => (
                                        <div key={i}
                                            onClick={() => handleOpenChat(chat)}
                                        >
                                            <ChatItem i={i}
                                                data={chat}
                                                isActive={activeChatId === chat.id}
                                                onClose={onCloseChat}
                                                activeUser={session}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </motion.div>
                    {/* Conversations list */}
                    <motion.div className="scrollbox-content w-full"
                        animate={{
                            display: search.focus || search.value.length > 0 ? 'none' : 'block',
                        }}
                    >
                        <div className="w-full">
                            <fieldset className='border-t border-gray-300 dark:border-gray-600'>
                                <legend className='text-sm font-bold text-gray-700 dark:text-gray-400 my-2 flex items-center gap-1 px-1 ml-2'>
                                    {/* <BiConversation className='h-4 w-4' /> */}
                                    <span>Conversations</span>
                                </legend>
                            </fieldset>
                            <div className="flex flex-col gap-1 pb-2">
                                {
                                    sortByLastUpdate(chats)
                                    .map((chat, i) => (
                                        <div key={i}
                                            onClick={() => handleOpenChat(chat)}
                                        >
                                            <ChatItem i={i}
                                                data={chat}
                                                isActive={activeChatId === chat.id}
                                                onClose={onCloseChat}
                                                activeUser={session}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: showGroupForm ? [1.1, 1] : 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-[1000]"
                >
                    {showGroupForm && <NewGroup onClose={() => setShowGroupForm(false)} onCreate={handleCreateGroup} />}
                </motion.div>
            </>

        }
    </>
  )
}

export default Conversations