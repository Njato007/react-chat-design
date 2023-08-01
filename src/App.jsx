import { BsChevronDown, BsFillSendFill, BsEmojiSmile, BsReply } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md'
import { VscFiles } from 'react-icons/vsc'
import { RxCross2 } from 'react-icons/rx'
import { IoMdRefreshCircle } from 'react-icons/io'
import { HiOutlineChevronDown } from 'react-icons/hi'
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { motion } from 'framer-motion';
import { MessageSender, MentionInput, MessageReceiver } from './components/MentionComponents';
import { MessagesData, groupByDate, isFileSizeGreaterThan5MB, scrollToBottom } from './utils/tools';
import { v1 } from 'uuid'
import moment from './utils/moment.cust';
import FilesList from './components/FilesList';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagesDisplay, setMessagesDisplay] = useState([]);
  const [isGettingOldMessage, setIsGettingOldMessage] = useState(false);
  const [isScrolling, setIsScrolling] = useState({
    state: false,
    position: { top: 0 }
  });
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

  const messageInputRef = useRef();
  const containerRef = useRef(null);
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
    // scroll to bottom to see sent message
    setTimeout(() => {
      scrollToBottom(containerRef);
    }, 10)
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

  // get old message
  const getOldMessage = (e) => {
    let element = e.target;
    if (element.scrollTop === 0) {
      setIsGettingOldMessage(true)
      setTimeout(() => {
        setIsGettingOldMessage(false)
      }, 3000);
      console.log('get old message')
    }
    // show scroll to bottom button
    const sh = Math.floor(element.scrollTop + element.clientHeight * 2);
    setIsScrolling(prev => ({
      ...prev, state: sh < element.scrollHeight
    }));
  }

  useEffect(() => {
    // scroll to bottom to see sent message
    setTimeout(() => {
      scrollToBottom(containerRef);
    }, 10);

    // give id to each message
    const messagesWithId = MessagesData.map(item => {
      if (item.replyId) {
        item.reply = MessagesData.find(m => m.id === item.replyId);
      }
      return item.id ? item : ({ ...item, id: v1() })
    });
    // group message by Id
    setMessages(messagesWithId);
  }, [containerRef])

  // after adding emoji
  useEffect(() => {
    messageInputRef.current.containerElement.querySelector('textarea').selectionEnd = cursorPosition;
  }, [cursorPosition]);

  // message display hook
  useEffect(() => {
    setMessagesDisplay(groupByDate(messages));
  }, [messages]);


  return (
    <div className="flex h-screen flex-col bg-gray-100"
      onDragOver={handleDrag}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-4">
        <h1 className="text-center text-2xl font-bold text-white">Custom chat - Noob</h1>
      </div>
      <div className={`flex flex-grow overflow-y-auto ${dragActive ? 'bg-yellow-100' : 'bg-white'} scroll-smooth relative msg-container`} ref={containerRef}
        onScroll={getOldMessage}
      >
        {
          isGettingOldMessage &&
          <div className="absolute top-2 w-full flex">
            <div className="shadow-lg rounded-2xl px-3 py-2 border border-slate-200 z-50 bg-white flex items-center justify-center w-fit mx-auto">
              <IoMdRefreshCircle className='animate-spin h-8 w-8 text-emerald-500' />
            </div>
          </div>
        }
        <div className="flex flex-col space-y-2 p-4 w-full mt-auto">
          {/* <!-- Individual chat message --> */}
          {
            messagesDisplay.map((item, index) => {
              return (
                <>
                  <fieldset className='border-t border-slate-200 my-5' key={index}>
                    <legend className='text-center text-xs px-3 text-slate-500'>{moment(new Date(item.date)).calendar()}</legend>
                  </fieldset>
                  {
                    item.messages.map((message, i) => (
                      message.user === "sender" ?
                        <MessageSender message={message}
                          onDelete={handleDeleteMessage}
                          onReply={handleReplyMessage}
                          onUpdate={handleUpdateMessage}
                          key={message.id}
                        />
                        :
                        <MessageReceiver message={message}
                          onReact={handleReaction}
                          onReply={handleReplyMessage}
                          key={message.id}
                        />
                    ))
                  }
                </>
              )
            })
          }
        </div>
      </div>
      <div className='flex items-center w-full p-3 gap-2 relative'>
        {/* Go to bottom button */}
        {
          isScrolling.state &&
          <div className="absolute right-6 -top-16">
            <button className="relative p-2 w-fit h-fit bg-slate-200 rounded-full cursor-pointer shadow"
              onClick={() => scrollToBottom(containerRef)}
            >
              <span className="text-xs rounded-full px-1 absolute -right-1 -top-1 text-white bg-emerald-600 h-fit w-fit">2</span>
              <HiOutlineChevronDown className='w-6 h-6 text-slate-700' />
            </button>
          </div>
        }
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
              <button disabled={message.trim().length === 0}
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
