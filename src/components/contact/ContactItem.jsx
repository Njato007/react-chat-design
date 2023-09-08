import { motion } from 'framer-motion'
import React from 'react'
import { profileColor } from '../../utils/tools'

const ContactItem = ({ data, openChat, contactId }) => {

    const handleOpenChat = () => {
        openChat && openChat(contactId)
    }
    const firstChar = data.firstname.charAt(0) ?? '';
    const secondChar = data.lastname.charAt(0) ?? '';

    return (
        <motion.div
            className="flex items-center gap-2 p-2 px-3 rounded-lg hover:bg-indigo-200 dark:hover:bg-sky-950"
            onClick={handleOpenChat}
        >
            {/* Profile */}
            <div className={`relative flex-shrink-0 w-10 h-10 ${profileColor(`${firstChar}${secondChar}`)} rounded-full flex items-center justify-center`}>
                <span className="font-bold text-base uppercase">
                    {firstChar}
                    {secondChar}
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