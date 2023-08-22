import { BsChevronDown, BsFillSendFill, BsEmojiSmile, BsReply } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md'
import { VscFiles } from 'react-icons/vsc'
import { RxCross2 } from 'react-icons/rx'
import { FiArrowLeft } from 'react-icons/fi'
import { IoMdRefreshCircle } from 'react-icons/io'
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { motion, useInView } from 'framer-motion';
import { MessageSender, MentionInput, MessageReceiver } from '../MentionComponents';
import { MessagesData, RandomMessages, firstChar, groupByDate, isFileSizeGreaterThan5MB } from '../../utils/tools';
import { PiImagesSquare } from 'react-icons/pi'
import { v1 } from 'uuid'
import moment from '../../utils/moment.cust';
import FilesList from '../FilesList';
import ScrollContainer from '../ui/ScrollContainer';
import { PiMagnifyingGlassBold } from 'react-icons/pi';

function Chat({ onCloseChat, chatId }) {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const displayChats = groupByDate(messages);
  const [isGettingOldMessage, setIsGettingOldMessage] = useState(false);
  const [lastPreviousMessage, setLastPreviousMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const initialState = {
    state: false,
    data: {}
  }
  // state for replying
  const [isReplying, setIsReplying] = useState(initialState);
  // state for updating
  const [isUpdating, setIsUpdating] = useState(initialState);
  // uploaded files
  const [uploadedFiles, setUploadedFiles] = useState([]);

  //trigger hooks
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messageInputRef = useRef();
  const uploaderRef = useRef(null);

  const handleSendMessage = () => {
    // reply message
    if (isReplying.state) {
      setMessages([...messages, {
        id: v1(),
        user: "sender",
        message: message,
        replyId: isReplying.data.id,
        reply: messages.find(m => m.id === isReplying.data.id),
        reactions: [],
        seenBy: ["sender"],
        createdAt: new Date()
      }]);
      // cancel reply
      handleCancelReply();
    }
    // updating message
    else if (isUpdating.state) {
      const messageId = isUpdating.data.id;
      console.log(messageId)
      setMessages(prev => prev.map(mess =>
        mess.id === messageId ?
          { ...mess, message: message } : mess
      ));
      setIsUpdating(initialState);
    }
    // send simple message
    else {
      setMessages([...messages, {
        id: v1(),
        user: "sender",
        message: message,
        reactions: [],
        seenBy: ["sender"],
        createdAt: new Date()
      }]);
    }
    setMessage('');
    setShowEmoji(false);
    // trigger to scroll to bottom
    setHasNewMessage(!hasNewMessage);
  }

  // Message reaction handler
  const handleReaction = (props) => {
    const { messageId, reaction, isRemoving } = props;
    // Update Message by inserting new Reaction
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        // get reaction
        const reactions = [...message.reactions];
        const senderReaction = reactions.find(r => r.user === 'sender');
        // the sender reaction exists
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
          ...message,
          reactions: reactions
        }
        return reactedMessage;
      }

      return message;
    }));
  }

  // handle reply message
  const handleReplyMessage = (message) => {
    setIsReplying({
      state: true,
      data: message
    });
    setIsUpdating(initialState);

    if (messageInputRef.current)
      messageInputRef.current.containerElement.querySelector('textarea').focus()
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
    const ref = messageInputRef.current.containerElement.querySelector('textarea');
    if (!ref) return;
    const emoji = selectedEmoji.emoji;
    ref.focus();
    const cursor = ref.selectionStart;
    const text = message.slice(0, cursor) + emoji + message.slice(cursor);
    setMessage(text);
    setTimeout(() => {
      ref.setSelectionRange(cursor + emoji.length, cursor + emoji.length);
    }, 100);
  }

  // delete message 
  const handleDeleteMessage = (msg) => {
    setMessages(prev => prev.filter(m => m.id !== msg.id));
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

  // update message
  const handleUpdateMessage = (msg) => {
    // cancel reply while updating
    setIsReplying(initialState);
    setIsUpdating({ state: true, data: msg });
    // setMessage
    setMessage(msg.message);
    // focus textarea
    messageInputRef.current.containerElement.querySelector('textarea').focus();
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
    setMessages(prev => [...prev, ...newMessages]);
    setIsGettingOldMessage(false);
    setD(prev => prev + 1)
  }

  // hooks to fetch message at first render
  useEffect(() => {
    if (!chatId) return;
    setMessages(RandomMessages(chatId + 1));
    // setMessages(MessagesData);
  }, [chatId])

  // after adding emoji
  useEffect(() => {
    messageInputRef.current.containerElement.querySelector('textarea').selectionEnd = cursorPosition;
  }, [cursorPosition]);

  return (
    <div className="flex h-screen flex-col bg-gray-100"
      onDragOver={handleDrag}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between px-2 bg-white border-b border-slate-300 py-3">
        {/* Active room */}
        <div className="flex items-center gap-2">
          <div className='flex items-center justify-center md:hidden'>
            {/* Close chat */}
            <button className="flex-gr text-slate-600 hover:text-slate-800"
              onClick={onCloseChat}
            >
              <FiArrowLeft className='w-6 h-6' />
            </button>
          </div>
          <div className="relative w-10 h-10 bg-indigo-100 text-indigo-500 border-2 border-indigo-300 rounded-full flex items-center justify-center">
            <span className="font-bold text-base">G</span>
          </div>
          <div className="text-slate-500 flex flex-col justify-between">
            <h1 className='text-sm font-semibold'>Selected ROOM</h1>
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
          <button className='p-1 text-slate-500 hover:text-slate-800'>
            <PiMagnifyingGlassBold className='w-5 h-5'/>
          </button>
          <button className='p-1 text-slate-500 hover:text-slate-800'>
            <PiImagesSquare className='w-6 h-6'/>
          </button>

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
            <div className="shadow-lg rounded-2xl px-3 py-2 border border-slate-200 z-50 bg-white flex items-center justify-center w-fit mx-auto">
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
                <fieldset className='border-t border-slate-200 my-5'>
                  <legend className='text-center text-xs px-3 text-slate-500'>{moment(new Date(item.date)).calendar()}</legend>
                </fieldset>
                <div className="w-full flex flex-col">
                  {
                    item.messages.map((msg, i) => (
                      <div className="w-full flex flex-col" key={`message-${msg.id}-${i}`}>
                        {msg.user === "sender" ?
                          <MessageSender message={msg}
                            onDelete={handleDeleteMessage}
                            onReply={handleReplyMessage}
                            onUpdate={handleUpdateMessage}
                          />
                          :
                          <>
                            {/* Display not seen indicator */}
                            { !msg.isRead && 
                              <motion.fieldset
                                className='border-t-2 border-emerald-400 my-4'
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                              >
                                <legend className='text-center text-xs px-3 text-emerald-400 font-semibold'>Nouveau message</legend>
                              </motion.fieldset>
                            }
                            <MessageReceiver message={msg}
                              onReact={handleReaction}
                              onReply={handleReplyMessage}
                              onUnread={handleUnreadMessageFromHere}
                            />
                          </>
                        }
                      </div>
                    ))
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

      <div className='flex items-center w-full p-3 gap-2 relative bg-gray-100'>
        <div className={`bg-white w-full max-w-6xl mx-auto flex-grow text-sm rounded-3xl ${showEmoji && 'rounded-t-lg rounded-tr-lg'} border border-gray-300 px-2 py-1 relative`}>
          {/* Emoji fields */}
          <motion.div className='w-full overflow-hidden hidden' animate={{
            display: showEmoji ? 'block' : 'none',
          }}>
            <EmojiPicker width={'100%'} height={330}
              searchPlaceHolder='Chercher...'
              skinTonesDisabled
              emojiStyle={EmojiStyle.GOOGLE}
              theme='light'
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
              className="w-full border-b border-slate-300 p-3 flex items-start gap-1">
              <BsReply className='w-4 h-4 flex-shrink-0' />
              <div className="flex flex-col flex-grow">
                <p className='line-clamp-3 font-normal'>
                  {isReplying.data.message}
                </p>
                <p className='text-slate-600'>
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
            <button type="button" className='p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full'
              onClick={() => setShowEmoji(!showEmoji)}
            >
              {!showEmoji ? <BsEmojiSmile className='h-5 w-5' /> : <BsChevronDown className='h-5 w-5' />}
            </button>
            {
              uploadedFiles.length === 0 &&
              <button key={2}
                className="flex items-center justify-center flex-grow-0 p-1 rounded-full text-slate-500 hover:bg-indigo-100 hover:text-slate-800 h-fit"
                onClick={() => uploaderRef.current?.click()}
              >
                <VscFiles className='h-5 w-5' />
              </button>
            }
            {/* <TextInput mentionData={mentionData} /> */}
            <MentionInput ref={messageInputRef} onSubmit={handleSendMessage} onChange={setMessage} defaultValue={message} />
            {
              isUpdating.state &&
              <button key={1} className="rounded-full text-rose-400 hover:bg-gray-300 hover:text-rose-500 p-2" onClick={handleCancelUpdate} >
                <MdCancel className='h-5 w-5' />
              </button>
            }
            {
              // message.trim().length > 0 &&
              <button disabled={message.trim().length === -1}
                className="rounded-full text-emerald-800 hover:bg-gray-300 hover:text-emerald-500 p-2 disabled:cursor-not-allowed"
                onClick={handleSendMessage} >
                <BsFillSendFill className='h-5 w-5' />
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
