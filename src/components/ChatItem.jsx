import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { ContextMenuChatItem } from './MessageItem'

const ChatItem = ({ i, isActive }) => {
    const initialContextValue = {
        state: false,
        x: 0,
        y: 0
    };

    const [showContext, setShowContext] = useState(initialContextValue);

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

    return (
        <motion.div
            className={`relative p-2 rounded-lg flex items-center gap-2 ${i === 0 && 'bg-indigo-100'} hover:bg-indigo-50 transition-all duration-200 cursor-pointer`}
            onContextMenu={handleContextMenu}
        >
            {/* Profile */}
            <div className="relative flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-500 border-2 border-indigo-300 rounded-full flex items-center justify-center">
                <span className="font-bold text-base">U</span>
                <span className='absolute h-3 w-3 border-2 bg-green-500 border-white rounded-full -bottom-0 -right-1'></span>
            </div>
            <div className="text-slate-500 flex flex-col justify-between gap-1">
                <h1 className='text-sm font-bold'>John Doe</h1>
                <div className="flex gap-1">
                    {
                        i === 0 &&
                        <div className="right-2 flex items-center justify-center">
                            <span className='h-fit w-fit px-1 py-0 text-xxs text-white bg-indigo-600 rounded-full'>2</span>
                        </div>
                    }
                    <p className={`text-xs line-clamp-1 ${i === 0 && 'font-bold'}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
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
                />
            }

        </motion.div>
    )
}

export default ChatItem