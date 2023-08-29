import { motion } from 'framer-motion'
import React from 'react'

const Typing = () => {
    const ballTransition = {
        y: {
            yoyo: Infinity,
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.4,
            ease: 'easeOut',
        }
    };
    const animate = { y: ['50%', '-50%'] };
    return (
        <div className='flex gap-[2px] items-center py-3 px-3 text-white rounded-xl rounded-tl-none bg-gray-200 dark:bg-gray-800'>
            <motion.span
                className='typing_ball'
                transition={{...ballTransition, delay: 0.1}}
                animate={animate}
            />
            <motion.span
                className='typing_ball'
                transition={{...ballTransition, delay: 0.25}}
                animate={animate}
            />
            <motion.span
                className='typing_ball'
                transition={{...ballTransition, delay: 0.4}}
                animate={animate}
            />
        </div>
    )
}

export const UserIsTyping = () => {
    return (
        
        <div className="flex items-center self-start gap-2 message-item mr-auto my-1" >
            <div className="rounded-full flex items-center justify-center font-bold text-emerald-500 bg-slate-100 ring-2 ring-gray-200 min-h-[40px] min-w-[40px]">
                JD
            </div>
            <div>
                <Typing />
            </div>
        </div>
    )
}

export default Typing