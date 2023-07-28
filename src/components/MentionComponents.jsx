import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { MentionsInput, Mention } from 'react-mentions'
import { MentionInputStyle, MentionPStyle } from '../mention-defaultStyle';
import { BsChevronBarLeft, BsChevronLeft, BsChevronRight, BsEmojiSmile, BsThreeDotsVertical } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { ContextMenu } from './MessageItem';
import { Emoji } from 'emoji-picker-react';
import { useClickAway } from '@uidotdev/usehooks';
import { useResizeObserver } from '../utils/resizeObserver';
import { useAxesStyle, useReactionAxes } from '../utils/tools';
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

export const MentionInput = forwardRef(({ onChange, defaultValue, ...props }, ref) => {
    const [value, setValue] = useState('');

    const handleChange = (value) => {
        setValue(value);
        onChange(value)
    }

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    return (
        <MentionsInput
            ref={ref}
            autoFocus
            style={MentionInputStyle}
            placeholder='Tapez un message'
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className='w-full bg-transparent text-slate-900 text-sm'
            allowSuggestionsAboveCursor
            {...props}
        >
            <Mention
                className='text-black'
                appendSpaceOnAdd={true}
                trigger={'@'}
                displayTransform={(id, display) => `@${display}`}
                renderSuggestion={(entry) => <span className='font-bold'>{entry.display}</span>}
                data={suggestions}

            />
        </MentionsInput>
    )
});

export const MessageSender = ({ message, onReply }) => {

    const handleReply = () => {

    }

    return (
        <div className="flex self-end message-item ml-auto">
            <div className='message-sender text-white bg-gradient-to-r from-emerald-500 to-emerald-600 py-2 px-3'>
                <MentionsInput
                    style={MentionPStyle}
                    placeholder='Tapez un message'
                    value={message.message}
                    readOnly
                    className='w-full bg-transparent'
                >
                    <Mention
                        className='text-white '
                        displayTransform={(id, display) => `@${display}`}
                    />
                </MentionsInput>
            </div>
            <button type='button' className='h-fit pl-1 rounded'>
                <BsThreeDotsVertical className='text-slate-500' />
            </button>
        </div>
    )
}

export const MessageReceiver = ({ message, onReact, onReply }) => {

    const [msg, setMsg] = useState(null);
    const [isMouseEntered, setIsMouseEntered] = useState(false);
    const [isReacting, setIsReacting] = useState(false);
    const [contextMenu, setContextMenu] = useState(initialContextMenu);
    const [reactionWidth, setReactionWidth] = useState(0);
    const [reactor, setReactor] = useState(null);

    const handleContextMenu = (event) => {
        event.preventDefault();
        const { pageX, pageY } = event;
        setContextMenu({ show: true, x: pageX, y: pageY });
    }
    // close reaction emoji component
    const emojiRef = useClickAway(() => {
        setIsReacting(false);
    });

    // click event on reaction
    const handleClickReaction = ({ code, isRemoving }) => {
        setIsReacting(false);
        onReact({
            messageId: message.id,
            reaction: {
                user: 'sender',
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
        onReply(msg);
    }
    // transfert message
    const handleTransfert = () => {
        alert('transfering message')
    }
    // copy message
    const handleCopy = () => {
        navigator.clipboard.writeText(msg.message);
    }


    useEffect(() => {
        setReactor(message.reactions.find(e => e.user === 'sender'));
        setMsg(message);
    }, [message])

    if (!msg) return;


    return (
        <div className="flex items-start self-start gap-2 message-item mr-auto">
            <div className="rounded-full flex items-center justify-center font-bold text-emerald-500 bg-slate-100 ring-2 ring-gray-200 min-h-[40px] min-w-[40px]">
                JD
            </div>
            <div className='w-fit'>
                <div className={`message-receiver text-black bg-gray-200 py-2 px-3 relative ${emojis.length > 0 && 'pb-4'}`}
                    onMouseEnter={() => setIsMouseEntered(true)}
                    onMouseLeave={() => setIsMouseEntered(false)}
                    onContextMenu={handleContextMenu}
                    ref={messageP_Ref}
                >
                    <MentionsInput
                        style={MentionPStyle}
                        placeholder='Tapez un message'
                        value={msg.message}
                        readOnly
                        className='w-full bg-transparent'
                    >
                        <Mention
                            className='text-black '
                            displayTransform={(id, display) => `@${display}`}
                        />
                    </MentionsInput>

                    {/* Reaction emojis component */}
                    <motion.div ref={emojiRef} className='hidden absolute -right-4 top-5' animate={{
                        display: isReacting ? 'block' : 'hidden',
                        scale: isReacting ? 1 : 0
                    }}>
                        <EmojiSelector reactor={reactor} onClick={handleClickReaction} />
                    </motion.div>
                </div>

                {/* ReactionEmoji lists in this message */}
                <div ref={reaction_Ref} style={{ maxWidth: `${reactionWidth}px` }}
                    className={`-translate-y-4 ${reactionWidth === 0 && 'hidden'} relative z-50`}>
                    <ReactionEmojiList reactions={msg.reactions} />
                </div>
            </div>

            {/* Reaction Button */}
            <motion.button type='button' className='p-1 rounded-full right-0 -bottom-2 bg-white hover:text-slate-800 text-slate-500'
                // animate={{ scale: isMouseEntered ? 1 : 0 }}
                onClick={() => setIsReacting(true)}
            >
                <BsEmojiSmile className='h-4 w-4' />
            </motion.button>

            { contextMenu.show &&
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    closeContextMenu={handleCloseContextMenu}
                    onReply={handleReply}
                    onCopy={handleCopy}
                    onTransfert={handleTransfert}
                />
            }
        </div>
    )
}

// List of users reactions
export const ReactionEmojiList = ({reactions}) => {

    const [dummyReactions, setdummyReactions] = useState([]);

    useEffect(() => {
        // unified reactions with same emoji
        const keys = [... new Set(reactions.map(e => e.emoji))];
        const results = [];
        keys.map(key => {
            const reactors = reactions.filter(reaction => reaction.emoji === key);
            results.push({
                emoji: key,
                reactors: reactors
            })
        });

        setdummyReactions(results);
    }, [reactions]);

    return (
        <div className='w-full flex items-center px-2 flex-wrap gap-1'>
        { dummyReactions.map(reaction =>
            <ReactionItem key={reaction.emoji} emoji={reaction.emoji} reactors={reaction.reactors} />
        )}
        </div>
    )
}

const ReactionItem = ({ emoji, reactors }) => {
    const [axes, setAxes] = useState({x: 0, y: 0});
    const axesStyle = useReactionAxes(axes.x, axes.y);
    const [show, setShow] = useState(false);

    const fieldRef = useClickAway(() => setShow(false));

    const handleClick = (event) => {
        const {pageX, pageY} = event;
        if (fieldRef.current) {
            setAxes(prev => ({...prev, y: pageY }));
            setShow(true);
        }
    }

    return (
        <motion.div
            animate={{
                scale: [0, 1],
            }}
            className='p-1 rounded-3xl bg-white border border-slate-200 flex gap-0 items-center relative'
            onClick={handleClick}
        >
            <Emoji unified={emoji} emojiStyle='google' size={24}/>
            {
                reactors.length > 1 &&
                <span className='text-sm text-slate-700 px-1'>{reactors.length}</span>
            }
                
            <div className={`absolute whitespace-nowrap z-[100000] bottom-10 translate-x-[-50%] left-[50%] ${show ? 'block' : 'hidden'}`}
                ref={fieldRef}
                style={axesStyle()}
            >
                <div className="flex flex-col w-full bg-white p-2 border-2 border-emerald-400 shadow-sm rounded-lg">
                    {
                        reactors.map((reactor, idx) => (
                            <div key={idx} className="flex items-center p-1 gap-1">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white">
                                    <span className="font-bold text-emerald-600">{reactor.user.charAt(0)}</span>
                                </div>
                                <p className='text-sm'>{reactor.user}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </motion.div>
    )
}

export const EmojiSelector = ({ reactor, onClick }) => {
    const ref = useRef();

    const goToPrev = () => {
        ref.current.scrollLeft -= 140;
    }

    const goToNext = () => {
        ref.current.scrollLeft += 140;
    }

    return (
        <div className='flex items-center gap-2 p-1 rounded-full border-2 border-slate-100 shadow bg-white'>
            <button className="p-1 flex-shrink-0 rounded-full text-slate-400 hover:bg-slate-200"
                onClick={goToPrev}
            >
                <BsChevronLeft />
            </button>
            <div ref={ref} className="max-w-[140px] scrollbar-hide overflow-x-auto scroll-smooth grid grid-flow-col gap-1 px-1 py-1 snaps-inline">
                {emojis.map(code => <EmojiReaction key={code} active={reactor?.emoji === code} code={code} onClick={onClick} />)}
            </div>
            <button className="p-1 flex-shrink-0 rounded-full text-slate-400 hover:bg-slate-200"
                onClick={goToNext}
            >
                <BsChevronRight />
            </button>
        </div>
    )
}

export const EmojiReaction = ({ code, active,  onClick }) => {

    return (
        <motion.div whileHover={{ y: 0, scale: 1.3, cursor: 'pointer', position: 'relative' }}
            className={`bg-transparent flex-shrink-0 max-w-[24px] min-w-[24px] py-1 snaps-inline--child border-b-2
            ${active ? 'border-emerald-500' : 'border-transparent'}`}
            onClick={() => onClick({ code: code, isRemoving: active})}
        >
            <Emoji emojiStyle='google' size={22} unified={code} />
        </motion.div>
    )
}

