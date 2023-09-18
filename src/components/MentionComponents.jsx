import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { BsChevronLeft, BsChevronRight, BsEmojiSmile, BsReply, BsThreeDotsVertical } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { ContextMenu } from './MessageItem';
import { Emoji } from 'emoji-picker-react';
import { useClickAway } from '@uidotdev/usehooks';
import { useResizeObserver } from '../utils/resizeObserver';
import { emojifyText, getTag, maximizeDisplay, minimize, profileColor, trimString, useReactionAxes, useScrollAway, useTheme  } from '../utils/tools';
import moment from '../utils/moment.cust';
import { getUser, session } from '../utils/func';
const initialContextMenu = {
    show: false,
    x: 0,
    y: 0
}
const emojis = ["1f44d", "2764-fe0f", "1f601", "1f602", "1f60b", "2714-fe0f", "1f44c", "1f612", "1f622", "1f60d", "1f497", "1f631"];

const suggestions = [
    { id: '1', display: "Tous le monde" },
    { id: '2', display: "Njato Tiana" },
    { id: '3', display: "Hello" },
];

export const MessageSender = ({ message, onReply, onDelete, onUpdate, onTransfert, theme }) => {

    const [contextMenu, setContextMenu] = useState(initialContextMenu);
    const [reactionWidth, setReactionWidth] = useState(0);
    const [showViewers, setShowViewers] = useState(false);
    const handleContextMenu = (event) => {
        event.preventDefault();
        const { pageX, pageY } = event;
        setContextMenu({ show: true, x: pageX, y: pageY });
    }
    const reaction_Ref = useRef();
    const messageRef = useRef(null);
    const messageP_Ref = useResizeObserver((cr, rest) => {
        if (reaction_Ref.current) {
            setReactionWidth(cr.width + 24);
        }
    });

    // reply message
    const handleReply = () => {
        onReply(message);
    }
    // transfert message
    const handleTransfert = () => {
        onTransfert && onTransfert ('transfering message')
    }
    // copy message
    const handleCopy = () => {
        // navigator.clipboard.writeText(message.message);
        const html = messageRef.current.innerHTML;
        const minimized = minimize(messageRef.current);
        const trimed = trimString(minimized);
        const text = emojifyText(trimed);
        const clipboardItem = new ClipboardItem({
            'text/html':  new Blob([html],
            { type: 'text/html' }),
            'text/plain': new Blob([text],
            {type: 'text/plain'})
        });
        
        navigator.clipboard.write([clipboardItem]).
        then(_ => console.log("clipboard.write() Ok"),
        error => console.log(error));
    }
    // close context menu
    const handleCloseContextMenu = () => setContextMenu(initialContextMenu);

    // delete message
    const handleDelete = () => {
        onDelete(message);
    }

    // update message
    const handleUpdate = () => {
        onUpdate(message);
    }

    useEffect(() => {
        
    }, [message]);

    return (
        <div id={message.id} className="flex self-end message-item ml-auto my-1">
            <div className="w-fit">
                <div className="text-xs w-full flex text-slate-600 dark:text-gray-400">
                    <span className='ml-auto'>{moment(message.createdAt).format('LT')}</span>
                </div>
                <motion.div
                    initial={{ scale: 0, x: 10 }}
                    animate={{ scale: 1, x: 0 }}
                    className={`message-sender flex flex-col text-white ${theme} py-2 px-3 ${message.reactions.length > 0 && 'pb-4'}`}
                    onContextMenu={handleContextMenu}
                    onClick={() => setShowViewers(!showViewers)}
                    ref={messageP_Ref}
                >
                    {
                        message.replyId &&
                        <a href={`#${message.reply.id}`} className="flex flex-col gap-1 border-b border-white pb-2 mb-2">
                            <div className="flex flex-col items-start cursor-pointer">
                                <BsReply className='w-5 h-5 text-white'/>
                                <div className="pl-4">
                                    <p className='chatbox-input italic' dangerouslySetInnerHTML={{__html: maximizeDisplay(emojifyText(message.reply.message))}} />
                                </div>
                            </div>
                            <div className="pl-4">
                                {message.reply.user}, 20/07/23
                            </div>
                        </a>
                    }

                    <div ref={messageRef} className="w-full bg-transparent chatbox-input"
                        dangerouslySetInnerHTML={{__html: maximizeDisplay(emojifyText(message.message))}}
                    />
                </motion.div>

                {/* ReactionEmoji lists in this message */}
                {
                    message.reactions.length > 0 && 
                    <div ref={reaction_Ref} style={{ maxWidth: `${reactionWidth}px` }}
                        className={`-translate-y-4 ${reactionWidth === 0 && 'hidden'} relative z-50`}>
                        <ReactionEmojiList reactions={message.reactions} onClickReaction={() => ''}/>
                    </div>
                }
                {/* Seen by users... */}
                {
                    message.seenBy.length > 0 &&
                    <motion.div className={`text-slate-400 text-xxs py-1`}
                        animate={{
                            y: showViewers ? (message.reactions.length > 0 ? -16 : 0) : -5,
                            display: showViewers ? 'block' : 'none',
                            zIndex: showViewers ? 1 : -10
                        }}
                    >
                        <b>Vu</b> par {message.seenBy.join(', ')}
                    </motion.div>
                }
            </div>
            <button type='button' className='h-fit pl-1 rounded' onClick={handleContextMenu}>
                <BsThreeDotsVertical className='text-slate-500' />
            </button>
            { contextMenu.show &&
                <ContextMenu
                    variant="sender"
                    x={contextMenu.x}
                    y={contextMenu.y}
                    closeContextMenu={handleCloseContextMenu}
                    onReply={handleReply}
                    onCopy={handleCopy}
                    onTransfert={handleTransfert}
                    onDelete={handleDelete}
                    OnUpdate={handleUpdate}
                />
            }
        </div>
    )
}

export const MessageReceiver = ({ message, onReact, onReply, onUnread, onTransfert, theme, user, users }) => {

    const activeUser = session.user();
    const [isMouseEntered, setIsMouseEntered] = useState(false);
    const [isReacting, setIsReacting] = useState({
        state: false,
        position: {}
    });
    const [contextMenu, setContextMenu] = useState(initialContextMenu);
    const [reactionWidth, setReactionWidth] = useState(0);
    const [reactor, setReactor] = useState(null);
    const [isRead, setIsRead] = useState(true);
    const [showViewers, setShowViewers] = useState(false);
    const messageRef = useRef(null);

    const handleContextMenu = (event) => {
        event.preventDefault();
        const { pageX, pageY } = event;
        setContextMenu({ show: true, x: pageX, y: pageY });
    }
    // close reaction emoji component
    const emojiRef = useClickAway(() => {
        setIsReacting(prev => ({...prev, state: false}));
    });

    // click event on reaction
    const handleClickReaction = ({ code, isRemoving }) => {
        setIsReacting(prev => ({...prev, state: false}));
        onReact({
            messageId: message.id,
            reaction: {
                user: activeUser.id,
                emoji: code,
            },
            isRemoving: isRemoving
        });
    }

    const reaction_Ref = useRef();
    const messageP_Ref = useResizeObserver((cr, rest) => {
        if (reaction_Ref.current) {
            setReactionWidth(cr.width + 24);
        }
    });

    const handleCloseContextMenu = () => setContextMenu(initialContextMenu);

    // reply message
    const handleReply = () => {
        onReply(message);
    }
    // transfert message
    const handleTransfert = () => {
        onTransfert && onTransfert(message)
    }
    // copy message
    const handleCopy = () => {
        const html = messageRef.current.innerHTML;
        const text = messageRef.current.innerText;
        const clipboardItem = new ClipboardItem({
            'text/html':  new Blob([html],
            { type: 'text/html' }),
            'text/plain': new Blob([text],
            {type: 'text/plain'})
        });
        
        navigator.clipboard.write([clipboardItem]).
        then(_ => console.log("clipboard.write() Ok"),
        error => console.log(error));
    }
    // unseen message
    const handleUnreadMessage = () => {
        onUnread(message)
    }

    const handleOpenReaction = (e) => {
        const parent = document.getElementById(message.id);
        const { y, width }  = parent.getClientRects().item(0);
        const top = (y >= window.innerHeight - 400) ? -50 : 20;
        const style = width <= 300 ? { left: 16, top } : { right: -16, top};
        setIsReacting({state: true, position: style});
    }

    useEffect(() => {
        setReactor(message.reactions.find(e => e.user === activeUser.id));
        setIsRead(message.isRead);
    }, [message])

    return (
        <div id={message.id} receiver='' read={isRead ? 1 : 0} className="flex items-start self-start gap-2 message-item mr-auto my-1" >
            <div className={`rounded-full flex items-center justify-center font-bold ${profileColor(getTag(user ? `${user.firstname} ${user.lastname}` : null))} min-h-[40px] min-w-[40px]`}>
                {getTag(user ? `${user.firstname} ${user.lastname}` : null)}
            </div>
            <div className='w-fit'>
                <div className="text-xs w-full flex text-slate-600 dark:text-gray-400">
                    <span className='mr-auto'>{moment(message.createdAt).format('LT')}</span>
                </div>

                <div className="flex items-start gap-2">
                    <motion.div
                        initial={{ scale: 0, x: -10 }}
                        animate={{ scale: 1, x: 0 }}
                        className={`message-receiver flex-col text-black dark:text-white bg-gray-200 dark:bg-gray-800 py-2 px-3 relative ${message.reactions.length > 0 && 'pb-4'}`}
                        onMouseEnter={() => setIsMouseEntered(true)}
                        onMouseLeave={() => setIsMouseEntered(false)}
                        onContextMenu={handleContextMenu}
                        ref={messageP_Ref}
                    >
                        {/* Replied message */}
                        {
                            message.replyId &&
                            <a href={`#${message.reply.id}`} className="flex flex-col gap-1 border-b border-slate-800 pb-2 mb-2">
                                <div className="flex flex-col items-start cursor-pointer">
                                    <BsReply className='w-5 h-5 text-black dark:text-white'/>
                                    <div className="pl-4">
                                        <p className='chatbox-input italic' dangerouslySetInnerHTML={{__html: maximizeDisplay(emojifyText(message.reply.message))}} />
                                    </div>
                                </div>
                                <div className="pl-4">
                                    {message.reply.user}, 20/07/23
                                </div>
                            </a>
                        }
                        
                        <div ref={messageRef} className="w-full bg-transparent chatbox-input"
                            dangerouslySetInnerHTML={{__html: maximizeDisplay(emojifyText(message.message))}}
                        />

                        {/* Reaction emojis component */}
                        <motion.div ref={emojiRef} className='hidden absolute -right-4 top-5 z-50 w-fit'
                            style={isReacting.position}
                            animate={{
                                display: isReacting.state ? 'block' : 'hidden',
                                scale: isReacting.state ? 1 : 0
                            }}
                        >
                            <EmojiSelector reactor={reactor} onClick={handleClickReaction} theme={theme} />
                        </motion.div>
                    </motion.div>
                    
                    {/* Reaction Button */}
                    <motion.button type='button' className='p-1 rounded-full right-0 -bottom-2 bg-transparent hover:text-slate-800 text-slate-500 dark:text-gray-400'
                        // animate={{ scale: isMouseEntered ? 1 : 0 }}
                        onClick={handleOpenReaction}
                    >
                        <BsEmojiSmile className='h-4 w-4' />
                    </motion.button>
                </div>


                {/* ReactionEmoji lists in this message */}
                {
                    message.reactions.length > 0 && 
                    <div ref={reaction_Ref} style={{ maxWidth: `${reactionWidth}px` }}
                        className={`-translate-y-4 ${reactionWidth === 0 && 'hidden'} relative z-40`}>
                        <ReactionEmojiList reactions={message.reactions} onClickReaction={handleClickReaction} users={users}/>
                    </div>
                }
                {/* Seen by users... */}
                <motion.div className={`text-slate-400 text-xxs py-1`}
                    animate={{
                        y: showViewers ? (message.reactions.length > 0 ? -16 : 0) : -5,
                        display: showViewers ? 'block' : 'none',
                        zIndex: showViewers ? 1 : -10
                    }}
                >
                    <b>Vu</b> par {message.seenBy.join(', ')}
                </motion.div>
            </div>

            { contextMenu.show &&
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    closeContextMenu={handleCloseContextMenu}
                    onReply={handleReply}
                    onCopy={handleCopy}
                    onTransfert={handleTransfert}
                    onUnread={handleUnreadMessage}
                />
            }
        </div>
    )
}

// List of users reactions
export const ReactionEmojiList = ({reactions, onClickReaction, users}) => {

    const [dummyReactions, setdummyReactions] = useState([]);

    useEffect(() => {
        // unified reactions with same emoji
        const keys = [... new Set(reactions.map(e => e.emoji))];
        const results = [];
        keys.map(key => {
            const reactors = reactions.filter(reaction => reaction.emoji === key);
            const reactorsWithUserInfos = reactors.map(reactor => {
                return ({...reactor, user: users.find(user => user.id === reactor.user)})
            });
            results.push({
                emoji: key,
                reactors: reactorsWithUserInfos
            })
        });
        setdummyReactions(results);
        console.log(results.reactors)
    }, [reactions]);

    if (reactions.length === 0) return null;

    return (
        <div className='w-full flex items-center px-2 flex-wrap gap-1 justify-end'>
        { reactions && dummyReactions.map(reaction =>
            <ReactionItem key={reaction.emoji} emoji={reaction.emoji} reactors={reaction.reactors} onClick={onClickReaction}/>
        )}
        </div>
    )
}

const ReactionItem = ({ emoji, reactors, onClick }) => {
    const [axes, setAxes] = useState({x: 0, y: 0});
    const axesStyle = useReactionAxes(axes.x, axes.y);
    const [show, setShow] = useState(false);
    const activeUser = session.user();

    const fieldRef = useClickAway(() => setShow(false));

    const handleClick = () => {
        onClick({ code: emoji, isRemoving: reactors.some(r => r.user.id === activeUser.id) })
    }
    // hover on element
    const handleMouseEnter = (event) => {
        const {pageX, pageY} = event;
        if (fieldRef.current) {
            setAxes(prev => ({...prev, y: pageY }));
            setShow(true);
        }
    }
    // mouse leave
    const handleMouseLeave = (event) => {
        setShow(false);
    }
    

    return (
        <motion.div
            animate={{
                scale: [0, 1],
            }}
            className='p-1 rounded-3xl bg-white border border-slate-200 flex gap-0 items-center relative cursor-pointer min-w-[24px] min-h-[24px]'
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            
            <Emoji unified={emoji} emojiStyle='google' size={22}/>
            {
                reactors.length > 1 &&
                <span className='text-sm text-slate-700 px-1'>{reactors.length}</span>
            }
                
            <div className={`absolute whitespace-nowrap shadow z-[10000] bottom-10 translate-x-[-50%] left-[50%] ${show ? 'block' : 'hidden'}`}
                ref={fieldRef}
                style={axesStyle()}
            >
                <div className="relative">
                    {
                        axesStyle().isTop ? 
                        <div className='absolute translate-x-[-50%] left-[50%] h-4 w-4 bg-white dark:bg-gray-800 border-l-2 border-t-2 border-gray-200 dark:border-gray-700 rotate-45 !z-[100000] top-[-7px]' />
                        :
                        <div className='absolute translate-x-[-50%] left-[50%] h-4 w-4 bg-white dark:bg-gray-800 border-r-2 border-b-2 border-gray-200 dark:border-gray-700 rotate-45 !z-[100000] bottom-[-7px]' />
                    }
                    <div className="flex flex-col gap-2 w-full bg-white dark:bg-gray-800 p-0 border-2 border-gray-200 dark:border-gray-700 shadow-sm rounded-lg max-h-[200px] overflow-y-auto">
                        {
                            reactors.map((reactor, idx) => (
                                reactor.user ?
                                <div key={idx} className="flex items-center p-3 gap-2 cursor:pointer">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${profileColor(getTag(`${reactor.user.firstname} ${reactor.user.lastname}`))}`}>
                                        <span className="font-semibold text-sm">
                                            {getTag(`${reactor.user.firstname} ${reactor.user.lastname}`)}
                                        </span>
                                    </div>
                                    <p className='text-sm text-black dark:text-white'>{`${reactor.user.firstname} ${reactor.user.lastname}`}</p>
                                </div>
                                : <div key={idx}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export const EmojiSelector = ({ reactor, onClick, theme }) => {
    const ref = useRef();

    const goToPrev = () => {
        ref.current.scrollLeft -= 140;
    }

    const goToNext = () => {
        ref.current.scrollLeft += 140;
    }

    return (
        <div className='flex items-center gap-2 p-1 rounded-full border-2 border-slate-100 shadow bg-white dark:bg-gray-800 dark:border-gray-700'>
            <button className="p-1 flex-shrink-0 rounded-full text-slate-400 hover:bg-slate-200 dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={goToPrev}
            >
                <BsChevronLeft />
            </button>
            <div ref={ref} className="max-w-[140px] scrollbar-hide overflow-x-auto scroll-smooth grid grid-flow-col gap-1 px-1 py-1 snaps-inline">
                {emojis.map(code => <EmojiReaction theme={theme} key={code} active={reactor?.emoji === code} code={code} onClick={onClick} />)}
            </div>
            <button className="p-1 flex-shrink-0 rounded-full text-slate-400 hover:bg-slate-200 dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={goToNext}
            >
                <BsChevronRight />
            </button>
        </div>
    )
}

export const EmojiReaction = ({ code, active,  onClick, theme }) => {

    return (
        <motion.div whileHover={{ y: 0, scale: 1.3, cursor: 'pointer', position: 'relative' }}
            className={`bg-transparent flex-shrink-0 max-w-[24px] min-w-[24px] py-1 snaps-inline--child border-b-2
            ${active ? ` border-gray-600` : 'border-transparent'}`}
            onClick={() => onClick({ code: code, isRemoving: active})}
        >
            <Emoji emojiStyle='google' size={22} unified={code} />
        </motion.div>
    )
}

