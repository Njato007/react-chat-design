import ReactDomServer from 'react-dom/server';
import { BsChevronDown, BsFillSendFill, BsEmojiSmile, BsReply } from 'react-icons/bs';
import { MdCancel, MdOutlineColorLens } from 'react-icons/md'
import { VscFiles } from 'react-icons/vsc'
import { RxCross2 } from 'react-icons/rx'
import { FiActivity, FiArrowLeft } from 'react-icons/fi'
import { IoMdRefreshCircle } from 'react-icons/io'
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, { Emoji, EmojiStyle } from 'emoji-picker-react';
import { motion, useInView } from 'framer-motion';
import { MessageSender, MentionInput, MessageReceiver } from '../MentionComponents';
import { MessagesData, RandomMessages, emojifyText, firstChar, getChatData, getSelectionStart, getTag, groupByDate, groupMessages, includeReplies, insertElement, insertEmojiElement, insertNodeOverSelection, isFileSizeGreaterThan5MB, maximizeDisplay, minimize, profileColor, trimString } from '../../utils/tools';
import { PiImagesSquare } from 'react-icons/pi'
import { v1 } from 'uuid'
import moment from '../../utils/moment.cust';
import FilesList from '../FilesList';
import ScrollContainer from '../ui/ScrollContainer';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import ChatInput from '../ChatInput';
import ThemeSelector from './ThemeSelector';
import Typing, { UserIsTyping } from './Typing';
import Transfert from '../Transfert';
import { deleteConversation, getConversations, getUserIn, postConversation, putConversation, session } from '../../utils/func';

function Chat({ onCloseChat, chat }) {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const displayChats = groupByDate(includeReplies(messages));
  const [isGettingOldMessage, setIsGettingOldMessage] = useState(false);
  const [lastPreviousMessage, setLastPreviousMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const initialState = {
    state: false,
    data: {}
  }
  const [transfert, setTranfert] = useState(initialState);
  // theme (color & bg of chat)
  const [theme, setTheme] = useState('_default');
  const [showTheme, setShowTheme] = useState(false);
  // state for replying
  const [isReplying, setIsReplying] = useState(initialState);
  // state for updating
  const [isUpdating, setIsUpdating] = useState(initialState);
  // uploaded files
  const [uploadedFiles, setUploadedFiles] = useState([]);

  //trigger hooks
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [usersInChat, setUsersInChat] = useState([]);

  const [people, setPeople] = useState([]);
  const activeUser = session.user();
  const [anotherUser, setAnotherUser] = useState({});
  const groupedMessage = groupMessages(messages);

  // fetch message data and users in chat
  useEffect(() => {
    if (!chat) return;
    // getConversations(chat.id).then(res => {
    //   if (res.status === 200) {
    //     setMessages(res.data);
    //   }
    // });
    
    // get all user in the actual chat
    // getUserIn(chat.users).then(res => {
    //   setUsersInChat(res.data)
    //   setPeople(res.data.filter(user => user.id !== activeUser.id));
    //   // if chat is not a group
    //   if (!chat.isGroup) {
    //     const user = res.data.find(user => user.id !== activeUser.id);
    //     user.fullName = `${user.firstname} ${user.lastname}`;
    //     setAnotherUser(user);
    //   }
    // });

  }, [chat]);

  const messageInputRef = useRef();
  const uploaderRef = useRef(null);

  const handleSendMessage = () => {
    if (messageInputRef.current.innerHTML.trim().length === 0 &&
    !messageInputRef.current.innerHTML.includes('<img')) return;
    const minimized = minimize(messageInputRef.current);
    const trimed = trimString(minimized);
    const message = trimed;
    // reply message
    if (isReplying.state) {
      postConversation({
        id: v1(),
        chatId: chat.id,
        sender: activeUser.id,
        replyId: isReplying.data.id,
        message: message,
        reactions: [],
        isRead: true,
        seenBy: [],
        createdAt: new Date().toISOString()
      }).then(res => {
        if (res.status === 201) {
          const newMessage = res.data;
          newMessage.reply = messages.find(message => message.id === res.data.replyId)
          setMessages([...messages, newMessage]);
        }
      })
      // cancel reply
      handleCancelReply();
    }
    // updating message
    else if (isUpdating.state) {
      const messageId = isUpdating.data.id;
      // console.log(messageId)
      const messageToEdit = messages.find(m => m.id === messageId)
      putConversation(messageId, {
        ...messageToEdit, message: message
      }).then(res => {
        if (res.data) {
          setMessages(prev => prev.map(mess =>
            mess.id === messageId ?
              { ...mess, message: res.data.message } : mess
          ));
          setIsUpdating(initialState);
        }
      })
    }
    // send simple message
    else {
      // post
      postConversation({
        id: v1(),
        chatId: chat.id,
        sender: activeUser.id,
        message: message,
        reactions: [],
        isRead: true,
        seenBy: [],
        createdAt: new Date().toISOString()
      }).then(res => {
        if (res.status === 201) {
          setMessages([...messages, res.data]);
        }
      })
    }
    setMessage('');
    messageInputRef.current.innerHTML = '';
    setShowEmoji(false);
    // trigger to scroll to bottom
    setHasNewMessage(!hasNewMessage);
  }

  // Message reaction handler
  const handleReaction = (props) => {
    const { messageId, reaction, isRemoving } = props;
    const messageToUpdate = messages.find(m => m.id === messageId);
    const reactions = [...messageToUpdate.reactions];
    const senderReaction = reactions.find(r => r.user === activeUser.id);
    if (senderReaction) {
      if (isRemoving)
        // Remove reaction
        reactions.splice(reactions.indexOf(senderReaction), 1);
      else
        // Update reaction
        reactions.splice(reactions.indexOf(senderReaction), 1, reaction)
    } else {
      reactions.push(reaction);
    }

    const reactedMessage = {
      ...messageToUpdate,
      reactions: reactions
    }

    putConversation(messageId, reactedMessage).then(res => {
      if (res.data) {
        setMessages(prev => prev.map(message =>
          message.id === messageId ? reactedMessage : message
        ));
      }
    });
  }

  // handle reply message
  const handleReplyMessage = (message) => {
    setIsReplying({
      state: true,
      data: message
    });
    setIsUpdating(initialState);

    // if (messageInputRef.current)
    //   messageInputRef.current.containerElement.querySelector('textarea').focus()
  }

  // handle cancel reply message
  const handleCancelReply = () => {
    setIsReplying({
      state: false,
      data: {}
    });
  }

  // handle pick emoji
  const handlePickEmoji = (selectedEmoji) => {
    const ref = messageInputRef.current;
    if (!ref) return;
    ref.focus();
    insertEmojiElement(messageInputRef, {emoji: selectedEmoji, size: 14});
  }

  // delete message 
  const handleDeleteMessage = (msg) => {
    deleteConversation(msg.id).then(res => {
      setMessages(prev => prev.filter(m => m.id !== msg.id));
    });
  }

  // unread message 
  const handleUnreadMessageFromHere = (msg) => {
    setMessages(prev => prev.map(
      m => ({...m, isRead: m.id !== msg.id})
    ));
  }
  // read message
  const handleReadMessage = (messagesId) => {
    if(!messagesId) return;
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === messagesId ? ({...m, isRead: true}) : m));
    }, 1500);
    
  }

  //transfert message 
  const handleTransfertMessage = (transfertData) => {
    console.log(transfertData)
    setTranfert(false);
  }
  // open transfert message form
  const handleOpenTransfert = (message) => {
    // TODO
    setTranfert({
      state: true,
      data: message
    });

  }

  // update message
  const handleUpdateMessage = (msg) => {
    // cancel reply while updating
    setIsReplying(initialState);
    setIsUpdating({ state: true, data: msg });
    // setMessage
    setMessage(maximizeDisplay(msg.message, true));
    // focus textarea
    // messageInputRef.current.containerElement.querySelector('textarea').focus();
  }

  const handleCancelUpdate = () => {
    setIsUpdating(initialState);
    setMessage('');
  }

  const handleUploadFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!isFileSizeGreaterThan5MB(file)) {
        setUploadedFiles(prev => [...prev, file]);
      } else {
        alert("Fichier est volumineux, on ne peux pas envoyer un fichier de taille supérieur à 5MB")
      }
    }
  }

  // drag drop file component
  // drag state
  const [dragActive, setDragActive] = useState(false);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // upload file
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const [d, setD] = useState(1);
  // get old message
  const getOldMessage = (e) => {
    // setIsGettingOldMessage(true)

    const newMessages = RandomMessages(d);
    // setLastPreviousMessage(messages[0].id);
    // setMessages(prev => [...prev, ...newMessages]);
    // setIsGettingOldMessage(false);
    // setD(prev => prev + 1)
  }


  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-slate-900"
      onDragOver={handleDrag}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between px-2 bg-white dark:bg-gray-800 border-b border-slate-300 dark:border-gray-600 py-3">
        {/* Active room */}
        <div className="flex items-center gap-2">
          <div className='flex items-center justify-center md:hidden'>
            {/* Close chat */}
            <button className="flex-gr text-slate-600 dark:text-gray-400 hover:text-slate-800"
              onClick={onCloseChat}
            >
              <FiArrowLeft className='w-6 h-6' />
            </button>
          </div>
          <div className={`relative w-10 h-10 rounded-full flex items-center justify-center
            ${profileColor(getTag(chat.isGroup ? chat.name : anotherUser.fullName))}`}>
            <span className="font-bold text-base">
              {getTag(chat.isGroup ? chat.name : anotherUser.fullName)}
            </span>
          </div>
          <div className="text-slate-500 dark:text-gray-300 flex flex-col justify-between">
            <h1 className='text-sm font-semibold'>
              {
                chat.isGroup ? chat.name : anotherUser.fullName
              }
            </h1>
            {/* Show status if not a group room */}
            <div className='flex items-center gap-1 text-xs line-clamp-1'>
              <span className='h-fit w-fit p-1 border-2 bg-green-500 border-white rounded-full'></span>
              {/* Status */}
              <span>Actif maintenant</span>
            </div>
            {/* Show participants if a group */}
            {/* <p></p> */}
          </div>
        </div>
        {/* search and gallery */}
        <div className='flex gap-3 items-center px-2'>
          <button className='p-1 text-slate-500 dark:text-gray-400 hover:text-slate-800'
            onClick={() => setShowTheme(true)}
          >
            <MdOutlineColorLens className='w-5 h-5'/>
          </button>
          <button className='p-1 text-slate-500 dark:text-gray-400 hover:text-slate-800'>
            <PiMagnifyingGlassBold className='w-5 h-5'/>
          </button>
          <button className='p-1 text-slate-500 dark:text-gray-400 hover:text-slate-800'>
            <PiImagesSquare className='w-6 h-6'/>
          </button>
          
          {/* Theme selector */}
          <motion.div className="absolute top-20 right-4 z-50 hidden"
            animate={{ display: showTheme ? 'block' : 'none'}}
          >
            <ThemeSelector setTheme={setTheme} currentTheme={theme} onClose={() => setShowTheme(false)}/>
          </motion.div>
        </div>
      </div>
      <ScrollContainer
        dragActive={false}
        haveNewMessage={hasNewMessage}
        onScrollTop={getOldMessage}
        onReadMessage={handleReadMessage}
      >
        {
          isGettingOldMessage &&
          <div className="absolute top-2 w-full flex">
            <div className="shadow-lg rounded-2xl px-3 py-2 border border-slate-200 z-50 bg-white dark:bg-gray-800 flex items-center justify-center w-fit mx-auto">
              <IoMdRefreshCircle className='animate-spin h-8 w-8 text-emerald-500' />
            </div>
          </div>
        }
        {/* <!-- Individual chat message --> */}
        {
          displayChats.map((item, index) => {
            return (
              <motion.div key={index}
                className='flex flex-col opacity-0 duration-500'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <fieldset className='border-t border-slate-200 dark:border-gray-700 my-5'>
                  <legend className='text-center text-xs px-3 text-slate-500'>{moment(new Date(item.date)).calendar()}</legend>
                </fieldset>
                <div className="w-full flex flex-col">
                  {
                    item.messages.map((msg, i) => (
                      <div className="w-full flex flex-col" key={`message-${msg.id}-${i}`}>
                        {msg.sender === activeUser.id ?
                          <MessageSender message={msg}
                            onDelete={handleDeleteMessage}
                            onReply={handleReplyMessage}
                            onUpdate={handleUpdateMessage}
                            onTransfert={() => handleOpenTransfert(msg)}
                            // user={usersInChat.find(u => u.id === msg.sender)}
                            theme={chat.theme}
                          />
                          :
                          <>
                            {/* Display not seen indicator */}
                            { !msg.isRead && 
                              <motion.fieldset
                                className={`border-t-2 border-gray-300 dark:border-gray-700 my-4`}
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                              >
                                <legend className={`${chat.theme} text-transparent bg-clip-text text-center text-sm px-3 py-2 font-bold`}>Nouveau message</legend>
                              </motion.fieldset>
                            }
                            <MessageReceiver message={msg}
                              onReact={handleReaction}
                              onReply={handleReplyMessage}
                              onUnread={handleUnreadMessageFromHere}
                              onTransfert={() => handleOpenTransfert(msg)}
                              theme={chat.theme}
                              user={usersInChat.find(u => u.id === msg.sender)}
                              users={usersInChat}
                            />
                          </>
                        }
                      </div>
                    ))
                  }
                  
                  {
                    isTyping && <UserIsTyping />
                  }

                  {/* <div className='w-full flex items-center gap-1 justify-end px-4'>
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-500 border border-indigo-200 text-xxxs flex items-center justify-center">
                      <span className='font-bold uppercase'>{firstChar('sender')}</span>
                    </div>
                  </div> */}
                </div>
              </motion.div>
            )
          })
        }
        {/* User profile */}
        <div className='w-full text-center font-bold uppercase text-slate-700'>
          Utilisateur
        </div>
      </ScrollContainer>

      <div className='flex flex-col items-center w-full p-3 gap-2 relative bg-gray-50 dark:bg-gray-950'>
        <div className={`bg-white dark:bg-gray-900 w-full max-w-6xl mx-auto flex-grow text-sm rounded-3xl ${showEmoji && 'rounded-t-lg rounded-tr-lg'} border border-gray-300 dark:border-gray-800 px-2 py-1 relative`}>
          {/* Emoji fields */}
          <motion.div className='w-full overflow-hidden hidden' animate={{
            display: showEmoji ? 'block' : 'none',
          }}>
            <EmojiPicker width={'100%'} height={330}
              searchPlaceHolder='Chercher...'
              skinTonesDisabled
              emojiStyle={EmojiStyle.GOOGLE}
              theme='auto'
              previewConfig={{
                showPreview: false,
              }}
              onEmojiClick={handlePickEmoji}
            />
          </motion.div>

          {/* Message to reply */}
          {
            isReplying.state &&
            <motion.div
              // animate={{ opacity: [0, 1] }}
              className="w-full border-b border-slate-300 p-3 flex items-start gap-1  text-gray-900 dark:text-gray-50">
              <BsReply className='w-4 h-4 flex-shrink-0' />
              <div className="flex flex-col flex-grow">
                <p className='line-clamp-3 font-normal chatbox-input'
                  dangerouslySetInnerHTML={{__html: maximizeDisplay(emojifyText(isReplying.data.message))}}
                />
                <p className='text-slate-600 dark:text-gray-400'>
                  {isReplying.data.user}, 10/07/2023
                </p>
              </div>
              <button className="p-1 hover:text-rose-600 text-slate-700" onClick={handleCancelReply}>
                <RxCross2 className='w-4 h-4 flex-shrink-0' />
              </button>
            </motion.div>
          }
          {/* Uploaded files */}
          <input type="file" ref={uploaderRef} hidden multiple onChange={(e) => handleUploadFiles(e.target.files)} />
          <FilesList files={uploadedFiles} changeFiles={setUploadedFiles} onAddFile={() => uploaderRef.current?.click()} />

          <div className="flex items-center gap-1 relative" id='mention_default'>
            <button type="button" className='p-1 hover:bg-indigo-100 dark:hover:text-gray-400 dark:hover:bg-gray-700 text-slate-500 hover:text-slate-800 rounded-full'
              onClick={() => setShowEmoji(!showEmoji)}
            >
              {!showEmoji ? <BsEmojiSmile className='h-5 w-5' /> : <BsChevronDown className='h-5 w-5' />}
            </button>
            {
              uploadedFiles.length === 0 &&
              <button key={2}
                className="flex items-center justify-center flex-grow-0 p-1 rounded-full text-slate-500 hover:bg-indigo-100 dark:hover:text-gray-400 dark:hover:bg-gray-700 hover:text-slate-800 h-fit"
                onClick={() => uploaderRef.current?.click()}
              >
                <VscFiles className='h-5 w-5' />
              </button>
            }

            {/* <TextInput mentionData={mentionData} /> */}
            <ChatInput value={message} ref={messageInputRef} onChange={setMessage} onSubmit={handleSendMessage} people={people} />

            {
              isUpdating.state &&
              <button key={1} className="rounded-full text-rose-400 hover:bg-gray-300 hover:text-rose-500 p-2" onClick={handleCancelUpdate} >
                <MdCancel className='h-5 w-5' />
              </button>
            }
            {
              // message.trim().length > 0 &&
              <motion.button disabled={message.trim().length === -1}
                whileHover={{ scale: 1.3 }}
                className={`rounded-full ${chat.theme} font-bold text-transparent bg-clip-text dark:hover:bg-gray-700 p-2 disabled:cursor-not-allowed`}
                onClick={handleSendMessage} >
                {/* <BsFillSendFill className='h-5 w-5' /> */}
                <i aria-hidden className='fa fa-paper-plane text-xl' />
              </motion.button>
            }
          </div>
        </div>
      </div>
      
        <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: transfert.state ? [1.1, 1] : 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-[1000]"
          >
              {transfert.state && <Transfert onTransfert={handleTransfertMessage} theme={theme} data={transfert.data} onClose={() => setTranfert(false)} />}
          </motion.div>
    </div>
  );
}

export default Chat;
