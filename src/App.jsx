import { useEffect, useRef, useState } from 'react';
import { MessagesData } from './utils/tools';
import Chat from './components/chat/Chat';
import { BsBell } from 'react-icons/bs';
import { GiConversation } from 'react-icons/gi';
import { AiOutlineContacts, AiOutlineMessage } from 'react-icons/ai';
import { RiContactsBook2Line } from 'react-icons/ri';
import Conversations from './components/chat/Conversations';
import Contacts from './components/contact/Contacts';

function App() {
  const [messages, setMessages] = useState([]);
  const initialOpenChat = {
    state: false,
    chatId: null
  }
  const [openChat, setOpenChat] = useState(initialOpenChat);
  const initialActiveTab = 'conv';
  const [activeTab, setactiveTab] = useState(initialActiveTab);
  
  const handleCloseConversation = () => {
    setTimeout(() => {
      setOpenChat(initialOpenChat);
    }, 0);
  }
  
  const handleOpenConversation = (param) => {
    if (openChat.chatId === param.chatId) return;
    setOpenChat(initialOpenChat);
    setTimeout(() => {
      setOpenChat(param)
    }, 0)
  }

  // hooks to fetch message at first render
  useEffect(() => {
    // setMessages(RandomMessages(0));
    setMessages(MessagesData);
  }, []);


  return (
    <div className="flex h-screen bg-white">
      <div className={`flex flex-col flex-shrink-0 w-[300px] xl:w-[320px]  max-md:w-full bg-white relative ${openChat.state && 'max-md:hidden'}`}>
        {/* Profil and search */}
        <div className="flex flex-col gap-2 px-0">
          {/* Online user profilebox */}
          <div className="flex justify-between items-center px-3 border-b border-gray-200 bg-gray-50 py-4">
            {/* Profile photo */}
            <div className="flex gap-2">
              <div className="relative w-10 h-10 bg-indigo-100 text-indigo-500 border-2 border-indigo-300 rounded-full flex items-center justify-center">
                <span className="font-bold">JD</span>
                {/* status */}
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
          {/* Tab (Contacts, Conversations) */}
          <div className="w-full grid grid-cols-2 gap-2 px-2">
            <button
              className={`${activeTab === 'conv' ? 'text-emerald-400' : 'text-gray-700'} p-2 rounded-lg hover:bg-white flex items-center flex-col hover:text-emerald-500`}
              onClick={() => setactiveTab('conv')}
            >
              <AiOutlineMessage className='w-7 h-7' />
              <p className='text-xs'>Conversations</p>
            </button>
            <button
              className={`${activeTab === 'cont' ? 'text-emerald-400' : 'text-gray-700'} p-2 rounded-lg hover:bg-white flex items-center flex-col hover:text-emerald-500`}
              onClick={() => setactiveTab('cont')}
            >
              <RiContactsBook2Line className='w-7 h-7' />
              <p className='text-xs'>Contacts</p>
            </button>
          </div>
        </div>

        <div className="div">
        </div>

        {/* Tab active */}
        <Conversations
          onCloseChat={handleCloseConversation}
          onOpenChat={handleOpenConversation}
          visible={activeTab === 'conv'}
        />
        <Contacts
          visible={activeTab === 'cont'}
          onOpenChat={handleOpenConversation}
        />
      </div>
      {/* Open chat room */}
      {
      openChat.state &&
      <div className={`flex flex-grow flex-col`}>
        <Chat onCloseChat={handleCloseConversation} chatId={openChat.chatId} />
      </div>
      }
      <div className={`flex-grow flex-col hidden ${!openChat.state && 'md:flex'}`}>
        <div className="m-auto">
          <GiConversation className='w-32 h-32 text-emerald-500' />
          <p className='font-medium w-full text-slate-700'>Messagerie interne</p>
        </div>
      </div>
    </div>
  );
}

export default App;
