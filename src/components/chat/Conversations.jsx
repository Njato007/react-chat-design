import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { BiConversation, BiGroup, BiSearch } from 'react-icons/bi';
import { RxMagnifyingGlass } from 'react-icons/rx';
import ChatItem from './ChatItem';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import NewGroup from '../NewGroup';
import { RandomConversations, getChatData, sortByLastUpdate } from '../../utils/tools';
import { v1 } from 'uuid';
import { getChats, session } from '../../utils/func';

const Conversations = ({ visible, onOpenChat, onCloseChat }) => {
    const initialSearch = {
      focus: false,
      value: ''
    }
    const [search, setSearch] = useState(initialSearch);
    const [activeChatId, setActiveChatId] = useState(null);
    const [showGroupForm, setShowGroupForm] = useState(false);
    const [chats, setChats] = useState([]);
    const activeUser = session.user();

    const handleOpenChat = (chat) => {
        setActiveChatId(chat.id);
        onOpenChat({state: true, chat: chat})
    }

    const handleCreateGroup = (data) => {
        // setConversations(prev => [...prev, {
        //     id: v1(),
        //     isGroup: true,
        //     lastMessage: '',
        //     name: data.name,
        //     users: data.members,
        //     lastUpdate: new Date(),
        // }]);
        setShowGroupForm(false);
    }

    const filter = (data) => {
        return search.value.length === 0 ? [] : data.filter(prev => prev.name.match(search.value));
    }

    // Fetch chat
    useEffect(() => {
        getChats().then(res => {
            if (res.status === 200) {
                setChats(res.data);
            }
        })
    }, []);

    if (!visible) return <></>;

    return (
    <>
        {/* search contacts */}
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
        <div className="flex items-center justify-start px-2">
            <button className='text-black dark:text-white text-xs font-semibold p-2 bg-transparent dark:hover:bg-gray-800 rounded flex gap-2 items-center'
                onClick={() => setShowGroupForm(true)}
            >
                <AiOutlineUsergroupAdd className='w-6 h-6' />
                Nouveau groupe
            </button>
        </div>

        {/* Chats */}
        <div className="chats p-2 flex-grow scrollbox scrollbox_delayed w-full">
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
                                        isActive={activeChatId === i}
                                        onClose={onCloseChat}
                                        activeUser={activeUser}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </motion.div>
            {/* Conversations list */}
            <div className="scrollbox-content w-full">
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
                                        isActive={activeChatId === i}
                                        onClose={onCloseChat}
                                        activeUser={activeUser}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: showGroupForm ? [1.1, 1] : 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-[1000]"
        >
            {showGroupForm && <NewGroup onClose={() => setShowGroupForm(false)} onCreate={handleCreateGroup} />}
        </motion.div>
    </>
  )
}

export default Conversations