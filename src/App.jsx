import { BsChevronDown, BsFillSendFill, BsEmojiSmile, BsReply } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md'
import { VscFiles } from 'react-icons/vsc'
import {RxCross2} from 'react-icons/rx'
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { motion } from 'framer-motion';
import { MessageSender, MentionInput, MessageReceiver } from './components/MentionComponents';
import { MessagesData, groupByDate, scrollToBottom } from './utils/tools';
import {v1} from 'uuid'
import moment from './utils/moment.cust';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagesDisplay, setMessagesDisplay] = useState([]);
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

  const messageInputRef = useRef();
  const containerRef = useRef(null);

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
        {...mess, message: message } : mess
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
    const {messageId, reaction, isRemoving} = props;
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
  }

  const handleCancelUpdate = () => {
    setIsUpdating(initialState);
    setMessage('');
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
      return item.id ? item : ({...item, id: v1()})
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
    <div className="flex h-screen flex-col bg-gray-100">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-4">
          <h1 className="text-center text-2xl font-bold text-white">Custom chat - Noob</h1>
        </div>
        <div className="flex flex-grow overflow-y-auto bg-white scroll-smooth" ref={containerRef}>
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
        <div className='flex w-full p-3 gap-2'>
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
                <BsReply className='w-4 h-4 flex-shrink-0'/>
                <div className="flex flex-col">
                  <p className='line-clamp-3 font-normal'>
                    {isReplying.data.message}
                  </p>
                  <p className='text-slate-600'>
                    {isReplying.data.user}, 10/07/2023
                  </p>
                </div>
                <button className="p-1 hover:text-rose-600 text-slate-700" onClick={handleCancelReply}>
                  <RxCross2 className='w-4 h-4 flex-shrink-0'/>
                </button>
              </motion.div>
            }
            
            <div className="flex items-center gap-1 relative" id='mention_default'>
              <button type="button" className='p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full'
                onClick={() => setShowEmoji(!showEmoji)}
              >
                { !showEmoji ? <BsEmojiSmile className='h-5 w-5'/> : <BsChevronDown className='h-5 w-5'/> }
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
          <button key={2} className="flex-shrink-0 flex-grow-0 rounded-lg text-emerald-800 hover:bg-gray-300 hover:text-emerald-500 p-2"
          >
            <VscFiles className='h-5 w-5' />
          </button>
        </div>
    </div>
  );
}

export default App;
