import { useClickAway } from '@uidotdev/usehooks'
import { motion } from 'framer-motion'
import React, { useEffect, useState, useCallback } from 'react'
import { BsReply } from 'react-icons/bs'
import { LuCopy } from 'react-icons/lu'
import { PiShareFatLight } from 'react-icons/pi'
import { useAxesStyle } from '../utils/tools'

export const ContextMenu = ({ x, y, closeContextMenu, onCopy, onTransfert, onReply }) => {

    const ref = useClickAway(() => {
        closeContextMenu();
    });

    const axesStyle = useAxesStyle(x, y);

    return (
        <motion.div ref={ref} className='absolute z-20' style={axesStyle()}>
            <div className='flex flex-col text-sm bg-white shadow rounded' onClick={() => closeContextMenu()}>
                <button className='context-menu-item' onClick={() => onCopy()}>
                    <LuCopy />
                    Copier
                </button>
                <button className='context-menu-item' onClick={() => onTransfert()}>
                    <PiShareFatLight />
                    Transférer
                </button>
                <button className='context-menu-item' onClick={() => onReply()}>
                    <BsReply />
                    Répondre
                </button>
            </div>
        </motion.div>
    )
}