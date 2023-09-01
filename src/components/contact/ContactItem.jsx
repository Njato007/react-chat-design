import { motion } from 'framer-motion'
import React from 'react'

const ContactItem = ({ data, openChat, contactId }) => {

    const handleOpenChat = () => {
        openChat && openChat(contactId)
    }

    return (
        <motion.div
            className="flex items-center gap-2 p-2 px-3 rounded-lg hover:bg-indigo-200 dark:hover:bg-sky-950"
            onClick={handleOpenChat}
        >
            {/* Profile */}
            <div className="relative flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-500 border-2 border-indigo-300 rounded-full flex items-center justify-center">
                <span className="font-bold text-base">
                    {data.firstname.charAt(0) ?? ''}
                    {data.lastname.charAt(0) ?? ''}
                </span>
            </div>
            <div className="flex flex-col justify-center gap-1">
                <h1 className='text-sm font-bold text-gray-600 dark:text-gray-400'>{data.firstname} {data.lastname}</h1>
                <div className="flex gap-1">
                    
                </div>
            </div>
        </motion.div>
    )
}

export default ContactItem