import { useEffect, useRef, useState } from 'react';
import { MessagesData, profileColor } from './../utils/tools';
import Chat from './chat/Chat';
import { BsBell } from 'react-icons/bs';
import { GiConversation } from 'react-icons/gi';
import { AiOutlineContacts, AiOutlineMessage } from 'react-icons/ai';
import { RiContactsBook2Line } from 'react-icons/ri';
import Conversations from './chat/Conversations';
import Contacts from './contact/Contacts';
import ThemSwitcher from './ThemSwitcher';
import { BiCog } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

function Messenger () {
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState({});
  const [userTag, setUserTag] = useState('');
  const navigate = useNavigate();
  const initialOpenChat = {
    state: false,
    chat: null
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
    if (openChat.chat && openChat.chat.id === param.chat.id) return;
    setOpenChat(initialOpenChat);
    setTimeout(() => {
      setOpenChat(param)
    }, 0)
  }

  // hooks to fetch message at first render
  useEffect(() => {
    // setMessages(RandomMessages(0));
    // setMessages(MessagesData);
    const userData = localStorage.getItem('_user');
    if (userData) {
      const user = JSON.parse(userData);
      setActiveUser(user);
      if (user) {
        setUserTag(`${user.firstname.charAt(0)}${user.lastname.charAt(0)}`);
      }
    } else {
      navigate('/');
    }
  }, []);


  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <div className={`flex flex-col flex-shrink-0 w-[300px] xl:w-[320px] max-md:w-full bg-white dark:bg-gray-900 relative ${openChat.state && 'max-md:hidden'}`}>
        {/* Profil and search */}
        <div className="flex flex-col gap-2 p-3">
          {/* Online user profilebox */}
          <div className="flex justify-between items-center rounded-xl px-3 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-4">
            {/* Profile photo */}
            <div className="flex gap-2">
              <div className={`relative flex-shrink-0 ${profileColor(userTag)} w-10 h-10 rounded-full flex items-center justify-center`}>
                <span className="font-bold">{userTag}</span>
                {/* status */}
                <span className='absolute h-3 w-3 border-2 bg-green-500 border-white rounded-full -bottom-0 -right-1'></span>
              </div>
              <div className="flex flex-col justify-between">
                <div className="flex items-center gap-1">
                  <h1 className='text-indigo-950 dark:text-indigo-400 font-bold'>{activeUser?.firstname} {activeUser?.lastname}</h1>
                  {/* Open user info */}
                  <button className='p-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'>
                    <BiCog className='w-5 h-5' />
                  </button>
                </div>
                <p className='text-slate-700 dark:text-slate-300 text-sm'>En ligne</p>
              </div>
            </div>
            {/* Bell notification */}
            <div className="flex items-center justify-center pr-4 gap-3">
              <ThemSwitcher />
              <div className="relative">
                <BsBell className='w-5 h-5 text-slate-600 dark:text-slate-400' />
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-xxxs rounded-full w-fit h-fit px-1">0</span>
              </div>
            </div>
          </div>
          {/* Tab (Contacts, Conversations) */}
          <div className="w-full grid grid-cols-2 gap-2 px-2">
            <button
              className={`${activeTab === 'conv' ? 'text-emerald-400' : 'text-gray-700 dark:text-gray-500'} p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 flex items-center flex-col hover:text-emerald-500`}
              onClick={() => setactiveTab('conv')}
            >
              <AiOutlineMessage className='w-7 h-7' />
              <p className='text-xs'>Conversations</p>
            </button>
            <button
              className={`${activeTab === 'cont' ? 'text-emerald-400' : 'text-gray-700 dark:text-gray-500'} p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 flex items-center flex-col hover:text-emerald-500`}
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
        <Chat onCloseChat={handleCloseConversation} chat={openChat.chat} />
      </div>
      }
      <div className={`flex-grow flex-col hidden ${!openChat.state && 'md:flex'}`}>
        <div className="m-auto">
          <GiConversation className='w-32 h-32 text-emerald-500' />
          <p className='font-medium w-full text-slate-700 dark:text-gray-500'>Messagerie interne</p>
        </div>
      </div>
    </div>
  );
}

export default Messenger;
