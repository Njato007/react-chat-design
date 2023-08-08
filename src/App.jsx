import { useEffect, useRef, useState } from 'react';
import { MessagesData } from './utils/tools';
import Chat from './components/Chat';
import { BsBell } from 'react-icons/bs';
import { RxMagnifyingGlass } from 'react-icons/rx';
import { motion } from 'framer-motion';
import ChatItem from './components/ChatItem';

function App() {
  const [messages, setMessages] = useState([]);
  // hooks to fetch message at first render
  useEffect(() => {
    // setMessages(RandomMessages(0));
    setMessages(MessagesData);
  }, []);

  return (
    <div className="flex h-screen bg-white">
      <div className="flex flex-col w-[280px] bg-white relative max-md:hidden">
        {/* Profil and search */}
        <div className="flex flex-col gap-2 bg-emerald-50 p-2 py-3">
          {/* Online user profilebox */}
          <div className="flex justify-between items-center">
            {/* Profile photo */}
            <div className="flex gap-2">
              <div className="relative w-10 h-10 bg-indigo-100 text-indigo-500 border-2 border-indigo-300 rounded-full flex items-center justify-center">
                <span className="font-bold">JD</span>
                <span className='absolute h-3 w-3 border-2 bg-green-500 border-white rounded-full -bottom-0 -right-1'></span>
              </div>
              <div className="flex flex-col justify-between">
                <h1 className='text-indigo-950 font-bold'>John Doe</h1>
                <p className='text-slate-700 text-sm'>En ligne</p>
              </div>
            </div>
            {/* Bell notification */}
            <div className="flex items-center justify-center pr-4">
              <div className="relative">
                <BsBell className='w-5 h-5 text-slate-600' />
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-xxxs rounded-full w-fit h-fit px-1">0</span>
              </div>
            </div>
          </div>
          {/* Contact messages groupes */}
          <div className="px-5">
            <div className="flex items-center gap-1 w-full bg-white shadow p-1 rounded-md cursor-pointer group">
              <RxMagnifyingGlass className='text-slate-600 group-hover:text-indigo-500'/>
              <input type="text"
              readOnly
              placeholder='Contacts, groupes, messages'
              className='py-1 px-1 text-xs flex-grow bg-transparent group-hover:placeholder:text-indigo-500 placeholder:text-slate-600 outline-none cursor-pointer' />
            </div>
          </div>
        </div>

        {/* Chats */}
        <div className="chats p-2 pr-0 flex-grow scrollbox scrollbox_delayed w-full">
          <div className="scrollbox-content w-full">
            <h1 className='text-sm font-bold text-slate-600 mb-2'>Conversations</h1>
            <div className="flex flex-col gap-1">
            {
              Array.from({ length: 10 }, (_, i) => (
                <ChatItem key={i} i={i} />
              ))
            }
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-grow flex-col">
        <Chat />
      </div>
    </div>
  );
}

export default App;
