import { Emoji } from 'emoji-picker-react';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'
import ReactDomServer from 'react-dom/server'
import { getCaretPosition, insertElement, insertLine, insertMentionElement, insertPeopleAsElement, insertTextNode, maximizeDisplay, minimize, moveCursorToLast, setCaretPosition } from '../utils/tools';
import ContactItem from './contact/ContactItem';

const ChatInput = React.forwardRef((props, ref) => {
    const [showMentionComp, setShowMentionComp] = useState(false);
    const mentionList = ['someone', 'anyone', 'everyone'];
    const [mentions, setMentions] = useState([]);
    const [value, setValue] = useState('');
    const [text, setText] = useState(props.value);
    const [isFocus, setIsFocus] = useState(false);
    const [showPlaceholder, setShowPlaceholder] = useState(false);
    const [activeMention, setActiveMention] = useState(null);

    useEffect(() => {
        setText(props.value);
        setTimeout(() => {
            moveCursorToLast(ref);
        }, 0);
        // to hide placeholder
        setValue(props.value);
    }, [props.value]);

    // people change
    useEffect(() => {
        const firstPeople = props.people[0];
        if (firstPeople) {
            setActiveMention(firstPeople);
        }
        setMentions(props.people)
    }, [props.people]);

    // handle when element has been inserted in the div content editable
    useEffect(() => {
        const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
              setValue(minimize(ref.current.innerHTML));
            }
          });
        });
    
        if (ref.current) {
          observer.observe(ref.current, {
            childList: true,
            subtree: true,
          });
        }
    
        return () => {
          observer.disconnect();
        };
    }, []);

    // use to remove mention indication
    const removeMentionIfExists = () => {
        const mention = document.getElementById('_mention');
        if (mention) {
            const text = mention.innerHTML;
            mention.remove();
            insertTextNode(ref, text);
       }
    }

    const handleCheckMention = (event) => {
        // Cross-browser solution: use key or keyCode
        const keyPressed = event.key || event.keyCode;

        // Submitting form
        if (!event.shiftKey && (keyPressed === 'Enter' || keyPressed === 13) && !showMentionComp) {
            event.preventDefault();
            props.onSubmit && props.onSubmit();
        }

        // Check if the "@" character was pressed
        if (keyPressed === '@' || keyPressed === 50) {
            removeMentionIfExists();
            // set mentions list to initial
            setMentions(props.people);
            event.preventDefault();
            const span = insertMentionElement();
            span.focus();
            // Your custom logic here
            setShowMentionComp(true);
        }
        // While the mention suggestion component shown
        if (showMentionComp) {
            // Handling up and down while mention suggestion poped up
            const activeIndex = mentions.indexOf(activeMention);
            const length = mentions.length;
            // Arrow Up button
            if (keyPressed === 'ArrowUp' || keyPressed === 38) {
                event.preventDefault();
                const prev = activeIndex - 1;
                setActiveMention(mentions[prev < 0 ? length - 1 : prev]);
            }
            // Arrow Down button
            else if (keyPressed === 'ArrowDown' || keyPressed === 40) {
                event.preventDefault();
                const next = activeIndex + 1;
                setActiveMention(mentions[next >= length ? 0 : next]);
            }
             // Pressing space button
            else if (keyPressed === ' ' || keyPressed === 32) {
                // Replace mention element with its content
                removeMentionIfExists();
                setShowMentionComp(false);
            }
            // Pressing Enter
            if (keyPressed === 'Enter' || keyPressed === 13) {
                if (mentions.length > 0) {
                    event.preventDefault();
                        handlePickMention(activeMention);
                }
            }
        }


        // removing tag mention (suggestion)
        if (event.key === 'Backspace') {// backspace
            try {
                // fix backspace bug in FF
                // https://bugzilla.mozilla.org/show_bug.cgi?id=685445
                var selection = window.getSelection();
                if (!selection.isCollapsed || !selection.rangeCount) {
                    return;
                }
        
                var curRange = selection.getRangeAt(selection.rangeCount - 1);
                if (curRange.commonAncestorContainer.nodeType == 3 && curRange.startOffset > 0) {
                    // we are in child selection. The characters of the text node is being deleted
                    return;
                }
        
                var range = document.createRange();
                var target = event.target;
                if (selection.anchorNode != target) {
                    // selection is in character mode. expand it to the whole editable field
                    range.selectNodeContents(target);
                    range.setEndBefore(selection.anchorNode);
                } else if (selection.anchorOffset > 0) {
                    range.setEnd(target, selection.anchorOffset);
                } else {
                    // reached the beginning of editable field
                    return;
                }
                range.setStart(target, range.endOffset - 1);
        
        
                var previousNode = range.cloneContents().lastChild;
                if (previousNode && previousNode.contentEditable == 'false') {
                    // this is some rich content, e.g. smile. We should help the user to delete it
                    range.deleteContents();
                    event.preventDefault();
                }
            } catch {}
        }

    }

    const handlePickMention = (suggestion) => {
        // replace mention element to people name
        const mention = document.getElementById('_mention');
        if (mention) {
            mention.remove();
            // insert the people mentioned
            insertPeopleAsElement(ref, <span id={suggestion.id} className='mentioned_people'>@{suggestion.firstname}</span>);
            // add space in the end
            insertTextNode(ref, '&nbsp;');
        }
        setShowMentionComp(false);
    }

    const handleInputChange = (e) => {
        const value = e.target.innerHTML;
        setValue(value);
        setIsFocus(true);

        // show placeholder
        setShowPlaceholder(value.length === 0);
        
        // filter mention
        if (showMentionComp) {
            // setMentions(prev => prev.filter(item => item.includes(event.target)))
            const mention = document.getElementById('_mention');
            if (mention) {
                // remove mention if content is empty
                if (!mention.textContent.includes('@')) {
                    ref.current.focus();
                    mention.remove();
                }
                // start filtering suggestions
                const key = mention.textContent.replace('@', '');
                const filteredMentions = props.people.filter(item => item.firstname.includes(key));
                setMentions(filteredMentions);
                // set default active mention as the first filtered item
                if (filteredMentions.length > 0) {
                    setActiveMention(filteredMentions[0]);
                }

            } else {
                setShowMentionComp(false);
            }
        }
    }

    return (
        <div className='w-full flex-grow'>
            {/* Suggestion */}
            <motion.div
                className='relative hidden'
                animate={{ display: showMentionComp ? 'block' : 'none' }}
            >
                <div className='absolute bottom-0 left-0 z-[1000] shadow-lg text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 flex flex-col gap-0 whitespace-nowrap w-fit'>
                {
                    mentions.map((mention, i) => (
                        <div key={i}
                            className={`${mention.id === activeMention.id && 'dark:bg-gray-600 bg-slate-300'} dark:hover:bg-gray-600 hover:bg-slate-300 p-0 cursor-pointer select-none`}
                            onClick={() => handlePickMention(mention)}
                        >
                            <ContactItem data={mention} contactId={i} openChat={() => ''} />
                        </div>
                    ))
                }
                </div>
            </motion.div>

            <div className="relative w-full flex">
                {/* placeholder */}
                {
                    (!isFocus && value.length === 0) &&
                    <span className="text-sm text-slate-600 dark:text-gray-400 absolute top-[50%] left-3 translate-y-[-50%]"
                        onClick={() => ref.current.focus()}
                    >
                        Tapez un message
                    </span>
                }
                <div
                    ref={ref}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => {
                        setShowPlaceholder(ref.current.innerHTML.length === 0)
                        setIsFocus(false);
                    }}
                    dangerouslySetInnerHTML={{__html: text}}
                    contentEditable={true}
                    className='py-3 px-2 w-full max-h-[200px] overflow-y-auto text-black dark:text-white box-content outline-none chatbox-input bg-transparent'
                    onKeyDown={handleCheckMention}
                    onInput={handleInputChange}
                />
            </div>
        </div>
    )
});

export default ChatInput