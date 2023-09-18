import { motion } from 'framer-motion'
import React from 'react'
import { getTag, profileColor } from '../../utils/tools'

const ContactItem = ({ data, openChat, contactId }) => {

    const handleOpenChat = () => {
        openChat && openChat(contactId)
    }
    const tag = getTag(data.name);

    return (
        <motion.div
            className="flex items-center gap-2 p-2 px-3 rounded-lg hover:bg-indigo-200 dark:hover:bg-sky-950"
            onClick={handleOpenChat}
        >
            {/* Profile */}
            <div className={`relative flex-shrink-0 w-10 h-10 ${profileColor(tag)} rounded-full flex items-center justify-center`}>
                <span className="font-bold text-base uppercase">
                    {tag}
                </span>
            </div>
            <div className="flex flex-col justify-center gap-1">
                <h1 className='text-sm font-bold text-gray-600 dark:text-gray-400'>{data.name}</h1>
                <div className="flex gap-1">
                    <span className='text-xs text-gray-600 dark:text-gray-500'>{data.email}</span>
                </div>
            </div>
        </motion.div>
    )
}

export default ContactItem