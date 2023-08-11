import { useClickAway } from '@uidotdev/usehooks'
import { motion } from 'framer-motion'
import React, { useEffect, useState, useCallback } from 'react'
import { BsEyeSlash, BsPencil, BsReply, BsTrash } from 'react-icons/bs'
import { LuCopy } from 'react-icons/lu'
import { GoUnread } from 'react-icons/go'
import { BiHide } from 'react-icons/bi'
import { LiaBroomSolid } from 'react-icons/lia'
import { PiShareFatLight } from 'react-icons/pi'
import { useAxesStyle } from '../utils/tools'
import { RxEyeClosed } from 'react-icons/rx'

export const ContextMenu = ({ variant, x, y, closeContextMenu, onCopy, onTransfert, onReply, onDelete, OnUpdate, onUnread }) => {

    const ref = useClickAway(() => {
        closeContextMenu();
    });

    const axesStyle = useAxesStyle(x, y);

    return (
        <motion.div ref={ref} className='fixed z-[1000]' style={axesStyle()}>
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
                <button className='context-menu-item' onClick={() => onReply && onReply()}>
                    <BsReply />
                    Répondre
                </button>
                {
                    variant === 'sender' && <button className='context-menu-item' onClick={() => onDelete()}>
                        <BsTrash />
                        Supprimer
                    </button>
                }
                {
                    variant !== 'sender' && <button className='context-menu-item' onClick={() => onUnread && onUnread()}>
                        <BsEyeSlash />
                        Marquer comme non lu à partir d&apos;ici
                    </button>
                }
            </div>
        </motion.div>
    )
}


export const ContextMenuChatItem = ({ isGroup, closeContextMenu, x, y, onMarkAsUnread, onHide, onLeave, isActive, onCloseConversation }) => {

    const ref = useClickAway(() => {
        closeContextMenu();
    });

    const axesStyle = useAxesStyle(x, y);

    return (
        <motion.div ref={ref} className='fixed z-[1000]' style={axesStyle()}>
            <div className='flex flex-col text-sm bg-white shadow rounded' onClick={() => closeContextMenu()}>
                <button className='context-menu-item' onClick={() => onMarkAsUnread && onMarkAsUnread()}>
                    <GoUnread />
                    Marquer comme non lu
                </button>
                {
                    isActive &&
                    <button className='context-menu-item' onClick={() => onCloseConversation && onCloseConversation()}>
                        <RxEyeClosed />
                        Fermer la conversation
                    </button>
                }
                <button className='context-menu-item' onClick={() => onHide && onHide()}>
                    <BiHide />
                    Dissimuler la conversation
                </button>
                {
                    isGroup &&
                    <button className='context-menu-item border-t border-slate-300' onClick={() => onLeave && onLeave()}>
                        <LiaBroomSolid />
                        Supprimer la conversation
                    </button>
                }
            </div>
        </motion.div>
    )
}