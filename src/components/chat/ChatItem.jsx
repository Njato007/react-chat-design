import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { ContextMenuChatItem } from '../MessageItem'
import { emojifyText, getTag, maximizeDisplay, profileColor } from '../../utils/tools';
import { getLastConversation, getUser } from '../../utils/func';

const ChatItem = ({ i, data, isActive, onClose, activeUser }) => {
    const initialContextValue = {
        state: false,
        x: 0,
        y: 0
    };

    const [showContext, setShowContext] = useState(initialContextValue);
    const [tag, setTag] = useState('');
    const [userName, setUserName] = useState('');
    const [lastMessage, setLastMessage] = useState('');
    const handleContextMenu = (e) => {
        e.preventDefault();
        const { pageY, pageX } = e;
        setShowContext({
            state: true,
            x: pageX, y: pageY
        })
    }

    const handleCloseContextMenu = () => {
        setShowContext(initialContextValue)
    }

    const handleHideChat = () => {
        
    }

    const handleMarkAsUnreadChat = () => {

    }

    const handleLeaveChat = () => {

    }

    const handleCloseConversation = () => {
        onClose();
    }

    useEffect(() => {
        if (data) {
            console.log(data)
            // Split space and get first char of splited to display
            if (!data.isGroupChat) {
                // get the id of the another user
                // const anotherUserId = data.users.filter(userId => userId !== activeUser.id)[0];
                // getUser(anotherUserId).then(res => {
                //     if (res.status === 200) {
                //         const user = res.data;
                //         setTag(`${user.firstname.charAt(0)}${user.lastname.charAt(0)}`);
                //         setUserName(`${user.firstname} ${user.lastname}`)
                //     }
                // })
            } else {
                console.log('not ', data)
                setTag(getTag(data.chatName));
            }
            // set last message
            // getLastConversation(data.id).then(res => {
            //     if (res.status === 200 && res.data.length > 0) {
            //         setLastMessage(res.data[0].message);
            //     }
            // })
        }
    }, [data])

    return (
        <motion.div
            className={`relative p-3 rounded-lg flex items-center gap-2 justify-between ${isActive && 'bg-indigo-100 dark:bg-gray-700'} active:bg-indigo-200 dark:active:bg-gray-950 hover:bg-indigo-50 dark:hover:bg-gray-950 transition-all duration-200 cursor-pointer`}
            onContextMenu={handleContextMenu}
        >
            {/* Profile & last message */}
            <div className="flex items-center gap-2">
                {/* Profile */}
                <div className={`relative flex-shrink-0 w-10 h-10 ${profileColor(tag)} rounded-full flex items-center justify-center`}>
                    <span className="font-bold text-base">
                        {tag}
                    </span>
                    {/* is not a group */}
                    {
                        data.isGroupChat ?
                            <span className='absolute h-[14px] w-[14px] border-2 bg-pink-500 border-white rounded-full -bottom-0 -right-1'></span>
                        :
                            <span className='absolute h-[14px] w-[14px] border-2 bg-green-500 border-white rounded-full -bottom-0 -right-1'></span>
                    }
                </div>
                <div className="flex flex-col justify-between gap-1">
                    <h1 className='text-sm font-bold text-gray-600 dark:text-gray-300 line-clamp-1'>{data.isGroupChat ? data.chatName : userName}</h1>
                    <div className="flex gap-1">
                        {
                            i === 4 &&
                            <div className="right-2 flex items-center justify-center">
                                <span className='h-fit w-fit px-2 py-0 text-xxs text-white bg-rose-400 rounded-full'>2</span>
                            </div>
                        }
                        <p className={`text-gray-700 dark:text-gray-300 text-sm line-clamp-1 ${i === 4 && 'font-bold'}`}
                            dangerouslySetInnerHTML={{__html: maximizeDisplay(emojifyText(lastMessage))}}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-between">
                <span className="text-xxs text-gray-500">12:44</span>
            </div>
            { showContext.state &&
                <ContextMenuChatItem
                    isGroup={true}
                    closeContextMenu={handleCloseContextMenu}
                    x={showContext.x}
                    y={showContext.y}
                    onHide={handleHideChat}
                    onLeave={handleLeaveChat}
                    onMarkAsUnread={handleMarkAsUnreadChat}
                    isActive={isActive}
                    onCloseConversation={handleCloseConversation}
                />
            }

        </motion.div>
    )
}

export default ChatItem