import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { BiConversation, BiSearch } from 'react-icons/bi';
import { RxMagnifyingGlass } from 'react-icons/rx';
import ChatItem from '../chat/ChatItem';
import ContactItem from './ContactItem';
import { RandomUsers } from '../../utils/tools';
import { getUsers } from '../../utils/func';
import useSession from '../../hooks/useSession';

const Contacts = ({ visible, onOpenChat }) => {
    const initialSearch = {
      focus: false,
      value: ''
    }
    const [search, setSearch] = useState(initialSearch);
    const [activeChatId, setActiveChatId] = useState(null);
    const [contacts, setContacts] = useState([]);
    const { session } = useSession();

    const handleOpenChat = (id) => {
        setActiveChatId(id);
        onOpenChat({state: true, chatId: id})
    }

    useEffect(() => {
        // setContacts(RandomUsers());
        if (session) {
            getUsers(session.token).then(res => {
                if (res.status === 200) {
                    setContacts(res.data);
                }
            })
        }
    }, [session]);

    if (!visible) return <></>;

    return (
    <>
        {/* search contacts */}
        <div className="px-2 my-2">
            <div className="flex items-center gap-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full p-2 cursor-pointer group">
                <RxMagnifyingGlass className='text-slate-600 dark:text-gray-500 group-hover:text-indigo-500' />
                <input type="search"
                    placeholder='Chercher...'
                    className='py-1 px-1 text-xs flex-grow bg-transparent placeholder:text-slate-600 dark:placeholder:text-gray-500 outline-none focus:text-slate-800'
                    onFocus={() => setSearch(prev => ({ ...prev, focus: true }))}
                    onBlur={() => setSearch(prev => ({ ...prev, focus: false }))}
                    onChange={(e) => setSearch(prev => ({ ...prev, value: e.target.value }))}
                />
            </div>
        </div>

        {/* Chats */}
        <div className="chats p-2 flex-grow scrollbox scrollbox_delayed w-full">
            {/* Conversations list */}
            <div className="scrollbox-content w-full">
                <div className="w-full">
                    <fieldset className='border-t border-gray-300 dark:border-gray-600'>
                        <legend className='text-sm font-bold text-gray-700 dark:text-gray-400 my-2 flex items-center gap-1 px-1 ml-2'>
                            <span>Contacts</span>
                        </legend>
                    </fieldset>
                    <div className="flex flex-col gap-1 pb-2">
                        {
                            contacts.map((contact, i) => (
                                <ContactItem
                                    key={i}
                                    data={contact}
                                    contactId={`contact-${i}`}
                                    openChat={() => handleOpenChat(i)}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Contacts