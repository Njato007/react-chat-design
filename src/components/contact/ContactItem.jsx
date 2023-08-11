import { motion } from 'framer-motion'
import React from 'react'

const ContactItem = ({ openChat, contactId }) => {

    const handleOpenChat = () => {
        openChat(contactId)
    }

    return (
        <motion.div
            className="flex items-center gap-2 p-2 px-3 rounded-lg hover:bg-indigo-100"
            onClick={handleOpenChat}
            initial={{ x: -100 }}
            animate={{ x: 0 }}
        >
            {/* Profile */}
            <div className="relative flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-500 border-2 border-indigo-300 rounded-full flex items-center justify-center">
                <span className="font-bold text-base">A</span>
            </div>
            <div className="flex flex-col justify-center gap-1">
                <h1 className='text-sm font-bold text-gray-600 '>John Doe</h1>
                <div className="flex gap-1">
                    
                </div>
            </div>
        </motion.div>
    )
}

export default ContactItem