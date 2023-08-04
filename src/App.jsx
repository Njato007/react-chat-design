import { BsChevronDown, BsFillSendFill, BsEmojiSmile, BsReply } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md'
import { VscFiles } from 'react-icons/vsc'
import { RxCross2 } from 'react-icons/rx'
import { IoMdRefreshCircle } from 'react-icons/io'
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { motion, useInView } from 'framer-motion';
import { MessageSender, MentionInput, MessageReceiver } from './components/MentionComponents';
import { RandomMessages, groupByDate, isFileSizeGreaterThan5MB, useOnScreen } from './utils/tools';
import { v1 } from 'uuid'
import moment from './utils/moment.cust';
import FilesList from './components/FilesList';
import ScrollContainer from './components/ui/ScrollContainer';
import { InView } from 'react-intersection-observer'

function App() {
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
    ref.focus();
    setMessage(prev => prev + selectedEmoji.emoji)
  }

  // delete message 
  const handleDeleteMessage = (msg) => {
    setMessages(prev => prev.filter(m => m.id !== msg.id));
  }

  // unread message 
  const handleUnreadMessageFromHere = (msg) => {
    setMessages(prev => prev.map(
      m => ({...m, hasRead: m.id !== msg.id})
    ));
  }
  // read message
  const handleReadMessage = (messagesId) => {
    console.log(messagesId)
    messagesId.forEach(id => {
      
    })
    
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
    setMessages(RandomMessages(0));
  }, [])

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
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-4">
        <h1 className="text-center text-2xl font-bold text-white">Custom chat - Noob</h1>
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
                            { !msg.hasRead && 
                              <fieldset className='border-t-2 border-emerald-400 my-4'>
                                <legend className='text-center text-xs px-3 text-emerald-400 font-semibold'>Nouveau message</legend>
                              </fieldset>
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
                </div>
              </motion.div>
            )
          })
        }
        {/* User profile */}
        <div className='w-full'>
          Utilisateur
        </div>
      </ScrollContainer>

      <div className='flex items-center w-full p-3 gap-2 relative'>
        <div className={`bg-white flex-grow text-sm rounded-3xl ${showEmoji && 'rounded-t-lg rounded-tr-lg'} border border-gray-300 px-2 py-1 relative`}>
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
        {
          uploadedFiles.length === 0 &&
          <button key={2}
            className="flex items-center justify-center flex-grow-0 p-2 rounded-full text-emerald-800 hover:bg-indigo-100 hover:text-emerald-500 h-fit"
            onClick={() => uploaderRef.current?.click()}
          >
            <VscFiles className='h-5 w-5' />
          </button>
        }
      </div>
    </div>
  );
}

export default App;
