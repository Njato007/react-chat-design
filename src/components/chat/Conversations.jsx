import { motion } from 'framer-motion';
import React, { useState } from 'react'
import { BiConversation, BiSearch } from 'react-icons/bi';
import { RxMagnifyingGlass } from 'react-icons/rx';
import ChatItem from './ChatItem';

const Conversations = ({ visible, onOpenChat, onCloseChat }) => {
    const initialSearch = {
      focus: false,
      value: ''
    }
    const [search, setSearch] = useState(initialSearch);
    const [activeChatId, setActiveChatId] = useState(null);

    const handleOpenChat = (id) => {
        setActiveChatId(id);
        onOpenChat({state: true, chatId: id})
    }

    if (!visible) return <></>;

    return (
    <>
        {/* search contacts */}
        <div className="px-2 my-2">
            <div className="flex items-center gap-1 w-full bg-gray-100 rounded-full p-2 cursor-pointer group">
                <RxMagnifyingGlass className='text-slate-600 group-hover:text-indigo-500' />
                <input type="search"
                    placeholder='Contacts, groupes'
                    className='py-1 px-1 text-xs flex-grow bg-transparent placeholder:text-slate-600 outline-none focus:text-slate-800'
                    onFocus={() => setSearch(prev => ({ ...prev, focus: true }))}
                    onBlur={() => setSearch(prev => ({ ...prev, focus: false }))}
                    onChange={(e) => setSearch(prev => ({ ...prev, value: e.target.value }))}
                />
            </div>
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
                    <fieldset className='border-t border-gray-300'>
                        <legend className='text-sm font-bold text-gray-700 my-2 flex items-center gap-1 px-1 ml-2'>
                            <BiSearch className='h-4 w-4' />
                            <span>Résultats de recherche</span>
                        </legend>
                    </fieldset>
                    <div className="flex flex-col gap-1 pb-2">
                        {
                            Array.from({ length: 1 }, (_, i) => (
                                <div key={i}
                                    onClick={() => handleOpenChat(i)}
                                >
                                    <ChatItem i={i}
                                        isActive={activeChatId === i}
                                        onClose={onCloseChat}
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
                    <fieldset className='border-t border-gray-300'>
                        <legend className='text-sm font-bold text-gray-700 my-2 flex items-center gap-1 px-1 ml-2'>
                            {/* <BiConversation className='h-4 w-4' /> */}
                            <span>Conversations</span>
                        </legend>
                    </fieldset>
                    <div className="flex flex-col gap-1 pb-2">
                        {
                            Array.from({ length: 10 }, (_, i) => (
                                <div key={i}
                                    onClick={() => handleOpenChat(i)}
                                >
                                    <ChatItem i={i}
                                        isActive={activeChatId === i}
                                        onClose={onCloseChat}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Conversations