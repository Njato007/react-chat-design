import { useClickAway } from '@uidotdev/usehooks'
import { motion } from 'framer-motion'
import React, { useEffect, useState, useCallback } from 'react'
import { BsPencil, BsReply, BsTrash } from 'react-icons/bs'
import { LuCopy } from 'react-icons/lu'
import { PiShareFatLight } from 'react-icons/pi'
import { useAxesStyle } from '../utils/tools'

export const ContextMenu = ({ variant, x, y, closeContextMenu, onCopy, onTransfert, onReply, onDelete, OnUpdate }) => {

    const ref = useClickAway(() => {
        closeContextMenu();
    });

    const axesStyle = useAxesStyle(x, y);

    return (
        <motion.div ref={ref} className='absolute z-[1000]' style={axesStyle()}>
            <div className='flex flex-col text-sm bg-white shadow rounded' onClick={() => closeContextMenu()}>
                <button className='context-menu-item' onClick={() => onCopy()}>
                    <LuCopy />
                    Copier
                </button>
                {
                    variant === 'sender' && <button className='context-menu-item' onClick={() => OnUpdate()}>
                        <BsPencil />
                        Modifier
                    </button>
                }
                <button className='context-menu-item' onClick={() => onTransfert()}>
                    <PiShareFatLight />
                    Transférer
                </button>
                <button className='context-menu-item' onClick={() => onReply()}>
                    <BsReply />
                    Répondre
                </button>
                {
                    variant === 'sender' && <button className='context-menu-item' onClick={() => onDelete()}>
                        <BsTrash />
                        Supprimer
                    </button>
                }
            </div>
        </motion.div>
    )
}