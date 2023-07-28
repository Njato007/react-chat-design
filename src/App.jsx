import { BsChevronDown, BsFillSendFill, BsEmojiSmile, BsReply } from 'react-icons/bs';
import {RxCross2} from 'react-icons/rx'
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { motion } from 'framer-motion';
import { MessageSender, MentionInput, MessageReceiver } from './components/MentionComponents';
import { MessagesData } from './utils/tools';
import {v1} from 'uuid'

function App() {
  const [message, setMessage] = useState('@[Tous le monde](1) Bonjour');
  const [messages, setMessages] = useState(MessagesData.map(item => item.id ? item : ({...item, id: v1()})));
  const [showEmoji, setShowEmoji] = useState(false);
  const [isReplying, setIsReplying] = useState({
    state: false,
    data: {}
  });

  const messageInputRef = useRef();

  const handleSendMessage = () => {
    setMessages([...messages, { user: "sender", message }]);
    setMessage('');
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
        console.log(senderReaction, isRemoving)
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

  const containerRef = useRef(null)

  useEffect(() => {
    // Function to scroll to the bottom of the container
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    // Call the scroll function after each render to handle updates
    scrollToBottom();
  }, [containerRef])

  return (
    <div className="flex h-screen flex-col bg-gray-100">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-4">
          <h1 className="text-center text-2xl font-bold text-white">Custom chat - Noob</h1>
        </div>
        <div className="flex flex-grow overflow-y-auto bg-white" ref={containerRef}>
          <div className="flex flex-col space-y-2 p-4 w-full mt-auto">
            {/* <!-- Individual chat message --> */}
            {
                messages.map((item, i) => (
                  item.user === "sender" ? 
                  <MessageSender message={item} key={i} />
                  :
                  <MessageReceiver message={item} onReact={handleReaction} onReply={handleReplyMessage} key={i} />
              ))
            }
          </div>
        </div>
        <div className='flex flex-col w-full p-3'>
          <div className={`bg-white text-sm rounded-3xl ${showEmoji && 'rounded-t-lg rounded-tr-lg'} border border-gray-300 px-1 py-1 relative`}>
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
                onEmojiClick={console.log}
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
              <MentionInput ref={messageInputRef} onChange={setMessage} defaultValue={message} />
              {
                // message.trim().length > 0 &&
                <button className="rounded-full text-emerald-800 hover:bg-gray-300 hover:text-emerald-500 p-2" onClick={handleSendMessage} >
                  <BsFillSendFill className='h-5 w-5' />
                </button>
              }
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;
